-- Fix UPDATE policy to include WITH CHECK condition to prevent user_id hijacking
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
AS PERMISSIVE
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add explicit INSERT policy for user_roles (for future use, currently only super admins can manage)
-- The ALL policy for super admins already covers this, but explicit policies are clearer
DROP POLICY IF EXISTS "Super admins can insert roles" ON public.user_roles;
CREATE POLICY "Super admins can insert roles" 
ON public.user_roles 
AS PERMISSIVE
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Super admins can update roles" ON public.user_roles;
CREATE POLICY "Super admins can update roles" 
ON public.user_roles 
AS PERMISSIVE
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Super admins can delete roles" ON public.user_roles;
CREATE POLICY "Super admins can delete roles" 
ON public.user_roles 
AS PERMISSIVE
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));