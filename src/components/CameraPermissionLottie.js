import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet, View, Text } from 'react-native';


const CameraPermissionLottie = () => {
  const animation = useRef()
  useEffect(() => {
    animation.current.play()
  }, [])
  return (
      <View style={styles.lottie_container}>
        <LottieView
          ref={animation}
          source={require('../assets/lottie/10568-camera-permission.json')}
        />
      </View>
  );
}

export default CameraPermissionLottie;

const styles = StyleSheet.create({
  lottie_container: {
    position:"absolute",
    top:50,
    width:"70%",
    height:"70%",
    alignSelf:"center",
  },
});