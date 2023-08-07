import React, { useState } from "react"

import { generateNodesAndEdgesFromQuestDefinition } from "@dcl/quests-designer/dist/utils"
import { useAuthContext } from "decentraland-gatsby/dist/context/Auth"
import { navigate } from "decentraland-gatsby/dist/plugins/intl"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Container } from "decentraland-ui/dist/components/Container/Container"

import { DesignerView } from "../../../components/DesignerView"
import { Edit } from "../../../components/Edit"
import { QuestsClient } from "../../../quests"
import {
  deleteQuestDraft,
  getQuestDraftById,
  isValidQuestDraft,
  locations,
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
    alert("Quest Draft saved!")
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
      <h2>Edit Quest Draft {quest.id}</h2>
      <Edit
        quest={quest}
        onChange={(editedQuest) => setQuestDraft({ ...quest, ...editedQuest })}
      />
      <h3>Steps & Connections</h3>
      <p style={{ fontStyle: "italic", color: "gray" }}>
        Steps and Connection are edited outside this tab. After clicking "save"
        button on the other tab, you should click "Save Draft" here in order to
        have a new version
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "40px",
        }}
      >
        <Button
          type="button"
          content="Save Draft"
          size="small"
          positive
          style={{ maxWidth: "20px" }}
          onClick={() => saveDraft()}
        />
        <Button
          type="button"
          content="Publish"
          size="small"
          disabled={!isValidQuestDraft(quest)}
          style={{ maxWidth: "20px" }}
          color="instagram"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { metadata, id, ...rest } = quest
            questClient.publishQuest(rest)
          }}
        />
        <Button
          type="button"
          content="Delete Draft"
          size="small"
          negative
          style={{ maxWidth: "20px" }}
          onClick={() => {
            deleteQuestDraft(quest.id)
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

export default EditDraft
