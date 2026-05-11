-- Support Bot Schema

-- 1. Support Topics (Categories)
CREATE TABLE IF NOT EXISTS public.support_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    total_queries INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Support Queries (FAQs)
CREATE TABLE IF NOT EXISTS public.support_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES public.support_topics(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    suggestions JSONB DEFAULT '[]'::jsonb, -- Array of query IDs [uuid, uuid]
    is_beginner_friendly BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger to update total_queries count in support_topics
CREATE OR REPLACE FUNCTION update_total_queries_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.support_topics SET total_queries = total_queries + 1 WHERE id = NEW.topic_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.support_topics SET total_queries = total_queries - 1 WHERE id = OLD.topic_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_total_queries
AFTER INSERT OR DELETE ON public.support_queries
FOR EACH ROW EXECUTE FUNCTION update_total_queries_count();

-- Enable RLS (Row Level Security)
ALTER TABLE public.support_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_queries ENABLE ROW LEVEL SECURITY;

-- Policies: Everyone can view, only admins can modify
CREATE POLICY "Allow public read access on support_topics" ON public.support_topics FOR SELECT USING (true);
CREATE POLICY "Allow public read access on support_queries" ON public.support_queries FOR SELECT USING (true);

-- Admin modification policies (assuming a 'role' claim in auth.users or a separate profiles table)
-- For now, allowing all for development, but ideally restricted to role='admin'
CREATE POLICY "Allow admin to manage support_topics" ON public.support_topics ALL USING (true);
CREATE POLICY "Allow admin to manage support_queries" ON public.support_queries ALL USING (true);

-- 3. Initial Seed Data
DO $$
DECLARE
    leads_id UUID;
    deals_id UUID;
    calls_id UUID;
    general_id UUID;
BEGIN
    -- Insert Topics
    INSERT INTO public.support_topics (name, icon, display_order) VALUES 
    ('Leads', 'users', 1) RETURNING id INTO leads_id;
    
    INSERT INTO public.support_topics (name, icon, display_order) VALUES 
    ('Deals', 'briefcase', 2) RETURNING id INTO deals_id;
    
    INSERT INTO public.support_topics (name, icon, display_order) VALUES 
    ('Call Management', 'phone', 3) RETURNING id INTO calls_id;
    
    INSERT INTO public.support_topics (name, icon, display_order) VALUES 
    ('General', 'help-circle', 4) RETURNING id INTO general_id;

    -- Insert Queries for Leads
    INSERT INTO public.support_queries (topic_id, question, answer) VALUES 
    (leads_id, 'How do I create a new lead?', 'To create a lead, go to the Leads section and click the "+ Add Lead" button. Fill in the required details like name, email, and phone number.'),
    (leads_id, 'How can I change the status of a lead?', 'Open a lead from the list and use the status dropdown in the header to move it from "New" to "Contacted", "Qualified", etc.'),
    (leads_id, 'How do I assign a lead to a team member?', 'Use the "Assign" button on the Lead Details page or select multiple leads from the list and use the bulk assign tool.'),
    (leads_id, 'Can I import leads from an Excel file?', 'Yes! Use the Import tool in the Leads section. Ensure your CSV/Excel file matches the CRM template.'),
    (leads_id, 'How do I convert a lead into a deal?', 'Once a lead is qualified, click the "Convert to Deal" button. This will automatically create a deal and map the lead information.');

    -- Insert Queries for Deals
    INSERT INTO public.support_queries (topic_id, question, answer) VALUES 
    (deals_id, 'What are deal stages?', 'Deal stages represent your sales pipeline. Common stages include Discovery, Proposal, Negotiation, and Closed (Won/Lost).'),
    (deals_id, 'How do I track deal value?', 'Every deal has a "Value" field. The system aggregates these in your dashboard to show your total pipeline value.'),
    (deals_id, 'How to mark a deal as won?', 'Click the "Won" button on the deal header. This will move the deal to the Closed segment and update your reports.'),
    (deals_id, 'Can I attach documents to a deal?', 'Yes, use the "Files" tab inside any deal record to upload contracts, proposals, or receipts.'),
    (deals_id, 'How do I set follow-up reminders?', 'Use the "Activities" tab to schedule a task or call. The system will notify you when it is due.');

    -- Insert Queries for Call Management
    INSERT INTO public.support_queries (topic_id, question, answer) VALUES 
    (calls_id, 'How do I make an outbound call?', 'Click the phone icon next to any contact number. If you have the Desk Phone integrated, it will trigger the call automatically.'),
    (calls_id, 'Where can I find call recordings?', 'Go to the "Call Logs" section. If recording is enabled, a play icon will appear next to each completed call entry.'),
    (calls_id, 'How to set up my desk phone?', 'Go to Settings > Communications > Desk Phone and enter your extension and provider details.'),
    (calls_id, 'Can I log notes during a live call?', 'Yes! When a call is active, a "Live Call" widget appears allowing you to type notes in real-time.'),
    (calls_id, 'How to see team call logs?', 'Admins can see all logs in the "Call Logs" report. Filter by "Agent Name" to see specific team members.');

    -- Insert Queries for General
    INSERT INTO public.support_queries (topic_id, question, answer) VALUES 
    (general_id, 'How do I reset my password?', 'Click on your profile avatar > Settings > Security. Enter a new password and confirm.'),
    (general_id, 'Where can I update my profile?', 'Go to the "Profile" section from the top-right menu to update your name, photo, and contact details.'),
    (general_id, 'How to invite new users?', 'Admins can go to Settings > Team > Invite User. Enter their email and assign a role.'),
    (general_id, 'What is the Dashboard?', 'The Dashboard gives you a bird''s-eye view of your leads, deals, and call performance for the day/month.'),
    (general_id, 'How to contact support?', 'Click the "Help" icon in the bottom menu to submit a ticket or start a live chat with our team.');
END $$;
