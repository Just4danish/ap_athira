import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';

const TruckLottie = (props) => {
  const animation = useRef()
  useEffect(() => {
    animation.current.play()
  }, [])
  return (
      <View style={styles.lottie_container}>
        <LottieView
          ref={animation}
          source={require('../../assets/lottie/83323-truck.json')}
        />
      </View>
  );
}

export default TruckLottie;

const styles = StyleSheet.create({
  lottie_container: {
    flex: 2,
    width:"80%",
    alignSelf:"center",
    margin: "15%"
  },
});