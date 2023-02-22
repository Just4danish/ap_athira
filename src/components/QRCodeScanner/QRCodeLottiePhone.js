import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';

const QRCodeLottiePhone= () => {
  const animation = useRef()
  useEffect(() => {
    animation.current.play()
  }, [])
  return (
      <View style={styles.lottie_container}>
        <LottieView
          ref={animation}
          source={require('../../assets/lottie/41279-qr-code-mobile-yellow.json')}
        />
      </View>
  );
}

export default QRCodeLottiePhone;

const styles = StyleSheet.create({
  lottie_container: {
    flex: 2,
    width:"80%",
    alignSelf:"center",
    margin: "15%"
  },
});