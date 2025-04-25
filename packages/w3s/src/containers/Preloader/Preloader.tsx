import { FC } from "react"

import "./Preloader.scss"

const Preloader: FC = () => (
  <div className={"preloader"}>
    <div className={"preloader__overlay"}>
      <p className={"preloader__message"}>{"~/> loading..."}</p>
    </div>
  </div>
)

export default Preloader
