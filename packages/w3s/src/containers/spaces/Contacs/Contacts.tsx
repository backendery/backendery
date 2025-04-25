import { FC, useEffect, useRef } from "react"
import { ReactTyped as Typed } from "react-typed"

import AnimateRadixGrid from "../../../components/AnimateRadixGrid/AnimateRadixGrid"
import { SvgIcon } from "../../../components/elements/Icon"
import { useRotator } from "../../../hooks/useRotator"
import { randomBetween, runWithTimeout } from "../../../utils/fn"

import "./Contacts.scss"

const Contacts: FC = () => {
  /** @references */
  const squareTimeoutRef = useRef<number | null>(null)

  const { ref: decorativeSquareRef, replay: squareReplay } = useRotator({
    duration: 1_100,
    randomizeRotation: true,
    onAnimationEnd: () => {
      runWithTimeout(squareTimeoutRef, squareReplay, randomBetween(3_850, 6_700))
    },
  })

  useEffect(() => {
    runWithTimeout(squareTimeoutRef, squareReplay)

    return () => {
      if (squareTimeoutRef.current) {
        clearTimeout(squareTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className={"contacts"}>
      <h2 className={"contacts__title"}>
        <Typed strings={["Contacts"]} typeSpeed={50} cursorChar={"_"} showCursor={true} startWhenVisible />
      </h2>
      <div className={"contacts__decorative-wrapper"}>
        <div className={"contacts__decorative-square"} ref={decorativeSquareRef}></div>
      </div>
      <div className={"contacts__email-wrapper"}>
        <p className={"contacts__email-description"}>
          {"Not everybody has an experienced backend developer... write to us"}
        </p>
        <a className={"contacts__email-address"} href={"mailto:hey@backendery.io"}>
          {"hey@backendery.io"}
        </a>
      </div>
      <div className={"contacts__social-wrapper"}>
        <a className={"contacts__social-link"} href={"#"}>
          {"LinkedIn"}
          <SvgIcon name={"arrow-up"} />
        </a>
        <a
          className={"contacts__social-link"}
          href={"https://github.com/backendery/"}
          target={"_blank"}
          rel={"noreferrer noopener"}
        >
          {"GitHub"}
          <SvgIcon name={"arrow-up"} />
        </a>
      </div>
      <div className={"contacts__decorative-animate-radix-grid-wrapper"}>
        {/* prettier-ignore */}
        <AnimateRadixGrid
          symbols={["0", "1"]}
          rows={7}
          cols={3}
          minInterval={300}
          maxInterval={650}
          unreachableCells={[
            [3, 1], [4, 1], [5, 1], [6, 1],
                    [4, 2], [5, 2], [6, 2],
          ]}
        />
      </div>
    </div>
  )
}

export default Contacts
