import type { RootState } from "@/store.ts"
import {VALKEY} from "@common/src/constants.ts"
import * as R from "ramda"

export const getNth = (index?: number) => (state: RootState) =>
    R.pipe(
        R.path([VALKEY.COMMAND.name, "commands", index]),
        R.defaultTo({}),
    )(state)

export const selectAllCommands = (state: RootState) => R.path([VALKEY.COMMAND.name, "commands"], state)
