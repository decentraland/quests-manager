import React, { useEffect, useState } from "react"

import { useAuthContext } from "decentraland-gatsby/dist/context/Auth"
import { Link, navigate } from "decentraland-gatsby/dist/plugins/intl"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Container } from "decentraland-ui/dist/components/Container/Container"

import { QuestsClient } from "../quests"
import { DraftQuest, QuestAmplified } from "../types"
import {
  deleteQuestDraft,
  getQuestDrafts,
  isValidQuestDraft,
  locations,
} from "../utils"

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
      <h1 style={{ textAlign: "center" }}>Quests Manager</h1>
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ width: "20%", fontWeight: "bold", fontSize: "16px" }}>
              Name
            </p>
            <p style={{ width: "20%", fontWeight: "bold", fontSize: "16px" }}>
              Description
            </p>
            <p style={{ width: "20%", fontWeight: "bold", fontSize: "16px" }}>
              Quest Image's Link
            </p>
            <p
              style={{
                width: "20%",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Status
            </p>
            <p
              style={{
                width: "20%",
                marginBottom: "1em",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            ></p>
          </div>
          {quests.map((q) => {
            return (
              <div
                key={q.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <p style={{ width: "20%", marginBottom: "0" }}>- {q.name}</p>
                <p style={{ width: "20%", marginBottom: "0" }}>
                  {q.description}
                </p>
                <Link
                  style={{ width: "20%", marginBottom: "0" }}
                  href={q.imageUrl}
                >
                  Quest Image
                </Link>
                <p style={{ width: "20%", marginBottom: "0" }}>
                  {q.active ? "Active" : "Not Active"}
                </p>
                <div
                  style={{
                    width: "20%",
                    display: "flex",
                  }}
                >
                  <Button
                    size="small"
                    onClick={() => navigate(locations.editPublishedQuest(q.id))}
                    style={{
                      minWidth: "20%",
                      padding: "5px",
                      marginRight: "5px",
                    }}
                    positive
                    content="Edit"
                  />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p>No Quests</p>
      )}
      <h2>Your Drafts</h2>
      {draftQuests.length ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ width: "20%", fontWeight: "bold", fontSize: "16px" }}>
              #
            </p>
            <p style={{ width: "20%", fontWeight: "bold", fontSize: "16px" }}>
              Name
            </p>
            <p style={{ width: "20%", fontWeight: "bold", fontSize: "16px" }}>
              Description
            </p>
            <p
              style={{
                width: "20%",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Is ready to be published?
            </p>
            <p
              style={{
                width: "20%",
                marginBottom: "1em",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            ></p>
          </div>
          {draftQuests.map((q) => {
            return (
              <div
                key={q.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <p style={{ width: "20%", marginBottom: "0" }}>- {q.id}</p>
                <p style={{ width: "20%", marginBottom: "0" }}>
                  {q.name || "No name"}
                </p>
                <p style={{ width: "20%", marginBottom: "0" }}>
                  {q.description || "No Description"}
                </p>
                <p style={{ width: "20%", marginBottom: "0" }}>
                  {isValidQuestDraft(q) ? "Ready" : "Not Ready"}
                </p>
                <div
                  style={{
                    width: "20%",
                    display: "flex",
                  }}
                >
                  <Button
                    size="small"
                    onClick={() => navigate(locations.editDraftQuest(q.id))}
                    style={{
                      minWidth: "20%",
                      padding: "5px",
                      marginRight: "5px",
                    }}
                    positive
                    content="Edit"
                  />
                  <Button
                    size="small"
                    onClick={async () => {
                      if (isValidQuestDraft(q)) {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { id, ...quest } = q
                        await navigator.clipboard.writeText(
                          JSON.stringify(quest)
                        )
                        alert("Definition has been Copied to your clipboard")
                      }
                    }}
                    style={{
                      minWidth: "20%",
                      padding: "5px",
                      marginRight: "5px",
                    }}
                    color="instagram"
                    content="Export"
                    disabled={!isValidQuestDraft(q)}
                  />
                  <Button
                    size="small"
                    onClick={() => {
                      deleteQuestDraft(q.id)
                      setDrafts(getQuestDrafts())
                    }}
                    style={{
                      minWidth: "20%",
                      padding: "5px",
                      alignSelf: "flex-end",
                    }}
                    negative
                    content={<span>&#x2715;</span>}
                  />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p>No Drafts</p>
      )}
    </Container>
  )
}
