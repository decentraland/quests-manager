import {
  Quest,
  QuestDefinition,
} from "@dcl/quests-designer/dist/protocol/quests"

export type DraftQuest = {
  id: number
  name?: string
  description?: string
  imageUrl?: string
  definition: QuestDefinition
  metadata: {
    stepPositions?: Record<string, { x: number; y: number }> // A.K.A node positions on the canvas
  }
} & Partial<QuestRewards>

export type QuestAmplified = Omit<Quest, "creatorAddress"> &
  QuestRewards & {
    active: boolean
  }

export type QuestRewards = {
  reward: {
    hook: {
      webhookUrl: string
      requestBody: string // Verify if it's a well-built Record<string, string>
    }
    items: { name: string; imageLink: string }[]
  }
}
