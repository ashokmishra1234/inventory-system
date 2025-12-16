require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testConnection() {
  console.log('Testing Supabase Connection...');
  console.log(`URL: ${process.env.SUPABASE_URL}`);
  console.log(`Key (first 10 chars): ${process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10)}...`);

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('ERROR: Missing variables in .env file');
    return;
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Try to list users (requires service role)
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('CONNECTION FAILED:', error.message);
      console.error('Full Error:', error);
    } else {
      console.log('CONNECTION SUCCESSFUL!');
      console.log(`Found ${data.users.length} users.`);
    }
  } catch (err) {
    console.error('UNEXPECTED ERROR:', err.message);
    console.error(err);
  }
}

testConnection();
