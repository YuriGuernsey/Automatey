"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import ReactFlow, {
  type Node,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  type Connection,
  type Edge,
  MiniMap,
  useReactFlow,
} from "reactflow"
import "reactflow/dist/style.css"
import mermaid from "mermaid"
import saveAs from "file-saver" // Fixed import

import ElementPalette from "./ElementPalette"
import CustomNode from "./CustomNode"
import PropertiesPanel from "./PropertiesPanel"
import SchemaPanel from "./SchemaPanel"
import { Button } from "@/components/ui/button"
import { toPng } from "html-to-image" // Fixed import

const nodeTypes = {
  customNode: CustomNode,
}

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { getNodes, getEdges, toObject } = useReactFlow()

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true })
  }, [])

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow")

      if (typeof type === "undefined" || !type) {
        return
      }

      const position = {
        x: event.clientX,
        y: event.clientY,
      }
      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type: "customNode",
        position,
        data: { label: `${type} node`, type: type },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [nodes, setNodes],
  )

  const generateSchema = () => {
    const schema = {
      nodes: getNodes().map((node) => ({
        id: node.id,
        type: node.data.type,
        label: node.data.label,
      })),
      edges: getEdges().map((edge) => ({
        source: edge.source,
        target: edge.target,
      })),
    }
    return schema
  }

  const generateMermaidDiagram = () => {
    const nodes = getNodes()
    const edges = getEdges()
    let mermaidCode = "graph TD\n"

    nodes.forEach((node) => {
      mermaidCode += `  ${node.id}[${node.data.label}]\n`
    })

    edges.forEach((edge) => {
      mermaidCode += `  ${edge.source} --> ${edge.target}\n`
    })

    return mermaidCode
  }

  const explainWorkflow = () => {
    const nodes = getNodes()
    const edges = getEdges()
    let explanation = "Workflow Explanation:\n\n"

    nodes.forEach((node) => {
      const outgoingEdges = edges.filter((edge) => edge.source === node.id)
      explanation += `${node.data.label} (${node.data.type}):\n`
      if (outgoingEdges.length === 0) {
        explanation += "- This is an end point in the workflow.\n"
      } else {
        outgoingEdges.forEach((edge) => {
          const targetNode = nodes.find((n) => n.id === edge.target)
          if (targetNode) {
            explanation += `- Connects to: ${targetNode.data.label}\n`
          }
        })
      }
      explanation += "\n"
    })

    return explanation
  }

  const exportImage = () => {
    if (reactFlowWrapper.current === null) {
      return
    }

    toPng(reactFlowWrapper.current, {
      filter: (node) => {
        if (node?.classList?.contains("react-flow__minimap") || node?.classList?.contains("react-flow__controls")) {
          return false
        }
        return true
      },
    }).then((dataUrl) => {
      const link = document.createElement("a")
      link.download = "workflow.png"
      link.href = dataUrl
      link.click()
    })
  }

  const saveMermaidDiagram = async () => {
    const mermaidCode = generateMermaidDiagram()
    try {
      const { svg } = await mermaid.render("mermaid-diagram", mermaidCode)
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
      saveAs(blob, "workflow_schema.svg")
    } catch (error) {
      console.error("Error generating Mermaid diagram:", error)
    }
  }

  const saveExplanation = () => {
    const explanation = explainWorkflow()
    const blob = new Blob([explanation], { type: "text/plain;charset=utf-8" })
    saveAs(blob, "workflow_explanation.txt")
  }

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex h-[calc(100vh-60px)]">
        <ElementPalette />
        <div className="flex-grow h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
        {selectedNode && <PropertiesPanel node={selectedNode} setNodes={setNodes} />}
      </div>
      <div className="flex justify-between items-center p-4 bg-gray-100">
        <SchemaPanel
          generateSchema={generateSchema}
          explainWorkflow={explainWorkflow}
          saveMermaidDiagram={saveMermaidDiagram}
          saveExplanation={saveExplanation}
        />
        <Button onClick={exportImage}>Export as Image</Button>
      </div>
    </div>
  )
}

export default function AutomationFlowCreator() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  )
}

