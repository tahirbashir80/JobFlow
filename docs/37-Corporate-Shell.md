# JobFlow v2.2.0 — Corporate Shell

The application shell now supports two desktop navigation paradigms:

1. Sidebar — collapsible to 72px or expandable to 250px.
2. Top navigation — primary operations navigation across the header.

The sidebar is grouped into Operations, Finance and System. Desktop uses a fixed shell with a global search/header action area. Mobile uses an animated navigation drawer.

Motion is driven by the existing Appearance motion preference. `full` uses subtle page and structural transitions, `reduced` shortens them, and `off` removes them.

The shell deliberately contains navigation and workspace chrome only. Business pages remain responsible for their own content.
