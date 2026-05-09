import { supabase } from './supabase.js';

async function test() {
    console.log("Testing Supabase connection...");
    try {
        const { data, error } = await supabase.from('support_topics').select('count');
        if (error) {
            console.error("❌ Connection failed:", error);
        } else {
            console.log("✅ Connection successful!");
        }
    } catch (e) {
        console.error("❌ Fatal error:", e);
    }
}

test();
