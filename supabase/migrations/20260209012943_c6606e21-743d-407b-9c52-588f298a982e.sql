-- Add DELETE policy for profiles table (GDPR compliance)
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add DELETE policy for super admins
CREATE POLICY "Super admins can delete any profile" 
ON public.profiles 
FOR DELETE 
USING (public.has_role(auth.uid(), 'super_admin'));