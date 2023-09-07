import React, { useEffect, useState } from "react"

import { useAuthContext } from "decentraland-gatsby/dist/context/Auth"
import { Link, navigate } from "decentraland-gatsby/dist/plugins/intl"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Container } from "decentraland-ui/dist/components/Container/Container"
import { SignIn } from "decentraland-ui/dist/components/SignIn/SignIn"

import { QuestsClient } from "../quests"
import { DraftQuest, QuestAmplified } from "../types"
import {
  deleteQuestDraft,
  getQuestDrafts,
  isValidQuestDraft,
  locations,
} from "../utils"

import "./index.css"

const Line = () => <div className="line"></div>

const Trash = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 12C7.5 12.4125 7.1625 12.75 6.75 12.75C6.3375 12.75 6 12.4125 6 12V9C6 8.5875 6.3375 8.25 6.75 8.25C7.1625 8.25 7.5 8.5875 7.5 9V12ZM12 12C12 12.4125 11.6625 12.75 11.25 12.75C10.8375 12.75 10.5 12.4125 10.5 12V9C10.5 8.5875 10.8375 8.25 11.25 8.25C11.6625 8.25 12 8.5875 12 9V12ZM13.5 14.25C13.5 14.6632 13.164 15 12.75 15H5.25C4.836 15 4.5 14.6632 4.5 14.25V6H13.5V14.25ZM7.5 3.246C7.5 3.12975 7.6605 3 7.875 3H10.125C10.3395 3 10.5 3.12975 10.5 3.246V4.5H7.5V3.246ZM15.75 4.5H15H12V3.246C12 2.283 11.1593 1.5 10.125 1.5H7.875C6.84075 1.5 6 2.283 6 3.246V4.5H3H2.25C1.8375 4.5 1.5 4.8375 1.5 5.25C1.5 5.6625 1.8375 6 2.25 6H3V14.25C3 15.4905 4.0095 16.5 5.25 16.5H12.75C13.9905 16.5 15 15.4905 15 14.25V6H15.75C16.1625 6 16.5 5.6625 16.5 5.25C16.5 4.8375 16.1625 4.5 15.75 4.5Z"
        fill="#161518"
      />
    </svg>
  )
}

export default function OverviewPage() {
  const [account, accountState] = useAuthContext()

  const [quests, setQuests] = useState<QuestAmplified[]>([])
  const [draftQuests, setDrafts] = useState<DraftQuest[]>(getQuestDrafts())

  useEffect(() => {
    if (account) {
      const questClient = new QuestsClient(account)
      questClient
        .getMyQuests()
        .then((res) => setQuests(res.quests))
        .catch(console.error)
    }
  }, [account])

  if (!account || accountState.loading) {
    return (
      <SignIn
        onConnect={() => accountState.select()}
        isConnecting={accountState.loading}
      />
    )
  }

  return (
    <Container className="full overview-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Quests Manager</h1>
        <Button
          onClick={() => navigate(locations.designer())}
          content="Create Quest"
          primary
        />
      </div>
      <h2>My published Quests</h2>
      {quests.length ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <ColumnNames />
          {quests.map((q) => {
            return (
              <div key={q.name}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "28px 0",
                    width: "100%",
                  }}
                >
                  <p style={{ width: "20%", marginBottom: "0" }}>- {q.name}</p>
                  <p style={{ width: "20%", marginBottom: "0" }}>
                    {q.description.length >= 20
                      ? q.description.slice(0, 20) + "..."
                      : q.description}
                  </p>
                  <Link
                    style={{
                      width: "20%",
                      marginBottom: "0",
                      fontWeight: "600",
                    }}
                    href={q.imageUrl}
                  >
                    Link
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
                      onClick={() =>
                        navigate(locations.editPublishedQuest(q.id))
                      }
                      className="quests-btn"
                      primary
                      content="Edit"
                    />
                  </div>
                </div>
                <Line />
              </div>
            )
          })}
        </div>
      ) : (
        <p>You don't have any published Quests</p>
      )}
      <h2>My drafts</h2>
      {draftQuests.length ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <ColumnNames draft />
          {draftQuests.map((q) => {
            return (
              <div key={q.name || q.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "28px 0",
                    width: "100%",
                  }}
                >
                  <p style={{ width: "20%", marginBottom: "0" }}>- {q.id}</p>
                  <p style={{ width: "20%", marginBottom: "0" }}>
                    {q.name || "No name"}
                  </p>
                  <p style={{ width: "20%", marginBottom: "0" }}>
                    {q.description
                      ? q.description.length >= 20
                        ? q.description.slice(0, 20) + "..."
                        : q.description
                      : "No Description"}
                  </p>
                  <p style={{ width: "20%", marginBottom: "0" }}>
                    {isValidQuestDraft(q) ? "Ready" : "Not Ready"}
                  </p>
                  <div
                    style={{
                      width: "20%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      size="small"
                      onClick={() => navigate(locations.editDraftQuest(q.id))}
                      primary
                      className="quests-btn"
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
                      className="quests-btn"
                      style={{ padding: "0 0" }}
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
                        background: "none",
                        border: "2px solid black",
                        display: "flex",
                        justifyContent: "center",
                      }}
                      content={<Trash />}
                    />
                  </div>
                </div>
                <Line />
              </div>
            )
          })}
        </div>
      ) : (
        <p>You don't have any drafts</p>
      )}
    </Container>
  )
}

const ColumnNames = ({ draft = false }: { draft?: boolean }) => (
  <>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderColor: "#736E7D",
        width: "100%",
      }}
    >
      <p className="quest-table-column-name">{draft ? "#" : "Name"}</p>
      <p className="quest-table-column-name">
        {draft ? "Name" : "Description"}
      </p>
      <p className="quest-table-column-name">
        {draft ? "Description" : "Image"}
      </p>
      <p className="quest-table-column-name">
        {draft ? "Ready to Publish?" : "Status"}
      </p>
      <p className="quest-table-column-name" style={{ marginBottom: "1em" }}>
        Actions
      </p>
    </div>
    <Line />
  </>
)
