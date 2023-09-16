import React, { useState } from "react"

import { navigate } from "gatsby"

import { useAuthContext } from "decentraland-gatsby/dist/context/Auth"
import { SignIn } from "decentraland-ui/dist/components/SignIn/SignIn"

import { DesignerView } from "../../components/DesignerView"
import { QuestDraftSaved } from "../../components/QuestStepsDraftSaved"
import { locations, storeQuestDraft } from "../../utils"

const Design = () => {
  const [account, accountState] = useAuthContext()
  const [draftSavedModal, setDraftSavedModal] = useState(false)
  const [questDraftId, setQuestDraftId] = useState<number | null>(null)

  if (!account || accountState.loading) {
    return (
      <SignIn
        onConnect={() => accountState.select()}
        isConnecting={accountState.loading}
      />
    )
  }

  return (
    <>
      <DesignerView
        onClick={(nodes, edges, definition) => {
          const id = storeQuestDraft({
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
          setQuestDraftId(id)
          setDraftSavedModal(true)
        }}
      />
      {draftSavedModal && (
        <QuestDraftSaved
          onContinue={() => {
            navigate(locations.editDraftQuest(questDraftId!))
          }}
          onKeepEditing={() => {
            setDraftSavedModal(false)
          }}
        />
      )}
    </>
  )
}

export default Design
