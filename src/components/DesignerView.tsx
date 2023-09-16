import React from "react"

import { QuestDefinition } from "@dcl/quests-client/dist/protocol/decentraland/quests/definitions.gen"
import { Edge, Node } from "@dcl/quests-designer/dist/types"
import useAsyncState from "decentraland-gatsby/dist/hooks/useAsyncState"
import { back } from "decentraland-gatsby/dist/plugins/intl"

export const DesignerView = ({
  initialNodes,
  initialEdges,
  type = "new",
  onClick,
  close,
}: {
  initialNodes?: Node[]
  initialEdges?: Edge[]
  type?: "new" | "draft" | "published" | "old"
  onClick?: (nodes: Node[], edges: Edge[], definition?: QuestDefinition) => void
  close?: () => void
}) => {
  const [QuestDesigner] = useAsyncState(() => import("@dcl/quests-designer"))
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {QuestDesigner && (
        <QuestDesigner.QuestsDesigner
          saveDesignButton={
            type !== "old" && onClick
              ? {
                  content:
                    type == "new"
                      ? "Save Draft"
                      : type == "draft"
                      ? "Update Draft"
                      : "Update Quest",
                  onClick: onClick,
                  validate: type == "published",
                }
              : undefined
          }
          backButton={() => (close ? close() : back())}
          initialNodes={initialNodes}
          initialEdges={initialEdges}
        />
      )}
    </div>
  )
}
