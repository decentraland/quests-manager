import React from "react"

import { useAuthContext } from "decentraland-gatsby/dist/context/Auth"
import { SignIn } from "decentraland-ui/dist/components/SignIn/SignIn"

import { DesignerView } from "../../components/DesignerView"

const Design = () => {
  const [account, accountState] = useAuthContext()

  if (!account || accountState.loading) {
    return (
      <SignIn
        onConnect={() => accountState.select()}
        isConnecting={accountState.loading}
      />
    )
  }

  return <DesignerView />
}

export default Design
