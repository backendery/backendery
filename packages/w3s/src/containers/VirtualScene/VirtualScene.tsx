import { FC, useEffect, useRef, useState } from "react"

import { addClass, removeClass } from "../../utils/fn"
import AboutUs from "../spaces/AboutUs/AboutUs"
import Cases from "../spaces/Cases/Cases"
import ComingSoon from "../spaces/ComingSoon/ComingSoon"
import Contacts from "../spaces/Contacs/Contacts"
import LetsStart from "../spaces/LetsStart/LetsStart"
import Main from "../spaces/Main/Main"
import Steps from "../spaces/Steps/Steps"
import WeDo from "../spaces/WeDo/WeDo"
import WeUse from "../spaces/WeUse/WeUse"

import "./VirtualScene.scss"

const VirtualScene: FC = () => {
  /**
   * Adjusts `positionX` and `positionY` based on data attributes from the clicked element.
   * Initiates zoom-in sequence by calling `zoomIn`.
   *
   * @function
   * @param {MouseEvent} event The click event containing position data.
   */
  const setSpaceAndZoomIt = (event: MouseEvent): void => {
    const target = event.target as HTMLElement

    // Use destructuring to extract data attributes with default values
    const xPosition = parseInt(target.getAttribute("data-x-position") || "0") * -1
    const yPosition = parseInt(target.getAttribute("data-y-position") || "0")

    // Update positions in a single call to setState for better performance
    setPositionX(xPosition)
    setPositionY(yPosition)

    zoomIn()
  }

  /**
   * Moves the scene upward by incrementing `positionY`.
   *
   * @function
   */
  const moveUp = (): void => {
    virtualSceneWrapperRef.current && setPositionY(prevPositionY => prevPositionY + 1)
  }

  /**
   * Moves the scene to the right by decrementing `positionX`.
   *
   * @function
   */
  const moveRight = (): void => {
    virtualSceneWrapperRef.current && setPositionX(prevPositionX => prevPositionX - 1)
  }

  /**
   * Moves the scene downward by decrementing `positionY`.
   *
   * @function
   */
  const moveDown = (): void => {
    virtualSceneWrapperRef.current && setPositionY(prevPositionY => prevPositionY - 1)
  }

  /**
   * Moves the scene to the left by incrementing `positionX`.
   *
   * @function
   */
  const moveLeft = (): void => {
    virtualSceneWrapperRef.current && setPositionX(prevPositionX => prevPositionX + 1)
  }

  /**
   * Toggles the visibility of `&__navigate` items based on `isHide`.
   *
   * @function
   * @param {boolean} isHide If true, hides navigation elements; if false, shows them.
   */
  const toggleNavigationVisibility = (isHide: boolean): void => {
    spacesNavigationRef.current?.forEach(navigateItem => {
      ;(navigateItem as HTMLElement).style.display = isHide ? "none" : ""
    })
  }

  /**
   * Toggles the active class on `&__caption` items based on `isHide`.
   *
   * @function
   * @param {boolean} isHide If true, adds the active class; if false, removes it.
   */
  const toggleCaptionVisibility = (isHide: boolean): void => {
    spacesCaptionRef.current?.forEach(captionItem => {
      isHide ? addClass(captionItem, "active") : removeClass(captionItem, "active")
    })
  }

  /**
   * Initiates zoom-in effect by hiding unnecessary elements and removing the 'show-all' class.
   *
   * @function
   */
  const zoomIn = (): void => {
    spacesRef.current?.forEach(spaceItem => {
      spaceItem.removeEventListener("click", setSpaceAndZoomIt)
    })

    if (virtualSceneRef.current) {
      removeClass(virtualSceneRef.current, "show-all")

      setTimeout(() => {
        toggleCaptionVisibility(false)
        toggleNavigationVisibility(false)
      }, 150)
    }
  }

  /**
   * Initiates zoom-out effect by adding the 'show-all' class, restoring element visibility, and
   * re-attaching click handlers for spaces.
   *
   * @function
   * @param {React.MouseEvent} event The click event triggering zoom-out.
   */
  const zoomOut = (event: React.MouseEvent): void => {
    event.stopPropagation()

    if (virtualSceneRef.current) {
      addClass(virtualSceneRef.current, "show-all")

      setTimeout(() => {
        toggleCaptionVisibility(true)
        toggleNavigationVisibility(true)
      }, 150)
    }

    spacesRef.current?.forEach(spaceItem => {
      spaceItem.addEventListener("click", setSpaceAndZoomIt)
    })
  }

  /** @states */
  /**
   * State that stores the current horizontal position in the virtual scene. The `positionX` is
   * updated during navigation events to control horizontal movement.
   *
   * @type {number} positionX - An integer representing the horizontal position in the scene.
   * @function setPositionX - A function to update the `positionX` state with a new value.
   */
  const [positionX, setPositionX] = useState<number>(0)
  /**
   * State that stores the current vertical position in the virtual scene. The `positionY` is
   * updated during navigation events to control vertical movement.
   *
   * @type {number} positionY - An integer representing the vertical position in the scene.
   * @function setPositionY - A function to update the `positionY` state with a new value.
   */
  const [positionY, setPositionY] = useState<number>(0)

  /** @references */
  /**
   * A reference to the main container of the virtual scene. Used for direct DOM manipulation or
   * measurements.
   *
   * @type {React.RefObject<HTMLDivElement>} virtualSceneRef
   */
  const virtualSceneRef = useRef<HTMLDivElement>(null)
  /**
   * A reference to the wrapper element surrounding the virtual scene. Useful for controlling the
   * container's properties or accessing it for adjustments.
   *
   * @type {React.RefObject<HTMLDivElement>} virtualSceneWrapperRef
   */
  const virtualSceneWrapperRef = useRef<HTMLDivElement>(null)
  /**
   * A reference to all space elements within the scene. This allows for operations or checks on
   * multiple space elements at once.
   *
   * @type {React.RefObject<NodeListOf<HTMLDivElement> | null>} spacesRef
   */
  const spacesRef = useRef<NodeListOf<HTMLDivElement> | null>(null)
  /**
   * A reference to all caption elements associated with the spaces. Facilitates bulk operations or
   * property changes on captions.
   *
   * @type {React.RefObject<NodeListOf<HTMLDivElement> | null>} spacesCaptionRef
   */
  const spacesCaptionRef = useRef<NodeListOf<HTMLDivElement> | null>(null)
  /**
   * A reference to all navigation elements within the space. Used for applying event listeners or
   * modifications to navigation items.
   *
   * @type {React.RefObject<NodeListOf<HTMLSpanElement> | null>} spacesNavigationRef
   */
  const spacesNavigationRef = useRef<NodeListOf<HTMLSpanElement> | null>(null)

  useEffect(() => {
    if (virtualSceneWrapperRef.current) {
      // Transforms the element's position based on `positionX` and `positionY`
      virtualSceneWrapperRef.current.style.transform = `translateX(${positionX * 100}%) translateY(${positionY * 100}%)`
    }
  }, [positionX, positionY])

  useEffect(() => {
    /* prettier-ignore */
    ;[
      spacesRef.current,
      spacesCaptionRef.current,
      spacesNavigationRef.current
    ] = [
      document.querySelectorAll(".virtual-space"),
      document.querySelectorAll(".virtual-space__caption"),
      document.querySelectorAll("[class^='js-'], [class*=' js-'], [class$=' js-']"),
    ]
  }, [])

  useEffect(() => {
    // Map of navigation elements and their corresponding handler functions
    const navigationMap = [
      { elements: document.getElementsByClassName("js-up"), handler: moveUp },
      { elements: document.getElementsByClassName("js-right"), handler: moveRight },
      { elements: document.getElementsByClassName("js-down"), handler: moveDown },
      { elements: document.getElementsByClassName("js-left"), handler: moveLeft },
    ]

    // Adding click event listeners to each navigation element
    navigationMap.forEach(({ elements, handler }) => {
      Array.from(elements).forEach(navigateItem => navigateItem.addEventListener("click", handler))
    })

    return () => {
      // Cleanup function to remove event listeners on component unmount
      navigationMap.forEach(({ elements, handler }) => {
        Array.from(elements).forEach(navigateItem => navigateItem.removeEventListener("click", handler))
      })
    }
  }, [])

  return (
    <div className={"virtual-scene"} ref={virtualSceneRef}>
      <div className={"virtual-scene__wrapper"} ref={virtualSceneWrapperRef}>
        {/* Center */}
        {/* prettier-ignore */}
        <div className={"virtual-space"} data-x-position={"0"} data-y-position={"0"}>
          <div className={"virtual-space__caption"}>{"Main"}</div>
          <span className={"virtual-space__navigate virtual-space__navigate--up js-up"}>{"We Do"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--right-top js-up js-right"}>{"Coming Soon"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--left-top js-up js-left"}>{"About Us"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--left js-left"}>{"Cases"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--right js-right"}>{"Steps"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--right-down js-down js-right"}>{"Contacts"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--left-down js-down js-left"}>{"Let's Start"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--down js-down"}>{"We Use"}</span>
          <Main zoomOut={zoomOut} />
        </div>
        {/* Up */}
        {/* prettier-ignore */}
        <div className={"virtual-space"} data-x-position={"0"} data-y-position={"1"}>
          <div className={"virtual-space__caption"}>{"We Do"}</div>
          <span className={"virtual-space__navigate virtual-space__navigate--left js-left"}>{"About Us"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--right js-right"}>{"Coming Soon"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--right-down js-down js-right"}>{"Steps"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--left-down js-down js-left"}>{"Cases"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--down js-down"}>{"Main"}</span>
          <WeDo />
        </div>
        {/* Up/Right */}
        {/* prettier-ignore */}
        <div className={"virtual-space"} data-x-position={"1"} data-y-position={"1"}>
          <div className={"virtual-space__caption"}>{"Coming Soon"}</div>
          <span className={"virtual-space__navigate virtual-space__navigate--left-down js-down js-left"}>{"Main"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--left js-left"}>{"We Do"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--down js-down"}>{"Steps"}</span>
          <ComingSoon />
        </div>
        {/* Right */}
        {/* prettier-ignore */}
        <div className={"virtual-space"} data-x-position={"1"} data-y-position={"0"}>
          <div className={"virtual-space__caption"}>{"Steps"}</div>
          <span className={"virtual-space__navigate virtual-space__navigate--up js-up"}>{"Coming Soon"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--left-top js-up js-left"}>{"We Do"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--left js-left"}>{"Main"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--left-down js-down js-left"}>{"We Use"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--down js-down"}>{"Contacts"}</span>
          <Steps />
        </div>
        {/* Down/Right */}
        {/* prettier-ignore */}
        <div className={"virtual-space"} data-x-position={"1"} data-y-position={"-1"}>
          <div className={"virtual-space__caption"}>{"Contacts"}</div>
          <span className={"virtual-space__navigate virtual-space__navigate--up js-up"}>{"Steps"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--left-top js-up js-left"}>{"Main"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--left js-left"}>{"We Use"}</span>
          <Contacts />
        </div>
        {/* Down */}
        {/* prettier-ignore */}
        <div className={"virtual-space"} data-x-position={"0"} data-y-position={"-1"}>
          <div className={"virtual-space__caption"}>{"We Use"}</div>
          <span className={"virtual-space__navigate virtual-space__navigate--up js-up"}>{"Main"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--left-top js-up js-left"}>{"Cases"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--right-top js-up js-right"}>{"Steps"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--left js-left"}>{"Let's Start"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--right js-right"}>{"Contacts"}</span>
          <WeUse />
        </div>
        {/* Down/Left */}
        {/* prettier-ignore */}
        <div className={"virtual-space"} data-x-position={"-1"} data-y-position={"-1"}>
          <div className={"virtual-space__caption"}>{"Let's Start"}</div>
          <span className={"virtual-space__navigate virtual-space__navigate--up js-up"}>{"Cases"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--right-top js-up js-right"}>{"Main"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--right js-right"}>{"We Use"}</span>
          <LetsStart />
        </div>
        {/* Left */}
        {/* prettier-ignore */}
        <div className={"virtual-space"} data-x-position={"-1"} data-y-position={"0"}>
          <div className={"virtual-space__caption"}>{"Cases"}</div>
          <span className={"virtual-space__navigate virtual-space__navigate--up js-up"}>{"About Us"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--right-top js-up js-right"}>{"We Do"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--right js-right"}>{"Main"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--right-down js-down js-right"}>{"We Use"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--down js-down"}>{"Let's Start"}</span>
          <Cases />
        </div>
        {/* Up/Left */}
        {/* prettier-ignore */}
        <div className={"virtual-space"} data-x-position={"-1"} data-y-position={"1"}>
          <div className={"virtual-space__caption"}>{"About Us"}</div>
          <span className={"virtual-space__navigate virtual-space__navigate--right-down js-down js-right"}>{"Main"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--right js-right"}>{"We Do"}</span>
          <span className={"virtual-space__navigate virtual-space__navigate--down js-down"}>{"Cases"}</span>
          <AboutUs />
        </div>
      </div>
    </div>
  )
}

export default VirtualScene
