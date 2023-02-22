import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet, View, Text } from 'react-native';


const NoGreaseTrapLottie = () => {
  const animation = useRef()
  useEffect(() => {
    animation.current.play()
  }, [])
  return (
      <View style={styles.lottie_container}>
        <LottieView
          ref={animation}
          source={require('../../assets/lottie/111398-coupon-code-animation.json')}
        />
      </View>
  );
}

export default NoGreaseTrapLottie;

const styles = StyleSheet.create({
  lottie_container: {
    position:"absolute",
    bottom:20,
    width:"50%",
    height:"50%",
    alignSelf:"center",
    marginTop:20,
  },
});