import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';

const SearchingPropertyAnimation = () => {
  const animation = useRef()
  useEffect(() => {
    animation.current.play()
  }, [])
  return (
      <View style={styles.lottie_container}>
        <LottieView
          ref={animation}
          source={require('../assets/lottie/looking.json')}
        />
      </View>
  );
}

export default SearchingPropertyAnimation;

const styles = StyleSheet.create({
  lottie_container: {
    flex: 2,
    width:"50%",
    alignSelf:"center",
    margin: "15%"
  },
});