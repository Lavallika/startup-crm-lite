import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

async function runTests() {
  console.log('==================================================');
  console.log('STARTING CRM API ENDPOINT TESTS (ADVANCED FEATURES)');
  console.log('==================================================\n');

  let token1 = '';
  let token2 = '';
  let leadId1 = '';
  let leadId2 = '';
  let secondUserLeadId = '';
  const timestamp = Date.now();
  const testUser1 = {
    name: 'Test User One',
    email: `user1_${timestamp}@example.com`,
    password: 'password123'
  };
  const testUser2 = {
    name: 'Test User Two',
    email: `user2_${timestamp}@example.com`,
    password: 'password123'
  };

  try {
    // ----------------------------------------------------
    // Step 1: GET /api/health
    // ----------------------------------------------------
    console.log('Step 1: GET /api/health');
    const res1 = await fetch(`${BASE_URL}/api/health`);
    const data1 = await res1.json();
    console.log(`Status: ${res1.status}`);
    console.log('Response:', data1);
    if (res1.status !== 200 || data1.status !== 'OK') {
      throw new Error('Step 1 failed: Expected 200 OK');
    }
    console.log('PASSED\n');

    // ----------------------------------------------------
    // Step 2: POST /api/auth/register
    // ----------------------------------------------------
    console.log('Step 2: POST /api/auth/register');
    const res2 = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser1)
    });
    const data2 = await res2.json();
    console.log(`Status: ${res2.status}`);
    console.log('Response Success:', data2.success);
    console.log('Token Exists:', !!data2.data?.token);
    if (res2.status !== 201 || !data2.data?.token) {
      throw new Error('Step 2 failed: Expected 201 with token');
    }
    token1 = data2.data.token;
    console.log('PASSED\n');

    // Register second user for owner isolation test later
    console.log('Registering user 2 (for isolation check)...');
    const resReg2 = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser2)
    });
    const dataReg2 = await resReg2.json();
    token2 = dataReg2.data?.token;
    console.log(`User 2 status: ${resReg2.status}, Token: ${!!token2}`);

    // Create a lead for user 2
    const resLead2 = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token2}`
      },
      body: JSON.stringify({
        name: 'User 2 Lead',
        company: 'Company Two',
        email: 'user2lead@example.com',
        status: 'New'
      })
    });
    const dataLead2 = await resLead2.json();
    secondUserLeadId = dataLead2.data?.lead?._id;
    console.log(`User 2 Lead ID: ${secondUserLeadId}\n`);

    // ----------------------------------------------------
    // Step 3: POST /api/auth/login
    // ----------------------------------------------------
    console.log('Step 3: POST /api/auth/login');
    const res3 = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser1.email,
        password: testUser1.password
      })
    });
    const data3 = await res3.json();
    console.log(`Status: ${res3.status}`);
    console.log('Response Success:', data3.success);
    console.log('Token Exists:', !!data3.data?.token);
    if (res3.status !== 200 || !data3.data?.token) {
      throw new Error('Step 3 failed: Expected 200 with token');
    }
    console.log('PASSED\n');

    // ----------------------------------------------------
    // Step 4: GET /api/auth/profile
    // ----------------------------------------------------
    console.log('Step 4: GET /api/auth/profile');
    const res4 = await fetch(`${BASE_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const data4 = await res4.json();
    console.log(`Status: ${res4.status}`);
    console.log('User Name:', data4.data?.user?.name);
    console.log('User Email:', data4.data?.user?.email);
    if (res4.status !== 200 || data4.data?.user?.email !== testUser1.email.toLowerCase()) {
      throw new Error('Step 4 failed: Expected 200 with user profile');
    }
    console.log('PASSED\n');

    // ----------------------------------------------------
    // Step 5: POST /api/leads (Create Lead 1 - John Doe)
    // ----------------------------------------------------
    console.log('Step 5: POST /api/leads (Lead 1)');
    const leadBody1 = {
      name: 'John Doe',
      company: 'Acme Corp',
      email: 'johndoe@acme.com',
      phone: '1234567890',
      status: 'New',
      source: 'Website',
      notes: 'Initial discussion scheduled.'
    };
    const res5a = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token1}`
      },
      body: JSON.stringify(leadBody1)
    });
    const data5a = await res5a.json();
    console.log(`Status: ${res5a.status}`);
    console.log('Lead 1 Created ID:', data5a.data?.lead?._id);
    if (res5a.status !== 201 || !data5a.data?.lead?._id) {
      throw new Error('Step 5 failed: Expected 201 with new lead ID');
    }
    leadId1 = data5a.data.lead._id;
    console.log('PASSED\n');

    // Create Lead 2 - Bob Smith (for pagination & search tests)
    console.log('POST /api/leads (Lead 2)');
    const leadBody2 = {
      name: 'Bob Smith',
      company: 'Zenith Labs',
      email: 'bobsmith@zenith.com',
      phone: '9876543210',
      status: 'Contacted',
      source: 'LinkedIn',
      notes: 'Interested in analytics dashboard.'
    };
    const res5b = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token1}`
      },
      body: JSON.stringify(leadBody2)
    });
    const data5b = await res5b.json();
    console.log(`Status: ${res5b.status}`);
    console.log('Lead 2 Created ID:', data5b.data?.lead?._id);
    leadId2 = data5b.data.lead._id;
    console.log('PASSED\n');

    // ----------------------------------------------------
    // Step 6: GET /api/leads (Pagination, filters, sort checks)
    // ----------------------------------------------------
    console.log('Step 6: GET /api/leads (Enhanced Pagination and Filter tests)');
    
    // Test pagination limit=1
    console.log('Testing limit=1, page=1...');
    const resPag1 = await fetch(`${BASE_URL}/api/leads?limit=1&page=1`, {
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const dataPag1 = await resPag1.json();
    console.log(`Status: ${resPag1.status}`);
    console.log('Returned count:', dataPag1.data?.length);
    console.log('Pagination metadata:', dataPag1.pagination);
    if (dataPag1.data?.length !== 1 || dataPag1.pagination.pages !== 2 || !dataPag1.pagination.hasNext) {
      throw new Error('Pagination test (limit=1, page=1) failed');
    }

    // Test pagination page=2
    console.log('Testing limit=1, page=2...');
    const resPag2 = await fetch(`${BASE_URL}/api/leads?limit=1&page=2`, {
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const dataPag2 = await resPag2.json();
    console.log(`Status: ${resPag2.status}`);
    console.log('Returned count:', dataPag2.data?.length);
    console.log('Pagination metadata:', dataPag2.pagination);
    if (dataPag2.data?.length !== 1 || dataPag2.pagination.pages !== 2 || !dataPag2.pagination.hasPrev) {
      throw new Error('Pagination test (limit=1, page=2) failed');
    }

    // Test sorting: sortBy=name, sortOrder=asc
    console.log('Testing sorting by name ascending...');
    const resSortAsc = await fetch(`${BASE_URL}/api/leads?sortBy=name&sortOrder=asc`, {
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const dataSortAsc = await resSortAsc.json();
    console.log(`First lead: ${dataSortAsc.data?.[0]?.name}, Second lead: ${dataSortAsc.data?.[1]?.name}`);
    if (dataSortAsc.data?.[0]?.name !== 'Bob Smith' || dataSortAsc.data?.[1]?.name !== 'John Doe') {
      throw new Error('Sorting by name ascending failed');
    }

    // Test sorting: sortBy=name, sortOrder=desc
    console.log('Testing sorting by name descending...');
    const resSortDesc = await fetch(`${BASE_URL}/api/leads?sortBy=name&sortOrder=desc`, {
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const dataSortDesc = await resSortDesc.json();
    console.log(`First lead: ${dataSortDesc.data?.[0]?.name}, Second lead: ${dataSortDesc.data?.[1]?.name}`);
    if (dataSortDesc.data?.[0]?.name !== 'John Doe' || dataSortDesc.data?.[1]?.name !== 'Bob Smith') {
      throw new Error('Sorting by name descending failed');
    }

    // Test filter: source=LinkedIn
    console.log('Testing filter by source=LinkedIn...');
    const resFilterSource = await fetch(`${BASE_URL}/api/leads?source=LinkedIn`, {
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const dataFilterSource = await resFilterSource.json();
    console.log('Matching leads count:', dataFilterSource.data?.length);
    console.log('Leads:', dataFilterSource.data?.map(l => l.name));
    if (dataFilterSource.data?.length !== 1 || dataFilterSource.data?.[0]?.name !== 'Bob Smith') {
      throw new Error('Filter by source=LinkedIn failed');
    }

    // Test date range filter: dateFrom = today
    const todayStr = new Date().toISOString().split('T')[0];
    console.log(`Testing filter by dateFrom=${todayStr}...`);
    const resFilterDate = await fetch(`${BASE_URL}/api/leads?dateFrom=${todayStr}`, {
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const dataFilterDate = await resFilterDate.json();
    console.log('Matching leads count:', dataFilterDate.data?.length);
    if (dataFilterDate.data?.length !== 2) {
      throw new Error('Filter by dateFrom failed');
    }
    console.log('PASSED\n');

    // ----------------------------------------------------
    // Step 7: GET /api/leads/:id
    // ----------------------------------------------------
    console.log(`Step 7: GET /api/leads/${leadId1}`);
    const res7 = await fetch(`${BASE_URL}/api/leads/${leadId1}`, {
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const data7 = await res7.json();
    console.log(`Status: ${res7.status}`);
    console.log('Lead Name:', data7.data?.lead?.name);
    if (res7.status !== 200 || data7.data?.lead?._id !== leadId1) {
      throw new Error('Step 7 failed: Expected 200 with matching lead ID');
    }
    console.log('PASSED\n');

    // ----------------------------------------------------
    // Step 8: PUT /api/leads/:id
    // ----------------------------------------------------
    console.log(`Step 8: PUT /api/leads/${leadId1}`);
    const updateBody = {
      name: 'Johnathan Doe',
      company: 'Acme International',
      email: 'johndoe@acme-intl.com',
      notes: 'Updated notes via PUT request.'
    };
    const res8 = await fetch(`${BASE_URL}/api/leads/${leadId1}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token1}`
      },
      body: JSON.stringify(updateBody)
    });
    const data8 = await res8.json();
    console.log(`Status: ${res8.status}`);
    console.log('Updated Name:', data8.data?.lead?.name);
    console.log('Updated Company:', data8.data?.lead?.company);
    if (res8.status !== 200 || data8.data?.lead?.name !== 'Johnathan Doe') {
      throw new Error('Step 8 failed: Expected 200 with updated fields');
    }
    console.log('PASSED\n');

    // ----------------------------------------------------
    // Step 9: PATCH /api/leads/:id/status
    // ----------------------------------------------------
    console.log(`Step 9: PATCH /api/leads/${leadId1}/status`);
    const res9 = await fetch(`${BASE_URL}/api/leads/${leadId1}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token1}`
      },
      body: JSON.stringify({ status: 'Won' })
    });
    const data9 = await res9.json();
    console.log(`Status: ${res9.status}`);
    console.log('New Status:', data9.data?.lead?.status);
    if (res9.status !== 200 || data9.data?.lead?.status !== 'Won') {
      throw new Error('Step 9 failed: Expected 200 and status Won');
    }
    console.log('PASSED\n');

    // ----------------------------------------------------
    // Autocomplete Search Endpoint: GET /api/leads/search?q=john&limit=5
    // ----------------------------------------------------
    console.log('Testing autocomplete search: GET /api/leads/search?q=john');
    const resSearch = await fetch(`${BASE_URL}/api/leads/search?q=john&limit=5`, {
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const dataSearch = await resSearch.json();
    console.log(`Status: ${resSearch.status}`);
    console.log('Search matches:', dataSearch.data);
    if (resSearch.status !== 200 || !Array.isArray(dataSearch.data)) {
      throw new Error('Search endpoint failed: Expected status 200 with array of matches');
    }
    // Verify it only returned projected fields
    const firstMatch = dataSearch.data[0];
    if (firstMatch) {
      const keys = Object.keys(firstMatch);
      console.log('Returned fields:', keys);
      const invalidKeys = keys.filter(k => !['_id', 'name', 'company', 'email', 'status', 'id'].includes(k));
      if (invalidKeys.length > 0) {
        throw new Error(`Search endpoint returned extra unprojected fields: ${invalidKeys.join(', ')}`);
      }
    }
    console.log('PASSED\n');

    // ----------------------------------------------------
    // Step 11: GET /api/leads/stats/summary
    // ----------------------------------------------------
    console.log('Step 11: GET /api/leads/stats/summary (Enhanced Aggregate KPIs)');
    const res11 = await fetch(`${BASE_URL}/api/leads/stats/summary`, {
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const data11 = await res11.json();
    console.log(`Status: ${res11.status}`);
    console.log('Stats summary object:', JSON.stringify(data11.data, null, 2));
    if (res11.status !== 200 || typeof data11.data?.conversionRate !== 'number') {
      throw new Error('Step 11 stats aggregation failed');
    }
    // Validate required fields
    const statsData = data11.data;
    const requiredStatsKeys = [
      'totalLeads', 'wonLeads', 'lostLeads', 'activeLeads',
      'conversionRate', 'growthRate', 'thisMonthLeads', 'lastMonthLeads',
      'statusBreakdown', 'sourceBreakdown'
    ];
    requiredStatsKeys.forEach(k => {
      if (statsData[k] === undefined) {
        throw new Error(`Missing expected KPI key: "${k}" in stats response`);
      }
    });
    console.log('PASSED\n');

    // ----------------------------------------------------
    // Step 12: GET /api/leads?status=Won
    // ----------------------------------------------------
    console.log('Step 12: GET /api/leads?status=Won');
    const res12 = await fetch(`${BASE_URL}/api/leads?status=Won`, {
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const data12 = await res12.json();
    console.log(`Status: ${res12.status}`);
    console.log('Filtered Leads Count:', data12.data?.length);
    if (res12.status !== 200 || !data12.data?.every(l => l.status === 'Won')) {
      throw new Error('Step 12 failed: Expected 200 and leads with status Won');
    }
    console.log('PASSED\n');

    // ----------------------------------------------------
    // Monthly Analytics Stats: GET /api/leads/stats/monthly
    // ----------------------------------------------------
    console.log('Testing Monthly Stats: GET /api/leads/stats/monthly');
    const resMonthly = await fetch(`${BASE_URL}/api/leads/stats/monthly`, {
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const dataMonthly = await resMonthly.json();
    console.log(`Status: ${resMonthly.status}`);
    console.log('Monthly stats (last 6 months chronological):', JSON.stringify(dataMonthly.data, null, 2));
    if (resMonthly.status !== 200 || !Array.isArray(dataMonthly.data) || dataMonthly.data.length !== 6) {
      throw new Error('Monthly stats aggregation failed or did not return exactly 6 months');
    }
    // Check fields in monthly stats elements
    const monthlyRequiredKeys = ['month', 'total', 'won', 'lost', 'conversionRate'];
    dataMonthly.data.forEach(item => {
      monthlyRequiredKeys.forEach(k => {
        if (item[k] === undefined) {
          throw new Error(`Missing monthly field: "${k}" in monthly stats elements`);
        }
      });
    });
    console.log('PASSED\n');

    // ----------------------------------------------------
    // Step 10: DELETE /api/leads/:id
    // ----------------------------------------------------
    console.log(`Step 10: DELETE /api/leads/${leadId1}`);
    const res10 = await fetch(`${BASE_URL}/api/leads/${leadId1}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const data10 = await res10.json();
    console.log(`Status: ${res10.status}`);
    console.log('Delete Message:', data10.message);
    if (res10.status !== 200 || !data10.success) {
      throw new Error('Step 10 failed: Expected 200 OK');
    }
    console.log('PASSED\n');

    // ====================================================
    // VALIDATION ERROR TESTS
    // ====================================================
    console.log('==================================================');
    console.log('RUNNING VALIDATION & ERROR TESTS');
    console.log('==================================================\n');

    // Test 1: POST /api/auth/register with an invalid email (no @ sign) → should return 400
    console.log('Validation Test 1: Register with invalid email (no @ sign)');
    const resVal1 = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Invalid Email User',
        email: 'invalidemailnoatsign',
        password: 'password123'
      })
    });
    const dataVal1 = await resVal1.json();
    console.log(`Status (Expected 400/422): ${resVal1.status}`);
    console.log('Response Error Message:', dataVal1.message);
    if (resVal1.status !== 400 && resVal1.status !== 422) {
      throw new Error('Validation Test 1 failed: Expected status 400/422');
    }
    console.log('PASSED\n');

    // Test 2: POST /api/leads with an empty name field → should return 400 with field errors
    console.log('Validation Test 2: Create lead with empty name field');
    const resVal2 = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token1}`
      },
      body: JSON.stringify({
        name: '',
        company: 'Empty Name Corp',
        email: 'valid@email.com'
      })
    });
    const dataVal2 = await resVal2.json();
    console.log(`Status (Expected 400): ${resVal2.status}`);
    console.log('Response Errors:', dataVal2.errors);
    if (resVal2.status !== 400) {
      throw new Error('Validation Test 2 failed: Expected status 400');
    }
    console.log('PASSED\n');

    // Test 3: GET /api/leads/:id with a random invalid ID → should return 404
    console.log('Validation Test 3: Get lead with random invalid ObjectId');
    const randomObjectId = '60d5ec49f395cd12c45e7f12';
    const resVal3 = await fetch(`${BASE_URL}/api/leads/${randomObjectId}`, {
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const dataVal3 = await resVal3.json();
    console.log(`Status (Expected 404): ${resVal3.status}`);
    console.log('Response Message:', dataVal3.message);
    if (resVal3.status !== 404) {
      throw new Error('Validation Test 3 failed: Expected status 404');
    }
    console.log('PASSED\n');

    // Test 4: GET /api/leads without an Authorization header → should return 401
    console.log('Validation Test 4: Access leads without Authorization header');
    const resVal4 = await fetch(`${BASE_URL}/api/leads`);
    const dataVal4 = await resVal4.json();
    console.log(`Status (Expected 401): ${resVal4.status}`);
    console.log('Response Message:', dataVal4.message);
    if (resVal4.status !== 401) {
      throw new Error('Validation Test 4 failed: Expected status 401');
    }
    console.log('PASSED\n');

    // Test 5: Try to access another user's lead by ID → should return 404 (owner isolation)
    console.log(`Validation Test 5: Try to access user 2's lead (${secondUserLeadId}) using user 1's token`);
    const resVal5 = await fetch(`${BASE_URL}/api/leads/${secondUserLeadId}`, {
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const dataVal5 = await resVal5.json();
    console.log(`Status (Expected 404): ${resVal5.status}`);
    console.log('Response Message:', dataVal5.message);
    if (resVal5.status !== 404) {
      throw new Error('Validation Test 5 failed: Expected status 404 (owner isolation)');
    }
    console.log('PASSED\n');

    console.log('==================================================');
    console.log('ALL API ENDPOINT AND VALIDATION TESTS PASSED!');
    console.log('==================================================');

  } catch (error) {
    console.error('\n❌ TEST RUNNER ERROR:', error.message);
    process.exit(1);
  }
}

runTests();
