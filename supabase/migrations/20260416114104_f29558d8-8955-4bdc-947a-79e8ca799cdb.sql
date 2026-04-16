
-- Bugs tabel
CREATE TABLE public.bugs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  priority text NOT NULL DEFAULT 'normaal',
  attachment_url text,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bugs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read bugs"
  ON public.bugs FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can insert own bugs"
  ON public.bugs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bugs"
  ON public.bugs FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bugs"
  ON public.bugs FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Notifications tabel
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  message text,
  read boolean NOT NULL DEFAULT false,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert notifications"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Storage bucket voor bug bijlagen
INSERT INTO storage.buckets (id, name, public) VALUES ('bug-attachments', 'bug-attachments', false);

CREATE POLICY "Anyone can view bug attachments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'bug-attachments');

CREATE POLICY "Authenticated users can upload bug attachments"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'bug-attachments');
