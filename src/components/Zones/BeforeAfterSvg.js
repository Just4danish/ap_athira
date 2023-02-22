import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={339}
      height={26}
      viewBox="0 0 339 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path d="M0 4a4 4 0 014-4h75v26H0V4z" fill="#66B552" />
      <Path d="M79 0h75a4 4 0 014 4v22H79V0z" fill="#A19D9D" />
      <Path stroke="#EEE8E8" strokeWidth={0.5} d="M0 25.75L339 25.75" />
      <Path
        d="M9.596 18V8.2h4.228c1.092 0 1.937.22 2.534.658.607.439.91 1.06.91 1.862 0 .532-.126.98-.378 1.344-.243.364-.579.64-1.008.826-.42.187-.882.28-1.386.28l.238-.336c.625 0 1.162.098 1.61.294.457.187.812.471 1.064.854.252.373.378.84.378 1.4 0 .83-.308 1.475-.924 1.932-.607.457-1.526.686-2.758.686H9.596zm1.036-.854h3.458c.859 0 1.517-.145 1.974-.434.457-.299.686-.77.686-1.414 0-.635-.229-1.097-.686-1.386-.457-.299-1.115-.448-1.974-.448h-3.57v-.854h3.234c.784 0 1.39-.15 1.82-.448.439-.299.658-.742.658-1.33 0-.597-.22-1.04-.658-1.33-.43-.299-1.036-.448-1.82-.448h-3.122v8.092zm12.43.924c-.765 0-1.437-.159-2.015-.476a3.575 3.575 0 01-1.358-1.33c-.327-.57-.49-1.218-.49-1.946s.154-1.372.462-1.932c.317-.56.746-.999 1.288-1.316a3.553 3.553 0 011.848-.49c.69 0 1.302.159 1.834.476.541.308.966.747 1.274 1.316.308.56.462 1.209.462 1.946a.946.946 0 01-.014.154v.154h-6.398v-.742h5.866l-.392.294c0-.532-.117-1.003-.35-1.414a2.462 2.462 0 00-.924-.98c-.392-.233-.845-.35-1.358-.35-.504 0-.957.117-1.358.35-.402.233-.714.56-.938.98-.224.42-.336.9-.336 1.442v.154c0 .56.121 1.055.364 1.484.252.42.597.751 1.036.994.448.233.956.35 1.526.35.448 0 .863-.08 1.246-.238a2.592 2.592 0 001.008-.728l.56.644c-.327.392-.738.69-1.232.896a4.092 4.092 0 01-1.61.308zm5.496-.07V9.726c0-.653.191-1.18.574-1.582.383-.401.933-.602 1.652-.602.28 0 .55.037.812.112.261.075.48.191.658.35l-.336.742a1.315 1.315 0 00-.49-.266 1.81 1.81 0 00-.602-.098c-.42 0-.742.117-.966.35-.224.233-.336.579-.336 1.036v1.12l.028.462V18h-.994zm-1.316-6.524v-.826h4.55v.826h-4.55zm8.765 6.594c-.71 0-1.349-.159-1.918-.476a3.636 3.636 0 01-1.33-1.33c-.327-.57-.49-1.218-.49-1.946 0-.737.163-1.386.49-1.946a3.53 3.53 0 011.33-1.316c.56-.317 1.2-.476 1.918-.476.728 0 1.372.159 1.932.476.57.317 1.013.756 1.33 1.316.327.56.49 1.209.49 1.946 0 .728-.163 1.377-.49 1.946a3.5 3.5 0 01-1.33 1.33c-.57.317-1.213.476-1.932.476zm0-.882c.532 0 1.003-.117 1.414-.35.41-.243.733-.579.966-1.008.243-.439.364-.943.364-1.512 0-.579-.121-1.083-.364-1.512a2.477 2.477 0 00-.966-.994 2.7 2.7 0 00-1.4-.364 2.7 2.7 0 00-1.4.364c-.41.233-.737.565-.98.994-.243.43-.364.933-.364 1.512 0 .57.121 1.073.364 1.512.243.43.57.765.98 1.008.41.233.873.35 1.386.35zm5.781.812v-7.35h.952v2.002l-.098-.35c.206-.56.551-.985 1.036-1.274.486-.299 1.088-.448 1.806-.448v.966h-.112a.461.461 0 00-.112-.014c-.774 0-1.381.238-1.82.714-.438.467-.658 1.134-.658 2.002V18h-.994zm8.564.07c-.766 0-1.438-.159-2.016-.476a3.575 3.575 0 01-1.358-1.33c-.327-.57-.49-1.218-.49-1.946s.154-1.372.462-1.932c.317-.56.746-.999 1.288-1.316a3.553 3.553 0 011.848-.49c.69 0 1.302.159 1.834.476.541.308.966.747 1.274 1.316.308.56.462 1.209.462 1.946a.946.946 0 01-.014.154v.154h-6.398v-.742h5.866l-.392.294c0-.532-.117-1.003-.35-1.414a2.462 2.462 0 00-.924-.98c-.392-.233-.845-.35-1.358-.35-.504 0-.957.117-1.358.35-.402.233-.714.56-.938.98-.224.42-.336.9-.336 1.442v.154c0 .56.121 1.055.364 1.484.252.42.597.751 1.036.994.448.233.956.35 1.526.35.448 0 .863-.08 1.246-.238a2.592 2.592 0 001.008-.728l.56.644c-.327.392-.738.69-1.232.896a4.092 4.092 0 01-1.61.308zM85.028 18l4.48-9.8h1.022l4.48 9.8h-1.092l-4.116-9.198h.42L86.106 18h-1.078zm1.764-2.618l.308-.84h5.698l.308.84h-6.314zM96.589 18V9.726c0-.653.192-1.18.574-1.582.383-.401.934-.602 1.652-.602.28 0 .55.037.812.112.261.075.481.191.658.35l-.336.742a1.316 1.316 0 00-.49-.266 1.81 1.81 0 00-.602-.098c-.42 0-.742.117-.966.35-.224.233-.336.579-.336 1.036v1.12l.028.462V18h-.994zm-1.316-6.524v-.826h4.55v.826h-4.55zm8.216 6.594c-.69 0-1.222-.187-1.596-.56-.373-.373-.56-.9-.56-1.582V9.026h.994v6.846c0 .43.108.76.322.994.224.233.542.35.952.35.439 0 .803-.126 1.092-.378l.35.714a1.831 1.831 0 01-.714.392c-.27.084-.55.126-.84.126zm-3.472-6.594v-.826h4.55v.826h-4.55zm9.698 6.594c-.765 0-1.437-.159-2.016-.476a3.575 3.575 0 01-1.358-1.33c-.327-.57-.49-1.218-.49-1.946s.154-1.372.462-1.932c.317-.56.747-.999 1.288-1.316a3.555 3.555 0 011.848-.49c.691 0 1.302.159 1.834.476.541.308.966.747 1.274 1.316.308.56.462 1.209.462 1.946a.98.98 0 01-.014.154v.154h-6.398v-.742h5.866l-.392.294c0-.532-.117-1.003-.35-1.414a2.462 2.462 0 00-.924-.98c-.392-.233-.845-.35-1.358-.35-.504 0-.957.117-1.358.35-.401.233-.714.56-.938.98-.224.42-.336.9-.336 1.442v.154c0 .56.121 1.055.364 1.484.252.42.597.751 1.036.994.448.233.957.35 1.526.35.448 0 .863-.08 1.246-.238a2.592 2.592 0 001.008-.728l.56.644c-.327.392-.737.69-1.232.896a4.091 4.091 0 01-1.61.308zm5.327-.07v-7.35h.952v2.002l-.098-.35c.206-.56.551-.985 1.036-1.274.486-.299 1.088-.448 1.806-.448v.966h-.112a.456.456 0 00-.112-.014c-.774 0-1.381.238-1.82.714-.438.467-.658 1.134-.658 2.002V18h-.994z"
        fill="#fff"
      />
    </Svg>
  )
}

export default SvgComponent
