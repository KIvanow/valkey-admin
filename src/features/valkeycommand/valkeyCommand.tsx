import { useState } from 'react';
import { sendPending } from '../valkeycommand/valkeycommandSlice';
import { setConnected as valkeySetConnected } from '../valkeyconnection/valkeyConnectionSlice';
import { useAppDispatch } from '../../hooks/hooks';
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';


export function SendCommand() {
    const dispatch = useAppDispatch();
    const [text, setText] = useState("");

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4">
            {/* Textarea and Send button side-by-side */}
            <div className="flex gap-2">
                <Textarea
                    placeholder="Type your Valkey command here"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 resize-none h-24"
                />
                <Button
                    onClick={() =>
                        dispatch(sendPending({ command: text, pending: true }))
                    }
                    className="h-24"
                >
                    Send
                </Button>
            </div>

            {/* Disconnect button centered below */}
            <div className="flex justify-end">
                <Button
                    variant="secondary"
                    onClick={() => dispatch(valkeySetConnected(false))}
                >
                    Disconnect
                </Button>
            </div>
        </div>
    );
}
