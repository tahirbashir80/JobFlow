# CHANGELOG

## v0.9.0 — Customers & Sites

- Added tenant-scoped Customer CRUD foundations.
- Added residential/commercial customer validation.
- Added business-scoped customer number generation.
- Added Customer search and list UI.
- Added Customer detail view.
- Added Site creation and customer site listing.
- Added archive operations instead of hard deletion.
- Added Customers navigation to the authenticated app shell.
- No database schema changes.

## v1.0.0 — Jobs & Scheduling

- Added tenant-scoped Job persistence and JobAssignment creation.
- Added Job list, search, status filtering and detail view.
- Added New Job workflow linking Customer → Site → Service → Staff.
- Added scheduling, priority, price and notes.
- Added Job status history.
- Added Jobs to authenticated navigation.
- No database migration or seed changes.

## v1.1.0 — Job Execution & Completion

- Added overnight scheduling support when end time is earlier than start time.
- Added Start Job action with actual start and primary assignment timestamps.
- Added field execution panel for work performed, findings, recommendations, customer comments and internal notes.
- Added Complete Job transaction using the existing JobCompletion model.
- Added completion timestamps, customer acknowledgement and assignment completion tracking.
- Added completion/status history records.
- No Prisma schema changes, migration, or seed changes.

## v1.2.0 — Service Reports

- Added tenant-safe service report generation from completed jobs.
- Added persistent ServiceReport records using the existing Prisma model.
- Added report numbering (`SR-<job number>`).
- Added professional printable Service Report view.
- Added Print / Save PDF browser action.
- Added Service Report access from completed Job Detail.
- No Prisma schema changes, migration, or seed changes.

## v1.2.1 — Service Report Import Fix

- Corrected the relative import path for the Service Report action.
- No database or schema changes.

## v1.2.2 — Service Report Print Fix

- Moved the report print action into a Client Component so `window.print()` is valid in Next.js App Router.
- Removed the invalid Server Component event handler.
- No database or schema changes.

## v1.3.0 — Calendar & Dispatch

- Added weekly Calendar view for scheduled jobs.
- Added Dispatch board with Unassigned, Assigned and In Progress columns.
- Added tenant-safe technician assignment and reassignment.
- Added technician scheduling conflict detection using overlapping scheduled intervals.
- Added unassign workflow.
- Added Calendar and Dispatch navigation.
- No Prisma schema changes, migration, or seed changes.

## v1.4.0 — Technician Management

- Added technician directory and detail views.
- Added service skill management with proficiency levels.
- Added weekly availability management.
- Added technician workload and recent job history.
- Updated dispatch technician selection to prefer service-qualified staff.
- Added technician navigation.
- No Prisma schema changes, migration, or seed changes.

## v1.4.1 — Typecheck Fix

- Fixed DispatchBoard service typing so service ID is available for skill filtering.
- Fixed TechnicianManager action import path.
- No database or schema changes.

## v1.4.2 — Prisma Relation Fix

- Added the missing `Business.staffServiceSkills` opposite relation.
- Added the missing `Business.jobAssignments` opposite relation.
- No database columns or tables were added; these are Prisma relation metadata fixes.

## v1.5.0 — Dashboard & Analytics

- Replaced the placeholder dashboard with tenant-scoped live operational metrics.
- Added today's schedule, active/completed/unassigned KPIs and upcoming work.
- Added weekly completion trend.
- Added jobs-by-service breakdown.
- Added technician workload breakdown.
- Added cumulative completed job value.
- Added recent customer activity.
- Added dashboard links into Calendar, Dispatch, Technicians and New Job workflows.
- No Prisma schema changes, migration, or seed changes.

## v1.6.0 — Recurring Jobs

- Added recurring service management using the existing `RecurringService` model.
- Added daily, weekly, biweekly, monthly, quarterly, semi-annual, annual and custom recurrence options.
- Added start/end dates, interval, price and notes.
- Added pause/resume controls.
- Added tenant-safe due-job generation.
- Generated Jobs flow into Jobs, Calendar, Dispatch and Dashboard.
- Prevented duplicate job numbers during recurring generation.
- No Prisma schema changes, migration, or seed changes.

