import { validateCreateQuest } from "@dcl/quests-client/dist/utils"
import API from "decentraland-gatsby/dist/utils/api/API"

import { DraftQuest } from "./types"

export const LOCAL_DB = "draft_quests"

export const getQuestDrafts = (): DraftQuest[] => {
  if (typeof window === "undefined") {
    return []
  }

  return JSON.parse(localStorage.getItem(LOCAL_DB) || "[]")
}

export const getQuestDraftById = (id: number) => {
  return getQuestDrafts().find((q) => q.id == id)
}

export const storeQuestDraft = (quest: Omit<DraftQuest, "id">): number => {
  if (typeof window === "undefined") return 0

  const db = getQuestDrafts()
  const id = db.length ? db[db.length - 1].id + 1 : 1
  db.push({ id, ...quest })
  localStorage.setItem(LOCAL_DB, JSON.stringify(db))
  return id
}

export const updateQuestDraft = (quest: DraftQuest): boolean => {
  if (typeof window === "undefined") return false

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
  if (typeof window === "undefined") return false

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
  if (typeof window === "undefined") return false

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
  oldQuest: (id: string) => API.url(GATSBY_BASE_URL, `/quests/old/${id}`),
}

export const isValidQuest = (q: DraftQuest) => {
  try {
    validateCreateQuest(q)
    return true
  } catch (error) {
    console.error("IsValidQuest > ", error)
    return false
  }
}

export const urlRegex =
  // eslint-disable-next-line no-useless-escape
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/gm
