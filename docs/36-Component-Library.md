# JobFlow v2.1.0 — Corporate Component Library

## UI primitives
Button, IconButton, Card, Badge, Input, Textarea, Select, Checkbox, Switch, Avatar, Separator, Skeleton, EmptyState, Modal, Drawer, Tabs, Dropdown, Tooltip.

## Data display
MetricCard, StatusBadge, PageHeader, FilterBar.

## Business
JobStatusBadge, InvoiceStatusBadge, PaymentStatusBadge, PaymentMethodBadge, CurrencyAmount, PriorityBadge.

## Libraries
- Lucide React: SVG icon system.
- Motion: interaction/animation foundation; migration of structural animations follows in the shell refinement phase.
- clsx: class composition.

## Architecture rule
Pages should compose these components. New page-level UI should not duplicate primitive markup when a component exists.
