import { createSlice } from "@reduxjs/toolkit"
import { VALKEY } from "@common/src/constants.ts"

interface ConnectionData {
    total_commands_processed: number | null
    dataset_bytes: number | null
    connected_clients: number | null
    keys_count: number | null
    bytes_per_key: number | null
    server_name: string | null
    tcp_port: number | null
}

interface ConnectionState {
    error: string | null
    lastUpdated: number | null
    data: ConnectionData
}

interface InfoSliceState {
    [connectionId: string]: ConnectionState
}

const createInitialConnectionState = (): ConnectionState => ({
    error: null,
    lastUpdated: null,
    data: {
        total_commands_processed: null,
        dataset_bytes: null,
        connected_clients: null,
        keys_count: null,
        bytes_per_key: null,
        server_name: null,
        tcp_port: null,
    },
})

const initialState: InfoSliceState = {}

const infoSlice = createSlice({
    name: VALKEY.STATS.name,
    initialState,
    reducers: {
        setLastUpdated: (state, action) => {
            const { connectionId, timestamp } = action.payload
            if (!state[connectionId]) {
                state[connectionId] = createInitialConnectionState()
            }
            state[connectionId].lastUpdated = timestamp
        },
        setData: (state, action) => {
            const { connectionId, info, memory } = action.payload
            if (!state[connectionId]) {
                state[connectionId] = createInitialConnectionState()
            }

            state[connectionId].data.total_commands_processed = info["total_commands_processed"]
            state[connectionId].data.connected_clients = info['connected_clients']
            state[connectionId].data.dataset_bytes = memory['dataset.bytes']
            state[connectionId].data.keys_count = memory['keys.count']
            state[connectionId].data.bytes_per_key = memory['keys.bytes-per-key']
            state[connectionId].data.server_name = info['server_name']
            state[connectionId].data.tcp_port = info['tcp_port']
        },
        setError: (state, action) => {
            const { connectionId, error } = action.payload
            if (!state[connectionId]) {
                state[connectionId] = createInitialConnectionState()
            }
            state[connectionId].error = error
        },
    }
})

export default infoSlice.reducer
export const { setLastUpdated, setData, setError } = infoSlice.actions