## v1.6.1 — Server/Client Serialization Fix

- Removed Prisma Decimal values from the recurring page's Server → Client props.
- Recurring service prices are converted to numbers before reaching the Client Component.
- Recurring service dates are converted to ISO strings.
- Service form options no longer fetch unused Decimal `basePrice` values.
- No database or schema changes.

## v1.7.0 — Notifications & Alerts

- Added tenant-scoped in-app Notification Center using the existing Notification model.
- Added unread count, mark as read and mark all as read.
- Added notification when a technician with a linked user account is assigned a Job.
- Added notification when due recurring schedules generate Jobs.
- Added Notifications navigation.
- No Prisma schema changes, migration, or seed changes.

## v1.7.1 — Notification JSON Type Fix

- Fixed Prisma 7 JSON metadata typing in notification creation by normalizing metadata to a JSON-serializable value.
- No database schema changes, migration, or seed changes.

## v1.7.2 — Notifications Typecheck Fix

- Corrected NotificationCenter server-action import path.
- Corrected Prisma JSON metadata normalization in notification persistence.
- No database schema changes, migration, or seed changes.

## v1.7.3 — Notifications Import Path Fix

- Corrected NotificationCenter's relative import to the sibling Jobs actions module.
- No database schema changes, migration, or seed changes.

## v1.7.4 — Technician User Linking

- Added tenant-safe Staff → User account linking on technician profiles.
- Added account selector for existing business users not already linked to another technician.
- Added unlink support.
- Enables assignment notifications to reach the technician's own Notification Center.
- No Prisma schema changes, migration, or seed changes.

## v1.7.5 — Dispatch Board Fix

- Dispatch now considers operational job statuses explicitly.
- Cancelled/declined assignments no longer make a job appear assigned.
- Unassigned column is limited to NEW/SCHEDULED jobs.
- Assigned column is limited to ASSIGNED/ACCEPTED jobs.
- In Progress column handles EN_ROUTE/ON_SITE/IN_PROGRESS work.
- Completed and cancelled jobs remain out of the operational Dispatch board.
- No Prisma schema changes, migration, or seed changes.

## v1.7.6 — Dispatch Status Type Fix

- Replaced the invalid `ACCEPTED` JobStatus with the schema-supported `DISPATCHED` status.
- Restored correct Prisma relation inference for Dispatch job queries.
- No database schema changes, migration, or seed changes.

## v1.8.0 — Billing & Payments

- Added Invoice list and detail screens.
- Added Create Invoice from completed Job.
- Added invoice numbering and duplicate-job protection.
- Added Mark as Sent workflow.
- Added payment recording and automatic balance/status calculation.
- Added customer/job references and payment history.
- Added Invoices navigation.
- No Prisma schema changes, migration, or seed changes.

## v1.8.1 — Mixed Payments & Cheques

- Added `CHEQUE` payment method.
- Supports unlimited payment transactions against an invoice, including mixed methods.
- Cheque payments are recorded as pending until cleared.
- Added cheque number, bank, cheque date and cleared timestamp.
- Added Clear and Bounce actions for pending cheques.
- Invoice paid/balance totals count only succeeded/cleared payments.
- No existing payment records are altered by code changes.
- Prisma schema change requires a database migration.

## v1.8.2 — Discount, Tax & Adjustments

- Added explicit invoice discount type/rate (fixed amount or percentage).
- Added explicit invoice tax type/rate (fixed amount or percentage).
- Added signed invoice adjustment amount and adjustment reason for auditability.
- Added Pricing Adjustments editor to invoice detail.
- Recalculates invoice total, cleared paid amount and balance due transactionally.
- Prevents changing an invoice total below already-cleared payments.
- Existing invoices remain compatible with zero/default pricing inputs.
- Prisma schema change requires a migration.

## v1.9.0 — Multi-Currency Architecture

