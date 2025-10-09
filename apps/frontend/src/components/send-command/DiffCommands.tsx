import * as R from "ramda"
import { useSelector } from "react-redux"
import { getNth } from "@/state/valkey-features/command/commandSelectors.ts"
import { diff, type JSONObject } from "@common/src/json-utils.ts"
import type { CommandMetadata } from "@/state/valkey-features/command/commandSlice.ts"

const DiffCommands = ({ id, indexA, indexB }) => {
  const A = useSelector(getNth(indexA, id as string)) as CommandMetadata as JSONObject
  const B = useSelector(getNth(indexB, id as string)) as CommandMetadata as JSONObject

  const diffs = diff(A, B)

  if (R.isEmpty(diffs)) return "Responses are identical"

  return diffs
    .map(({ keyPathString, valueA, valueB }) => `${keyPathString}: ${valueA} -> ${valueB}`)
    .join("\n")
}

export default DiffCommands
