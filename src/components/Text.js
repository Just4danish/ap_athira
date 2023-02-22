import React from 'react';
import {StyleSheet, Text} from 'react-native';

export default ({children, style}) => {
  return <Text style={[styles.text, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: '#000',
    fontSize: 14,
  },
});
