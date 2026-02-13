-- Create enum for template categories
CREATE TYPE public.agent_category AS ENUM ('sales', 'support', 'hr', 'marketing', 'operations', 'finance', 'custom');

-- Create agent_templates table for marketplace
CREATE TABLE public.agent_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category agent_category NOT NULL DEFAULT 'custom',
  icon TEXT NOT NULL DEFAULT '🤖',
  capabilities TEXT[] NOT NULL DEFAULT '{}',
  tone TEXT NOT NULL DEFAULT 'Professional',
  system_prompt TEXT NOT NULL,
  use_cases TEXT[] NOT NULL DEFAULT '{}',
  is_public BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  downloads INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create template_ratings table
CREATE TABLE public.template_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.agent_templates(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (template_id, user_id)
);

-- Create template_favorites table
CREATE TABLE public.template_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.agent_templates(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (template_id, user_id)
);

-- Enable RLS
ALTER TABLE public.agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agent_templates
CREATE POLICY "Anyone can view public templates"
ON public.agent_templates
FOR SELECT
USING (is_public = true);

CREATE POLICY "Users can view their own templates"
ON public.agent_templates
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create templates"
ON public.agent_templates
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
ON public.agent_templates
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
ON public.agent_templates
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for template_ratings
CREATE POLICY "Anyone can view ratings"
ON public.template_ratings
FOR SELECT
USING (true);

CREATE POLICY "Users can rate templates"
ON public.template_ratings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
ON public.template_ratings
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
ON public.template_ratings
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for template_favorites
CREATE POLICY "Users can view their favorites"
ON public.template_favorites
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
ON public.template_favorites
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
ON public.template_favorites
FOR DELETE
USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_agent_templates_updated_at
BEFORE UPDATE ON public.agent_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment downloads
CREATE OR REPLACE FUNCTION public.increment_template_downloads(template_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.agent_templates
  SET downloads = downloads + 1
  WHERE id = template_id;
END;
$$;

-- Function to get average rating for a template
CREATE OR REPLACE FUNCTION public.get_template_rating(p_template_id UUID)
RETURNS NUMERIC
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(AVG(rating)::NUMERIC(3,2), 0)
  FROM public.template_ratings
  WHERE template_id = p_template_id;
$$;