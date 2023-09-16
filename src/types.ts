import {
  Quest,
  QuestDefinition,
} from "@dcl/quests-client/dist/protocol/decentraland/quests/definitions.gen"
import { Edge, Node } from "@dcl/quests-designer/dist/types"

export type DraftQuest = {
  id: number
  name?: string
  description?: string
  imageUrl?: string
  definition?: QuestDefinition
  metadata: {
    stepPositions?: Record<string, { x: number; y: number }> // A.K.A node positions on the canvas
    nodes?: Node[]
    edges?: Edge[]
  }
} & Partial<QuestRewards>

export type QuestAmplified = Omit<Quest, "creatorAddress"> &
  Partial<QuestRewards> & {
    active: boolean
  }

export type QuestRewards = {
  reward: {
    hook: {
      webhookUrl: string
      requestBody: Record<string, string>
    }
    items: { name: string; imageLink: string }[]
  }
}

export type RawQuest = {
  name?: string
  description?: string
  imageUrl?: string
} & Partial<QuestRewards>