- Business currency is treated as the base/default/reporting currency.
- Invoices now snapshot their transaction currency.
- Payments store their transaction currency plus invoice-currency FX snapshot fields.
- Existing invoices can be backfilled from their Business currency.
- Invoice lists no longer incorrectly sum mixed currencies.
- Added international currency catalog and onboarding currency selector.
- Current payment entry requires payment currency to match invoice currency; cross-currency settlement is schema-ready but deliberately deferred until an FX source/workflow is added.
- Prisma schema change requires a migration.

## v1.9.1 — Invoice JSX Fix

- Fixed malformed invoice detail JSX introduced during the multi-currency UI update.
- Payment summary now renders as its own card/section.
- Invoice line-item amounts now use the invoice currency.
- No schema changes.

## v1.9.2 — Invoice Typecheck Fix

- Fixed missing Business currency lookup in invoice creation.
- Added explicit InvoiceItem and Payment row types to the invoice detail page.
- Removed implicit `any` errors from invoice item/payment maps.
- No database schema changes.

## v1.10.0 — Customer Accounts & Accounts Receivable

- Added currency-separated customer AR summaries.
- Added customer account page at `/customers/[id]/account`.
- Shows invoiced, collected, outstanding and overdue amounts per currency.
- Added invoice and payment history to the customer account.
- Added `CustomerAccountTransaction` ledger model for future auditable running-balance statements.
- Added payment reversal metadata.
- No automatic cross-currency aggregation.
- Prisma schema change requires a migration.

## v1.10.1 — Customer Account Navigation

- Added an Account button to the customer detail page.
- Account opens the existing customer Accounts Receivable view.
- No database/schema changes.

## v1.10.2 — Invoice Type Import Fix

- Removed the unused `@/generated/prisma` type import from the invoice detail page.
- No database or Prisma schema changes.

## v1.10.3 — Customer Account Button

- Added a visible Account button to the customer detail header.
- Account links to `/customers/[id]/account`.
- No database or Prisma changes.

## v1.10.4 — Verified Customer Account Navigation

- Verified and corrected the actual customer detail page source.
- Account button is now inserted immediately beside + Add Site.
- No database or Prisma changes.

## v1.11.0 — AR Aging

- Added invoice aging buckets based on due date.
- Added Current, 1–30, 31–60, 61–90 and 90+ aging calculations.
- Added per-currency aging summaries to Customer Accounts Receivable.
- Added aging bucket and days overdue to invoice account rows.
- No database/schema changes.

## v1.11.1 — AR Draft Exclusion

- Draft invoices are excluded from Accounts Receivable totals and aging.
- Void and cancelled invoices are also excluded from AR totals and aging.
- Draft invoices remain visible in the customer's invoice account history.
- No database/schema changes.

## v1.11.2 — Prisma Relation Fix

- Added the missing `Business.accountTransactions` opposite relation for `CustomerAccountTransaction`.
- No database migration is needed for this relation-only correction if the model already exists in the database; regenerate Prisma after updating the schema.

## v1.12.0 — Customer Statements

- Added Customer Statement of Account at `/customers/[id]/statement`.
- Statement separates financial activity by currency.
- Posted invoices are debits; cleared/succeeded payments are credits.
- Running balance, total debits, total credits and closing balance are shown.
- Draft, void and cancelled invoices are excluded.
- Added browser Print / Save PDF output with print-optimized layout.
- No database/schema changes.

## v1.13.0 — Invoice Lifecycle & Collections

- Hardened payment recording so payments can only be entered against SENT, PARTIALLY_PAID or OVERDUE invoices.
- Added invoice status refresh for overdue sent invoices.
- Added controlled Cancel and Void invoice actions.
- Paid/partially paid invoices cannot be voided or cancelled when payments exist.
- Payment UI now appears only for payment-eligible invoice states.
- Added lifecycle guidance to invoice detail.
- Supports partial and mixed payments; cheque remains pending until cleared.
- No database/schema changes.

## v1.13.1 — Payment UX & Validation

