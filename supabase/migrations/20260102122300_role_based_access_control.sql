-- Role-Based Access Control Enhancement
-- Adds RLS policies for department-based data filtering and admin-only access

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
$$;

-- Function to check if user is leadership (dg, minister, or admin)
CREATE OR REPLACE FUNCTION public.is_leadership()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role IN ('dg', 'minister', 'admin')
  )
$$;

-- Function to get user's department ID
CREATE OR REPLACE FUNCTION public.get_user_department_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT department_id FROM public.user_profiles
  WHERE id = auth.uid()
$$;

-- Update departments table RLS policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.departments;

CREATE POLICY "leadership_can_view_all_departments"
ON public.departments
FOR SELECT
TO authenticated
USING (public.is_leadership());

CREATE POLICY "department_users_view_own_department"
ON public.departments
FOR SELECT
TO authenticated
USING (id = public.get_user_department_id());

CREATE POLICY "admin_can_manage_departments"
ON public.departments
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Update user_profiles table RLS policies for admin management
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

CREATE POLICY "users_can_view_own_profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "users_can_update_own_profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "admin_can_view_all_profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "admin_can_manage_all_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Update tasks table RLS policies for department filtering
DROP POLICY IF EXISTS "Users can view tasks assigned to them" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks assigned to them" ON public.tasks;
DROP POLICY IF EXISTS "Leadership can view all tasks" ON public.tasks;
DROP POLICY IF EXISTS "Leadership can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Leadership can update all tasks" ON public.tasks;

CREATE POLICY "leadership_can_view_all_tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (public.is_leadership());

CREATE POLICY "department_users_view_own_department_tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (assigned_to_department = public.get_user_department_id() OR assigned_to_user = auth.uid());

CREATE POLICY "leadership_can_manage_tasks"
ON public.tasks
FOR ALL
TO authenticated
USING (public.is_leadership())
WITH CHECK (public.is_leadership());

CREATE POLICY "department_users_can_update_assigned_tasks"
ON public.tasks
FOR UPDATE
TO authenticated
USING (assigned_to_user = auth.uid())
WITH CHECK (assigned_to_user = auth.uid());

-- Update task_reports table RLS policies for department filtering
DROP POLICY IF EXISTS "Users can view reports for their department" ON public.task_reports;
DROP POLICY IF EXISTS "Users can create reports for their department" ON public.task_reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON public.task_reports;
DROP POLICY IF EXISTS "Leadership can view all reports" ON public.task_reports;
DROP POLICY IF EXISTS "Leadership can manage all reports" ON public.task_reports;

CREATE POLICY "leadership_can_view_all_reports"
ON public.task_reports
FOR SELECT
TO authenticated
USING (public.is_leadership());

CREATE POLICY "department_users_view_own_department_reports"
ON public.task_reports
FOR SELECT
TO authenticated
USING (department_id = public.get_user_department_id());

CREATE POLICY "leadership_can_manage_reports"
ON public.task_reports
FOR ALL
TO authenticated
USING (public.is_leadership())
WITH CHECK (public.is_leadership());

CREATE POLICY "department_users_can_manage_own_reports"
ON public.task_reports
FOR ALL
TO authenticated
USING (submitted_by = auth.uid() OR department_id = public.get_user_department_id())
WITH CHECK (submitted_by = auth.uid() OR department_id = public.get_user_department_id());