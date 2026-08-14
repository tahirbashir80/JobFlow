# JobFlow v2.9.3 — Customer Onboarding Audit & Optimization

Baseline: `JobFlow-v2.9.1-Customers-Table-Map`

## Scope

This release audits and upgrades the Customer creation/onboarding flow without replacing the existing JobFlow visual language.

### Frontend
- Customer Information
- Primary Contact
- Billing Information
- Address Information
- Additional Information
- Segmented customer type selection
- Industry autosuggest via native datalist
- Country-code phone inputs with locale-based default
- Website `https://` normalization
- Real-time VAT / registration syntax checks for configured countries
- Trade licence helper text
- WhatsApp same-as-phone shortcut
- Billing name same-as-customer shortcut
- Payment terms and credit-limit formatting
- Country → State → City cascading selectors
- Optional interactive Google Maps pin picker with reverse geocoding
- Conditional Referral / Other lead-source fields
- Customer group pills
- Notes character counter

## Database

Added normalized entities:
- `CustomerBillingProfile`
- `CustomerAddress`
- `CustomerMetadata`
- `GeoCountry`
- `GeoState`
- `GeoCity`

Extended:
- `Customer`
- `Contact`
- `User` relation for `createdBy`

Unique identifiers are scoped to business + registration country for Trade Licence and VAT Number.

## Deployment

```powershell
npm install
npm run db:generate
npm run db:validate
npm run typecheck
```

Review and then apply:

```powershell
npm run db:migrate
```

For Google Maps:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-browser-restricted-key"
```

The map picker gracefully falls back to manual coordinates when no key is configured.