- Added explicit Full Payment / Partial Payment selection.
- Full payment pre-fills and locks the outstanding balance.
- Partial payment requires an amount strictly below the outstanding balance.
- Payment method now defaults to an explicit "Select payment method" choice.
- Cheque fields are displayed only when Cheque is selected.
- Cheque number is required only for cheque payments.
- Added clearer payment state messaging and payment-history guidance.
- Added server-side payment type and method validation.
- Preserved the Decimal-safe `Number(invoice.balanceDue) > 0` comparison in AR aging.
- No database/schema changes.

## v2.0.0 — Corporate Theme Foundation

- Added theme-based UI foundation with Light, Dark and System modes.
- Added configurable accent colors.
- Added Sidebar and Top Navigation layouts.
- Added collapsible sidebar with remembered state.
- Added density, motion, page-width, table-density, text-size and currency-display preferences.
- Added high-contrast accessibility setting.
- Added live Appearance settings page at `/settings/appearance`.
- Added centralized CSS design tokens for theme surfaces, borders, text, states and motion.
- Preferences are stored locally per browser and do not require database changes.
- Replaced the previous application header navigation with the configurable CorporateShell.

## v2.0.1 — Corporate UI Foundation Fix

- Fixed the Appearance page JSX syntax error.
- No business-logic or design-system changes.
- Preserved `Number(invoice.balanceDue) > 0` in AR persistence.

## v2.0.2 — Appearance Controls Fix

- Added the missing `tableDensity` options definition used by AppearanceControls.
- Preserved the existing theme/navigation foundation.
- Preserved the Decimal-safe `Number(invoice.balanceDue) > 0` AR comparison.

## v2.1.0 — Corporate Component Library

- Added reusable UI primitives for buttons, icon buttons, cards, badges, form controls, avatars, switches, modals, drawers, tabs, dropdowns, skeletons and empty states.
- Added data-display components for metric cards, status badges, page headers and filter bars.
- Added JobFlow business components for job/invoice/payment statuses, payment methods, priorities and currency amounts.
- Added Lucide React for consistent SVG iconography.
- Added Motion dependency for the upcoming interaction/transition layer.
- Added `clsx` for component class composition.
- Replaced temporary text navigation icons with Lucide icons.
- Added component barrel exports.

## v2.1.1 — Component Library Syntax Fix

- Fixed malformed `"use client";` directives in Switch, Tabs and Dropdown.
- No component behavior or business logic changed.

## v2.2.0 — Corporate Shell Refinement

- Added responsive corporate application shell.
- Added grouped sidebar navigation for Operations, Finance and System.
- Added animated collapsible sidebar using Motion.
- Added animated active navigation indicator.
- Added desktop global search navigation surface.
- Added notification center surface and user/workspace menu.
- Added mobile drawer navigation with animated open/close.
- Added responsive top-navigation mode with mobile search.
- Added subtle page transition behavior controlled by the Appearance motion setting.
- Preserved Light/Dark/System themes and appearance preferences.

## v2.2.1 — Corporate Shell Type Fix

- Added explicit shared `NavItem`/`NavGroup` types so grouped navigation arrays retain a common tuple shape.
- Fixed TypeScript inference errors affecting global search and navigation mapping.
- No navigation behavior or visual design changes.

## v2.2.2 — Tailwind Build Fix

- Added Tailwind CSS v4 and the Tailwind PostCSS plugin required by `@import "tailwindcss";`.
- Added `postcss.config.mjs` using `@tailwindcss/postcss`.
- Preserved the manually corrected `LucideIcon` navigation typing.
- Preserved the Decimal-safe `Number(invoice.balanceDue) > 0` AR comparison.

## v2.3.0 — Corporate Dashboard

- Rebuilt the Dashboard as a reusable client-side corporate dashboard component.
- Added a two-tier KPI system for operations and financial position.
- Added business-currency-aware completed value and accounts receivable metrics.
- Added outstanding and overdue receivables snapshots using only the business currency.
- Added animated weekly completion chart with hover detail.
- Added polished schedule, technician workload, service volume and recent customer cards.
- Added upcoming-work surface for the next seven days.
- Added refined empty states, status badges, hover states and motion.
- Preserved the existing Corporate Shell, Theme/Appearance system and navigation architecture.

