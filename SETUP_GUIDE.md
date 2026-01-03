# Task Management & Role-Based Analytics System - Setup Guide

## Overview
This system implements task assignment, report requests, and role-based access control for the Ministry Dashboard.

## Database Setup

### 1. Run the Migration
The migration file `supabase/migrations/20260102115400_task_management_system.sql` creates:
- User roles (DG, Minister, Admin, Department User)
- Departments table
- User profiles with role and department assignment
- Tasks table for task assignment
- Task reports table for report requests
- Role-based security policies

### 2. Demo User Credentials
The migration creates the following test users:

**Leadership Roles (Can assign tasks and request reports):**
- DG: `dg@ministry.gov` / `password123`
- Minister: `minister@ministry.gov` / `password123`
- Admin: `admin@ministry.gov` / `password123`

**Department Users (Can view and complete assigned tasks):**
- Finance User: `finance.user@ministry.gov` / `password123`
- HR User: `hr.user@ministry.gov` / `password123`

### 3. Departments Created
- Finance
- Human Resources
- Operations
- Legal Affairs

## Features Implemented

### For DG, Minister, and Admin:
1. **Task Management**
   - Assign tasks to departments or specific users
   - Set priority levels (Low, Medium, High, Urgent)
   - Set due dates
   - Monitor task status across all departments

2. **Report Requests**
   - Request reports from any department
   - Set report due dates
   - Review submitted reports
   - Approve or reject reports with notes

3. **Analytics Access**
   - View analytics for ALL departments
   - Executive overview with cross-department metrics
   - Department performance comparisons
   - System-wide analytics

### For Department Users:
1. **Task Management**
   - View tasks assigned to their department
   - Update task status (Start, Complete)
   - View task details and due dates

2. **Report Submissions**
   - View report requests for their department
   - Submit report content
   - Track report status

3. **Analytics Access**
   - View analytics ONLY for their own department
   - Department-specific performance metrics
   - Department document analytics
   - Department system analytics

## Navigation

### Leadership Users See:
- Executive Overview
- Department Performance
- Document Analytics
- System Administration
- **Task Management** (assign tasks)
- **Report Requests** (request reports)

### Department Users See:
- Executive Overview (department-filtered)
- Department Performance (department-filtered)
- Document Analytics (department-filtered)
- System Administration (department-filtered)
- **My Tasks** (view assigned tasks)
- **My Reports** (submit reports)

## Role-Based Access Control

### Database Level (RLS Policies)
- Leadership can view and manage all tasks and reports
- Department users can only view/update their department's data
- User profiles are protected (users can only edit their own)

### Application Level
- Navigation items change based on user role
- Analytics pages show department-specific data for department users
- Task assignment interface only visible to leadership
- Report request interface only visible to leadership

## Testing the System

1. **Login as Leadership (e.g., minister@ministry.gov)**
   - Navigate to Task Management
   - Assign a task to a department
   - Navigate to Report Requests
   - Request a report from a department
   - View all department analytics

2. **Login as Department User (e.g., finance.user@ministry.gov)**
   - Navigate to My Tasks
   - View assigned tasks
   - Update task status
   - Navigate to My Reports
   - Submit a report
   - Notice analytics are filtered to Finance department only

## Environment Variables Required

Ensure your `.env` file contains:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Email Verification Behavior

When new users sign up, they will receive an email confirmation link. Here's what to expect:

**What Happens When You Click the Email Link:**
- You click the email confirmation link
- You get redirected to localhost (this is normal and expected)
- Your account verification is actually completed successfully
- You need to manually navigate back to the platform to continue with login

**Note:** The localhost redirect does NOT mean verification failed. Email verification is working correctly.