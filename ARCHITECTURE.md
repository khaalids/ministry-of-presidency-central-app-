# Ministry Dashboard - Application Architecture Overview

## 🏗️ High-Level Architecture

This is a **React-based Single Page Application (SPA)** built with modern web technologies, serving as a government ministry operations dashboard with role-based access control, task management, and analytics capabilities.

### Architecture Pattern
- **Frontend Architecture**: Component-based React architecture with Context API for state management
- **Backend**: Supabase (PostgreSQL database with real-time capabilities, authentication, and Row-Level Security)
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom design system

---

## 📁 Project Structure

```
ministry_dashboard/
├── public/                    # Static assets
│   ├── assets/images/        # Image resources
│   └── favicon.ico
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base UI components (Button, Input, Header, etc.)
│   │   ├── AppIcon.jsx      # Icon wrapper component
│   │   ├── AppImage.jsx     # Image wrapper component
│   │   ├── ErrorBoundary.jsx # Error handling component
│   │   └── ScrollToTop.jsx  # Scroll behavior utility
│   ├── contexts/            # React Context providers
│   │   └── AuthContext.jsx  # Authentication state management
│   ├── lib/                 # External library configurations
│   │   └── supabase.js      # Supabase client initialization
│   ├── pages/               # Page-level components (route components)
│   │   ├── department-performance/
│   │   ├── document-analytics/
│   │   ├── executive-overview/
│   │   ├── login-authentication/
│   │   ├── notifications-center/
│   │   ├── report-request-management/
│   │   ├── report-requests/
│   │   ├── system-administration/
│   │   ├── task-management/
│   │   └── user-management/
│   ├── services/            # Data access layer (API service functions)
│   │   ├── departmentService.js
│   │   ├── notificationService.js
│   │   ├── reportService.js
│   │   ├── taskService.js
│   │   └── userService.js
│   ├── styles/              # Global styles
│   │   ├── index.css        # Custom CSS
│   │   └── tailwind.css     # TailwindCSS imports
│   ├── utils/               # Utility functions
│   │   └── cn.js            # Class name utility (clsx/tailwind-merge)
│   ├── App.jsx              # Root application component
│   ├── Routes.jsx           # Route configuration
│   └── index.jsx            # Application entry point
├── supabase/
│   └── migrations/          # Database migration files
│       ├── 20260102115400_task_management_system.sql
│       ├── 20260102122300_role_based_access_control.sql
│       └── 20260102123400_sample_users_with_roles.sql
├── package.json
├── vite.config.mjs          # Vite configuration
├── tailwind.config.js       # TailwindCSS configuration
└── README.md
```

---

## 🔑 Core Technologies & Dependencies

### Frontend Framework & Build
- **React 18.2.0** - UI library
- **Vite 5.0.0** - Build tool and dev server
- **React Router v6** - Client-side routing

### State Management
- **React Context API** - Global state (authentication)
- **React Hooks** - Local component state

### Backend & Database
- **Supabase** - Backend-as-a-Service (PostgreSQL, Auth, RLS)
- **@supabase/supabase-js** - Supabase client library

### UI & Styling
- **TailwindCSS 3.4.6** - Utility-first CSS framework
- **Framer Motion 10.16.4** - Animation library
- **Lucide React** - Icon library
- **Radix UI** - Headless UI components

### Data Visualization
- **Recharts 2.15.2** - Chart library
- **D3.js 7.9.0** - Data visualization library

### Forms & Validation
- **React Hook Form 7.55.0** - Form management

### Utilities
- **date-fns 4.1.0** - Date manipulation
- **clsx** + **tailwind-merge** - Conditional class names
- **class-variance-authority** - Component variant management

---

## 🗄️ Database Schema (Supabase/PostgreSQL)

### Core Tables

#### 1. **departments**
- Stores department information
- Fields: `id`, `name`, `description`, `created_at`, `updated_at`

#### 2. **user_profiles**
- Extended user profile linked to `auth.users`
- Fields: `id` (FK to auth.users), `email`, `full_name`, `role`, `department_id`, `avatar_url`, `is_active`, timestamps
- Role enum: `'dg'`, `'minister'`, `'admin'`, `'department_user'`

#### 3. **tasks**
- Task assignment and tracking
- Fields: `id`, `title`, `description`, `assigned_by`, `assigned_to_department`, `assigned_to_user`, `status`, `priority`, `due_date`, `completed_at`, timestamps
- Status enum: `'pending'`, `'in_progress'`, `'completed'`, `'cancelled'`
- Priority enum: `'low'`, `'medium'`, `'high'`, `'urgent'`

