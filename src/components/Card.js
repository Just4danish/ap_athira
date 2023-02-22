import React from 'react';
import {StyleSheet, View} from 'react-native';

export default ({children, style}) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: '#FFF',
    elevation: 4,
  },
});
