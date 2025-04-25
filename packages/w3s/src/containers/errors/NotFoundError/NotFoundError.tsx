import { FC } from "react"

import AnimateSignalStrip from "../../../components/AnimateSignalStrip/AnimateSignalStrip"
import { SvgIcon } from "../../../components/elements/Icon"

import "./NotFoundError.scss"

const NotFoundError: FC = () => {
  return (
    <div className={"not-found-error"}>
      <div className={"not-found-error__wrapper"}>
        <div className={"not-found-error__status-code"}>{"404"}</div>
        <div className={"not-found-error__message"}>
          {"Uh-oh!"} <br /> {"Page not found :/"}
        </div>
        <div
          className={"not-found-error__go-to-home"}
          onClick={(_: React.MouseEvent) => {
            document.location = "/"
          }}
        >
          {"Go to home"}
          <SvgIcon name={"arrow-right"} />
        </div>
      </div>
      <div className={"not-found-error__decorative-animate-signal-strip-wrapper"}>
        <AnimateSignalStrip
          symbol={"."}
          maxNumberOfSymbols={4}
          minInterval={1_000}
          maxInterval={2_500}
          initialSymbols={".."}
          style={{ color: "#f1f7f7" }}
        />
        <AnimateSignalStrip
          symbol={"."}
          maxNumberOfSymbols={7}
          minInterval={1_250}
          maxInterval={2_500}
          initialSymbols={"....."}
          style={{ color: "#00df82" }}
        />
      </div>
    </div>
  )
}

export default NotFoundError
