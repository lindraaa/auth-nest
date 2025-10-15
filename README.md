<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

# Auth-nest

A NestJS-based authentication example and starter project. This repository demonstrates a modular authentication system including JWT and token-based auth, user management, file uploads, simple post resources, and request-scoped context handling.

## Highlights

- Modular NestJS app: `auth`, `users`, `post`, `upload`, `request-context`, and shared utilities
- Authentication features: password hashing, JWTs, personal access tokens, guards and decorators
- File uploads with validation and storage configuration
- Database configuration and seeders (see `database/seeders`)
- Middleware and request context support for per-request data

## Project structure (important folders)

- `src/modules/auth` — authentication controllers, services, guards, and decorators
- `src/modules/users` — user CRUD and related DTOs/entities
- `src/modules/post` — example Post resource with ownership guard
- `src/modules/upload` — upload endpoint, validation pipe, and storage config
- `src/config` — centralized configuration (database, storage)
- `src/database/seeders` — seeding scripts to populate dev data
- `src/request-context` — request-scoped context and interceptor

## Requirements

- Node.js (LTS recommended)
- npm or yarn
- A database supported by the project's configuration (see `src/config/database.config.ts`)

## Quick start

1. Install dependencies

```bash
yarn install

```

2. Provide configuration

Copy or create environment variables required by the app. Configuration keys are read from the files in `src/config`. Common variables include database connection values and JWT secret/key. For development you can set these in your shell or a `.env` file that your environment loader reads.

3. Run the app in development

```bash
npm run start:dev
```

4. Seed the database (optional)

There is a seeder runner at `src/database/seeders/run-seeder.ts`. Run it with ts-node or a project script if one exists to populate sample users and posts for local development.

## Notable scripts

Check `package.json` for exact npm scripts. Typical commands in this repository are: `start`, `start:dev`, `build`, `test`, and `lint`.

## Development notes

- Check `src/modules/auth/hashing/bcrypt.service.ts` for how passwords are hashed.
- Token-based auth and personal access tokens are implemented under `src/modules/auth` and `entities`.
- Ownership and role guards live under module `guards/` directories.
- Uploaded files are stored in the `uploads/` folder by default (see `src/config/storage.config.ts`).
