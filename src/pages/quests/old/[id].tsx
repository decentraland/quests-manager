import React, { useEffect, useState } from "react"

import { QuestsDesigner } from "@dcl/quests-designer"
import { generateNodesAndEdgesFromQuestDefinition } from "@dcl/quests-designer/dist/utils"
import { useAuthContext } from "decentraland-gatsby/dist/context/Auth"
import { back } from "decentraland-gatsby/dist/plugins/intl"
import { Back } from "decentraland-ui/dist/components/Back/Back"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Container } from "decentraland-ui/dist/components/Container/Container"

import { Edit } from "../../../components/Edit"
import { QuestsClient } from "../../../quests"
import { QuestAmplified } from "../../../types"

import "../quests.css"

const ViewUpdatedQuest = ({ id }: { id: string }) => {
  const [quest, setQuest] = useState<QuestAmplified | null>(null)
  const [questDesigner, setQuestDesigner] = useState(false)
  const [address, { loading }] = useAuthContext()

  let questClient: QuestsClient
  if (address) {
    questClient = new QuestsClient(address)
  }

  useEffect(() => {
    if (address) {
      questClient
        .getQuest(id)
        .then((quest) => {
          setQuest({ ...quest })
        })
        .catch(console.error)
    }
  }, [address])

  if (!quest) {
    return <Container>Loading</Container>
  }

  if (loading) {
    return <>Loading</>
  }

  if (!address) {
    return <>Loading</>
  }

  if (questDesigner) {
    const { nodes, edges } = generateNodesAndEdgesFromQuestDefinition(
      quest.definition!
    )

    return (
      <div style={{ height: "100vh", width: "100vw" }}>
        <QuestsDesigner
          saveDesignButton={{
            content: "Save new design",
            onClick: (definition) => {
              setQuest({ ...quest, definition })
              setQuestDesigner(false)
            },
          }}
          closeDesigner={() => setQuestDesigner(false)}
          initialNodes={nodes}
          initialEdges={edges}
        />
      </div>
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
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "55%",
          }}
        >
          <Button onClick={() => setQuestDesigner(true)}>
            View Quest Definition
          </Button>
        </div>
      </div>
      <div style={{ width: "50%" }}>
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
