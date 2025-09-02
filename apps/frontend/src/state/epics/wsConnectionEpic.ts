import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import { of, EMPTY } from 'rxjs'
import {
    catchError,
    mergeMap,
    takeUntil,
    tap,
    ignoreElements,
    filter
} from 'rxjs/operators'
import {
    connectFulfilled,
    connectPending,
    connectRejected,
} from '@/state/wsconnection/wsConnectionSlice'
import { action$ } from '../middleware/rxjsMiddleware/rxjsMiddlware'
import type { PayloadAction, Store } from '@reduxjs/toolkit'
import { VALKEY } from "@common/src/constants.ts"

let socket$: WebSocketSubject<PayloadAction> | null = null;

export const wsConnectionEpic = (store: Store) =>
    action$.pipe(
        filter((action) => action.type === connectPending.type),
        mergeMap(() => {
            if (socket$) {
                return EMPTY
            }
            socket$ = webSocket({
                url: 'ws://localhost:8080',
                deserializer: message => JSON.parse(message.data),
                serializer: message => JSON.stringify(message),
                openObserver: {
                    next: () => {
                        console.log('Socket Connection opened')
                        store.dispatch(connectFulfilled())
                    }
                },
                closeObserver: {
                    next: (closeEvent) => {
                        console.log('Socket Connection closed', closeEvent)
                    }
                }
            })
            return socket$.pipe(
                tap((message) => {
                    console.log('[WebSocket] Incoming message:', message)
                    store.dispatch(message)
                }),
                ignoreElements(),
                takeUntil(
                    action$.pipe(
                        filter((action) => action.type === VALKEY.CONNECTION.closeConnection),
                        tap(() => {
                            console.log('Socket Connection closed')
                            socket$?.complete();
                            socket$ = null;
                        })
                    )
                ),
                catchError((err) => of(connectRejected(err)))
            );
        })
    )

export function getSocket(): WebSocketSubject<PayloadAction> {
    if (!socket$) {
        throw new Error("WebSocket is not connected");
    }
    return socket$;
}