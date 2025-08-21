import {createSlice, type PayloadAction} from "@reduxjs/toolkit"
import {VALKEY} from "@common/src/constants.ts"

type CmdMeta = { command: string }

export interface CommandMetadata {
    command: string
    error: string | null
    response: string | null
    isFulfilled: boolean
    timestamp: number
}

interface CommandState {
    pending: boolean
    commands: CommandMetadata[]
}

const withMetadata = (command: string, response: string, isFulfilled = true): CommandMetadata => ({
    command,
    error: isFulfilled ? null : response,
    response: isFulfilled ? response : null,
    isFulfilled,
    timestamp: Date.now(),
})

const initialState: CommandState = { pending: false, commands: [] }
const commandSlice = createSlice({
    name: VALKEY.COMMAND.name,
    initialState,
    reducers: {
        sendRequested: (state: CommandState) => {
            state.pending = true
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        sendFulfilled: (state: CommandState, action: PayloadAction<string, string, CmdMeta>) => {
            state.pending = false
            state.commands.unshift(withMetadata(action.meta.command, action.payload, true))
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        sendFailed: (state: CommandState, action: PayloadAction<string, string, CmdMeta>) => {
            state.pending = false
            state.commands.unshift(withMetadata(action.meta.command, action.payload, false))
        }
    }
})

export default commandSlice.reducer
export const { sendRequested, sendFulfilled, sendFailed } = commandSlice.actions
