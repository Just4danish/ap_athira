import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import SubAreaCard from './SubAreaCard';
import {tempJobs} from './tempJobLists';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  color,
  Easing,
  withTiming,
  SlideInRight,
  BounceInRight,
  BounceInLeft,
  FadeOutRight,
} from 'react-native-reanimated';
import EmptyZones from './EmptyZones';
import {useEffect, useContext} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
// import {setJob} from '../../../store/jobSlice'
import {InspectorJobContext} from '../../context/InspectorJobContext';
import {AxiosContext} from '../../context/AxiosContext';
import ScreenWrapper from '../ScreenWrapper';
import {globalStyles} from '../styles';
import EmptySubAreas from './EmptySubAreas';

export default function SubArea({navigation, route}) {
  const [backendLoadingStatus, setBackendLoadingStatus] = useState('success');
  // const [list, setList] = useState(tempJobs)
  const dispatch = useDispatch();
  const inspectorJobContext = useContext(InspectorJobContext);
  const {authAxios} = useContext(AxiosContext);

  const isFocused = useIsFocused();

  const fetchSubAreaList = id => {
    setBackendLoadingStatus('loading');
    const url = `/inspector_api/sub_area/${id}`;
    authAxios
      .get(url)
      .then(response => {
        inspectorJobContext.setAllSubAreaForSelectedArea(response.data);
        setBackendLoadingStatus('success');
      })
      .catch(error => {
        setBackendLoadingStatus('error');
      });
  };
  const pressHandler = item => {
    navigation.navigate('Entities', {
      entityId: item.id,
    });
  };

  useEffect(() => {
    if (isFocused) {
      fetchSubAreaList(route.params?.subAreaId);
    }
  }, [isFocused]);

  return (
    <ScreenWrapper navigationShow={false} sideBarShow={false}>
      <View style={{flex: 1}}>
        <Text
          style={[
            globalStyles.h1_bold,
            {color: 'white', margin: 10, marginTop: 50},
          ]}>
          Sub Areas
        </Text>
        <FlatList
          onRefresh={fetchSubAreaList}
          data={inspectorJobContext.allSubAreaForSelectedArea}
          refreshing={backendLoadingStatus === 'loading'}
          renderItem={({item, index}) => (
            <Animated.View
              entering={BounceInLeft.delay(index * 50)}
              exiting={FadeOutRight.delay(index * 50)}
              key={index}>
              <Pressable onPress={() => pressHandler(item)}>
                <SubAreaCard item={item} />
              </Pressable>
            </Animated.View>
          )}
          keyExtractor={(item, index) => index}
          ListEmptyComponent={<EmptySubAreas />}
          ListFooterComponent={<View style={{height: 150}}></View>}
          ListHeaderComponent={<View style={{height: 20}}></View>}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    // backgroundColor:"red"
  },
});
