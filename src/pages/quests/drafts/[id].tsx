import React, { useState } from "react"

import { generateNodesAndEdgesFromQuestDefinition } from "@dcl/quests-designer/dist/utils"
import { useAuthContext } from "decentraland-gatsby/dist/context/Auth"
import { back } from "decentraland-gatsby/dist/plugins/intl"
import { Back } from "decentraland-ui/dist/components/Back/Back"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Container } from "decentraland-ui/dist/components/Container/Container"

import { DesignerView } from "../../../components/DesignerView"
import { Edit } from "../../../components/Edit"
import { QuestsClient } from "../../../quests"
import {
  deleteQuestDraft,
  getQuestDraftById,
  isValidQuestDraft,
  updateQuestDraft,
} from "../../../utils"

import "../quests.css"

const EditDraft = ({ id }: { id: string }) => {
  const [questDesigner, setQuestDesigner] = useState(false)
  const [quest, setQuestDraft] = useState(getQuestDraftById(Number(id)))

  const [address] = useAuthContext()

  if (!address) {
    return (
      <Container>
        <h2>Loading..</h2>
      </Container>
    )
  }

  const questClient = new QuestsClient(address)

  if (!quest) {
    return (
      <Container>
        <h2>Draft not found :(</h2>
      </Container>
    )
  }

  const saveDraft = () => {
    updateQuestDraft(quest)
    alert("Draft saved!")
  }

  if (questDesigner) {
    const { nodes, edges } = generateNodesAndEdgesFromQuestDefinition(
      quest.definition,
      quest.metadata?.stepPositions
    )

    return (
      <DesignerView
        initialEdges={edges}
        initialNodes={nodes}
        type="draft"
        close={() => setQuestDesigner(false)}
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
            <h2>Edit Draft</h2>
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
            content="Delete Draft"
            size="small"
            style={{
              marginLeft: "10px",
            }}
            inverted
            onClick={() => {
              deleteQuestDraft(quest.id)
            }}
          />
        </div>
      </div>
      <div style={{ width: "50%" }}>
        <Edit
          quest={quest}
          onChange={(editedQuest) =>
            setQuestDraft({ ...quest, ...editedQuest })
          }
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "40px",
          width: "30%",
        }}
      >
        <Button
          type="button"
          content="Save Draft"
          size="small"
          style={{
            backgroundColor: "transparent",
            border: "2px solid black",
            maxWidth: "20px",
          }}
          onClick={() => saveDraft()}
        />
        <Button
          type="button"
          content="Publish"
          size="small"
          primary
          disabled={!isValidQuestDraft(quest)}
          style={{ maxWidth: "20px" }}
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { metadata, id, ...rest } = quest
            questClient.publishQuest(rest)
          }}
        />
      </div>
    </Container>
  )
}

export default EditDraft
