import Valkey from "iovalkey"
const url = "valkey://host.docker.internal:6379"
//const url = String(process.env.VALKEY_URL || cfg.valkey.url || "").trim()
export const makeHotkeysFetcher = (mainClient, topN = 10, prefixDelim = ":") => {
  let lastSnapshot = []
  const sleep = ms => new Promise(r => setTimeout(r, ms))
  const keyCounts = new Map()
  const prefixCounts = new Map()

  const recordKey = key => {
    keyCounts.set(key, (keyCounts.get(key) || 0) + 1)
    const parts = key.split(prefixDelim)
    if (parts.length > 1) {
      const prefix = parts[0]
      prefixCounts.set(prefix, (prefixCounts.get(prefix) || 0) + 1)
    }
  }

  const processCommand = args => {
    if (!Array.isArray(args) || args.length < 2) return
    console.log("Args are: ", args)
    const command = String(args[0]).toLowerCase()
    const key = args[1] ? String(args[1]) : null
    if (key) recordKey(key)
  }

  const monitorLoop = async () => {
    const monitorClient = new Valkey(url) 

    while (true) {
      try {
        console.info("Hotkeys monitor connected")

        const monitor = await monitorClient.monitor()
        monitor.on("monitor", (_time, args) => processCommand(args))

        // rest for a minute
        await sleep(60000)

        // compute top N keys
        const sorted = [...keyCounts.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, topN)
          .map(([key, count]) => ({ key, count, ts: Date.now() }))

        lastSnapshot = sorted
        console.info(`Captured top ${topN} hotkeys`)

        await monitor.disconnect()
        console.info("Hotkeys monitor sleeping for 1 minute")
        await sleep(60_000)
      } catch (err) {
        console.error("Hotkeys monitor error", err)
        try { await monitorClient.disconnect() } catch {}
        await sleep(5000)
      }
    }
  }

  monitorLoop().catch(err => console.error("Hotkeys loop crashed", err))

  return async () => lastSnapshot
}
