-- ── 001: Profiles table, Husky Tokens, NEU email restriction ──

-- ── Profiles table ──
CREATE TABLE public.profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text NOT NULL,
  display_name    text NOT NULL,
  avatar_url      text,
  husky_balance   integer NOT NULL DEFAULT 1000,
  role            text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin', 'moderator')),
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ── Trigger: auto-create profile with 1,000 Husky Tokens on signup ──
-- Reads display_name from user metadata if provided, otherwise falls back to email prefix
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── NEU email restriction: block non-NEU signups at the database level ──
-- IMPORTANT: You MUST register this function as a Supabase "Before User Created" auth hook:
--   Dashboard → Authentication → Hooks → Before User Created → select "restrict_to_neu_emails"
-- Without this manual step, ANY email can sign up!
CREATE OR REPLACE FUNCTION public.restrict_to_neu_emails(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  user_email text;
BEGIN
  -- Supabase nests the email inside a "user" object in the hook payload
  user_email := event->'user'->>'email';
  IF user_email IS NULL OR (
    user_email NOT LIKE '%@northeastern.edu' AND
    user_email NOT LIKE '%@husky.neu.edu'
  ) THEN
    RETURN jsonb_build_object(
      'error', jsonb_build_object(
        'http_code', 422,
        'message', 'Only Northeastern University email addresses are allowed (@northeastern.edu or @husky.neu.edu)'
      )
    );
  END IF;
  RETURN event;
END;
$$;

-- ── Row Level Security ──
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING ((SELECT auth.uid()) = id);

-- Users can update their own display_name and avatar_url only
-- Balance and role changes must go through server-side functions (SECURITY DEFINER)
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING ((SELECT auth.uid()) = id)
  WITH CHECK (
    (SELECT auth.uid()) = id AND
    husky_balance = (SELECT husky_balance FROM public.profiles WHERE id = auth.uid()) AND
    role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- Admins can read all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid()) AND role = 'admin'
    )
  );

-- Service role can do anything (used by Edge Functions)
CREATE POLICY "Service role full access"
  ON public.profiles
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
