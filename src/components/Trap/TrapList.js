import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import TrapItem from './TrapItem';

export default ({traps}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={traps}
        renderItem={({item}) => <TrapItem trap={item} />}
        keyExtractor={item => item.trapId}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  list: {
    flex: 1,
    minWidth: '100%',
  },
});
