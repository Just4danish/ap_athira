import React from 'react';
import {useState, useEffect} from 'react';
import {StyleSheet, View, Pressable, Animated} from 'react-native';
import Button from '../Button';
import Card from '../Card';
import JobId from '../JobId';
import Text from '../Text';

export default ({trap}) => {
  const [expanded, setExpanded] = useState(false);
  const [height] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(height, {
      toValue: expanded ? 330 : 0,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [expanded, height]);
  return (
    <Card style={styles.card}>
      <Pressable
        android_ripple={{color: '#ccc'}}
        onPress={() => setExpanded(expanded => !expanded)}>
        <View style={{marginBottom: 10}}>
          <JobId style={{maxWidth: 100}}>{trap.trapId}</JobId>
        </View>
        <View style={{paddingHorizontal: 20, paddingBottom: 5}}>
          <Text>{trap.material} trap</Text>
          <Text>{trap.brand}</Text>
          <Text>{trap.capacity} (Total Capacity)</Text>
        </View>
      </Pressable>

      <Animated.View
        style={[
          {
            paddingHorizontal: 0,
            paddingTop: 5,
            paddingBottom: 5,
            overflow: 'hidden',
          },
          {height},
        ]}>
        {expanded && (
          <View style={{marginTop: 10}}>
            <View style={styles.container}>
              <Text style={{width: 55, alignItems: 'center'}}>BEFORE</Text>
              <View style={styles.square} />
              <View style={styles.square} />
              <View style={styles.square} />
              <View style={styles.square} />
            </View>
            <View style={styles.container}>
              <Text style={{width: 55, alignItems: 'center'}}>AFTER</Text>
              <View style={styles.square} />
              <View style={styles.square} />
              <View style={styles.square} />
              <View style={styles.square} />
            </View>
          </View>
        )}
        <View>
          <View>
            <Text>Grease Tap Condition</Text>
          </View>
          <View>
            <Text>Waste & Contents</Text>
          </View>
          <View>
            <Text>Cover Condition</Text>
          </View>
          <View>
            <Text>Buffle Wall Condition</Text>
          </View>
          <View>
            <Text>Outlet Elbow Condition</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Button>Skipped</Button>
          <Button>Partial</Button>
          <Button>Completed</Button>
        </View>
      </Animated.View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10,
    width: '100%',
  },
  square: {
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 4,
    borderRadius: 5,
  },
  actions: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
