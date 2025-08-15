import { configureStore } from "@reduxjs/toolkit";
import wsConnectionReducer from "./features/wsconnection/wsConnectionSlice";
import valkeyConnectionReducer from "./features/valkeyconnection/valkeyConnectionSlice";
import valkeyCommandReducer from "./features/valkeycommand/valkeycommandSlice";
import valkeyInfoReducer from "./features/valkeyinfo/valkeyInfoSlice";
import { wsMiddleware } from "./middleware/ws/wsMiddleware";
import { valkeyMiddleware } from "./middleware/valkey/valkeyMiddleware";

export const store = configureStore({
    reducer: {
        websocket: wsConnectionReducer,
        valkeyconnection: valkeyConnectionReducer,
        valkeycommand: valkeyCommandReducer,
        valkeyinfo: valkeyInfoReducer
    },
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware().concat(wsMiddleware, valkeyMiddleware)
    },
    devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch