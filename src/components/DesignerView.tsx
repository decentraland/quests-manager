import React from "react"

import { Edge, Node } from "@dcl/quests-designer/dist/types"
import useAsyncState from "decentraland-gatsby/dist/hooks/useAsyncState"
import { back, navigate } from "decentraland-gatsby/dist/plugins/intl"

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
  close,
}: {
  initialNodes?: Node[]
  initialEdges?: Edge[]
  type?: "new" | "draft" | "published" | "old"
  questId?: string
  close?: () => void
}) => {
  const [QuestDesigner] = useAsyncState(() => import("@dcl/quests-designer"))
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {QuestDesigner && (
        <QuestDesigner.QuestsDesigner
          saveDesignButton={
            type !== "old"
              ? {
                  content:
                    type == "new"
                      ? "Generate New Quest"
                      : type == "draft"
                      ? "Update Draft"
                      : "Update Quest",
                  onClick: (definition, nodes) => {
                    switch (type) {
                      case "new": {
                        const id = storeQuestDraft({
                          definition,
                          metadata: {
                            stepPositions: nodes.reduce((acc, curr) => {
                              acc[curr.id] = curr.position
                              return acc
                            }, {} as Record<string, { x: number; y: number }>),
                          },
                        })
                        if (typeof window !== "undefined") {
                          navigate(locations.editDraftQuest(id))
                        }
                        break
                      }
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
                        break
                    }
                  },
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
