# JobFlow v1.7.4 — Technician User Linking

## Purpose
A Staff record can optionally link to a User account through `Staff.userId`. v1.7 assignment notifications require this link so the notification has a recipient.

## UI
Open a technician profile at `/technicians/[id]`. The **Login account** section lists existing tenant users that are not already linked to another technician.

## Safety
Both Staff and User records are checked against the current tenant. A User already linked to another Staff record cannot be claimed. The account can also be unlinked.

## Database
No schema changes are required because `Staff.userId` and the Staff/User relation already exist.
