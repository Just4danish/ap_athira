import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';

const QRCodeLottie = () => {
  const animation = useRef()
  useEffect(() => {
    animation.current.play()
  }, [])
  return (
      <View style={styles.lottie_container}>
        <LottieView
          ref={animation}
          source={require('../../assets/lottie/115818-qrcode.json')}
        />
      </View>
  );
}

export default QRCodeLottie;

const styles = StyleSheet.create({
  lottie_container: {
    position:"absolute",
    top:10,
    width:"50%",
    height:"20%",
    alignSelf:"center",
  },
});