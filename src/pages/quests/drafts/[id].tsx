import React, { useState } from "react"

import { generateNodesAndEdgesFromQuestDefinition } from "@dcl/quests-designer/dist/utils"
import { useAuthContext } from "decentraland-gatsby/dist/context/Auth"
import { back, navigate } from "decentraland-gatsby/dist/plugins/intl"
import { Back } from "decentraland-ui/dist/components/Back/Back"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Container } from "decentraland-ui/dist/components/Container/Container"
import { Loader } from "decentraland-ui/dist/components/Loader/Loader"
import { Modal } from "decentraland-ui/dist/components/Modal/Modal"
import { SignIn } from "decentraland-ui/dist/components/SignIn/SignIn"

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
  const [editDraftState, setEditDraftState] = useState({
    savedDraft: false,
    publishingQuest: false,
    publishedQuest: false,
    publishQuestLoading: false,
    publishedQuestID: "",
  })

  const [account, accountState] = useAuthContext()

  if (!account || accountState.loading) {
    return (
      <SignIn
        onConnect={() => accountState.select()}
        isConnecting={accountState.loading}
      />
    )
  }

  const questClient = new QuestsClient(account)

  if (!quest) {
    return (
      <Container>
        <h2>Draft not found :(</h2>
      </Container>
    )
  }

  const saveDraft = () => {
    updateQuestDraft(quest)
    setEditDraftState({
      savedDraft: true,
      publishingQuest: false,
      publishQuestLoading: false,
      publishedQuest: false,
      publishedQuestID: "",
    })
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

  if (editDraftState.publishQuestLoading)
    return <Loader active size="massive" />

  if (editDraftState.publishedQuest) {
    return (
      <QuestPublished
        onClick={() => {
          navigate(
            locations.editPublishedQuest(editDraftState.publishedQuestID)
          )
        }}
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
      <div style={{ width: "50%", marginLeft: "60px" }}>
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
          marginLeft: "60px",
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
          onClick={async () => {
            setEditDraftState({
              publishedQuestID: "",
              publishingQuest: true,
              publishedQuest: false,
              publishQuestLoading: false,
              savedDraft: false,
            })
          }}
        />
      </div>
      {editDraftState.savedDraft && (
        <SavedDraftModal
          onClick={() =>
            setEditDraftState({
              publishedQuest: false,
              publishingQuest: false,
              savedDraft: false,
              publishQuestLoading: false,
              publishedQuestID: "",
            })
          }
        />
      )}
      {editDraftState.publishingQuest && (
        <PublishingQuest
          onCancel={() => {
            setEditDraftState({
              publishedQuestID: "",
              publishingQuest: false,
              publishedQuest: false,
              publishQuestLoading: false,
              savedDraft: false,
            })
          }}
          onDelete={async () => {
            deleteQuestDraft(Number(quest.id))
            setEditDraftState({
              publishedQuestID: "",
              publishingQuest: false,
              publishedQuest: false,
              publishQuestLoading: true,
              savedDraft: false,
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { metadata, id, ...rest } = quest
            const response = await questClient.publishQuest(rest)
            setTimeout(() => {
              setEditDraftState({
                publishedQuestID: response.id,
                publishingQuest: false,
                publishedQuest: true,
                publishQuestLoading: false,
                savedDraft: false,
              })
            }, 1500)
          }}
          onProceed={async () => {
            setEditDraftState({
              publishedQuestID: "",
              publishingQuest: false,
              publishedQuest: false,
              publishQuestLoading: true,
              savedDraft: false,
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { metadata, id, ...rest } = quest
            const response = await questClient.publishQuest(rest)
            setTimeout(() => {
              setEditDraftState({
                publishedQuestID: response.id,
                publishingQuest: false,
                publishedQuest: true,
                publishQuestLoading: false,
                savedDraft: false,
              })
            }, 1500)
          }}
        />
      )}
    </Container>
  )
}

const SavedDraftModal = ({ onClick }: { onClick: () => void }) => (
  <Modal open={true} size="tiny">
    <Modal.Content>Your draft has been saved</Modal.Content>
    <Modal.Actions>
      <Button primary onClick={onClick}>
        Close
      </Button>
    </Modal.Actions>
  </Modal>
)

const QuestPublished = ({ onClick }: { onClick: () => void }) => (
  <Modal open={true} size="tiny">
    <Modal.Content>Your Quest was published!</Modal.Content>
    <Modal.Actions>
      <Button primary onClick={onClick}>
        Go to edit page
      </Button>
    </Modal.Actions>
  </Modal>
)

const PublishingQuest = ({
  onDelete,
  onProceed,
  onCancel,
}: {
  onDelete: () => void
  onProceed: () => void
  onCancel: () => void
}) => (
  <Modal open={true} size="tiny">
    <Modal.Header>You're about to publish the Quest</Modal.Header>
    <Modal.Content>What do you want to do with the Draft?</Modal.Content>
    <Modal.Actions>
      <Button primary onClick={onProceed} size="small">
        Keep it & Publish
      </Button>
      <Button
        inverted
        onClick={onDelete}
        size="small"
        style={{ backgroundColor: "transparent" }}
      >
        Delete it & Publsih
      </Button>
      <Button onClick={onCancel} size="small" style={{ minWidth: "0" }}>
        Cancel
      </Button>
    </Modal.Actions>
  </Modal>
)

export default EditDraft
