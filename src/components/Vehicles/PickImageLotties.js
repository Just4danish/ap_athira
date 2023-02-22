import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet, View, Text } from 'react-native';


export const CamLottie = () => {
  const animation = useRef()
  useEffect(() => {
    animation.current.play()
  }, [])
  return (
      <View style={styles.lottie_container}>
        <LottieView
          ref={animation}
          source={require('../../assets/lottie/60265-digital-camera.json')}
        />
      </View>
  );
}

export const GalleryLottie = () => {
  const animation = useRef()
  useEffect(() => {
    animation.current.play()
  }, [])
  return (
      <View style={styles.lottie_container}>
        <LottieView
          ref={animation}
          source={require('../../assets/lottie/20431-cloud-storage.json')}
        />
      </View>
  );
}



const styles = StyleSheet.create({
  lottie_container: {
    // position:"absolute",
    // top:50,
    width:"100%",
    height:"100%",
    alignSelf:"center",
  },
});