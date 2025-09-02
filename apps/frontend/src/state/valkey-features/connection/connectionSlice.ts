import { createSlice } from "@reduxjs/toolkit";
import { VALKEY } from "@common/src/constants.ts"

const connectionSlice = createSlice({
    name: VALKEY.CONNECTION.name,
    initialState: {
        status: "Idle",
        errorMessage: null,
        hasRedirected: false
    },
    reducers: {
        connectPending: (state, action) => {
            state.status = "Connecting";
            state.errorMessage = null;
        },
        connectFulfilled: (state) => {
            state.status = "Connected";
            state.errorMessage = null;
        },
        connectRejected: (state, action) => {
            state.status = "Error";
            state.errorMessage = action.payload || "Unknown error";
        },
        setRedirected: (state, action) => {
            state.hasRedirected = action.payload;
        },
        resetConnection: (state) => {
            state.status = "Idle";
            state.errorMessage = null;
        }
    }
})

export default connectionSlice.reducer
export const { connectPending, connectFulfilled, connectRejected, setRedirected, resetConnection } = connectionSlice.actions