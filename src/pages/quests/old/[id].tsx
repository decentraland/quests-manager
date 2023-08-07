import React, { useEffect, useState } from "react"

import { QuestsDesigner } from "@dcl/quests-designer"
import { generateNodesAndEdgesFromQuestDefinition } from "@dcl/quests-designer/dist/utils"
import { useAuthContext } from "decentraland-gatsby/dist/context/Auth"
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
      <h2>View Updated Quest {quest.id}</h2>
      <Edit
        quest={quest}
        onChange={(editedQuest) => setQuest({ ...quest, ...editedQuest })}
      />
      <h3>Steps & Connections</h3>
      <div
        style={{
          marginTop: "20px",
        }}
      >
        <Button
          style={{
            color: "white",
            backgroundColor: "var(--primary)",
            padding: "7px 20px",
            borderRadius: "5px",
          }}
          onClick={() => setQuestDesigner(true)}
        >
          View Quest Definition
        </Button>
      </div>
    </Container>
  )
}

export default ViewUpdatedQuest
