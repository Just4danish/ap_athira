import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={40}
      height={40}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M15.586 4.586l-.53.53.53-.53zm3.828 3.828l.53-.53-.53.53zM9 15v-.75a.75.75 0 00-.75.75H9zm6 0h.75a.75.75 0 00-.75-.75V15zm-.75 5a.75.75 0 001.5 0h-1.5zm-6 0a.75.75 0 001.5 0h-1.5zm9.75-.75H6v1.5h12v-1.5zM4.75 18V6h-1.5v12h1.5zM6 4.75h8.172v-1.5H6v1.5zm13.25 5.078V18h1.5V9.828h-1.5zm-4.194-4.712l3.828 3.829 1.06-1.061-3.828-3.829-1.06 1.061zm5.694 4.712c0-.729-.29-1.428-.805-1.944l-1.061 1.06c.234.235.366.553.366.884h1.5zM14.172 4.75c.331 0 .649.132.883.366l1.061-1.06a2.75 2.75 0 00-1.944-.806v1.5zM6 19.25c-.69 0-1.25-.56-1.25-1.25h-1.5A2.75 2.75 0 006 20.75v-1.5zm12 1.5A2.75 2.75 0 0020.75 18h-1.5c0 .69-.56 1.25-1.25 1.25v1.5zM4.75 6c0-.69.56-1.25 1.25-1.25v-1.5A2.75 2.75 0 003.25 6h1.5zM9 15.75h6v-1.5H9v1.5zm5.25-.75v5h1.5v-5h-1.5zm-4.5 5v-5h-1.5v5h1.5z"
        fill="white"
      />
    </Svg>
  )
}

export default SvgComponent
