require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkRetailers() {
    console.log("Checking User vs Retailer consistency...");

    // 1. Get all Users
    const { data: users, error: userError } = await supabase.from('users').select('*');
    if (userError) {
        console.error("Error fetching users:", userError);
        return;
    }

    console.log(`Found ${users.length} users.`);

    // 2. Get all Retailers
    const { data: retailers, error: retError } = await supabase.from('retailers').select('*');
    if (retError) {
        console.error("Error fetching retailers:", retError);
        return;
    }

    console.log(`Found ${retailers.length} retailer profiles.`);

    // 3. Find Missing
    const missing = users.filter(u => !retailers.find(r => r.id === u.id));

    if (missing.length > 0) {
        console.log("!!! FOUND USERS WITHOUT RETAILER PROFILES !!!");
        console.log(missing.map(u => ({ id: u.id, name: u.name, role: u.role })));
        
        // 4. Fix them?
        console.log("\nAttempting to fix...");
        for (const u of missing) {
            const { error: insertError } = await supabase
                .from('retailers')
                .insert([{ id: u.id, shop_name: `${u.name}'s Shop` }]);
            
            if (insertError) console.error(`Failed to fix user ${u.name}:`, insertError.message);
            else console.log(`Fixed: Created shop for ${u.name}`);
        }
    } else {
        console.log("All users have retailer profiles. The issue might be elsewhere.");
    }
}

checkRetailers();
