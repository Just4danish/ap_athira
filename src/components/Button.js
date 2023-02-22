import React from 'react';
import {Pressable, Text, StyleSheet, View} from 'react-native';

export default ({children, onPress, style}) => {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <Text style={[styles.button, style]}>{children}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    color: '#fff',
  },
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    maxWidth: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7B900',
    borderRadius: 25,
  },
});
