import React, { useEffect, useState } from "react"

import { Quest } from "@dcl/quests-designer/dist/protocol/quests"
import { useAuthContext } from "decentraland-gatsby/dist/context/Auth"
import { Link } from "decentraland-gatsby/dist/plugins/intl"
import { Container } from "decentraland-ui/dist/components/Container/Container"

import { getMyQuests } from "../quests"
import { getDefinitionOnLocalStorage } from "../utils"

import "./index.css"

export default function OverviewPage() {
  const [address] = useAuthContext()

  const [quests, setQuests] = useState<Quest[]>([])

  const draftQuests = getDefinitionOnLocalStorage()

  useEffect(() => {
    getMyQuests(address!)
      .then((res) => setQuests(res.quests))
      .catch(console.error)
  }, [])

  return (
    <Container className="full overview-container">
      <h1>Quests Manager</h1>
      <Link href="/design/create">Let's Design a new Quest</Link>
      <h2>Your Quests</h2>
      {quests.length ? (
        <ul>
          {quests.map((q) => {
            return <li>{q.name}</li>
          })}
        </ul>
      ) : (
        <p>No Quests</p>
      )}
      <h2>Your Drafts</h2>
      {draftQuests.length ? (
        <ul>
          {draftQuests.map((_, i) => (
            <li>Draft #{i + 1}</li>
          ))}
        </ul>
      ) : (
        <p>No Drafts</p>
      )}
    </Container>
  )
}
