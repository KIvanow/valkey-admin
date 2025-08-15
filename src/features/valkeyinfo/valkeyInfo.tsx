
import { useSelector } from "react-redux";
import { selectData } from "./valkeyInfoSlice";
import { Card } from "@/components/ui/card";
export function Dashboard() {
    const {
        total_commands_processed,
        dataset_bytes,
        connected_clients,
        keys_count,
        bytes_per_key,
    } = useSelector(selectData)
    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold">Dashboard</h1>

            <div className="flex flex-wrap gap-4">
                {[
                    ["Total Commands Processed", total_commands_processed],
                    ["Dataset Bytes", dataset_bytes],
                    ["Connected Clients", connected_clients],
                    ["Keys Count", keys_count],
                    ["Bytes per Key", bytes_per_key],
                ].map(([label, value]) => (
                    <Card key={label} className="flex flex-col p-4 w-[200px]">
                        <div className="text-2xl font-bold">{value}</div>
                        <div className="text-lg text-muted-foreground">{label}</div>
                    </Card>
                ))}
            </div>
        </div>
    );

}