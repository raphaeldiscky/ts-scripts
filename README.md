# ts-mono-template

TypeScript monorepo template — pnpm workspaces (Internal Packages) + `tsdown` (Rolldown-based) + `vitest` + `oxlint` + `oxfmt` + TypeScript 7 (`tsgo`) + `task` + husky + commitlint, with `syncpack` + `@manypkg/cli` + `publint` for consistency checks.

## Setup

```sh
task install_tools
```

## Tasks

```sh
task --list
task app FILE=<name>          # run apps/scripts/src/<name>.ts via tsx
```

| Task                    | What it does                                                   |
| ----------------------- | -------------------------------------------------------------- |
| `format`                | `oxfmt --write .`                                              |
| `format:check`          | `oxfmt --check .`                                              |
| `lint`                  | `oxlint .`                                                     |
| `lint:fix`              | `oxlint --fix .`                                               |
| `typecheck`             | `tsgo --noEmit` (whole workspace, one TS graph)                |
| `test`                  | `vitest run` (workspace projects mode)                         |
| `test:coverage`         | `vitest run --coverage` (v8, 80% thresholds on `libraries/`)   |
| `bundle`                | `tsdown` → per-library `dist/` (ESM + CJS + `.d.mts`/`.d.cts`) |
| `check:consistency`     | `syncpack lint` + `manypkg check` + `publint --strict`         |
| `check:consistency:fix` | `syncpack fix-mismatches` + `syncpack format`                  |
| `typos`                 | `typos` — Rust spell-checker                                   |
| `typos:fix`             | `typos -w` — auto-fix spelling                                 |
| `app`                   | `tsx apps/scripts/src/<FILE>.ts` (FILE without `.ts`)          |

## Layout

```
.
├── libraries/
│   └── stdlib/                # @local/stdlib — shared helpers
│       └── src/
│           ├── index.ts       # barrel re-export
│           ├── io.ts          # JSON/CSV/text file IO
│           ├── io.test.ts
│           ├── paths.ts       # createDataPaths factory
│           └── paths.test.ts
├── apps/
│   └── scripts/               # @local/scripts — runnable TS programs
│       └── src/
│           ├── camel-case.ts
│           ├── export-json-to-csv.ts
│           ├── json-to-csv.ts
│           ├── slugify.ts
│           └── snowflake.ts
├── scripts/                   # project shell tooling
│   └── install-tools.sh
├── data/                      # gitignored
│   ├── sources/<script>/      # inputs
│   └── results/<script>/      # outputs
├── tsconfig.base.json         # shared compiler options
├── tsdown.config.ts           # bundler (libraries/* workspace)
├── vitest.config.ts           # projects: ["libraries/*", "apps/*"]
└── .syncpackrc.json           # workspace:* enforcement
```

## Workspace topology

**Internal Packages** pattern (no Project References): each package's
`exports` map points at `src/*.ts` during dev, with `publishConfig.exports`
swapping to `dist/*.{mjs,cjs,d.mts,d.cts}` at publish time. pnpm symlinks
`@local/*` workspace packages into each consumer's `node_modules/`, so
`tsgo`/`tsx`/`vitest` walk the workspace as a single TS graph — no
`composite: true`, no `.tsbuildinfo`.

## Adding a script

Drop a new file at `apps/scripts/src/<name>.ts`:

```ts
import path from "node:path";
import { createDataPaths, listJsonFiles, readJson, writeJson } from "@local/stdlib";

const SCRIPT = "<name>";
const { sourceDir, resultDir } = createDataPaths({
  baseDir: path.resolve(process.cwd(), "data"),
});

// ... main()
```

Run with `task app FILE=<name>` from repo root.

## Adding a library

Create `libraries/<name>/{src/index.ts, package.json, tsconfig.json}` mirroring
`libraries/stdlib/`. Set `"name": "@local/<name>"`, declare deps, and the
`tsdown.config.ts` `workspace: "libraries/*"` glob will pick it up
automatically. Consumers depend on it via `"@local/<name>": "workspace:*"`.
# ts-scripts