## 2.3.1 — Reference-inspired visual foundation

- Applied the supplied operations-UI design language as the next visual layer without changing business logic.
- Introduced an independent teal/coral palette rather than copying the reference amber palette.
- Refined enterprise surfaces, borders, radii, typography scale, sidebar tokens and page-width behavior.
- Updated the corporate shell to use the new dark operational sidebar treatment.
- Set the default appearance accent to Teal.
- Preserved the existing component architecture, theme controls, navigation choices and data/persistence behavior.

## v2.3.2 — Typography & Sizing Refinement

- Introduced a deliberate JobFlow enterprise typography scale.
- Improved page-title, section-title, metric, navigation and metadata hierarchy.
- Increased KPI legibility while reducing excessive label wrapping.
- Standardized data text and metadata line heights.
- Improved tabular-number treatment for financial metrics.
- Refined shell navigation and brand typography.
- Preserved the v2.3.1 teal/coral visual foundation and existing functionality.

## v2.3.3 — Visual Balance & Navigation Contrast

- Reduced page and section heading weight from 800 to 700.
- Reduced KPI value weight and size for a calmer enterprise hierarchy.
- Refined navigation typography to 13px / 600.
- Preserved uppercase label hierarchy while reducing visual heaviness.
- Removed the global anchor color rule that was overriding sidebar link utility colors.
- Restored clear sidebar logo, icon and navigation text contrast.
- Slightly tightened the dashboard display scale for a more balanced desktop composition.

## v2.4.0 — Dashboard 4–2–3 Executive Layout

- Replaced the multi-card dashboard with the locked 4–2–3 composition.
- Row 1: Total Revenue, Jobs This Month, New Customer, Outstanding Invoices.
- Row 2: Recent Jobs and Recent Invoices operational tables.
- Row 3: Revenue by Service, Jobs by Staff and Job Status analytical cards.
- Added live dashboard data queries for monthly revenue, monthly jobs, new customers, outstanding invoice amount/count, recent jobs and recent invoices.
- Added service-revenue, staff-workload and job-status visualizations.
- Removed the previous schedule, receivables snapshot, recent customers and secondary KPI rows from the main dashboard.
- Preserved JobFlow theme, navigation, typography and existing business logic.

## v2.5.1 — Style System Recovery & Translation

- Restored Tailwind CSS import that was accidentally removed in v2.5.0.
- Kept JobFlow's existing component architecture and 4–2–3 dashboard.
- Translated the supplied BlueSmart stylesheet into JobFlow-compatible tokens and global UI primitives.
- Applied source-inspired typography, compact controls, panel geometry, table density, focus rings and hover transitions.
- Preserved JobFlow's independent teal/coral color scheme.
- Did not globally import conflicting source selectors.

## v2.6.0 — Corporate Application Shell

- Applied the supplied reference's compact enterprise shell language to JobFlow.
- Refined sidebar to a 224px expanded / 68px collapsed system.
- Added compact brand mark and Job Management CRM subtitle.
- Introduced smaller uppercase navigation group labels and denser 34px navigation rows.
- Refined active navigation indicator and hover treatment.
- Refined 60px desktop top bar and compact global search.
- Preserved top-navigation option, collapsible sidebar and mobile drawer behavior.
- Preserved JobFlow's independent teal/coral palette and Tailwind CSS pipeline.

## v2.7.0 — Dashboard Density & KPI Performance

- Reduced dashboard left/right content padding and inter-section gaps.
- Reduced KPI card padding while applying the requested `jf-metric-value` typography: 26px / 800 / 4px top margin / 1.2 line-height.
- Removed the small "Business overview" label above the page heading.
- Converted KPI helper text into stronger performance/status rows with directional icons.
- Added month-over-month comparisons for revenue, jobs and new customers.
- Outstanding invoices now use a clear collection-status indicator: green when fully clear, red when a balance remains.
- Reduced table row/header heights.
- Applied the design-system subtle surface color to table header rows.
- Tightened Recent Jobs and Recent Invoices tables and limited the dashboard preview to four rows each.
- Removed the desktop invoice-table horizontal overflow by using a fixed responsive column grid.

