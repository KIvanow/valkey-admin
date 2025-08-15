import { WebSocketServer, WebSocket } from "ws";
import { GlideClient, Decoder } from "@valkey/valkey-glide";
import { setConnecting, setConnected, setError } from "../src/features/valkeyconnection/valkeyConnectionSlice.ts"
import { sendFulfilled, sendFailed, sendPending } from "../src/features/valkeycommand/valkeycommandSlice.ts";
import { setData } from "../src/features/valkeyinfo/valkeyInfoSlice.ts";

const wss = new WebSocketServer({ port: 8080 })

console.log("Websocket server running on localhost:8080")

wss.on('connection', (ws: WebSocket) => {
    console.log("Client connected.")
    let client: GlideClient | undefined;

    ws.on('message', async (message) => {
        const action = JSON.parse(message.toString());

        if (action.type === setConnecting.type) {
            client = await connectToValkey(ws, action.payload)
        }
        if (action.type === sendPending.type && client) {
            await sendValkeyRunCommand(client, ws, action.payload)
        }
        if (action.type === setData.type && client) {
            setDashboardData(client, ws)
        }
    })
    ws.onerror = (err) => {
        console.error("WebSocket error:", err);
    }

    ws.on('close', (code, reason) => {
        if (client) {
            client.close()
        }
        console.log("Client disconnected. Reason: ", code, reason.toString())
    })

})

async function connectToValkey(ws: WebSocket, payload) {
    const addresses = [
        {
            host: payload.host,
            port: payload.port,
        },
    ];
    try {
        const client = await GlideClient.createClient({
            addresses,
            requestTimeout: 5000,
            clientName: "test_client"
        })

        ws.send(JSON.stringify({
            type: setConnected.type,
            payload: {
                status: true,
            },
        }));

        return client;
    }
    catch (err) {
        console.log("Error connecting to Valkey", err)
        ws.send(JSON.stringify({
            type: setError.type,
            payload: err
        }))
    }
}

async function setDashboardData(client: GlideClient, ws: WebSocket) {
    const rawInfo = await client.info();
    const info = parseInfo(rawInfo);
    const rawMemoryStats = await client.customCommand(
        ["MEMORY", "STATS"],
        { decoder: Decoder.String }
    ) as Array<{ key: string; value: string }>

    const memoryStats = rawMemoryStats.reduce((acc, { key, value }) => {
        acc[key] = value
        return acc
    })

    console.log(info)

    ws.send(JSON.stringify({
        type: setData.type,
        payload: {
            info: info,
            memory: memoryStats,
        },
    }));
}

const parseInfo = (infoStr: string): Record<string, string> =>
    infoStr
        .split('\n')
        .reduce((acc, line) => {
            if (!line || line.startsWith('#') || !line.includes(':')) return acc;
            const [key, value] = line.split(':').map(part => part.trim());
            acc[key] = value;
            return acc;
        }, {} as Record<string, string>);

async function sendValkeyRunCommand(client: GlideClient, ws: WebSocket, payload) {
    try {
        const rawResponse = await client.customCommand(payload.command.split(" ")) as string;
        const response = parseInfo(rawResponse)
        if (rawResponse.includes("ResponseError")) {
            ws.send(JSON.stringify({
                type: sendFailed.type,
                payload: rawResponse
            }));
        }
        ws.send(JSON.stringify({
            type: sendFulfilled.type,
            payload: response
        }))
    } catch (err) {
        ws.send(JSON.stringify({
            type: sendFailed.type,
            payload: err
        }))
        console.log("Error sending command to Valkey", err)
    }
}
