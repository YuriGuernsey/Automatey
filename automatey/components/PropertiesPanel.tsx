import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Node } from "reactflow"

export default function PropertiesPanel({
  node,
  setNodes,
}: { node: Node; setNodes: React.Dispatch<React.SetStateAction<Node[]>> }) {
  const updateNodeData = (key: string, value: string) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            data: {
              ...n.data,
              [key]: value,
            },
          }
        }
        return n
      }),
    )
  }

  return (
    <div className="w-64 p-4 bg-gray-100 border-l">
      <h3 className="text-lg font-semibold mb-4">Properties</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="node-label">Label</Label>
          <Input
            id="node-label"
            value={node.data.label}
            onChange={(evt) => updateNodeData("label", evt.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="node-type">Type</Label>
          <Input id="node-type" value={node.data.type} disabled className="mt-1" />
        </div>
      </div>
    </div>
  )
}

