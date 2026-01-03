-- Task Management and Role-Based Analytics System
-- This migration creates tables for task assignment, report requests, and role-based access control

-- 1. Create ENUM types
CREATE TYPE public.user_role AS ENUM ('dg', 'minister', 'admin', 'department_user');
CREATE TYPE public.task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.report_status AS ENUM ('requested', 'in_progress', 'submitted', 'reviewed', 'approved', 'rejected');

-- 2. Create departments table
CREATE TABLE public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create user_profiles table (intermediary for auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'department_user'::public.user_role,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create tasks table
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    assigned_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    assigned_to_department UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    assigned_to_user UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    status public.task_status DEFAULT 'pending'::public.task_status,
    priority public.task_priority DEFAULT 'medium'::public.task_priority,
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create task_reports table
CREATE TABLE public.task_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    requested_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    submitted_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    status public.report_status DEFAULT 'requested'::public.report_status,
    due_date TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    reviewer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create indexes
CREATE INDEX idx_user_profiles_id ON public.user_profiles(id);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_department_id ON public.user_profiles(department_id);
CREATE INDEX idx_tasks_assigned_to_department ON public.tasks(assigned_to_department);
CREATE INDEX idx_tasks_assigned_to_user ON public.tasks(assigned_to_user);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_task_reports_department_id ON public.task_reports(department_id);
CREATE INDEX idx_task_reports_status ON public.task_reports(status);

-- 7. Create functions (BEFORE RLS policies)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role, department_id, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'department_user'::public.user_role),
        COALESCE((NEW.raw_user_meta_data->>'department_id')::UUID, NULL),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$func$;

CREATE OR REPLACE FUNCTION public.is_admin_or_leadership()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role IN ('dg', 'minister', 'admin')
    AND up.is_active = true
)
$$;

CREATE OR REPLACE FUNCTION public.get_user_department()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT department_id FROM public.user_profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $func$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$func$;

-- 8. Enable RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_reports ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies

-- Departments: Everyone can read, only admins can modify
CREATE POLICY "authenticated_users_can_read_departments"
ON public.departments
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admins_can_manage_departments"
ON public.departments
FOR ALL
TO authenticated
USING (public.is_admin_or_leadership())
WITH CHECK (public.is_admin_or_leadership());

-- User Profiles: Users manage own, admins see all
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "admins_can_view_all_user_profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (public.is_admin_or_leadership());

-- Tasks: Admins can create/manage, department users can view their department tasks
CREATE POLICY "admins_can_manage_all_tasks"
ON public.tasks
FOR ALL
TO authenticated
USING (public.is_admin_or_leadership())
WITH CHECK (public.is_admin_or_leadership());

CREATE POLICY "department_users_can_view_their_tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (
    assigned_to_department = public.get_user_department()
    OR assigned_to_user = auth.uid()
);

CREATE POLICY "department_users_can_update_their_tasks"
ON public.tasks
FOR UPDATE
TO authenticated
USING (assigned_to_user = auth.uid())
WITH CHECK (assigned_to_user = auth.uid());

-- Task Reports: Admins can manage, department users can view/submit their reports
CREATE POLICY "admins_can_manage_all_reports"
ON public.task_reports
FOR ALL
TO authenticated
USING (public.is_admin_or_leadership())
WITH CHECK (public.is_admin_or_leadership());

CREATE POLICY "department_users_can_view_their_reports"
ON public.task_reports
FOR SELECT
TO authenticated
USING (department_id = public.get_user_department());

CREATE POLICY "department_users_can_submit_reports"
ON public.task_reports
FOR INSERT
TO authenticated
WITH CHECK (department_id = public.get_user_department());

CREATE POLICY "department_users_can_update_their_reports"
ON public.task_reports
FOR UPDATE
TO authenticated
USING (submitted_by = auth.uid())
WITH CHECK (submitted_by = auth.uid());

-- 10. Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_task_reports_updated_at
    BEFORE UPDATE ON public.task_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Mock Data
DO $$
DECLARE
    dg_uuid UUID := gen_random_uuid();
    minister_uuid UUID := gen_random_uuid();
    admin_uuid UUID := gen_random_uuid();
    dept_user1_uuid UUID := gen_random_uuid();
    dept_user2_uuid UUID := gen_random_uuid();
    finance_dept_uuid UUID := gen_random_uuid();
    hr_dept_uuid UUID := gen_random_uuid();
    operations_dept_uuid UUID := gen_random_uuid();
    legal_dept_uuid UUID := gen_random_uuid();
    task1_uuid UUID := gen_random_uuid();
    task2_uuid UUID := gen_random_uuid();
    task3_uuid UUID := gen_random_uuid();
BEGIN
    -- Insert departments
    INSERT INTO public.departments (id, name, description) VALUES
        (finance_dept_uuid, 'Finance', 'Financial management and budgeting'),
        (hr_dept_uuid, 'Human Resources', 'Personnel management and recruitment'),
        (operations_dept_uuid, 'Operations', 'Day-to-day operational activities'),
        (legal_dept_uuid, 'Legal Affairs', 'Legal compliance and advisory');

    -- Create auth users (trigger creates user_profiles automatically)
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (dg_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'dg@ministry.gov', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         jsonb_build_object('full_name', 'Director General', 'role', 'dg'),
         '{
"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (minister_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'minister@ministry.gov', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         jsonb_build_object('full_name', 'Dr. Sarah Mitchell', 'role', 'minister'),
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@ministry.gov', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         jsonb_build_object('full_name', 'System Administrator', 'role', 'admin'),
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (dept_user1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'finance.user@ministry.gov', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         jsonb_build_object('full_name', 'John Finance', 'role', 'department_user', 'department_id', finance_dept_uuid::text),
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (dept_user2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'hr.user@ministry.gov', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         jsonb_build_object('full_name', 'Jane HR', 'role', 'department_user', 'department_id', hr_dept_uuid::text),
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create tasks
    INSERT INTO public.tasks (id, title, description, assigned_by, assigned_to_department, assigned_to_user, status, priority, due_date) VALUES
        (task1_uuid, 'Prepare Q1 Budget Report', 'Compile and analyze Q1 financial data for ministry review', minister_uuid, finance_dept_uuid, dept_user1_uuid, 'in_progress'::public.task_status, 'high'::public.task_priority, now() + interval '7 days'),
        (task2_uuid, 'Staff Performance Reviews', 'Conduct annual performance reviews for all department staff', dg_uuid, hr_dept_uuid, dept_user2_uuid, 'pending'::public.task_status, 'medium'::public.task_priority, now() + interval '14 days'),
        (task3_uuid, 'Compliance Audit Preparation', 'Prepare documentation for upcoming compliance audit', admin_uuid, legal_dept_uuid, NULL, 'pending'::public.task_status, 'urgent'::public.task_priority, now() + interval '3 days');

    -- Create task reports
    INSERT INTO public.task_reports (task_id, requested_by, department_id, title, description, status, due_date) VALUES
        (task1_uuid, minister_uuid, finance_dept_uuid, 'Q1 Financial Performance Report', 'Detailed analysis of Q1 financial performance with recommendations', 'in_progress'::public.report_status, now() + interval '7 days'),
        (NULL, dg_uuid, hr_dept_uuid, 'Monthly HR Metrics Report', 'Monthly report on hiring, retention, and employee satisfaction metrics', 'requested'::public.report_status, now() + interval '5 days');
END $$;