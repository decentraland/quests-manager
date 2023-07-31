import { QuestDefinition } from "@dcl/quests-designer/dist/protocol/quests"
import API from "decentraland-gatsby/dist/utils/api/API"

export const LOCAL_DB = "draft_quests"

export const getDefinitionOnLocalStorage = (): QuestDefinition[] => {
  return JSON.parse(localStorage.getItem(LOCAL_DB) || "[]")
}

export const storeDefinitionOnLocalStorage = (def: QuestDefinition) => {
  const db = getDefinitionOnLocalStorage()
  db.push(def)
  localStorage.setItem(LOCAL_DB, JSON.stringify(db))
}

const GATSBY_BASE_URL = process.env.GATSBY_BASE_URL || "/"

export const locations = {
  home: () => API.url(GATSBY_BASE_URL, "/"),
  designer: () => API.url(GATSBY_BASE_URL, "/design"),
}
