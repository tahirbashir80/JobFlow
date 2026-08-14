# JobFlow — SaaS Architecture v1.0

## Plans

Starter, Professional, Business.

Plan limits are configuration data, not application-wide hard-coded constants.

Typical metered dimensions:
- Users
- Staff
- Customers
- Jobs per month
- Storage
- SMS
- API calls
- Reports

## Entitlements

Feature access is represented by named entitlements such as:
- recurring_jobs
- advanced_analytics
- sms_notifications
- gps_verification
- staff_performance
- api_access
- custom_branding
- advanced_permissions
- data_export

## Trial

Default product requirement:
14-day trial with Professional-level feature access.

## Billing

Billing provider integration is abstracted behind subscription records and provider event records. Stripe can be the first provider, with provider-specific identifiers stored on the subscription.

## Subscription Events

Webhook/provider events must be stored so processing can be made auditable and idempotent.

## Usage

Usage records support enforcement and UI visibility:
- current staff / limit
- current customers / limit
- jobs used this period / limit
- storage used / limit

## Super Admin

The private platform administration area should support:
- Tenant management
- Subscription management
- Plan management
- Industry/service templates
- Usage monitoring
- MRR/churn analytics
- Administrative overrides

## Data Retention

Expired tenants should enter a controlled retention lifecycle. Permanent deletion must not be an automatic 30-day destructive operation in the initial architecture.
