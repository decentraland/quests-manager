import React, { useState } from "react"

import { generateNodesAndEdgesFromQuestDefinition } from "@dcl/quests-designer/dist/utils"
import { useAuthContext } from "decentraland-gatsby/dist/context/Auth"
import { navigate } from "decentraland-gatsby/dist/plugins/intl"
import { Back } from "decentraland-ui/dist/components/Back/Back"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Container } from "decentraland-ui/dist/components/Container/Container"
import { Loader } from "decentraland-ui/dist/components/Loader/Loader"
import { Modal } from "decentraland-ui/dist/components/Modal/Modal"
import { SignIn } from "decentraland-ui/dist/components/SignIn/SignIn"

import { DesignerView } from "../../../components/DesignerView"
import { Edit } from "../../../components/Edit"
import { QuestDraftSaved } from "../../../components/QuestStepsDraftSaved"
import { QuestsClient } from "../../../quests"
import {
  deleteQuestDraft,
  getQuestDraftById,
  isValidQuest,
  locations,
  updateQuestDraft,
  updateQuestDraftDefinition,
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
    publishedQuestError: null,
    deleteDraft: false,
  })
  const [draftSavedModal, setDraftSavedModal] = useState(false)

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
      publishedQuestError: null,
      deleteDraft: false,
    })
  }

  if (questDesigner) {
    let nodes
    let edges
    if (quest.definition) {
      const canvas = generateNodesAndEdgesFromQuestDefinition(
        quest.definition,
        quest.metadata?.stepPositions
      )
      nodes = canvas.nodes
      edges = canvas.edges
    } else {
      nodes = quest.metadata.nodes
      edges = quest.metadata.edges
    }

    return (
      <>
        <DesignerView
          initialEdges={edges}
          initialNodes={nodes}
          type="draft"
          close={() => setQuestDesigner(false)}
          onClick={(nodes, edges, definition) => {
            updateQuestDraftDefinition(Number(id), {
              definition,
              metadata: {
                stepPositions: nodes.reduce((acc, curr) => {
                  if (curr.data.id) {
                    acc[curr.data.id] = curr.position
                  } else {
                    acc[curr.id] = curr.position
                  }
                  return acc
                }, {} as Record<string, { x: number; y: number }>),
                nodes,
                edges,
              },
            })
            setQuestDraft(getQuestDraftById(Number(id)))
          }}
        />
        {draftSavedModal && (
          <QuestDraftSaved
            onContinue={() => {
              setDraftSavedModal(false)
              setQuestDesigner(false)
            }}
            onKeepEditing={() => {
              setDraftSavedModal(false)
            }}
          />
        )}
      </>
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
          <Back onClick={() => navigate(locations.home())} />
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
            Edit Quest Steps
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
              setEditDraftState({
                savedDraft: true,
                publishingQuest: false,
                publishQuestLoading: false,
                publishedQuest: false,
                publishedQuestID: "",
                publishedQuestError: null,
                deleteDraft: true,
              })
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
          width: "50%",
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
            width: "45%",
          }}
          onClick={() => saveDraft()}
        />
        <Button
          type="button"
          content="Publish"
          size="small"
          primary
          style={{
            width: "45%",
          }}
          disabled={!isValidQuest(quest)}
          onClick={async () => {
            setEditDraftState({
              publishedQuestID: "",
              publishingQuest: true,
              publishedQuest: false,
              publishQuestLoading: false,
              savedDraft: false,
              publishedQuestError: null,
              deleteDraft: false,
            })
          }}
        />
      </div>
      {!quest.definition && (
        <div
          style={{
            display: "flex",
            alignContent: "center",
            marginLeft: "60px",
            marginTop: "5px",
          }}
        >
          <span>
            <ErrorIcon />
          </span>
          <p
            style={{
              color: "var(--primary)",
              fontSize: "12px",
              marginLeft: "5px",
            }}
          >
            Cannot publish due to invalid Quest steps
          </p>
        </div>
      )}
      {editDraftState.savedDraft && (
        <SavedDraftModal
          onClick={() =>
            setEditDraftState({
              publishedQuest: false,
              publishingQuest: false,
              savedDraft: false,
              publishQuestLoading: false,
              publishedQuestID: "",
              publishedQuestError: null,
              deleteDraft: false,
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
              publishedQuestError: null,
              deleteDraft: false,
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
              publishedQuestError: null,
              deleteDraft: false,
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
                publishedQuestError: null,
                deleteDraft: false,
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
              publishedQuestError: null,
              deleteDraft: false,
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
                publishedQuestError: null,
                deleteDraft: false,
              })
            }, 1500)
          }}
        />
      )}
      {editDraftState.deleteDraft && (
        <DeleteDraftModal
          onDelete={() => {
            deleteQuestDraft(quest.id)
            navigate(locations.home())
          }}
          onCancel={() => {
            setEditDraftState({
              publishedQuestID: "",
              publishingQuest: false,
              publishedQuest: true,
              publishQuestLoading: false,
              savedDraft: false,
              publishedQuestError: null,
              deleteDraft: false,
            })
          }}
        />
      )}
    </Container>
  )
}

