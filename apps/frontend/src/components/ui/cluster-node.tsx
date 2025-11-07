import { Dot, LayoutDashboard, Terminal } from "lucide-react"
import { useNavigate } from "react-router"
import { Card } from "./card"

interface ReplicaNode {
  id: string
  host: string
  port: number
}

interface PrimaryNode {
  host: string
  port: number
  replicas: ReplicaNode[]
}

interface ParsedNodeInfo {
  server_name: string | null
  uptime_in_days: string | null
  tcp_port: string | null
  used_memory_human: string | null
  used_cpu_sys: string | null
  instantaneous_ops_per_sec: string | null
  total_commands_processed: string | null
  role: string | null
  connected_clients: string | null
}

interface ClusterNodeProps {
  primaryKey: string
  primary: PrimaryNode
  primaryData: ParsedNodeInfo
  allNodeData: Record<string, ParsedNodeInfo>
  clusterId: string
}

export default function ClusterNode({ primaryKey, primary, primaryData, allNodeData, clusterId }: ClusterNodeProps) {
  const navigate = useNavigate()

  const formatRole = (role: string | null) => {
    if (!role) return "UNKNOWN"
    const normalized = role.toLowerCase()
    if (normalized === "master") return "PRIMARY"
    if (normalized === "slave") return "REPLICA"
    return role.toUpperCase()
  }

  return (
    <Card className="dark:bg-gray-800">
      {/* for primary */}
      <div className="flex items-center">
        <span className="font-bold">{formatRole(primaryData?.role)}</span> <Dot className="text-green-500" size={34} />
      </div>
      <div className="flex flex-col text-xs text-tw-dark-border"><span>{primaryData?.server_name}</span><span>{primaryKey}</span></div>
      <div className="text-xs space-y-1.5">
        <div className="flex justify-between">
          <span className="text-tw-dark-border">Memory:</span>
          <span>{primaryData?.used_memory_human ?? "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-tw-dark-border">CPU (sys):</span>
          <span>{primaryData?.used_cpu_sys ?? "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-tw-dark-border">Commands:</span>
          <span>{primaryData?.total_commands_processed ?? "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-tw-dark-border">Clients:</span>
          <span>{primaryData?.connected_clients ?? "N/A"}</span>
        </div>
      </div>
      <div className="border-b mt-0"></div>
      {/* for replicas */}
      {primary.replicas.length > 0 && (
        <div className="mt-0">
          <span className="text-xs text-tw-dark-border">REPLICAS ({primary.replicas.length})</span>
          {primary.replicas.map((replica) => (
            <div className="bg-tw-primary/10 rounded-sm p-2 text-xs text-tw-dark-border" key={replica.id}>
              <div className="flex items-center justify-between space-y-1">
                <div className="">
                  <span>{`${replica.host}:${replica.port}`}</span>
                  <div className="flex gap-4">
                    <span>Mem: {allNodeData[`${replica.host}:${replica.port}`]?.used_memory_human}</span>
                    <span>Clients: {allNodeData[`${replica.host}:${replica.port}`]?.connected_clients}</span>
                  </div>
                </div>
                <Dot className="text-tw-primary" size={30} />
              </div>
              {/* replica buttons */}
              <div className="mt-2 flex gap-2">
                <button className="flex items-center gap-1.5 border dark:border-tw-dark-border px-2 py-0.5 
                    rounded cursor-pointer hover:bg-tw-primary hover:text-white"
                onClick={() => { navigate(`/${clusterId}/localhost-${replica.port}/dashboard`) }}><LayoutDashboard size={12} />
                  Dashboard</button>
                <button className="flex items-center gap-1.5 border dark:border-tw-dark-border px-2 py-0.5
                 rounded cursor-pointer hover:bg-tw-primary hover:text-white"
                onClick={() => { navigate(`/${clusterId}/localhost-${replica.port}/sendcommand`) }}><Terminal size={12} /> Command</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* primary buttons */}
      <div className="mt-2 flex gap-2 text-xs items-center justify-center">
        <button className="w-1/2 flex items-center justify-center gap-1.5 border px-2 py-1 rounded cursor-pointer
         hover:bg-tw-primary hover:text-white"
        onClick={() => { navigate(`/${clusterId}/localhost-${primary.port}/dashboard`) }}><LayoutDashboard size={12} /> Dashboard</button>
        <button className="w-1/2 flex items-center justify-center gap-1.5 border px-2 py-1 rounded cursor-pointer
         hover:bg-tw-primary hover:text-white"
        onClick={() => { navigate(`/${clusterId}/localhost-${primary.port}/sendcommand`) }}><Terminal size={12} /> Command</button>
      </div>
    </Card>
  )
}
