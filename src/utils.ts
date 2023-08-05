import API from "decentraland-gatsby/dist/utils/api/API"

import { DraftQuest } from "./types"

export const LOCAL_DB = "draft_quests"

export const getQuestDrafts = (): DraftQuest[] => {
  return JSON.parse(localStorage.getItem(LOCAL_DB) || "[]")
}

export const getQuestDraftById = (id: number) => {
  return getQuestDrafts().find((q) => q.id == id)
}

export const storeQuestDraft = (quest: Omit<DraftQuest, "id">) => {
  const db = getQuestDrafts()
  const id = db.length ? db[db.length - 1].id + 1 : 1
  db.push({ id, ...quest })
  localStorage.setItem(LOCAL_DB, JSON.stringify(db))
}

export const updateQuestDraft = (quest: DraftQuest): boolean => {
  const db = getQuestDrafts()
  const index = db.findIndex((q) => q.id == quest.id)
  if (index !== -1) {
    db[index] = { ...quest }
    localStorage.setItem(LOCAL_DB, JSON.stringify(db))
    return true
  } else {
    return false
  }
}

export const updateQuestDraftDefinition = (
  id: number,
  newDefinition: Pick<DraftQuest, "definition" | "metadata">
): boolean => {
  const db = getQuestDrafts()
  const index = db.findIndex((q) => q.id == id)
  if (index !== -1) {
    db[index].definition = newDefinition.definition
    db[index].metadata = newDefinition.metadata
    localStorage.setItem(LOCAL_DB, JSON.stringify(db))
    return true
  } else {
    return false
  }
}

export const deleteQuestDraft = (id: number): boolean => {
  const db = getQuestDrafts()
  const index = db.findIndex((q) => q.id == id)
  if (index !== -1) {
    db.splice(index, 1)
    localStorage.setItem(LOCAL_DB, JSON.stringify(db))
    return true
  } else {
    return false
  }
}

const GATSBY_BASE_URL = process.env.GATSBY_BASE_URL || "/"

export const locations = {
  home: () => API.url(GATSBY_BASE_URL, "/"),
  designer: () => API.url(GATSBY_BASE_URL, "/design/create"),
  editDraftQuest: (id: number) =>
    API.url(GATSBY_BASE_URL, `/quests/drafts/${id}`),
  editPublishedQuest: (id: string) => API.url(GATSBY_BASE_URL, `/quests/${id}`),
}
