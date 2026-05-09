import { supabase } from './supabase.js';

async function listData() {
    console.log("--- TOPICS ---");
    const { data: topics } = await supabase.from('support_topics').select('*');
    console.log(JSON.stringify(topics, null, 2));
}

listData();
