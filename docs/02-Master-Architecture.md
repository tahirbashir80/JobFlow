# JobFlow — Master Architecture v1.0

## 1. Platform Layers

JobFlow consists of three major layers:

1. SaaS Platform
2. Customer Business Application
3. Internal Super Admin

## 2. Tenant Model

For the first version, one Business represents one tenant/workspace.

Business-owned data must be isolated by business context.

Future multi-business organizations can introduce an Organization layer without requiring the current model to be rebuilt.

## 3. Domain Model

Business
- Users
- Roles / Permissions
- Staff
- Industries
- Services
- Service Pricing
- Service Checklists
- Customers
- Contacts
- Sites
- Jobs
- Job Assignments
- Job Checklists
- Job Materials
- Job Notes
- Job Status History
- Job Completion
- Attachments
- Signatures
- Service Reports
- Recurring Services
- Invoices
- Payments
- Notifications
- Activity Logs
- Audit Logs

## 4. SaaS Model

Platform-level entities:
- Plans
- Feature Entitlements
- Plan Entitlements
- Subscriptions
- Subscription Events
- Usage Records

## 5. Templates

System templates are separate from business configuration:

IndustryTemplate
  → ServiceTemplate

Business configuration:

BusinessIndustry
  → Service

A business can import/adapt predefined templates or create custom industries/services.

## 6. Job Model

A Job represents an actual service appointment/work order.

Job-related operational records are separated into explicit entities for assignment, checklist completion, materials, notes, status history, completion, attachments and reporting.

## 7. Job Completion

A completed job may contain:
- Work performed
- Findings
- Recommendations
- Customer comments
- Internal notes
- Customer approval
- Customer signature
- Technician signature
- Before/during/after photos
- Completion timestamp
- Service report

## 8. Subscription State

The technical model supports:
- Trial
- Active
- Past Due
- Canceling
- Canceled
- Expired
- Suspended

Payment state and application access policy must remain separate so a transient payment failure does not necessarily lock the tenant immediately.

## 9. Data Retention

Operational records should generally be archived rather than physically deleted. Permanent deletion should be a controlled lifecycle operation.

## 10. Security Principle

Tenant isolation must be enforced server-side in authorization and data-access code. UI filtering alone is never sufficient.

## 11. Custom Service Fields

Different services may require different operational fields.

Example:
Pest Control:
- Pest Type
- Chemical Used
- Area Treated
- Infestation Level

Tree Cutting:
- Tree Type
- Tree Height
- Branches Removed
- Waste Disposal

These fields must be modeled flexibly so new industries do not require database migrations for every new field.
