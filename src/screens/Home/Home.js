import React from 'react';
import {StyleSheet, View} from 'react-native';

// import JobList from '../../components/Job/JobList';

import {createStackNavigator} from '@react-navigation/stack';
// import Job from '../Job/Job';

const Stack = createStackNavigator();

// function MyStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="MyJobs" component={JobList} />
//       {/* <Stack.Screen name="Job Details" component={Job} /> */}
//     </Stack.Navigator>
//   );
// }

export default () => {
  return (
    <View style={styles.container}>
      {/* <MyStack /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
