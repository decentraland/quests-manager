import React, { useState } from "react"

import { generateNodesAndEdgesFromQuestDefinition } from "@dcl/quests-designer/dist/utils"
import { useAuthContext } from "decentraland-gatsby/dist/context/Auth"
import { navigate } from "decentraland-gatsby/dist/plugins/intl"
import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Container } from "decentraland-ui/dist/components/Container/Container"
import { Field } from "decentraland-ui/dist/components/Field/Field"

import { AddItem } from "../../../components/AddItem"
import { DesignerView } from "../../../components/DesignerView"
import { QuestsClient } from "../../../quests"
import { getQuestDraftById, locations, updateQuestDraft } from "../../../utils"

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
      <DesignerView initialEdges={edges} initialNodes={nodes} type="draft" />
    )
  }

  return (
    <Container>
      <h2>Edit Quest Draft {quest.id}</h2>
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
              setQuestDraft({ ...quest, name: e.target.value })
            }}
          />
          <Field
            label="description"
            placeholder="Short description of the quest"
            value={quest.description}
            onChange={(e) => {
              setQuestDraft({
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
              setQuestDraft({
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
              setQuestDraft({
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
                setQuestDraft({
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
            setQuestDraft({
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
        Steps and Connection are edited outside this tab. By clicking "save"
        here doesn't modify the steps and connections
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
          content="Deploy Dev"
          size="small"
          style={{ maxWidth: "20px" }}
          color="instagram"
          onClick={() => questClient.publishQuest(quest)}
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
