import React from 'react';
import {StyleSheet, Text} from 'react-native';

export default ({children}) => {
  return <Text style={styles.title}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    color: '#777',
    fontWeight: '700',
    fontSize: 16,
    marginTop: 10,
  },
});
