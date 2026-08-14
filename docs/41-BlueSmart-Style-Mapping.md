# BlueSmart Style Mapping

The supplied index.html was used as the visual reference. Its Manrope/IBM Plex Mono typography, compact 8px control geometry, 14–16px panel geometry, thin warm-neutral borders, restrained shadows, uppercase labels, compact tables, focus rings and hover transitions were translated into JobFlow primitives.

JobFlow intentionally retains its independent teal/coral palette rather than replacing the existing brand colors with the source amber palette.

Important: the source stylesheet is not imported wholesale because its global class names (`.app`, `.main`, `.sidebar`, `.btn-primary`, etc.) would conflict with JobFlow's existing component architecture. The styling has been translated into JobFlow tokens and global primitives instead.
