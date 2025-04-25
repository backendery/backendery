import React, { FC } from "react"

import AnimateLines from "../../../components/AnimateLines/AnimateLines"
import { SvgIcon } from "../../../components/elements/Icon"

import "./Main.scss"

interface IMainProps {
  zoomOut: (event: React.MouseEvent) => void
}

const Main: FC<IMainProps> = ({ zoomOut }) => {
  return (
    <div className={"main"}>
      <div className={"main__logo"}>
        <SvgIcon name={"logo"} />
      </div>
      <div className={"main__decorative-animate-lines-wrapper"}>
        <AnimateLines redrawInterval={6_500} />
      </div>
      <div className={"main__title"}>{"Reliable backend for your projects"}</div>
      <div className={"main__show-all"} onClick={zoomOut}>
        {"Show All"}
      </div>
    </div>
  )
}

export default Main
