import { Quest } from "@dcl/quests-designer/dist/protocol/quests"
import API from "decentraland-gatsby/dist/utils/api/API"
import env from "decentraland-gatsby/dist/utils/env"

import { DraftQuest, QuestAmplified, QuestRewards } from "./types"
import { isValidQuestDraft } from "./utils"

export class QuestsClient extends API {
  static URL = env("QUESTS_SERVER_URL", "https://quests.decentraland.org/api")

  constructor(public user: string) {
    super(QuestsClient.URL)
  }

  getMyQuests() {
    return this.fetch<{
      quests: QuestAmplified[]
    }>(
      `/creators/${this.user}/quests`,
      this.options().method("GET").authorization({ sign: true })
    )
  }

  publishQuest(quest: Omit<DraftQuest, "metadata" | "id">) {
    if (!isValidQuestDraft(quest)) {
      throw new Error("Invalid Quest")
    }

    // we must stringify all non-string parameters
    // server expects map<string, string>
    for (const step of quest.definition.steps) {
      for (const task of step.tasks) {
        for (const action of task.actionItems) {
          for (const param in action.parameters) {
            if (typeof action.parameters[param] != "string") {
              action.parameters[param] = JSON.stringify(
                action.parameters[param]
              )
            }
          }
        }
      }
    }

    return this.fetch<{ id: string }>(
      `/quests`,
      this.options()
        .method("POST")
        .authorization({ sign: true })
        .json(quest)
        .metadata(quest as unknown as any)
    )
  }

  async getQuest(id: string): Promise<QuestAmplified> {
    const questWithoutRewards = await this.fetch<{
      quest: Quest & { active: boolean }
    }>(
      `/quests/${id}`,
      this.options().method("GET").authorization({ sign: true })
    )

    let questRewards: QuestRewards["reward"] | null = null

    try {
      questRewards = await this.fetch<QuestRewards["reward"]>(
        `/quests/${id}/reward?with_hook=true`,
        this.options().method("GET").authorization({ sign: true })
      )
    } catch (error) {
      console.log(error)
    }

    return {
      ...questWithoutRewards.quest,
      reward: questRewards ? questRewards : undefined,
    }
  }

  updateQuest(
    id: string,
    quest: Omit<QuestAmplified, "creatorAddress" | "id" | "active">
  ) {
    if (!quest.name) {
      throw new Error("Quest must have a name")
    }

    return this.fetch<{ id: string }>(
      `/quests/${id}`,
      this.options().method("PUT").authorization({ sign: true }).json(quest)
    )
  }

  deactivateQuest(id: string) {
    return this.fetch(
      `/quests/${id}`,
      this.options().method("DELETE").authorization({ sign: true })
    )
  }

  activateQuest(id: string) {
    return this.fetch(
      `/quests/${id}/activate`,
      this.options().method("PUT").authorization({ sign: true })
    )
  }

  getOldVersions(id: string) {
    return this.fetch<{ updates: string[] }>(
      `/quests/${id}/updates`,
      this.options().method("GET")
    )
  }
}