#### 4. **task_reports**
- Report requests and submissions
- Fields: `id`, `task_id`, `requested_by`, `submitted_by`, `department_id`, `title`, `description`, `content`, `status`, `due_date`, `submitted_at`, `reviewed_at`, `reviewer_notes`, timestamps
- Status enum: `'requested'`, `'in_progress'`, `'submitted'`, `'reviewed'`, `'approved'`, `'rejected'`

### Database Functions
- `handle_new_user()` - Creates user_profile on user signup
- `is_admin_or_leadership()` - Checks if user has leadership role
- `is_admin()` - Checks if user is admin
- `is_leadership()` - Checks if user is dg, minister, or admin
- `get_user_department()` / `get_user_department_id()` - Gets user's department
- `update_updated_at_column()` - Trigger function for timestamps

### Row-Level Security (RLS)
- **Database-level security** enforced via PostgreSQL RLS policies
- Leadership (dg, minister, admin) can view/manage all data
- Department users can only access their department's data
- Users can manage their own profiles

---

## 🔐 Authentication & Authorization

### Authentication Flow
1. **Supabase Auth** handles user authentication
2. **AuthContext** manages auth state in React
3. **User Profile** loaded from `user_profiles` table after authentication
4. **Session persistence** via Supabase (localStorage)

### Role-Based Access Control (RBAC)

#### Roles Hierarchy
1. **Leadership Roles** (can assign tasks, request reports, view all data):
   - `dg` (Director General)
   - `minister`
   - `admin`

2. **Department User** (limited to own department):
   - `department_user`

#### Access Control Layers

**1. Database Level (RLS Policies)**
- Enforced at PostgreSQL level
- Users can only query data they're authorized to see
- Policies check role and department_id

**2. Application Level**
- Navigation items filtered based on role
- Page-level redirects (e.g., System Administration for admin only)
- UI components conditionally rendered based on user role

**3. Route Protection**
- Routes are not protected at route level (all routes accessible)
- Components handle authorization checks internally
- Redirects happen in component useEffect hooks

---

## 🔄 Application Flow

### Entry Point
```
index.jsx → App.jsx → AuthProvider → Routes → Page Components
```

### Authentication Flow
```
User Login → Supabase Auth → AuthContext → Load User Profile → Set User State
```

### Data Flow
```
Component → Service Layer (taskService, userService, etc.) → Supabase Client → PostgreSQL
```

### Navigation Flow
```
Header Component → Role Check → Filter Navigation Items → Render Role-Specific Menu
```

---

## 📄 Page Components & Features

### Public Pages
- **Login Authentication** (`/login-authentication`) - User login/signup

### Shared Pages (All Authenticated Users)
- **Executive Overview** (`/`) - Dashboard with KPIs (filtered by role)
- **Department Performance** (`/department-performance`) - Performance metrics (department-filtered for users)
- **Document Analytics** (`/document-analytics`) - Document tracking and analytics
- **Notifications Center** (`/notifications-center`) - System notifications

### Leadership-Only Pages (dg, minister, admin)
- **Task Management** (`/task-management`) - Assign and manage tasks
- **Report Requests** (`/report-requests`) - Request reports from departments
- **Report Request Management** (`/report-request-management`) - Advanced report management with templates

### Admin-Only Pages
- **System Administration** (`/system-administration`) - System metrics and monitoring
- **User Management** (`/user-management`) - Create, edit, and manage users

### Department User Experience
- Same routes as leadership but different views:
  - `/task-management` → "My Tasks" (view assigned tasks only)
  - `/report-requests` → "My Reports" (submit reports for their department)

---

## 🧩 Component Architecture

### Component Hierarchy

```
App
├── AuthProvider (Context)
└── Routes
    └── Page Components
        ├── Header (present on most pages)
        └── Page-Specific Components
            └── Feature Components
```

### Component Types

1. **Layout Components**
   - `Header` - Navigation and user menu
   - `ErrorBoundary` - Error handling wrapper

2. **UI Components** (`components/ui/`)
   - Reusable, presentational components
   - Button, Input, Select, Checkbox, FilterBar, etc.

3. **Page Components** (`pages/`)
   - Route-level components
   - Orchestrate feature components
   - Handle data fetching and state

4. **Feature Components** (`pages/*/components/`)
   - Page-specific feature components
   - Example: KPICard, DepartmentPerformanceChart, TaskCard

---

## 🔌 Service Layer Architecture

### Service Pattern
Services abstract Supabase queries and provide a clean API to components.

**Example: taskService.js**
```javascript
- getAllTasks() - Fetches tasks with joins to user_profiles and departments
- createTask(task) - Creates new task
- updateTask(taskId, updates) - Updates task
- deleteTask(taskId) - Deletes task
```

