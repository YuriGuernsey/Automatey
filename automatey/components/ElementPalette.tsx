import type React from "react"
import { Button } from "@/components/ui/button"

const elements = [
  { type: "trigger", label: "Trigger" },
  { type: "action", label: "Action" },
  { type: "condition", label: "Condition" },
]

export default function ElementPalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="w-48 p-4 bg-gray-100 border-r">
      <h3 className="text-lg font-semibold mb-4">Elements</h3>
      {elements.map((el) => (
        <div key={el.type} className="mb-2">
          <Button variant="outline" className="w-full" draggable onDragStart={(event) => onDragStart(event, el.type)}>
            {el.label}
          </Button>
        </div>
      ))}
    </div>
  )
}