const SavedDraftModal = ({ onClick }: { onClick: () => void }) => (
  <Modal open={true} size="tiny" className="quests-modal">
    <Modal.Content>Your draft has been saved</Modal.Content>
    <Modal.Actions>
      <Button primary onClick={onClick}>
        Close
      </Button>
    </Modal.Actions>
  </Modal>
)

const QuestPublished = ({ onClick }: { onClick: () => void }) => (
  <Modal open={true} size="tiny" className="quests-modal">
    <Modal.Content>Your Quest was published!</Modal.Content>
    <Modal.Actions>
      <Button primary onClick={onClick}>
        Go to edit page
      </Button>
    </Modal.Actions>
  </Modal>
)

const DeleteDraftModal = ({
  onDelete,
  onCancel,
}: {
  onDelete: () => void
  onCancel: () => void
}) => (
  <Modal open={true} size="tiny" className="quests-modal">
    <Modal.Header>Delete Quest</Modal.Header>
    <Modal.Content>
      You will lose your quest definition and information
    </Modal.Content>
    <Modal.Actions>
      <Button primary onClick={onDelete} size="medium">
        Delete
      </Button>
      <Button inverted onClick={onCancel} size="medium">
        Cancel
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
  <Modal open={true} size="tiny" className="quests-modal">
    <Modal.Header>Publish Quest</Modal.Header>
    <Modal.Content>
      Once your Quest is published, it will become live on the server.
    </Modal.Content>
    <Modal.Actions>
      <Button primary onClick={onProceed} size="medium">
        Publish and Keep Draft
      </Button>
      <Button onClick={onDelete} size="medium">
        Publish and Delete Draft
      </Button>
      <Button
        inverted
        style={{ backgroundColor: "transparent" }}
        onClick={onCancel}
        size="medium"
      >
        Cancel
      </Button>
    </Modal.Actions>
  </Modal>
)

const ErrorIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Group 2971">
      <circle id="Ellipse 86" cx="12" cy="12.5" r="11.9104" fill="#FF2D55" />
      <g id="x">
        <g id="Vector">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.9109 9.2488C16.2429 9.5803 16.2427 10.1175 15.9104 10.4487L9.9516 16.3879C9.61931 16.7191 9.08081 16.7189 8.74882 16.3874C8.41684 16.0558 8.41709 15.5186 8.74938 15.1874L14.7082 9.24824C15.0405 8.91704 15.579 8.91729 15.9109 9.2488Z"
            fill="#FCFCFC"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.9109 16.3876C15.579 16.7191 15.0405 16.7193 14.7082 16.3881L8.74939 10.449C8.41709 10.1178 8.41684 9.58052 8.74882 9.24901C9.08081 8.9175 9.61931 8.91725 9.9516 9.24845L15.9104 15.1876C16.2427 15.5188 16.2429 16.0561 15.9109 16.3876Z"
            fill="#FCFCFC"
          />
        </g>
      </g>
    </g>
  </svg>
)

export default EditDraft
