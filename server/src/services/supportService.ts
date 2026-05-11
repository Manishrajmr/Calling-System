import { supabase } from "../supabase.js";

export class SupportService {
    async getTopics() {
        const { data, error } = await supabase
            .from("support_topics")
            .select("*")

        if (error) throw error;
        return data;
    }

    async getQueriesByTopic(topicId: string) {
        const { data, error } = await supabase
            .from("support_queries")
            .select("*")
            .eq("topic_id", topicId);
        if (error) throw error;
        return data;
    }

    async createQuery(topicId: string, question: string, answer: string) {
        const { data, error } = await supabase
            .from("support_queries")
            .insert([{ topic_id: topicId, question, answer }])
            .select();
        if (error) throw error;
        return data;
    }

    async searchQueries(query: string) {
        const { data, error } = await supabase
            .from("support_queries")
            .select("*")
            .ilike("question", `%${query}%`);
        if (error) throw error;
        return data;
    }

    async getOrCreateTopic(name: string): Promise<string> {
        const normalized = name.trim().toLowerCase().replace(/s$/, ""); // Basic singularization

        const { data: existing } = await supabase
            .from("support_topics")
            .select("id")
            .or(`name.ilike.${normalized},name.ilike.${normalized}s`)
            .maybeSingle();

        if (existing) return existing.id;

        const iconMap: Record<string, string> = {
            'Leads': 'users',
            'Deals': 'briefcase',
            'Calls': 'phone',
            'Call Management': 'phone-call'
        };

        const icon = iconMap[name] || 'help-circle';

        const { data, error } = await supabase
            .from("support_topics")
            .insert([{ name, icon }])
            .select("id")
            .single();

        if (error) {
            const { data: fallback, error: fallbackErr } = await supabase
                .from("support_topics")
                .insert([{ name }])
                .select("id")
                .single();
            if (fallbackErr) throw fallbackErr;
            return fallback.id;
        }
        return data.id;
    }

    async bulkCreate(topicName: string, items: { question: string; answer: string }[]) {
        const topicId = await this.getOrCreateTopic(topicName);
        const queries = items.map(item => ({
            topic_id: topicId,
            question: item.question,
            answer: item.answer
        }));

        const { data, error } = await supabase
            .from("support_queries")
            .insert(queries)
            .select();

        if (error) throw error;
        return data;
    }

    async parseAndStorePDF(text: string) {
        console.log(`Parser started. Length: ${text.length}`);
        const lines = text.split("\n").map(l => l.trim()).filter(l => l);
        let currentTopicId: string | null = null;
        let count = 0;
        let items: any[] = [];
        let currentItem: any = null;

        for (const line of lines) {
            const topicMatch = line.match(/^(?:TOPIC|Section|Topic|Category):\s*(.+)$/i);
            if (topicMatch) {
                if (currentItem) items.push(currentItem);
                if (items.length > 0 && currentTopicId) {
                    await this.saveBatch(currentTopicId, items);
                    count += items.length;
                    items = [];
                }
                currentTopicId = await this.getOrCreateTopic(topicMatch[1]);
                currentItem = null;
                continue;
            }

            const qMatch = line.match(/^(?:Q|Question|Query):\s*(.+)$/i);
            if (qMatch) {
                if (currentItem) items.push(currentItem);
                currentItem = { question: qMatch[1], answer: "" };
                continue;
            }

            const aMatch = line.match(/^(?:A|Answer|Response|Ans):\s*(.+)$/i);
            if (aMatch && currentItem) {
                currentItem.answer = aMatch[1];
                continue;
            }

            if (currentItem) {
                if (currentItem.answer) currentItem.answer += " " + line;
                else currentItem.answer = line;
            }
        }

        if (currentItem) items.push(currentItem);
        if (items.length > 0) {
            if (!currentTopicId) currentTopicId = await this.getOrCreateTopic("General");
            await this.saveBatch(currentTopicId, items);
            count += items.length;
        }

        return { count };
    }

    private async saveBatch(topicId: string, items: any[]) {
        const valid = items.filter(i => i.question && i.answer);
        if (valid.length === 0) return;
        const { error } = await supabase.from("support_queries").insert(
            valid.map(i => ({ topic_id: topicId, question: i.question, answer: i.answer }))
        );
        if (error) throw error;
    }
}

export const supportService = new SupportService();
