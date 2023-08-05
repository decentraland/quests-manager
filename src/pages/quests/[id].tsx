import React, { useEffect, useState } from "react"

import { QuestsDesigner } from "@dcl/quests-designer"
import { generateNodesAndEdgesFromQuestDefinition } from "@dcl/quests-designer/dist/utils"
import { useAuthContext } from "decentraland-gatsby/dist/context/Auth"
import { navigate } from "decentraland-gatsby/dist/plugins/intl"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Container } from "decentraland-ui/dist/components/Container/Container"
import { Field } from "decentraland-ui/dist/components/Field/Field"

import { AddItem } from "../../components/AddItem"
import { QuestsClient } from "../../quests"
import { QuestAmplified } from "../../types"
import { locations } from "../../utils"

const EditPublishedQuest = ({ id }: { id: string }) => {
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
      <h2>Edit Quest {quest.id}</h2>
      <div style={{ width: "100%" }}>
        <h3>Basic Info</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Field
            label="name"
            placeholder="Name of the quest"
            value={quest.name}
            onChange={(e) => {
              setQuest({ ...quest, name: e.target.value })
            }}
          />
          <Field
            label="description"
            placeholder="Short description of the quest"
            value={quest.description}
            onChange={(e) => {
              setQuest({
                ...quest,
                description: e.target.value,
              })
            }}
          />
          <Field
            label="image"
            value={quest.imageUrl}
            placeholder="Image URL to display when listing the quest"
            onChange={(e) => {
              setQuest({
                ...quest,
                imageUrl: e.target.value,
              })
            }}
          />
        </div>
        <h3>Rewards</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Field
            label="Webhook URL"
            value={quest?.reward?.hook.webhookUrl || ""}
            onChange={(e) => {
              setQuest({
                ...quest,
                reward: {
                  items: quest.reward?.items || [],
                  hook: {
                    requestBody: quest.reward?.hook?.requestBody || "",
                    webhookUrl: e.target.value,
                  },
                },
              })
            }}
            placeholder="URL to call when the quest is completed"
            message={
              <span
                style={{
                  fontSize: "11px",
                  marginTop: "0px",
                  whiteSpace: "pre",
                }}
              >
                Available placeholders: &#123;quest_id&#125; ,
                &#123;user_address&#125; {"\n"}
                E.g: &#123; beneficary: &#123;user_address&#125;, quest:
                &#123;quest_id&#125; &#125;
              </span>
            }
          />
          <div>
            <Field
              kind="simple"
              label="Data to receive"
              value={
                typeof quest?.reward?.hook.requestBody == "string"
                  ? quest?.reward?.hook.requestBody
                  : JSON.stringify(quest?.reward?.hook.requestBody) || ""
              }
              placeholder="JSON data to send to the webhook"
              onChange={(e) => {
                setQuest({
                  ...quest,
                  reward: {
                    items: quest.reward?.items || [],
                    hook: {
                      requestBody: e.target.value,
                      webhookUrl: quest.reward?.hook?.webhookUrl || "",
                    },
                  },
                })
              }}
              message={
                <span
                  style={{
                    fontSize: "11px",
                    marginTop: "0px",
                    whiteSpace: "pre",
                  }}
                >
                  Available placeholders: &#123;quest_id&#125; ,
                  &#123;user_address&#125; {"\n"}
                  E.g: &#123; beneficary: &#123;user_address&#125;, quest:
                  &#123;quest_id&#125; &#125;
                </span>
              }
            />
          </div>
        </div>
        <AddItem
          items={quest?.reward?.items || []}
          onSaveItem={(item, index) => {
            const newItems = [...(quest?.reward?.items || [])]

            if (index === -1) {
              newItems.push(item)
            } else {
              newItems[index] = item
            }

            setQuest({
              ...quest,
              reward: {
                hook: {
                  requestBody: quest.reward?.hook.requestBody || "",
                  webhookUrl: quest.reward?.hook?.webhookUrl || "",
                },
                items: newItems,
              },
            })
          }}
        />
      </div>
      <h3>Steps & Connections</h3>
      <p style={{ fontStyle: "italic", color: "gray" }}>
        Steps and Connection are edited outside this tab. After clicking "save"
        button on the other tab, you should click "update quets" here in order
        to deploy the new version
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
          onClick={() => {
            quest.active
              ? questClient.deactivateQuest(quest.id)
              : questClient.activateQuest(quest.id)
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
