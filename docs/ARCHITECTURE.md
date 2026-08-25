# Architecture

Browser -> Vite React SPA -> Express REST API -> MongoDB Atlas
                                      -> Cloudinary

Public content is read-only from public routes. Admin writes are protected by JWT authentication, role checks where extended, CSRF validation and request validation.

For a larger deployment, add an object-storage abstraction, structured logger, automated tests (Vitest/Supertest/Playwright), database backup policy and centralized monitoring.