## v2.7.0 — Dashboard Density & KPI Performance

- Reduced dashboard left/right content padding and inter-section gaps.
- Applied the requested `jf-metric-value` typography: 26px / 800 / 4px top margin / 1.2 line-height.
- Removed the small "Business overview" label above the page heading.
- Converted KPI helper text into stronger performance/status rows with directional icons.
- Added month-over-month comparisons for revenue, jobs and new customers.
- Outstanding invoices now use a clear collection-status indicator: green when fully clear, red when a balance remains.
- Reduced table row/header heights.
- Applied the design-system subtle surface color to table header rows.
- Tightened Recent Jobs and Recent Invoices tables and limited the dashboard preview to four rows each.
- Removed the desktop invoice-table horizontal overflow by using a fixed responsive column grid.

## v2.7.1 — Dashboard TypeScript Stability

- Removed obsolete `change` props from Dashboard `MetricCard` usages.
- Removed unused MetricCard helper props after performance/status messaging became the visible secondary line.
- No visual or business-logic changes from v2.7.0.

## v2.7.2 — Dashboard MetricCard Compile Fix

- Restored the `helper` prop required by the MetricCard fallback status rendering.
- Preserved the v2.7 Dashboard visual design and performance indicators.
- No business-logic or layout changes.

## v2.8.0 — Customers List Corporate UI

- Rebuilt the Customers list using the approved JobFlow corporate visual system.
- Preserved existing tenant-aware customer retrieval and search behavior.
- Added compact search toolbar and primary New Customer action.
- Added design-system table header treatment and denser customer rows.
- Added customer/contact/site/job visual metadata with Lucide icons.
- Added hover states and clearer View / Account actions.
- Added responsive mobile stacking without changing customer business logic.
- Added a compact empty state and customer count footer.

## v2.8.1 — Customers Package Stability

- Fixed the inherited Dashboard `MetricCard` helper destructuring issue.
- No changes to the Customers UI or business logic from v2.8.0.

## v2.9.0 — Customers Directory Layout

- Moved New Customer into the Customers page heading row.
- Added four KPI cards: Total Clients, Total Sites, Active Contracts, Due This Month.
- Moved search/filter controls below the KPI cards and outside the table header.
- Added Multiple Sites toggle and Clear button.
- Replaced the customer table with the requested CID, Customer, Status, Sites, Contact, POC, Email, Balance, Action columns.
- Added customer balance totals from invoice balances.
- Added primary POC display from customer contacts.
- Added Active/Inactive status badges.
- Added Google Maps location panel using available site address/coordinates; no new maps package or API dependency was introduced.
- Preserved existing tenant-aware search and customer workflows.

## v2.9.1 — Customers Table / Map View

- Added a dedicated search/action toolbar above the content area.
- Made Multiple Sites an inline checkbox and added an adjacent Google Maps toggle.
- Table and Google Maps are mutually exclusive views occupying the same content area.
- Removed the Customer Directory subheader and separate map section.

## v2.9.3 — Customer Onboarding Audit & Database Normalization

- Rebuilt `/customers/new` as a structured Customer Onboarding form using the existing JobFlow design tokens and controls.
- Added Customer Information, Primary Contact, Billing Information, Address Information and Additional Information sections.
- Added segmented customer type selection, industry autosuggest, website normalization, phone country-code handling, contact preferences, billing defaults, lead-source conditions and notes counter.
- Added country/state/city cascading location selection with relational GeoCountry/GeoState/GeoCity records.
- Added optional Google Maps draggable/clickable pin picker with reverse geocoding when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is configured.
- Added normalized CustomerBillingProfile, CustomerAddress and CustomerMetadata records.
- Extended Contact with country codes, alternate/WhatsApp numbers, preferred contact method and best contact time.
- Added customer industry, trade licence, VAT, website, registration country and created-by audit linkage.
- Added country-scoped unique constraints for trade licence and VAT identifiers and search indexes for email/phone/industry.
- Added Prisma migration `20260813_customer_onboarding`.
- Added `country-state-city` server-side reference data dependency for lazy location synchronization.

