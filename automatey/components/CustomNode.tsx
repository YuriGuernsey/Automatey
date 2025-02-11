import { memo } from "react"
import { Handle, Position } from "reactflow"

function CustomNode({ data }: { data: { label: string; type: string } }) {
  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${getBorderColor(data.type)}`}>
      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
      <div className="font-bold">{data.label}</div>
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
    </div>
  )
}

function getBorderColor(type: string) {
  switch (type) {
    case "trigger":
      return "border-blue-500"
    case "action":
      return "border-green-500"
    case "condition":
      return "border-yellow-500"
    default:
      return "border-gray-500"
  }
}

export default memo(CustomNode)

