-- Add RLS policy to allow public access to projects where publish_enabled is true
CREATE POLICY "Public projects are visible to everyone" 
ON public.projects 
FOR SELECT 
USING (publish_enabled = true);
