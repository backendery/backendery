import { FC } from "react"
import { FallbackProps } from "react-error-boundary"

import AnimateSignalStrip from "../../../components/AnimateSignalStrip/AnimateSignalStrip"
import { SvgIcon } from "../../../components/elements/Icon"

import "./InternalServerError.scss"

const InternalServerError: FC<FallbackProps> = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className={"internal-server-error"}>
      <div className={"internal-server-error__wrapper"}>
        <div className={"internal-server-error__status-code"}>{"5XX"}</div>
        <div className={"internal-server-error__message"}>
          {"Uh-oh!"} <br /> {"Server failure :/"}
        </div>
        <div
          className={"internal-server-error__reload"}
          onClick={(_: React.MouseEvent) => {
            resetErrorBoundary()
          }}
        >
          {"Reload"}
          <SvgIcon name={"arrow-turn"} />
        </div>
      </div>
      <div className={"internal-server-error__decorative-animate-signal-strip-wrapper"}>
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

export default InternalServerError
