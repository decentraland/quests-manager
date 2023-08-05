import { Quest } from "@dcl/quests-designer/dist/protocol/quests"
import API from "decentraland-gatsby/dist/utils/api/API"
import env from "decentraland-gatsby/dist/utils/env"

import { DraftQuest, QuestAmplified, QuestRewards } from "./utils"

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
    if (!quest.name) {
      throw new Error("Quest must have a name")
    }

    // let parsedRequestBody = null
    // if (quest.reward?.hook.requestBody) {
    //   try {
    //     console.log(quest.reward?.hook.requestBody)
    //     parsedRequestBody = JSON.parse(
    //       JSON.stringify(quest.reward.hook.requestBody)
    //     )
    //     console.log(parsedRequestBody)
    //   } catch (error) {
    //     throw new Error("Inavlid Request Body must be a valid JSON")
    //   }
    // }

    return this.fetch<{ id: string }>(
      `/quests`,
      this.options()
        .method("POST")
        .authorization({ sign: true })
        .json({
          ...quest,
          reward: {
            ...quest.reward,
            hook: {
              ...quest.reward?.hook,
              requestBody: { beneficary: "{user_address}", key: "ee233sd2" },
            },
          },
        })
    )
  }

  async getQuest(id: string): Promise<QuestAmplified> {
    const questWithoutRewards = await this.fetch<{
      quest: Quest & { active: boolean }
    }>(
      `/quests/${id}`,
      this.options().method("GET").authorization({ sign: true })
    )

    const questRewards = await this.fetch<QuestRewards["reward"]>(
      `/quests/${id}/reward?with_hook=true`,
      this.options().method("GET").authorization({ sign: true })
    )

    return {
      ...questWithoutRewards.quest,
      reward: questRewards,
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
}
