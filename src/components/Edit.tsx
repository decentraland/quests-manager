import React from "react"

import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Checkbox } from "decentraland-ui/dist/components/Checkbox/Checkbox"
import { Field } from "decentraland-ui/dist/components/Field/Field"
import { Header } from "decentraland-ui/dist/components/Header/Header"

import { AddItem } from "./AddItem"
import { RawQuest } from "../types"

export const Edit = ({
  onChange,
  quest,
  readonly = false,
}: {
  quest: RawQuest
  onChange: (quest: RawQuest) => void
  readonly?: boolean
}) => {
  return (
    <>
      <h3>Quest Information</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Header sub size="small">
          <label>
            Name <span style={{ color: "var(--primary)" }}>*</span>
          </label>
        </Header>
        <Field
          placeholder="Name of the quest"
          value={quest.name}
          onChange={(e) => {
            onChange({ ...quest, name: e.target.value })
          }}
          readOnly={readonly}
        />
        <Header sub size="small">
          <label>
            Description <span style={{ color: "var(--primary)" }}>*</span>
          </label>
        </Header>
        <Field
          placeholder="Short description of the quest"
          value={quest.description}
          onChange={(e) => {
            onChange({
              ...quest,
              description: e.target.value,
            })
          }}
          readOnly={readonly}
        />
        <Header sub size="small">
          <label>
            Image <span style={{ color: "var(--primary)" }}>*</span>
          </label>
        </Header>
        <Field
          value={quest.imageUrl}
          placeholder="Image URL to display when listing the quest"
          onChange={(e) => {
            onChange({
              ...quest,
              imageUrl: e.target.value,
            })
          }}
          readOnly={readonly}
        />
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ marginBottom: "0px" }}>Rewards</h3>
          </div>
          <Checkbox
            toggle
            checked={!!quest.reward}
            onChange={() => {
              if (quest.reward) {
                onChange({ ...quest, reward: undefined })
              } else {
                onChange({
                  ...quest,
                  reward: {
                    hook: { webhookUrl: "", requestBody: {} },
                    items: [],
                  },
                })
              }
            }}
          />
        </div>
        <p
          style={{
            fontSize: "10px",
            marginBottom: "10px",
            whiteSpace: "pre",
            color: "#676370",
          }}
        >
          Available placeholders for Webhook URL and Data to Receive (request
          body): {"\n"}
          &#123; <span style={{ fontWeight: "bold" }}>quest_id</span>&#125; ,
          &#123; <span style={{ fontWeight: "bold" }}>user_address</span>&#125;{" "}
          {"\n"}
          E.g: &#123; beneficary: &#123;user_address&#125;, quest:
          &#123;quest_id&#125; &#125;
        </p>
        {quest.reward && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                marginTop: "40px",
              }}
            >
              <Header sub size="small">
                <label>
                  Webhook URL <span style={{ color: "var(--primary)" }}>*</span>
                </label>
              </Header>
              <Field
                value={quest?.reward?.hook.webhookUrl || ""}
                onChange={(e) => {
                  onChange({
                    ...quest,
                    reward: {
                      items: quest.reward?.items || [],
                      hook: {
                        requestBody: quest.reward?.hook?.requestBody || {},
                        webhookUrl: e.target.value,
                      },
                    },
                  })
                }}
                placeholder="URL to call when the quest is completed"
                readOnly={readonly}
              />
              <div style={{ width: "50%" }}>
                <Header sub size="small">
                  <label>
                    Data to Receive{" "}
                    <span style={{ color: "var(--primary)" }}>*</span>
                  </label>
                </Header>
                {Object.entries(
                  quest?.reward?.hook.requestBody ||
                    ({} as Record<string, string>)
                ).length
                  ? Object.entries(
                      quest?.reward?.hook.requestBody ||
                        ({} as Record<string, string>)
                    ).map(([key, value], index) => {
                      return (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                          className="key-value"
                        >
                          <Field
                            value={key}
                            onChange={(e) => {
                              // eslint-disable-next-line @typescript-eslint/no-unused-vars
                              const entries = Object.entries(
                                quest.reward?.hook.requestBody || {}
                              )
                              entries[index][0] = e.target.value
                              onChange({
                                ...quest,
                                reward: {
                                  hook: {
                                    webhookUrl:
                                      quest.reward?.hook.webhookUrl || "",
                                    requestBody: Object.fromEntries(entries),
                                  },
                                  items: quest.reward?.items || [],
                                },
                              })
                            }}
                            readOnly={readonly}
                          />
                          <span style={{ fontSize: "24px" }}>:</span>
                          <Field
                            value={value}
                            onChange={(e) => {
                              const entries = Object.entries(
                                quest.reward?.hook.requestBody || {}
                              )
                              entries[index][1] = e.target.value
                              onChange({
                                ...quest,
                                reward: {
                                  hook: {
                                    webhookUrl:
                                      quest.reward?.hook.webhookUrl || "",
                                    requestBody: Object.fromEntries(entries),
                                  },
                                  items: quest.reward?.items || [],
                                },
                              })
                            }}
                            readOnly={readonly}
                          />
                          {!readonly && (
                            <button
                              style={{
                                color: "red",
                                backgroundColor: "transparent",
                                border: "none",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                const entries = Object.entries(
                                  quest.reward?.hook.requestBody || {}
                                )
                                onChange({
                                  ...quest,
                                  reward: {
                                    hook: {
                                      webhookUrl:
                                        quest.reward?.hook.webhookUrl || "",
                                      requestBody: Object.fromEntries(
                                        entries.filter(
                                          (entry) => entry[0] != key
                                        )
                                      ),
                                    },
                                    items: quest.reward?.items || [],
                                  },
                                })
                              }}
                            >
                              &#x2715;
                            </button>
                          )}
                        </div>
                      )
                    })
                  : null}
                {!readonly && (
                  <Button
                    type="button"
                    content="Add Key:Value"
                    size="small"
                    inverted
                    style={{ border: "none" }}
                    onClick={() => {
                      const keys = Object.keys(
                        quest.reward?.hook.requestBody || {}
                      )
                      onChange({
                        ...quest,
                        reward: {
                          hook: {
                            webhookUrl: quest.reward?.hook.webhookUrl || "",
                            requestBody: {
                              ...(quest.reward?.hook.requestBody || {}),
                              [`key${keys.length == 0 ? "" : keys.length}`]:
                                "value",
                            } as Record<string, string>,
                          },
                          items: quest.reward?.items || [],
                        },
                      })
                    }}
                  />
                )}
              </div>
            </div>
            {!readonly && (
              <AddItem
                items={quest?.reward?.items || []}
                onSaveItem={(item, index) => {
                  const newItems = [...(quest?.reward?.items || [])]

                  if (index === -1) {
                    newItems.push(item)
                  } else {
                    newItems[index] = item
                  }

                  onChange({
                    ...quest,
                    reward: {
                      hook: {
                        requestBody: quest.reward?.hook.requestBody || {},
                        webhookUrl: quest.reward?.hook?.webhookUrl || "",
                      },
                      items: newItems,
                    },
                  })
                }}
              />
            )}
          </>
        )}
      </div>
    </>
  )
}
