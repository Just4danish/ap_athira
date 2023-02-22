import React from 'react';
import {StyleSheet, Text} from 'react-native';

export default ({children, style}) => {
  return <Text style={[styles.id, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  id: {
    backgroundColor: '#F7B900',
    maxWidth: 70,
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#fff',
    fontSize: 16,
  },
});
