import React from "react"

import { Button } from "decentraland-ui/dist/components/Button/Button"
import { Modal } from "decentraland-ui/dist/components/Modal/Modal"

export const QuestDraftSaved = ({
  onContinue,
  onKeepEditing,
}: {
  onContinue: () => void
  onKeepEditing: () => void
}) => (
  <Modal open={true} size="tiny" className="quests-modal">
    <Modal.Header>Quest Draft saved successfully</Modal.Header>
    <Modal.Content></Modal.Content>
    <Modal.Actions>
      <Button primary onClick={onContinue} size="medium">
        Continue
      </Button>
      <Button
        inverted
        onClick={onKeepEditing}
        size="medium"
        style={{ backgroundColor: "transparent" }}
      >
        Keep Editing
      </Button>
    </Modal.Actions>
  </Modal>
)
