import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { CONNECTED, LOCAL_STORAGE, VALKEY } from "@common/src/constants.ts"
import * as R from "ramda"

type ConnectionStatus = "Idle" | "Connecting" | "Connected" | "Error";

interface ConnectionDetails {
    host: string;
    port: string;
    username: string;
    password: string;
}

export interface ConnectionState {
    status: ConnectionStatus;
    errorMessage: string | null;
    connectionDetails: ConnectionDetails;
}

interface ValkeyConnectionsState {
    [connectionId: string]: ConnectionState
}

const currentConnections = R.pipe(
  (v: string) => localStorage.getItem(v),
  (s) => (s === null ? {} : JSON.parse(s)),
)(LOCAL_STORAGE.VALKEY_CONNECTIONS)

const connectionSlice = createSlice({
    name: VALKEY.CONNECTION.name,
    initialState: {
        connections: currentConnections as ValkeyConnectionsState
    },
    reducers: {
        connectPending: (
            state,
            action: PayloadAction<{
                connectionId: string;
                host: string;
                port: string;
                username?: string;
                password?: string;
            }>
        ) => {
            const { connectionId, host, port, username = "", password = "" } = action.payload;
            state.connections[connectionId] = {
                status: "Connecting",
                errorMessage: null,
                connectionDetails: { host, port, username, password },
            };
        },
        connectFulfilled: (state, action) => {
            const { connectionId } = action.payload;
            if (state.connections[connectionId]) {
                state.connections[connectionId].status = CONNECTED;
                state.connections[connectionId].errorMessage = null;
            }
        },
        connectRejected: (state, action) => {
            const { connectionId } = action.payload;
            state.connections[connectionId].status = "Error";
            state.connections[connectionId].errorMessage = action.payload || "Unknown error";
        },
        resetConnection: (state, action) => {
            const { connectionId } = action.payload;
            state.connections[connectionId].status = "Idle";
            state.connections[connectionId].errorMessage = null;
        },
        updateConnectionDetails: (state, action) => {
            const { connectionId } = action.payload;
            state.connections[connectionId].connectionDetails = {
                ...state.connections[connectionId].connectionDetails,
                ...action.payload,
            };
        },
    }
})

export default connectionSlice.reducer
export const { connectPending, connectFulfilled, connectRejected, resetConnection, updateConnectionDetails } = connectionSlice.actions
