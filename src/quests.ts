import { Quest } from "@dcl/quests-designer/dist/protocol/quests"
import env from "decentraland-gatsby/dist/utils/env"

export const getMyQuests = async (address: string) => {
  const quests = await (
    await fetch(`${env("QUESTS_SERVER_URL")}/creators/${address}/quests`)
  ).json<{ quests: Quest[] }>()

  return quests
}
