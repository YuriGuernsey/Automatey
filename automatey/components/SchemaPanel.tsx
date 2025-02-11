"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SchemaPanelProps {
  generateSchema: () => any
  explainWorkflow: () => string
  saveMermaidDiagram: () => void
  saveExplanation: () => void
}

export default function SchemaPanel({
  generateSchema,
  explainWorkflow,
  saveMermaidDiagram,
  saveExplanation,
}: SchemaPanelProps) {
  const [schemaVisible, setSchemaVisible] = useState(false)
  const [explanationVisible, setExplanationVisible] = useState(false)

  return (
    <div className="flex space-x-4">
      <div>
        <Button onClick={() => setSchemaVisible(!schemaVisible)}>
          {schemaVisible ? "Hide Schema" : "Show Schema"}
        </Button>
        {schemaVisible && (
          <div className="mt-2">
            <pre className="p-2 bg-gray-200 rounded text-sm">{JSON.stringify(generateSchema(), null, 2)}</pre>
            <Button onClick={saveMermaidDiagram} className="mt-2">
              Save Schema as Diagram
            </Button>
          </div>
        )}
      </div>
      <div>
        <Button onClick={() => setExplanationVisible(!explanationVisible)}>
          {explanationVisible ? "Hide Explanation" : "Show Explanation"}
        </Button>
        {explanationVisible && (
          <div className="mt-2">
            <pre className="p-2 bg-gray-200 rounded text-sm whitespace-pre-wrap">{explainWorkflow()}</pre>
            <Button onClick={saveExplanation} className="mt-2">
              Save Explanation
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