## v2.9.4 — Prisma Relation Fix

- Added the missing Business.accountTransactions opposite relation required by CustomerAccountTransaction.business.
- No Customer Onboarding UI or data-model behavior was otherwise changed.

## v2.9.5 — Customer Onboarding Typecheck Fixes

- Added strongly typed adapters around `country-state-city-js` to match its runtime overloads.
- Removed implicit `any` errors from geo country/state/city loading.
- Corrected state option keys to use the available state code.
- Added explicit types to onboarding country/industry mappings.
- Preserved the Customer Onboarding UX and database schema from v2.9.4.

## v2.9.6 — Customer Onboarding Typecheck Cleanup

- Fixed city list typing to match the geo persistence return shape.
- Added a compatible Customer edit form contract for the existing edit route.
- Added a scoped customer profile update action/persistence helper for core profile edits.
- Preserved the full Customer Onboarding form for new customer creation.

## v2.9.7 — Geo Runtime Compatibility

- Replaced `country-state-city-js`, whose dynamic CommonJS `require()` pattern is incompatible with the Next.js/Turbopack server bundle.
- Switched the server-side geo adapter to `@countrystatecity/countries`.
- Preserved the existing `getGeoCountries`, `getGeoStates`, `getGeoCities`, and address-reference contracts used by Customer Onboarding.
- Kept country → state → city cascading behavior and database geo reference persistence unchanged.

## v2.9.8 — Geo Country Type Fix

- Normalized nullable country phone codes to an empty string in the server geo adapter so Customer Onboarding matches the existing `Country` UI type.

## v2.9.9 — Setup UX Foundation

- Replaced the placeholder Setup page with a seven-section System Setup workspace.
- Applied the existing JobFlow design tokens and component primitives while using the supplied Setup screenshots as layout/interaction inspiration.
- Added Company, Industry & Jobs, Hours, Users, Templates, Numbering, and Backup views with responsive layouts and local UI interactions.
- No database schema or existing application data contracts were changed in this UI pass.

## v2.9.10 — Setup Theme Refinement

- Set the light-theme root background to `#F6F3EA`.
- Set form controls to use the same `#F6F3EA` background through `--form-background`.
- Kept dark theme controls on the existing dark surface token.
- Made the Setup active-tab underline explicitly use the project `--primary` token.
- Removed the active-tab top shadow so the state is communicated by the primary underline without introducing a new visual primitive.

## v2.11.1 — Contracts Merge / Onboarding Preservation

- Rebased Contracts on the v2.9.10 Setup + Customer Onboarding checkpoint instead of the incomplete v2.11.0 source.
- Preserved the full Customer Onboarding schema, geo persistence and Google Maps integration.
- Added the dedicated Contracts module and Prisma relations.
- Fixed optional Contract site/service typing.
- Preserved `@countrystatecity/countries` dependency.
- Updated customer Active Contracts summary to use active Contract records.

## v2.11.2 — Contracts Service Relation Fix

- Added the missing `Service.contracts` reverse relation required by Prisma for the optional Contract → Service relation.

## v2.11.3 — Correct Service Contract Relation

- Added `Service.contracts Contract[]` to the actual Service model.
- Corrected the previous patch, which inserted the reverse relation into the wrong model.

## v2.11.4 — Contract Edit Notes Type Fix

- Normalized nullable database contract notes to an empty string at the edit-form boundary.
- No UI or database schema changes.

## v2.11.9 — Contract ↔ Job Integration

- Added optional Contract relation to Job with tenant-scoped foreign key and index.
- New Job form now shows applicable active contracts after customer/site/service selection.
- Job creation validates that the selected contract is active and applicable.
- Job detail displays the linked contract.
- No changes to existing Contract CRUD or archive behavior.

## v2.11.10 — Job Contract Detail Relation Fix

- Included the optional Contract relation in `getExecutionJob()`.
- Fixes the Job Detail page TypeScript error when rendering the linked contract.
- No database or migration changes.
