import React, { useEffect, useState } from "react"

import { QuestsDesigner } from "@dcl/quests-designer"
import { generateNodesAndEdgesFromQuestDefinition } from "@dcl/quests-designer/dist/utils"
import { useAuthContext } from "decentraland-gatsby/dist/context/Auth"
import { Link, back } from "decentraland-gatsby/dist/plugins/intl"
import { Back } from "decentraland-ui/dist/components/Back/Back"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Container } from "decentraland-ui/dist/components/Container/Container"

import { Edit } from "../../components/Edit"
import { QuestsClient } from "../../quests"
import { QuestAmplified } from "../../types"
import { locations } from "../../utils"

import "./quests.css"

const EditPublishedQuest = ({ id }: { id: string }) => {
  const [quest, setQuest] = useState<QuestAmplified | null>(null)
  const [questDesigner, setQuestDesigner] = useState(false)
  const [oldVersions, setOldVersions] = useState<string[]>([])
  const [address] = useAuthContext()

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
      questClient
        .getOldVersions(id)
        .then(({ updates }) => setOldVersions([...updates]))
        .catch(console.error)
    }
  }, [address])

  if (!quest) {
    return <Container>Loading</Container>
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
            <h2>Edit Quest</h2>
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
            Edit Quest Definition
          </Button>
          <Button
            type="button"
            content={quest.active ? "Deactivate Quest" : "Activate Quest"}
            inverted
            style={{
              marginLeft: "10px",
            }}
            size="small"
            onClick={async () => {
              if (quest.active) {
                await questClient.deactivateQuest(quest.id)
              } else {
                await questClient.activateQuest(quest.id)
              }
              const updatedQuest = await questClient.getQuest(quest.id)
              setQuest({ ...updatedQuest })
            }}
          />
        </div>
      </div>
      <p>Quest ID: {quest.id}</p>
      <div style={{ width: "50%" }}>
        <Edit
          quest={quest}
          onChange={(editedQuest) => setQuest({ ...quest, ...editedQuest })}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <h3>Old Versions</h3>
        <ul style={{ listStyle: "none" }}>
          {oldVersions.map((version) => (
            <li key={version}>
              <Link href={locations.oldQuest(version)}>- Quest {version}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "40px",
          marginBottom: "40px",
        }}
      >
        <Button
          type="button"
          primary
          content="Publish Changes"
          size="small"
          onClick={() => questClient.updateQuest(quest.id, quest)}
          // TODO: Add warning of updating a published quest will cause a new quest
        />
      </div>
    </Container>
  )
}

export default EditPublishedQuest
