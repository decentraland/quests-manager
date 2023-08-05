import React, { useEffect, useState } from "react"

import { useAuthContext } from "decentraland-gatsby/dist/context/Auth"
import { Link, navigate } from "decentraland-gatsby/dist/plugins/intl"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Container } from "decentraland-ui/dist/components/Container/Container"

import { QuestsClient } from "../quests"
import { DraftQuest, QuestAmplified } from "../types"
import { deleteQuestDraft, getQuestDrafts, locations } from "../utils"

import "./index.css"

export default function OverviewPage() {
  const [address] = useAuthContext()

  const [quests, setQuests] = useState<QuestAmplified[]>([])
  const [draftQuests, setDrafts] = useState<DraftQuest[]>(getQuestDrafts())

  useEffect(() => {
    if (address) {
      const questClient = new QuestsClient(address)
      questClient
        .getMyQuests()
        .then((res) => setQuests(res.quests))
        .catch(console.error)
    }
  }, [address])

  if (!address) {
    return <h2>Loading</h2>
  }

  return (
    <Container className="full overview-container">
      <h1>Quests Manager</h1>
      <Button
        onClick={() => navigate(locations.designer())}
        content="Let's design a quest!"
        style={{
          backgroundColor: "var(--primary)",
          color: "white",
        }}
      />
      <h2>Your Quests</h2>
      {quests.length ? (
        <ul style={{ listStyle: "none" }}>
          {quests.map((q) => {
            return (
              <li key={q.name}>
                <Link href={locations.editPublishedQuest(q.id)}>
                  - {q.name}
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <p>No Quests</p>
      )}
      <h2>Your Drafts</h2>
      {draftQuests.length ? (
        <ul style={{ listStyle: "none" }}>
          {draftQuests.map((draft) => (
            <li key={draft.id}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "25%",
                  margin: "5px 0",
                }}
              >
                <Link href={locations.editDraftQuest(draft.id)}>
                  - Draft #{draft.id}
                </Link>
                <Button
                  size="small"
                  onClick={() => {
                    deleteQuestDraft(draft.id)
                    setDrafts(getQuestDrafts())
                  }}
                  style={{ minWidth: "0px", padding: "5px" }}
                  negative
                  content={<span>&#x2715;</span>}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No Drafts</p>
      )}
    </Container>
  )
}
