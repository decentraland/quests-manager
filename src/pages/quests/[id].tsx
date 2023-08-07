import React, { useEffect, useState } from "react"

import { QuestsDesigner } from "@dcl/quests-designer"
import { generateNodesAndEdgesFromQuestDefinition } from "@dcl/quests-designer/dist/utils"
import { useAuthContext } from "decentraland-gatsby/dist/context/Auth"
import { Link, navigate } from "decentraland-gatsby/dist/plugins/intl"
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
      questClient
        .getOldVersions(id)
        .then(({ updates }) => setOldVersions([...updates]))
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
      <h2>Edit Quest {quest.id}</h2>
      <Edit
        quest={quest}
        onChange={(editedQuest) => setQuest({ ...quest, ...editedQuest })}
      />
      <h3>Steps & Connections</h3>
      <p style={{ fontStyle: "italic", color: "gray" }}>
        Steps and Connection are edited outside this tab. After clicking "save"
        button on the other tab, you should click "Update Quest" here in order
        to publish a new version
      </p>
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
          Edit Quest Definition
        </Button>
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
        }}
      >
        <Button
          type="button"
          content="Update Quest"
          size="small"
          color="google plus"
          style={{ maxWidth: "20px" }}
          onClick={() => questClient.updateQuest(quest.id, quest)}
          // Add warning of updating a published quest will cause a new quest
        />
        <Button
          type="button"
          content={quest.active ? "Deactivate Quest" : "Activate Quest"}
          size="small"
          style={{ maxWidth: "20px" }}
          negative={quest.active}
          color="orange"
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
        <Button
          type="button"
          content="Close"
          size="small"
          style={{ maxWidth: "20px", marginLeft: "10px" }}
          onClick={() => navigate(locations.home())}
        />
      </div>
    </Container>
  )
}

export default EditPublishedQuest
