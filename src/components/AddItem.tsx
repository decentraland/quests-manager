import React, { useState } from "react"

import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Field } from "decentraland-ui/dist/components/Field/Field"

import { urlRegex } from "../utils"

export const AddItem = ({
  items,
  onSaveItem,
}: {
  items: { name: string; imageLink: string }[]
  onSaveItem: (item: { name: string; imageLink: string }, index: number) => void
}) => {
  const [adding, setAdding] = useState<{
    name: string
    imageLink: string
  } | null>(null)
  const [currentSelected, setCurrentSelected] = useState<{
    index: number
    name: string
    imageLink: string
  } | null>(null)

  if (currentSelected) {
    return (
      <Adder
        item={currentSelected}
        onChange={(key, value) =>
          setCurrentSelected({ ...currentSelected, [key]: value })
        }
        onClose={() => setCurrentSelected(null)}
        onSave={() => {
          onSaveItem(currentSelected, currentSelected.index)
          setCurrentSelected(null)
        }}
      />
    )
  }

  if (adding) {
    return (
      <Adder
        item={adding}
        onChange={(key, value) => setAdding({ ...adding, [key]: value })}
        onClose={() => setAdding(null)}
        onSave={() => {
          onSaveItem(adding, -1)
          setAdding(null)
        }}
      />
    )
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "20px",
        marginBottom: "20px",
      }}
    >
      <h4>
        Reward Items <span style={{ color: "var(--primary)" }}>*</span>
      </h4>
      {items.length ? (
        <ul>
          {items.map((item, i) => (
            <Button
              size="small"
              type="button"
              content={`${item.name}`}
              inverted
              onClick={() => setCurrentSelected({ ...item, index: i })}
            />
          ))}
        </ul>
      ) : (
        <p>No items</p>
      )}
      <Button
        type="button"
        content="Add item"
        size="small"
        inverted
        style={{ border: "none", width: "20px" }}
        onClick={() => setAdding({ name: "", imageLink: "" })}
      />
    </div>
  )
}

const Adder = ({
  item,
  onSave,
  onClose,
  onChange,
}: {
  item: { name: string; imageLink: string }
  onChange: (key: string, value: string) => void
  onSave: () => void
  onClose: () => void
}) => {
  return (
    <div style={{ width: "100%", marginTop: "20px" }}>
      <h4>Adding Item</h4>
      <div
        style={{
          display: "flex",
          maxWidth: "100%",
          justifyContent: "space-between",
        }}
        className="key-value"
      >
        <Field
          label="name"
          value={item.name}
          onChange={(e) => onChange("name", e.target.value)}
          error={item.name.length < 3}
          message={
            item.name.length < 3 ? "Name should be at least 3 chars" : undefined
          }
        />
        <Field
          label="image link"
          value={item.imageLink}
          onChange={(e) => onChange("imageLink", e.target.value)}
          error={new RegExp(urlRegex).test(item.imageLink || "") ? false : true}
          message={
            !new RegExp(urlRegex).test(item.imageLink || "")
              ? "Image URL is invalud"
              : undefined
          }
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Button
          type="button"
          content="Save"
          secondary
          size="small"
          style={{ maxWidth: "20px", marginRight: "10px" }}
          disabled={
            item?.name.length < 3 ||
            item?.imageLink == "" ||
            !new RegExp(urlRegex).test(item.imageLink || "")
          }
          onClick={() => onSave()}
        />
        <Button
          type="button"
          content="Close"
          inverted
          size="small"
          style={{ maxWidth: "20px" }}
          onClick={() => {
            onClose()
          }}
        />
      </div>
    </div>
  )
}
