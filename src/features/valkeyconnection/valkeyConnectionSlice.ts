import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export const selectStatus = (state: RootState) => state.valkeyconnection.status
export const selectConnected = (state: RootState) => state.valkeyconnection.connected
export const selectConnecting = (state: RootState) => state.valkeyconnection.connecting
export const selectRedirected = (state: RootState) => state.valkeyconnection.hasRedirected
export const selectError = (state: RootState) => state.valkeyconnection.status

const valkeyConnectionSlice = createSlice({
    name: 'valkeyconnection',
    initialState: {
        status: "Not Connected",
        connected: false,
        connecting: false,
        hasRedirected: false
    },
    reducers: {
        setConnected: (state, action) => {
            state.status = action.payload.status ? "Connected" : "Not Connected"
            state.connected = action.payload.status
            state.connecting = action.payload.status ? false : state.connecting
        },
        setConnecting: (state, action) => {
            state.status = "Connecting..."
            state.connecting = action.payload.status
        },
        setError: (state, action) => {
            state.status = "Error" + action.payload
            state.connecting = false
        },
        setRedirected: (state, action) => {
            state.hasRedirected = action.payload
        }
    }
})

export default valkeyConnectionSlice.reducer
export const { setConnected, setConnecting, setError, setRedirected } = valkeyConnectionSlice.actions