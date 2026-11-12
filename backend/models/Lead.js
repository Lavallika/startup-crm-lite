import mongoose from 'mongoose';

/**
 * Mongoose Schema representing a Lead in the CRM system.
 * Contains details about the potential customer, lead status, source, and owner.
 */
export const leadSchema = new mongoose.Schema(
  {
    /**
     * The full name of the lead contact.
     * Required. Must be between 2 and 100 characters, trimmed of whitespace.
     */
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minLength: [2, 'Lead name must be at least 2 characters long'],
      maxLength: [100, 'Lead name cannot exceed 100 characters']
    },
    /**
     * The name of the company/organization the lead belongs to.
     * Required. Trimmed of whitespace.
     */
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    /**
     * The email address of the lead.
     * Required. Trimmed, and validated for proper email formatting.
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be a valid email address']
    },
    /**
     * The phone number of the lead.
     * Optional. Trimmed of whitespace.
     */
    phone: {
      type: String,
      trim: true
    },
    /**
     * The current status of the lead in the sales pipeline.
     * Must match one of the predefined status values. Defaults to 'New'.
     */
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Qualified', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Converted', 'Lost'],
        message: '{VALUE} is not a valid lead status'
      },
      default: 'New'
    },
    /**
     * The acquisition source of the lead (e.g. Website, LinkedIn).
     * Must match one of the predefined source values. Defaults to 'Website'.
     */
    source: {
      type: String,
      enum: {
        values: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'],
        message: '{VALUE} is not a valid lead source'
      },
      default: 'Website'
    },
    /**
     * Additional notes, background information, or comments about the lead.
     * Optional. Maximum of 1000 characters.
     */
    notes: {
      type: String,
      maxLength: [1000, 'Notes cannot exceed 1000 characters']
    },
    /**
     * The ID of the User (owner) who created or is responsible for this lead.
     * Required. References the 'User' model.
     */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead owner is required']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// --- Indexes ---

// Single-field index on email for fast lookups (e.g. checking for existing leads or searching by email)
leadSchema.index({ email: 1 });

// Compound index on (owner, status) for fast filtered queries (e.g. finding leads of a specific owner in a specific stage)
leadSchema.index({ owner: 1, status: 1 });

// Compound index on (owner, source) for fast source-filtered queries
leadSchema.index({ owner: 1, source: 1 });

// Compound index on (owner, createdAt) for date range filtering and chronological listing
leadSchema.index({ owner: 1, createdAt: -1 });

// Compound indexes on name and company for autocomplete search and pagination sorting
leadSchema.index({ owner: 1, name: 1 });
leadSchema.index({ owner: 1, company: 1 });

// --- Virtuals ---

/**
 * Virtual field 'age' representing the number of days since the lead was created.
 * Useful for analytics to track how long a lead has been in the system.
 *
 * @returns {number} Number of days since creation, or 0 if createdAt is not defined.
 */
leadSchema.virtual('age').get(function () {
  if (!this.createdAt) return 0;
  const timeDifferenceMs = Date.now() - this.createdAt.getTime();
  return Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
});

// Create the Lead model
export const Lead = mongoose.model('Lead', leadSchema);

// Export Lead model as default export
export default Lead;
