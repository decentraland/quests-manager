import React from "react"

import { QuestsDesigner } from "@dcl/quests-designer"
import { Edge, Node } from "@dcl/quests-designer/dist/types"
import { navigate } from "decentraland-gatsby/dist/plugins/intl"

import {
  locations,
  storeQuestDraft,
  updateQuestDraftDefinition,
} from "../utils"

export const DesignerView = ({
  initialNodes,
  initialEdges,
  type = "new",
  questId,
}: {
  initialNodes?: Node[]
  initialEdges?: Edge[]
  type?: "new" | "draft" | "published"
  questId?: string
}) => {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <QuestsDesigner
        saveDesignButton={{
          content:
            type == "new"
              ? "Generate New Quest"
              : type == "draft"
              ? "Update Draft"
              : "Update Quest",
          onClick: (definition, nodes) => {
            switch (type) {
              case "new":
                storeQuestDraft({
                  definition,
                  metadata: {
                    stepPositions: nodes.reduce((acc, curr) => {
                      acc[curr.id] = curr.position
                      return acc
                    }, {} as Record<string, { x: number; y: number }>),
                  },
                })
                alert("Quest Definition stored as a draft")
                break
              case "draft":
                updateQuestDraftDefinition(Number(questId), {
                  definition,
                  metadata: {
                    stepPositions: nodes.reduce((acc, curr) => {
                      acc[curr.id] = curr.position
                      return acc
                    }, {} as Record<string, { x: number; y: number }>),
                  },
                })
            }
          },
        }}
        closeDesigner={() => navigate(locations.home())}
        initialNodes={initialNodes}
        initialEdges={initialEdges}
      />
    </div>
  )
}
