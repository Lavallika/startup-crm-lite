import Lead from '../models/Lead.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

// Valid lead status and source enums (must match Lead model)
const VALID_STATUSES = ['New', 'Contacted', 'Qualified', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Converted', 'Lost'];
const VALID_SOURCES  = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Get all leads belonging to the logged-in user, with filters/pagination
 * @route   GET /api/leads
 * @access  Protected
 *
 * Query Params:
 *   status    – filter by lead status (omit or 'All' = no filter)
 *   search    – regex search across name, company, email
 *   page      – page number (default: 1)
 *   limit     – records per page (default: 20)
 *   sortBy    – field to sort by (default: 'createdAt')
 *   sortOrder – 'asc' | 'desc' (default: 'desc')
 *
 * Returns: paginatedResponse with leads array and pagination metadata
 */
/**
 * @desc    Get all leads belonging to the logged-in user, with dynamic filters & pagination
 * @route   GET /api/leads
 * @access  Protected
 *
 * Query Params:
 *   page      – page number (default: 1)
 *   limit     – records per page (default: 20)
 *   sortBy    – field to sort by (default: 'createdAt')
 *   sortOrder – 'asc' | 'desc' (default: 'desc')
 *   status    – filter by status (omit or 'All' = no filter)
 *   search    – regex search term on name, company, email
 *   source    – filter by source (omit or 'All' = no filter)
 *   dateFrom  – filter leads created on/after this date (YYYY-MM-DD or ISO string)
 *   dateTo    – filter leads created on/before this date (YYYY-MM-DD or ISO string)
 *
 * Returns: JSON response with leads array and pagination metadata
 */
export const getLeads = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      search,
      source,
      dateFrom,
      dateTo
    } = req.query;

    // Always scope leads to the requesting user — owner isolation
    const filter = { owner: req.user._id };

    // Dynamic filtering
    if (status && status !== 'All') {
      filter.status = status;
    }

    if (source && source !== 'All') {
      filter.source = source;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (dateFrom || dateTo) {
      const dateFilter = {};
      if (dateFrom) {
        const parsedFrom = new Date(dateFrom);
        if (!isNaN(parsedFrom.getTime())) {
          dateFilter.$gte = parsedFrom;
        }
      }
      if (dateTo) {
        const parsedTo = new Date(dateTo);
        if (!isNaN(parsedTo.getTime())) {
          dateFilter.$lte = parsedTo;
        }
      }
      if (Object.keys(dateFilter).length > 0) {
        filter.createdAt = dateFilter;
      }
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = limit === 'all' ? 1000 : Math.max(1, parseInt(limit) || 20);
    const skip = limit === 'all' ? 0 : (pageNum - 1) * limitNum;

    // Build sort object
    const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    if (process.env.NODE_ENV === 'development') {
      console.log(`[getLeads] filter=${JSON.stringify(filter)} sort=${JSON.stringify(sortObj)} page=${pageNum} limit=${limitNum}`);
    }

    // Run query and count in parallel for performance
    const [leads, total] = await Promise.all([
      Lead.find(filter).sort(sortObj).skip(skip).limit(limitNum),
      Lead.countDocuments(filter)
    ]);

    const pages = Math.ceil(total / limitNum) || 1;
    const hasNext = pageNum < pages;
    const hasPrev = pageNum > 1;

    return res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages,
        hasNext,
        hasPrev
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Create a new lead owned by the logged-in user
 * @route   POST /api/leads
 * @access  Protected
 *
 * Body: { name, company, email, phone?, status?, source?, notes? }
 * Returns: 201 with the newly created lead document
 */
export const createLead = async (req, res, next) => {
  try {
    const { name, company, email, phone, status, source, notes } = req.body;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[createLead] user=${req.user._id} email=${email}`);
    }

    // Attach the authenticated user as the owner
    const lead = await Lead.create({
      name,
      company,
      email,
      phone,
      status,
      source,
      notes,
      owner: req.user._id
    });

    return successResponse(res, { lead }, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Get a single lead by ID — must belong to the requesting user
 * @route   GET /api/leads/:id
 * @access  Protected
 *
 * Params: id – MongoDB lead _id
 * Returns: 200 with lead | 404 if not found or not owned by user
 */
export const getLeadById = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[getLeadById] id=${req.params.id} user=${req.user._id}`);
    }

    // Both conditions prevent other users from peeking at leads they don't own
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, { lead }, 'Lead retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Fully update a lead — must belong to the requesting user
 * @route   PUT /api/leads/:id
 * @access  Protected
 *
 * Body: { name?, company?, email?, phone?, status?, source?, notes? }
 * Note: 'owner' field is stripped from the body before updating — cannot be reassigned
 * Returns: 200 with updated lead | 404 if not found
 */
export const updateLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[updateLead] id=${req.params.id} user=${req.user._id}`);
    }

    // Prevent ownership reassignment by removing 'owner' from the update payload
    const updateData = { ...req.body };
    delete updateData.owner;

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updateData,
      {
        returnDocument: 'after',
        new: true,           // Return the updated document
        runValidators: true  // Run schema validators on update
      }
    );

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, { lead }, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Update only the status field of a lead (pipeline drag-and-drop)
 * @route   PATCH /api/leads/:id/status
 * @access  Protected
 *
 * Body: { status } — must be one of the 6 valid enum values
 * Returns: 200 with updated lead | 400 if invalid status | 404 if not found
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[updateLeadStatus] id=${req.params.id} status=${status} user=${req.user._id}`);
    }

    // Validate the status is one of the accepted enum values
    if (!status || !VALID_STATUSES.includes(status)) {
      return errorResponse(
        res,
        `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        400
      );
    }

    // Single atomic find-and-update operation with owner isolation
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status },
      { returnDocument: 'after', new: true, runValidators: true }
    );

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, { lead }, `Lead status updated to "${status}"`);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Permanently delete a lead — must belong to the requesting user
 * @route   DELETE /api/leads/:id
 * @access  Protected
 *
 * Params: id – MongoDB lead _id
 * Returns: 200 with success message | 404 if not found
 */
export const deleteLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[deleteLead] id=${req.params.id} user=${req.user._id}`);
    }

    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    // Use instance method deleteOne for proper middleware support
    await lead.deleteOne();

    return successResponse(res, null, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Get aggregate stats for the Dashboard StatsCards
 * @route   GET /api/leads/stats/summary
 * @access  Protected
 *
 * Returns:
 *   {
 *     totalLeads, wonLeads, lostLeads, activeLeads,
 *     conversionRate,            ← Won / Total * 100 (rounded to 1 decimal)
 *     byStatus: { New, Contacted, 'Meeting Scheduled', 'Proposal Sent', Won, Lost }
 *   }
 */
/**
 * @desc    Get aggregate stats for the Dashboard StatsCards in a single query
 * @route   GET /api/leads/stats/summary
 * @access  Protected
 *
 * Returns: KPI statistics object including breakdown and monthly growth
 */
export const getLeadStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[getLeadStats] user=${req.user._id}`);
    }

    const now = new Date();
    // Start of this calendar month
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // End of this calendar month
    const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Start of last calendar month
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    // End of last calendar month
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const rawStats = await Lead.aggregate([
      // Owner isolation
      { $match: { owner: req.user._id } },
      {
        $facet: {
          totalCount: [
            { $count: "count" }
          ],
          statusBreakdown: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          sourceBreakdown: [
            { $group: { _id: "$source", count: { $sum: 1 } } }
          ],
          thisMonthLeads: [
            {
              $match: {
                createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth }
              }
            },
            { $count: "count" }
          ],
          lastMonthLeads: [
            {
              $match: {
                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
              }
            },
            { $count: "count" }
          ]
        }
      }
    ]);

    const result = rawStats[0] || {};
    const totalLeads = result.totalCount?.[0]?.count || 0;

    // Initialize full breakdown keys with default 0 value
    const statusBreakdown = {};
    VALID_STATUSES.forEach((s) => { statusBreakdown[s] = 0; });
    if (result.statusBreakdown) {
      result.statusBreakdown.forEach(({ _id, count }) => {
        if (_id) statusBreakdown[_id] = count;
      });
    }

    const sourceBreakdown = {};
    VALID_SOURCES.forEach((s) => { sourceBreakdown[s] = 0; });
    if (result.sourceBreakdown) {
      result.sourceBreakdown.forEach(({ _id, count }) => {
        if (_id) sourceBreakdown[_id] = count;
      });
    }

    const wonLeads = (statusBreakdown['Won'] || 0) + (statusBreakdown['Converted'] || 0);
    const lostLeads = statusBreakdown['Lost'] || 0;
    const newLeads = statusBreakdown['New'] || 0;
    const contactedLeads = statusBreakdown['Contacted'] || 0;
    const qualifiedLeads = (statusBreakdown['Qualified'] || 0) + (statusBreakdown['Meeting Scheduled'] || 0);
    const proposalLeads = statusBreakdown['Proposal Sent'] || 0;
    const activeLeads = totalLeads - wonLeads - lostLeads;

    // conversionRate: (won / total) * 100, rounded to 1 decimal
    // Handle division by zero when totalLeads is 0
    const conversionRate = totalLeads > 0
      ? Math.round((wonLeads / totalLeads) * 100 * 10) / 10
      : 0;

    const thisMonthCount = result.thisMonthLeads?.[0]?.count || 0;
    const lastMonthCount = result.lastMonthLeads?.[0]?.count || 0;

    // growthRate: ((thisMonth - lastMonth) / lastMonth) * 100
    // Handle division by zero when lastMonthCount is 0
    let growthRate = 0;
    if (lastMonthCount > 0) {
      growthRate = Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100 * 10) / 10;
    } else if (thisMonthCount > 0) {
      growthRate = 100;
    }

    return successResponse(res, {
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      proposalLeads,
      convertedLeads: wonLeads,
      wonLeads,
      lostLeads,
      activeLeads,
      conversionRate,
      growthRate,
      thisMonthLeads: thisMonthCount,
      lastMonthLeads: lastMonthCount,
      statusBreakdown,
      sourceBreakdown
    }, 'Stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Get monthly lead counts for the last 6 months (Analytics bar chart)
 * @route   GET /api/leads/stats/monthly
 * @access  Protected
 *
 * Returns: Array of last 6 months in chronological order:
 *   [{ month: 'Jan', total: 5, won: 2 }, { month: 'Feb', ... }, ...]
 */
/**
 * @desc    Get monthly lead counts for the last 6 months (Analytics bar chart)
 * @route   GET /api/leads/stats/monthly
 * @access  Protected
 *
 * Returns: Chronologically sorted array of last 6 months analytics data
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[getMonthlyStats] user=${req.user._id}`);
    }

    // Calculate the start date = first day of 6 months ago (avoiding timezone bugs)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setDate(1); // prevent month roll-over logic bug
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const pipeline = [
      {
        // Match only this user's leads created in the last 6 months
        $match: {
          owner: req.user._id,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        // Group by year and month, counting total, won, and lost leads
        $group: {
          _id: {
            year:  { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 },
          won: {
            $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] }
          },
          lost: {
            $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] }
          }
        }
      },
      {
        // Sort chronologically ascending
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ];

    const rawStats = await Lead.aggregate(pipeline);

    // Build a full 6-month map (including months with 0 leads)
    const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // Create lookup map from aggregation results: key = "YYYY-M"
    const statsMap = {};
    rawStats.forEach(({ _id, total, won, lost }) => {
      statsMap[`${_id.year}-${_id.month}`] = { total, won, lost };
    });

    // Build result array for the last 6 months in chronological order
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1); // prevent month subtraction roll-over bug
      d.setMonth(d.getMonth() - i);
      const y = d.getFullYear();
      const m = d.getMonth() + 1; // 1-indexed
      const key = `${y}-${m}`;

      const total = statsMap[key]?.total || 0;
      const won = statsMap[key]?.won || 0;
      const lost = statsMap[key]?.lost || 0;

      // Handle division by zero for monthly conversionRate
      const conversionRate = total > 0
        ? Math.round((won / total) * 100 * 10) / 10
        : 0;

      result.push({
        month: `${MONTH_NAMES[m - 1]} ${y}`,
        total,
        won,
        lost,
        conversionRate
      });
    }

    return successResponse(res, result, 'Monthly stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Quick search for autocomplete (React SearchBar debounce)
 * @route   GET /api/leads/search
 * @access  Protected
 *
 * Query Params:
 *   q     – search term
 *   limit – max results (default: 5)
 *
 * Returns: JSON array containing matching leads (ID, name, company, email, status)
 */
export const searchLeads = async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;
    const limitNum = Math.min(20, Math.max(1, parseInt(limit) || 5));

    // Owner isolation
    const filter = { owner: req.user._id };

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(filter)
      .select('_id name company email status')
      .limit(limitNum)
      .lean();

    return successResponse(res, leads, 'Autocomplete search completed successfully');
  } catch (error) {
    next(error);
  }
};
