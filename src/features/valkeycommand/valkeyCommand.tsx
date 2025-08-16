import { useState } from 'react';
import { selectError, selectResponse, sendPending } from '../valkeycommand/valkeycommandSlice';
import { useAppDispatch } from '../../hooks/hooks';
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';


export function SendCommand() {
    const dispatch = useAppDispatch();
    const [text, setText] = useState("");
    const response = useSelector(selectResponse)
    const error = useSelector(selectError)

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4 text-center">
            {/* Textarea + Button vertically stacked */}
            <div className="flex flex-col items-center gap-4">
                <Textarea
                    placeholder="Type your Valkey command here"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-[600px] h-24 resize-none whitespace-pre-wrap break-words"
                />
                <Button
                    onClick={() =>
                        dispatch(sendPending({ command: text, pending: true }))
                    }
                    className="h-12 w-32"
                >
                    Send
                </Button>
            </div>

            {/* Response output */}
            {response && (
                <pre className="rounded-md bg-muted p-4 overflow-x-auto text-left max-w-[600px] mx-auto">
                    <code className="text-sm font-mono text-muted-foreground">
                        {response}
                    </code>
                </pre>
            )}
            {error && (
                <pre className="rounded-md bg-red-100 border border-red-400 text-red-800 p-4 overflow-x-auto text-left max-w-[600px] mx-auto">
                    <code className="text-sm font-mono whitespace-pre-wrap break-words">
                        {error['message']}
                    </code>
                </pre>
            )}

        </div>
    );


}
