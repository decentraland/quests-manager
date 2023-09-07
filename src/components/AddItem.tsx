import React, { useState } from "react"

import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Field } from "decentraland-ui/dist/components/Field/Field"

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
    <>
      <div
        style={{
          marginTop: "80px",
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
        }}
      >
        <h4>Adding Item</h4>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "50%",
          }}
        >
          <Field
            label="name"
            value={item.name}
            style={{ maxWidth: "50%" }}
            onChange={(e) => onChange("name", e.target.value)}
          />
          <Field
            label="image link"
            value={item.imageLink}
            style={{ maxWidth: "50%" }}
            onChange={(e) => onChange("imageLink", e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "40%",
          }}
        >
          <Button
            type="button"
            content="Save"
            size="small"
            style={{ maxWidth: "20px" }}
            disabled={item?.name == "" || item?.imageLink == ""}
            onClick={() => onSave()}
          />
          <Button
            type="button"
            content="Close"
            size="small"
            style={{ maxWidth: "20px" }}
            onClick={() => {
              onClose()
            }}
          />
        </div>
      </div>
    </>
  )
}
