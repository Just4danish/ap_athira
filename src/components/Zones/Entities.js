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
import EntityCard from './EntityCard';
import EmptyEntities from './EmptyEntities';

export default function Entities({navigation, route}) {
  const [backendLoadingStatus, setBackendLoadingStatus] = useState('success');
  // const [list, setList] = useState(tempJobs)
  const dispatch = useDispatch();
  const inspectorJobContext = useContext(InspectorJobContext);
  const {authAxios} = useContext(AxiosContext);

  const isFocused = useIsFocused();

  const fetchEntityList = id => {
    setBackendLoadingStatus('loading');
    const url = `/inspector_api/entity/${id}`;
    authAxios
      .get(url)
      .then(response => {
        inspectorJobContext.setAllEntitiesForSelectedSubArea(response.data);
        setBackendLoadingStatus('success');
      })
      .catch(error => {
        setBackendLoadingStatus('error');
      });
  };
  const pressHandler = item => {
    navigation.navigate('InspectorEntityDetailsScreen', {
      entityId: item.id,
    });
  };

  useEffect(() => {
    if (isFocused) {
      fetchEntityList(route.params?.entityId);
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
          Entities
        </Text>
        <FlatList
          onRefresh={fetchEntityList}
          data={inspectorJobContext.allEntitiesForSelectedSubArea}
          refreshing={backendLoadingStatus === 'loading'}
          renderItem={({item, index}) => (
            <Animated.View
              entering={BounceInLeft.delay(index * 50)}
              exiting={FadeOutRight.delay(index * 50)}
              key={index}>
              <Pressable onPress={() => pressHandler(item)}>
                <EntityCard item={item} />
              </Pressable>
            </Animated.View>
          )}
          keyExtractor={(item, index) => index}
          ListEmptyComponent={<EmptyEntities />}
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
