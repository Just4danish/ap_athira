import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import ZoneTagSvg from './ZoneTagSvg';
import {Colors, globalStyles} from '../styles';
import Line from './Line';
import {useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function EntityCard({item}) {
  return (
    <View style={styles.cardWrapper}>
      <View style={styles.cardInsideWrapper}>
        <View
          style={{
            height: 20,
            width: 20,
            borderRadius: 10,
            backgroundColor: '#6CE679',
            position: 'absolute',
            right: 20,
            top: -8,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name="check-bold" size={15} color={'white'} />
        </View>
        <View
          style={{
            height: '100%',
            width: '90%',
            alignItems: 'flex-start',
            paddingTop: 14,
            paddingBottom: 14,
            paddingLeft: 40,
            justifyContent: 'space-evenly',
          }}>
          <View
            style={{
              borderBottomColor: Colors.gray,
              borderBottomWidth: 0.5,
              width: '100%',
              alignItems: 'flex-start',
            }}>
            <Text
              style={[globalStyles.h1_bold, {fontSize: 16}]}
              numberOfLines={1}>
              {item.establishment_name}
            </Text>
          </View>
          <Text style={[globalStyles.h2_regular, {fontSize: 14}]}>
            {/* TODO the value for entity shall be updated from the backend data */}
            5 Grease Traps
          </Text>
          <Text style={[globalStyles.h2_regular, {fontSize: 14}]}>
            {/* TODO the value for entity shall be updated from the backend data */}
            6 Fixtures
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: '#FF4444',
    height: 122,
    width: '90%',
    alignSelf: 'center',
    margin: 5,
    borderRadius: 5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    flexDirection: 'row',
    paddingTop: 12,
  },
  cardInsideWrapper: {
    backgroundColor: 'white',
    height: 110,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    flexDirection: 'row',
  },
  dateTime: {
    position: 'absolute',
    color: Colors.dark_gray,
    fontFamily: 'Montserrat-Italic',
    top: 10,
    right: 20,
  },
  restaurentName: {
    color: Colors.dark_gray,
    fontFamily: 'Montserrat-ExtraBold',
    marginLeft: 20,
  },
  restaurenAddress: {
    color: Colors.dark_gray,
    fontFamily: 'Montserrat-Medium',
    marginLeft: 40,
    margin: 3,
    fontSize: 14,
  },
});
