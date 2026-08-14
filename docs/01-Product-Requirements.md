# JobFlow — Product Requirements Baseline

## Product Vision

Build a modern, flexible, and easy-to-use Job Management CRM / Field Service Management platform for small business owners, independent service providers, contractors, and small teams who perform jobs for customers on a daily basis.

The platform must adapt to the business rather than forcing the business to adapt to the platform.

## Core Workflow

Sign Up → Choose Plan → Set Up Business → Select/Create Industry → Select/Create Services → Configure Pricing → Add Staff → Add Customers → Create Jobs → Assign Staff → Track Jobs → Complete Jobs → Generate Service Reports → Manage Follow-ups → Monitor Business Performance

## Core Modules

- Business Setup
- Industry Management
- Service / Job Catalog
- Pricing
- Staff Management
- Customer Management
- Site Management
- Job Management
- Scheduling / Dispatch
- Staff / Technician Workflow
- Job Completion
- Service Reports
- Recurring Services
- Billing / Payments
- Dashboard Analytics
- Role-Based Access
- SaaS Subscription & Tenant Management
- Super Admin

## Product Principle

Do not build this as a Pest Control CRM, Lawn Care CRM, or Cleaning CRM. Build it as a configurable Job Management Platform for Small Service Businesses.

The owner defines:
- What business am I in? → Industry
- What services do I offer? → Services
- Who performs the work? → Staff
- Who do I serve? → Customers
- Where do I provide the service? → Sites
- What work needs to be done? → Jobs
- Who is doing it? → Assignment
- What happened? → Job Execution
- Was it completed? → Job Completion
- What happens next? → Follow-up / Recurring Job / Billing

## UX Direction

- Desktop-first owner dashboard
- Mobile-friendly staff workflow
- Simplicity
- Speed
- Clarity
- Minimal learning curve
- Responsive design
- KPI cards, tables, status badges, filters, search, calendar, job cards, staff cards, timelines, drawers, modal forms, setup wizard, empty states and confirmations

## Recommended Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- Zod
- Secure authentication with role-based authorization
- S3-compatible object storage

## SaaS Baseline

The application is multi-tenant. Each business has isolated:
- Business profile
- Industries
- Services
- Staff
- Customers
- Sites
- Jobs
- Pricing
- Settings
- Reports

Initial commercial plans:
- Starter
- Professional
- Business

Initial trial:
- 14 days
- Professional-level feature access during trial

The uploaded master plan specifies subscription limits, billing, tenant lifecycle, and a private Super Admin panel. Those details will be implemented through the technical architecture rather than hard-coded into individual UI screens.
