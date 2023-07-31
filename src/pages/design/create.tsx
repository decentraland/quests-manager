import React from "react"

import { QuestsDesigner } from "@dcl/quests-designer"
import { navigate } from "decentraland-gatsby/dist/plugins/intl"

import { locations, storeDefinitionOnLocalStorage } from "../../utils"

const Design = () => {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <QuestsDesigner
        onGenerateQuestDefinition={(definition) =>
          storeDefinitionOnLocalStorage(definition)
        }
        closeDesigner={() => navigate(locations.home())}
      />
    </div>
  )
}

export default Design
