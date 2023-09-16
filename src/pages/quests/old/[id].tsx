import React, { useEffect, useState } from "react"

import { generateNodesAndEdgesFromQuestDefinition } from "@dcl/quests-designer/dist/utils"
import { useAuthContext } from "decentraland-gatsby/dist/context/Auth"
import { back } from "decentraland-gatsby/dist/plugins/intl"
import { Back } from "decentraland-ui/dist/components/Back/Back"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Container } from "decentraland-ui/dist/components/Container/Container"
import { SignIn } from "decentraland-ui/dist/components/SignIn/SignIn"

import { DesignerView } from "../../../components/DesignerView"
import { Edit } from "../../../components/Edit"
import { QuestsClient } from "../../../quests"
import { QuestAmplified } from "../../../types"

import "../quests.css"

const ViewUpdatedQuest = ({ id }: { id: string }) => {
  const [quest, setQuest] = useState<QuestAmplified | null>(null)
  const [questDesigner, setQuestDesigner] = useState(false)
  const [account, accountState] = useAuthContext()

  let questClient: QuestsClient
  if (account) {
    questClient = new QuestsClient(account)
  }

  useEffect(() => {
    if (account) {
      questClient
        .getQuest(id)
        .then((quest) => {
          setQuest({ ...quest })
        })
        .catch(console.error)
    }
  }, [account])

  if (!quest) {
    return <Container>Loading</Container>
  }

  if (!account || accountState.loading) {
    return (
      <SignIn
        onConnect={() => accountState.select()}
        isConnecting={accountState.loading}
      />
    )
  }

  if (questDesigner) {
    const { nodes, edges } = generateNodesAndEdgesFromQuestDefinition(
      quest.definition!
    )

    return (
      <DesignerView
        type="old"
        close={() => setQuestDesigner(false)}
        initialEdges={edges}
        initialNodes={nodes}
      />
    )
  }

  return (
    <Container>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            width: "45%",
          }}
        >
          <Back onClick={() => back()} />
          <div style={{ marginLeft: "24px" }}>
            <h2>View Quest</h2>
            <p>Quest ID: {quest.id}</p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "55%",
          }}
        >
          <Button
            onClick={() => setQuestDesigner(true)}
            inverted
            style={{ border: "none" }}
          >
            View Quest Steps
          </Button>
        </div>
      </div>
      <div style={{ width: "50%", paddingTop: "20px", marginLeft: "60px" }}>
        <Edit
          quest={quest}
          readonly
          onChange={(editedQuest) => setQuest({ ...quest, ...editedQuest })}
        />
      </div>
    </Container>
  )
}

export default ViewUpdatedQuest
