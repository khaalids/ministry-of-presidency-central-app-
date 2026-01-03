-- Sample Users with Different Roles
-- Creates test users for role-based access control testing
-- Credentials displayed in login form for easy testing

DO $$
DECLARE
    admin_user_uuid UUID := gen_random_uuid();
    dg_user_uuid UUID := gen_random_uuid();
    minister_user_uuid UUID := gen_random_uuid();
    dept_head_uuid UUID := gen_random_uuid();
    finance_dept_id UUID;
    hr_dept_id UUID;
    it_dept_id UUID;
    operations_dept_id UUID;
BEGIN
    -- Get existing department IDs
    SELECT id INTO finance_dept_id FROM public.departments WHERE name = 'Finance' LIMIT 1;
    SELECT id INTO hr_dept_id FROM public.departments WHERE name = 'Human Resources' LIMIT 1;
    SELECT id INTO it_dept_id FROM public.departments WHERE name = 'Information Technology' LIMIT 1;
    SELECT id INTO operations_dept_id FROM public.departments WHERE name = 'Operations' LIMIT 1;

    -- Create sample users with different roles
    -- These credentials can be used for testing the application
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        -- Admin User
        (admin_user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@gov.et', crypt('Admin@2026', gen_salt('bf', 10)), now(), now(), now(),
         jsonb_build_object('full_name', 'System Administrator', 'role', 'admin'),
         jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        
        -- DG (Director General) User
        (dg_user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'dg@gov.et', crypt('DG@2026', gen_salt('bf', 10)), now(), now(), now(),
         jsonb_build_object('full_name', 'Director General', 'role', 'dg'),
         jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        
        -- Minister User
        (minister_user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'minister@gov.et', crypt('Minister@2026', gen_salt('bf', 10)), now(), now(), now(),
         jsonb_build_object('full_name', 'Minister of Technology', 'role', 'minister'),
         jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        
        -- Department Head User (Finance Department)
        (dept_head_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'depthead@gov.et', crypt('DeptHead@2026', gen_salt('bf', 10)), now(), now(), now(),
         jsonb_build_object('full_name', 'Finance Department Head', 'role', 'department_user', 'department_id', finance_dept_id),
         jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Update user_profiles (created automatically by trigger)
    -- Set department for department head
    UPDATE public.user_profiles
    SET department_id = finance_dept_id
    WHERE id = dept_head_uuid;

    RAISE NOTICE 'Sample users created successfully:';
    RAISE NOTICE 'Admin: admin@gov.et / Admin@2026';
    RAISE NOTICE 'DG: dg@gov.et / DG@2026';
    RAISE NOTICE 'Minister: minister@gov.et / Minister@2026';
    RAISE NOTICE 'Department Head: depthead@gov.et / DeptHead@2026';

EXCEPTION
    WHEN unique_violation THEN
        RAISE NOTICE 'Sample users already exist. Skipping creation.';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating sample users: %', SQLERRM;
END $$;