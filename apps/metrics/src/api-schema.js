import * as R from "ramda"
import { z } from "zod"

// just a helper to parse an object query schema; on failure, return empty object
export const parseQuery = (schema) =>
  R.pipe(
    schema.safeParse,
    R.ifElse(
      R.prop("success"),
      R.prop("data"),
      R.always({}),
    ),
  )

// Reusable validator for query param: since=<epoch ms>
export const sinceMsSchema = z
  .string()
  .optional()
  .transform(Number)
  .transform(Math.abs)
  .pipe(z.number().int().gte(0))

export const memoryQuerySchema = z.object({
  maxPoints: z
    .string()
    .optional()
    .transform(Number)
    .transform(Math.abs)
    .pipe(z.number().int().gte(10).lte(600)),

  since: sinceMsSchema,
  until: sinceMsSchema,
})

export const cpuQuerySchema = z.object({
  tolerance: z
    .string()
    .optional()
    .transform(Number)
    .transform(Math.abs)
    .pipe(z.number().lte(0.2)),

  since: sinceMsSchema,
  until: sinceMsSchema,
})
