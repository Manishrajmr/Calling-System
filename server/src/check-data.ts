import { supabase } from './supabase.js';

async function listData() {
    console.log("--- TOPICS ---");
    const { data: topics } = await supabase.from('support_topics').select('*');
    console.table(topics);

    console.log("--- QUERIES ---");
    const { data: queries } = await supabase.from('support_queries').select('*');
    console.table(queries);
}

listData();
