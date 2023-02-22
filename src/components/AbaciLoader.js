import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet, View, Modal } from 'react-native';
import { BlurView } from "@react-native-community/blur";

const AbaciLoader = (props) => {
  const animation = useRef()
  useEffect(() => {
    animation?.current?.play()
  }, [props.visible])
  return (
    <Modal
      // animationType="slide"
      transparent={true}
      visible={props.visible}
    // onRequestClose={couponModalCloseHandler}
    >
      <BlurView
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      />
      <View style={styles.lottie_container}>
        <LottieView
          ref={animation}
          source={require('../assets/lottie/loader.json')}
        />
      </View>
    </Modal>
  );
}

export default AbaciLoader;

const styles = StyleSheet.create({
  lottie_container: {
    flex: 2,
    width: "50%",
    alignSelf: "center",
    margin: "15%",
  },
});