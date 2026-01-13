import * as R from "ramda"
import { z } from "zod"

const lastQueryValue = (v) => (Array.isArray(v) ? v.at(-1) : v)

const parseOptionalNum =
  ({ abs = false, int = false } = {}) =>
    (v) => {
      const raw = lastQueryValue(v)
      if (raw == null || raw === "") return undefined

      let n = Number(raw)
      if (!Number.isFinite(n)) return undefined // isFinite takes care of NaN, so no need to check for it again

      if (abs) n = Math.abs(n)
      if (int) n = Math.trunc(n)

      return n
    }

const bounded = (base, { min, max } = {}) => {
  let s = base
  if (typeof min === "number") s = s.gte(min)
  if (typeof max === "number") s = s.lte(max)
  return s
}

export const optionalNumber = (opts = {}) =>
  z.preprocess(
    parseOptionalNum({ ...opts, int: false }),
    bounded(z.number(), opts).optional(),
  )

export const optionalInt = (opts = {}) =>
  z.preprocess(
    parseOptionalNum({ ...opts, int: true }),
    bounded(z.number().int(), opts).optional(),
  )

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

export const memoryQuerySchema = z.object({
  since: optionalInt(),
  until: optionalInt(),
  maxPoints: optionalInt({ min: 4, max: 600, abs: true }),
})

export const cpuQuerySchema = z.object({
  tolerance: optionalNumber({ min: 0, max: 0.2, abs: true }),
  since: optionalInt(),
  until: optionalInt(),
})
