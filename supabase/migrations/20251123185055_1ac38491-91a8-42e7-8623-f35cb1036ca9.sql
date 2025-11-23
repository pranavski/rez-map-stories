-- Create app role enum for user permissions
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create film_submissions table
CREATE TABLE public.film_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  location_lat DECIMAL NOT NULL,
  location_lng DECIMAL NOT NULL,
  location_name TEXT NOT NULL,
  location_nation TEXT NOT NULL,
  synopsis TEXT NOT NULL,
  themes TEXT[] NOT NULL DEFAULT '{}',
  key_issues TEXT[] NOT NULL DEFAULT '{}',
  illumination TEXT NOT NULL,
  year INTEGER,
  directors TEXT[] DEFAULT '{}',
  available_on TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT
);

-- Create readings table for film submissions
CREATE TABLE public.submission_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.film_submissions(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  url TEXT
);

-- Enable RLS
ALTER TABLE public.film_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_readings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for film_submissions
-- Anyone can view approved submissions
CREATE POLICY "Anyone can view approved submissions"
  ON public.film_submissions
  FOR SELECT
  USING (status = 'approved');

-- Authenticated users can insert submissions
CREATE POLICY "Authenticated users can submit films"
  ON public.film_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = submitted_by);

-- Admins can view all submissions
CREATE POLICY "Admins can view all submissions"
  ON public.film_submissions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update submissions
CREATE POLICY "Admins can update submissions"
  ON public.film_submissions
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for submission_readings
-- Anyone can view readings for approved submissions
CREATE POLICY "Anyone can view readings for approved submissions"
  ON public.submission_readings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.film_submissions
      WHERE id = submission_id AND status = 'approved'
    )
  );

-- Authenticated users can insert readings with their submissions
CREATE POLICY "Users can add readings to their submissions"
  ON public.submission_readings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.film_submissions
      WHERE id = submission_id AND submitted_by = auth.uid()
    )
  );

-- Admins can manage all readings
CREATE POLICY "Admins can manage all readings"
  ON public.submission_readings
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_film_submissions_status ON public.film_submissions(status);
CREATE INDEX idx_film_submissions_submitted_by ON public.film_submissions(submitted_by);
CREATE INDEX idx_submission_readings_submission_id ON public.submission_readings(submission_id);