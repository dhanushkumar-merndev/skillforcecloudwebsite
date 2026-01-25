# Supabase Integration - Setup Instructions

## ✅ Implementation Complete!

Your contact form now stores submissions in Supabase, and you have a password-protected admin dashboard.

---

## 📋 What's Been Implemented

### 1. **Contact Form** → Supabase Database
- Form submissions are saved to `contact_submissions` table
- Success/error messages shown to users
- Loading states during submission

### 2. **Admin Authentication System**
- Login page: `/admin/login`
- Session-based authentication using httpOnly cookies
- Secure password hashing with bcrypt

### 3. **Admin Dashboard** → View Submissions
- Dashboard: `/admin/dashboard` (password protected)
- Table view of all contact submissions
- Shows: Date, Name, Email, Phone, Program, Year, Message
- Total submission count

---

## 🚀 Setup Steps

### Step 1: Run SQL in Supabase
1. Go to https://app.supabase.com
2. Open your project
3. Go to **SQL Editor**
4. Run the SQL from `supabase_schema.sql`

### Step 2: Create First Admin User
Run the admin creation script:
```bash
node create-admin.mjs
```

Follow the prompts to enter:
- Your Supabase URL (from your .env)
- Your Supabase Anon Key (from your .env)
- Admin username
- Admin email
- Admin password

### Step 3: Test the System

**Test Contact Form:**
1. Go to http://localhost:4321/#contact
2. Fill out the form
3. Click "Send Application"
4. You should see a success message

**Test Admin Login:**
1. Go to http://localhost:4321/admin/login
2. Enter your admin credentials
3. You should be redirected to the dashboard
4. View your contact form submission in the table

---

## 🔒 Security Features

✅ Row Level Security (RLS) enabled
✅ Password hashing with bcrypt (10 salt rounds)
✅ HttpOnly cookies for sessions
✅ Protected admin routes
✅ API validation

---

## 📁 Files Created

```
src/
├── lib/
│   └── supabase.ts                    # Supabase client
├── pages/
│   ├── api/
│   │   ├── contact.json.ts            # Form submission endpoint
│   │   ├── auth/
│   │   │   ├── login.json.ts          # Admin login
│   │   │   ├── logout.json.ts         # Admin logout
│   │   │   └── session.json.ts        # Session check
│   │   └── admin/
│   │       └── submissions.json.ts    # Fetch submissions
│   └── admin/
│       ├── login.astro                # Login page
│       └── dashboard.astro            # Dashboard (protected)
└── components/
    └── Contact.astro                  # Updated with API

supabase_schema.sql                    # Database schema
create-admin.mjs                       # Admin user creation script
```

---

## 🎉 You're All Set!

Your website now has a fully functional contact form with database storage and admin dashboard!

**Admin Dashboard**: http://localhost:4321/admin/dashboard
**Login Page**: http://localhost:4321/admin/login
