import React, { useEffect, useState } from "react"

import { generateNodesAndEdgesFromQuestDefinition } from "@dcl/quests-designer/dist/utils"
import { useAuthContext } from "decentraland-gatsby/dist/context/Auth"
import { Link, back, navigate } from "decentraland-gatsby/dist/plugins/intl"
import { Back } from "decentraland-ui/dist/components/Back/Back"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Container } from "decentraland-ui/dist/components/Container/Container"
import { Loader } from "decentraland-ui/dist/components/Loader/Loader"
import { Modal } from "decentraland-ui/dist/components/Modal/Modal"
import { SignIn } from "decentraland-ui/dist/components/SignIn/SignIn"

import { DesignerView } from "../../components/DesignerView"
import { Edit } from "../../components/Edit"
import { QuestsClient } from "../../quests"
import { QuestAmplified } from "../../types"
import { locations } from "../../utils"

import "./quests.css"

const EditPublishedQuest = ({ id }: { id: string }) => {
  const [quest, setQuest] = useState<QuestAmplified | null>(null)
  const [questDesigner, setQuestDesigner] = useState(false)
  const [oldVersions, setOldVersions] = useState<string[]>([])
  const [account, accountState] = useAuthContext()
  const [editState, setEditState] = useState({
    updatingQuestLoading: false,
    activatingQuest: false,
    activatingQuestLoading: false,
    deactivatingQuest: false,
    deactivatingQuestLoading: false,
  })

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
      questClient
        .getOldVersions(id)
        .then(({ updates }) => setOldVersions([...updates]))
        .catch(console.error)
    }
  }, [account, id])

  if (!quest) {
    return <Loader size="massive" active />
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
        type="published"
        close={() => setQuestDesigner(false)}
        initialEdges={edges}
        initialNodes={nodes}
      />
    )
  }

  if (
    editState.updatingQuestLoading ||
    editState.activatingQuestLoading ||
    editState.deactivatingQuestLoading
  )
    return <Loader size="massive" active />

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
                setEditState({
                  updatingQuestLoading: false,
                  activatingQuest: false,
                  activatingQuestLoading: false,
                  deactivatingQuest: true,
                  deactivatingQuestLoading: false,
                })
              } else {
                setEditState({
                  updatingQuestLoading: false,
                  activatingQuest: true,
                  activatingQuestLoading: false,
                  deactivatingQuest: false,
                  deactivatingQuestLoading: false,
                })
              }
            }}
          />
        </div>
      </div>
      <div style={{ width: "50%", marginLeft: "60px", marginTop: "20px" }}>
        <Edit
          quest={quest}
          onChange={(editedQuest) => setQuest({ ...quest, ...editedQuest })}
        />
      </div>
      <div style={{ marginTop: "20px", marginLeft: "60px" }}>
        <h3>Old Versions</h3>
        {oldVersions.length > 0 ? (
          <ul style={{ listStyle: "none" }}>
            {oldVersions.map((version) => (
              <li key={version}>
                <Link href={locations.oldQuest(version)}>
                  - Quest {version}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          "No old versions"
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "40px",
          marginBottom: "40px",
          marginLeft: "60px",
        }}
      >
        <div>
          <Button
            type="button"
            primary
            content="Publish Changes"
            size="small"
            onClick={async () => {
              setEditState({
                updatingQuestLoading: true,
                activatingQuest: false,
                activatingQuestLoading: false,
                deactivatingQuest: false,
                deactivatingQuestLoading: false,
              })
              const { quest_id } = await questClient.updateQuest(
                quest.id,
                quest
              )
              setTimeout(() => {
                setEditState({
                  updatingQuestLoading: false,
                  activatingQuest: false,
                  activatingQuestLoading: false,
                  deactivatingQuest: false,
                  deactivatingQuestLoading: false,
                })
                navigate(locations.editPublishedQuest(quest_id))
              }, 2500)
            }}
          />
          <p
            style={{
              fontSize: "10px",
              marginTop: "5px",
              whiteSpace: "pre",
              color: "#676370",
            }}
          >
            Update a published Quest will cause a new Quest version, {"\n"}with
            new ID and this Quest will be deactivated and no longer updatable
          </p>
        </div>
      </div>
      {editState.activatingQuest && (
        <ChangeQuestState
          type="activate"
          onProceed={async () => {
            setEditState({
              updatingQuestLoading: false,
              activatingQuest: false,
              activatingQuestLoading: true,
              deactivatingQuest: false,
              deactivatingQuestLoading: false,
            })
            await questClient.activateQuest(quest.id)
            setTimeout(async () => {
              setEditState({
                updatingQuestLoading: false,
                activatingQuest: false,
                activatingQuestLoading: false,
                deactivatingQuest: false,
                deactivatingQuestLoading: false,
              })
              const updatedQuest = await questClient.getQuest(quest.id)
              setQuest({ ...updatedQuest })
            }, 1500)
          }}
          onCancel={() => {
            setEditState({
              updatingQuestLoading: false,
              activatingQuest: false,
              activatingQuestLoading: false,
              deactivatingQuest: false,
              deactivatingQuestLoading: false,
            })
          }}
        />
      )}
      {editState.deactivatingQuest && (
        <ChangeQuestState
          type="deactivate"
          onProceed={async () => {
            setEditState({
              updatingQuestLoading: false,
              activatingQuest: false,
              activatingQuestLoading: false,
              deactivatingQuest: false,
              deactivatingQuestLoading: true,
            })
            await questClient.deactivateQuest(quest.id)
            setTimeout(async () => {
              setEditState({
                updatingQuestLoading: false,
                activatingQuest: false,
                activatingQuestLoading: false,
                deactivatingQuest: false,
                deactivatingQuestLoading: false,
              })
              const updatedQuest = await questClient.getQuest(quest.id)
              setQuest({ ...updatedQuest })
            }, 1500)
          }}
          onCancel={() => {
            setEditState({
              updatingQuestLoading: false,
              activatingQuest: false,
              activatingQuestLoading: false,
              deactivatingQuest: false,
              deactivatingQuestLoading: false,
            })
          }}
        />
      )}
    </Container>
  )
}

const ChangeQuestState = ({
  type,
  onProceed,
  onCancel,
}: {
  type: "activate" | "deactivate"
  onProceed: () => void
  onCancel: () => void
}) => (
  <Modal open={true} size="tiny">
    <Modal.Header>You're about to change the state of your Quest</Modal.Header>
    <Modal.Content>
      {type == "activate"
        ? "If you activate your Quest, anyone can start playing it again"
        : "If you deactivate your Quest, no one will be able to start playing your Quest"}
    </Modal.Content>
    <Modal.Actions>
      <Button primary onClick={onProceed} size="small">
        Proceed
      </Button>
      <Button onClick={onCancel} size="small">
        Cancel
      </Button>
    </Modal.Actions>
  </Modal>
)

export default EditPublishedQuest
