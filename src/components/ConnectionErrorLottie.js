import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';

const ConnectionErrorLottie = () => {
  const animation = useRef()
  useEffect(() => {
    animation.current.play()
  }, [])
  return (
    <View style={styles.lottie_container}>
      <LottieView
        ref={animation}
        source={require('../assets/lottie/90517-connection-error.json')}
      />
    </View>
  );
}

export default ConnectionErrorLottie;

const styles = StyleSheet.create({
  lottie_container: {
    width:200,
    height:150,
    position:"absolute",
    bottom:100,
    alignSelf:"center"
  },
});
