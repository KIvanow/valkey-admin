import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store";


export const selectResponse = (state: RootState) => state.valkeycommand.response
export const selectError = (state: RootState) => state.valkeycommand.error

const valkeycommandSlice = createSlice({
    name: 'valkeycommand',
    initialState: {
        lastCommand: "",
        response: null,
        pending: false,
        error: null
    },
    reducers: {
        sendFulfilled: (state, action) => {
            state.error = null
            state.response = action.payload
            state.pending = false
        },
        sendPending: (state, action) => {
            state.error = null
            state.lastCommand = action.payload.command
            state.pending = action.payload.pending
            state.response = null
        },
        sendFailed: (state, action) => {
            state.error = action.payload
            state.pending = false
        }
    }
})

export default valkeycommandSlice.reducer;
export const { sendFulfilled, sendPending, sendFailed } = valkeycommandSlice.actions