**Services:**
- `taskService.js` - Task CRUD operations
- `userService.js` - User management
- `reportService.js` - Report operations
- `departmentService.js` - Department data
- `notificationService.js` - Notifications

### Data Transformation
- Services map database field names (snake_case) to JavaScript conventions (camelCase)
- Handle joins and relationships
- Error handling and validation

---

## 🎨 Styling Architecture

### TailwindCSS Configuration
- Custom theme configuration in `tailwind.config.js`
- Custom color palette
- Custom utility classes

### Design System
- Component variants using `class-variance-authority`
- Consistent spacing, typography, and colors
- Responsive design (mobile-first approach)

### CSS Organization
- Global styles in `styles/index.css`
- Tailwind imports in `styles/tailwind.css`
- Component-level Tailwind classes

---

## 🔒 Security Architecture

### Authentication Security
- **Supabase Auth** - Industry-standard authentication
- **JWT tokens** - Secure session management
- **Email verification** - Optional email confirmation

### Authorization Security
- **Row-Level Security (RLS)** - Database-level access control
- **Role-based policies** - Enforced at database level
- **Application-level checks** - Additional UI/UX filtering

### Data Security
- **Supabase connection** - HTTPS only
- **Environment variables** - Sensitive config in `.env`
- **RLS policies** - Prevent unauthorized data access

---

## 🚀 Build & Deployment

### Development
```bash
npm start  # Starts Vite dev server (port 4028)
```

### Production Build
```bash
npm run build  # Builds to 'build' directory
```

### Configuration
- **Vite config** (`vite.config.mjs`):
  - React plugin
  - Path aliases (tsconfigPaths)
  - Component tagger plugin
  - Custom build output directory
  - Server configuration (port 4028, host 0.0.0.0)

### Environment Variables
Required in `.env`:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

---

## 🔍 Key Architectural Decisions

### 1. **Context API over Redux**
- Simpler state management for auth state
- Reduces complexity for single global state concern

### 2. **Service Layer Pattern**
- Centralized data access
- Easier to maintain and test
- Clear separation of concerns

### 3. **Database-Level Security (RLS)**
- Security enforced at database level
- Prevents unauthorized access even if application logic fails
- Single source of truth for permissions

### 4. **Component Composition**
- Reusable UI components
- Page components compose feature components
- Clear component hierarchy

### 5. **Role-Based Navigation**
- Dynamic navigation based on user role
- Better UX - users only see relevant features
- Implemented in Header component

---

## 📊 Data Flow Patterns

### Fetching Data
```
Component → Service Function → Supabase Query → PostgreSQL → RLS Policies → Filtered Results → Component State
```

### Creating/Updating Data
```
Component → Service Function → Supabase Mutation → PostgreSQL → RLS Policies → Success/Error → Component Update
```

### Real-time Updates
- Supabase supports real-time subscriptions (not extensively used in current implementation)
- Potential for future enhancements (live notifications, task updates)

---

## 🧪 Testing & Quality

### Testing Setup
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction testing

### Code Quality
- ESLint configuration
- Error boundaries for error handling
- TypeScript paths support (via vite-tsconfig-paths)

---

## 🔮 Potential Architecture Improvements

1. **Route Protection**
   - Implement route guards/private routes
   - Redirect unauthorized users before rendering

2. **State Management**
   - Consider Redux Toolkit for complex state
   - If adding more global state beyond auth

3. **API Error Handling**
   - Centralized error handling service
   - User-friendly error messages

4. **Loading States**
   - Consistent loading state management
   - Skeleton screens for better UX

5. **Caching**
   - Implement React Query or SWR for data caching
   - Reduce redundant API calls

6. **Type Safety**
   - Consider migrating to TypeScript
   - Type-safe database queries

7. **Real-time Features**
   - Leverage Supabase real-time subscriptions
   - Live updates for tasks and notifications

---

## 📚 Key Files Reference

- **Entry Point**: `src/index.jsx`
- **Root Component**: `src/App.jsx`
- **Routes**: `src/Routes.jsx`
- **Auth Context**: `src/contexts/AuthContext.jsx`
- **Supabase Config**: `src/lib/supabase.js`
- **Navigation**: `src/components/ui/Header.jsx`
- **Database Schema**: `supabase/migrations/*.sql`

---

## 🎯 Summary

This application follows a **modern React architecture** with:
- **Component-based** UI structure
- **Service layer** for data access
- **Context API** for global state
- **Supabase** as backend (database + auth)
- **Role-based access control** at database and application levels
- **Responsive design** with TailwindCSS

The architecture prioritizes:
- ✅ Security (RLS policies)
- ✅ Maintainability (clear structure, service layer)
- ✅ User Experience (role-based navigation, filtered views)
- ✅ Scalability (modular components, clear separation of concerns)

