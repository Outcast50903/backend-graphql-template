<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

[Nest](https://github.com/nestjs/nest) template with Prisma, GraphQL and postgreSQL.

## Installation

```bash
$ bun install
```

## Generate database schema

```bash
# generate schema
$ bun run db:generate

# migrate schema
$ bun run db:migrate
```

## Running the app

```bash
# development
$ bun run start

# watch mode
$ bun run start:dev

# production mode
$ bun run start:prod
```

## Other commands

```bash
# Prisma studio
$ bun run db:studio
```

## Docker

```bash

# build development image
docker compose up -d

# build production image
docker compose -f docker-compose.prod.yaml up --build -d

```