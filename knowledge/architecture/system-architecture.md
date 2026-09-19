# System Architecture

```text
Browser
   |
   v
Next.js Application
   |
   +------------------+
   |                  |
Public Website      Admin Panel
   |                  |
   +--------+---------+
            |
            v
       Application Layer
            |
            v
         Prisma ORM
            |
            v
       PostgreSQL

External Services
   |
   +-- Mapbox
   +-- Cloudinary
```

Single Next.js application, no microservices. Server Actions / Route
Handlers implement the application layer directly against Prisma. See
`knowledge/decisions/ADR-001-mvp-architecture.md` for the rationale.
