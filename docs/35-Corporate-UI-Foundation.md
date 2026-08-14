# JobFlow v2.0.0 — Corporate UI Foundation

## Personal appearance settings
- Theme: Light / Dark / System
- Accent: Blue / Indigo / Emerald / Violet / Orange / Teal / Red
- Navigation: Sidebar / Top navigation
- Sidebar: Remember / Expanded / Collapsed
- Density: Comfortable / Standard / Compact
- Motion: Full / Reduced / Off
- Page width: Standard / Wide / Full
- Table density: Comfortable / Standard / Compact
- Currency display: Symbol / Code / Symbol + Code
- Text size: Small / Standard / Large
- High contrast: On / Off

## Architecture
Theme settings are client-side preferences stored in localStorage. CSS custom properties provide the visual token layer. The CorporateShell consumes navigation preferences without requiring individual pages to know which navigation mode is active.

## Scope
This is the first corporate UI foundation. The next UI phase should build reusable primitives (Button, Input, Select, Card, Badge, Table, Modal, Drawer, Tabs, Skeleton, EmptyState), then use them to redesign the Dashboard as the reference implementation.
