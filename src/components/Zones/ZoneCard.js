import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import ZoneTagSvg from './ZoneTagSvg';
import {Colors} from '../styles';
import Line from './Line';
import {globalStyles} from '../styles';

export default function ZoneCard({item}) {
  return (
    <View style={styles.cardWrapper}>
      <View
        style={{
          height: '100%',
          width: '70%',
          alignItems: 'flex-start',
          justifyContent: 'space-evenly',
          paddingTop: 14,
          paddingBottom: 14,
          paddingLeft: 40,
        }}>
        <View
          style={{
            borderBottomColor: Colors.gray,
            borderBottomWidth: 0.5,
            width: '100%',
            alignItems: 'flex-start',
          }}>
          <Text style={[globalStyles.h1_bold, {fontSize: 16}]}>
            {item.zone_no} - {item.zone_name}
          </Text>
        </View>
        {/* <Text style={[globalStyles.h2_regular, {fontSize: 14}]}>
          {item.sub_area_count} Sub Areas
        </Text> */}
        <Text style={[globalStyles.h2_regular, {fontSize: 14}]}>
          {/* TODO the value for entity shall be updated from the backend data */}
          {item.area_count} Areas
        </Text>
        <Text style={[globalStyles.h2_regular, {fontSize: 14}]}>
          {/* TODO the value for entity shall be updated from the backend data */}
          {item.sub_area_count} Sub Areas
        </Text>
        <Text style={[globalStyles.h2_regular, {fontSize: 14}]}>
          {/* TODO the value for entity shall be updated from the backend data */}
          29 Entities
        </Text>
      </View>
      <View
        style={{
          height: '100%',
          width: '30%',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: '#4D8D3D',
            height: 21,
            width: 56,
            borderRadius: 3,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={[
              globalStyles.h3_bold,
              {
                color: 'white',
              },
            ]}>
            {/* TODO the value for entity shall be updated from the backend data */}
            300
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#FB9D10',
            height: 21,
            width: 56,
            borderRadius: 3,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={[
              globalStyles.h3_bold,
              {
                color: 'white',
              },
            ]}>
            {/* TODO the value for entity shall be updated from the backend data */}
            400
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#FF4444',
            height: 21,
            width: 56,
            borderRadius: 3,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={[
              globalStyles.h3_bold,
              {
                color: 'white',
              },
            ]}>
            {/* TODO the value for entity shall be updated from the backend data */}
            600
          </Text>
          {/* <View
          style={{
            borderBottomColor: Colors.gray,
            borderBottomWidth: 0.5,
            width: '100%',
            alignItems: 'flex-start',
          }}>
          <Text style={[globalStyles.h1_bold, {fontSize: 16}]}>
            {item.zone_no} - {item.zone_name}
          </Text>
        </View> */}
          {/* <View
          style={{
            backgroundColor: '#EA4772',
            height: 68,
            width: 68,
            borderRadius: 50,
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <Text style={[globalStyles.h1_bold, {color: 'white', fontSize: 24}]}>
            {item.zone_no}
          </Text>
        </View> */}
        </View>
        {/* <View
        style={{
          height: '100%',
          width: '40%',
          alignItems: 'flex-start',
          justifyContent: 'space-evenly',
          paddingTop: 14,
          paddingBottom: 14,
        }}>
        <Text style={[globalStyles.h2_regular, {fontSize: 14}]}>
          {item.area_count} Areas
        </Text>
        <Text style={[globalStyles.h2_regular, {fontSize: 14}]}>
          {item.sub_area_count} Sub Areas
        </Text>
        <Text style={[globalStyles.h2_regular, {fontSize: 14}]}> */}
        {/* TODO the value for entity shall be updated from the backend data */}
        {/* 29 Entities
        </Text>
      </View>
      <View
        style={{
          height: '100%',
          width: '30%',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: '#4D8D3D',
            height: 21,
            width: 56,
            borderRadius: 3,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={[
              globalStyles.h3_bold,
              {
                color: 'white',
              },
            ]}> */}
        {/* TODO the value for entity shall be updated from the backend data */}
        {/* 14000
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#FB9D10',
            height: 21,
            width: 56,
            borderRadius: 3,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={[
              globalStyles.h3_bold,
              {
                color: 'white',
              },
            ]}> */}
        {/* TODO the value for entity shall be updated from the backend data */}
        {/* 14000
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#FF4444',
            height: 21,
            width: 56,
            borderRadius: 3,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={[
              globalStyles.h3_bold,
              {
                color: 'white',
              },
            ]}> */}
        {/* TODO the value for entity shall be updated from the backend data */}
        {/* 14000
          </Text>
        </View> */}
      </View>

      {/* <ZoneTagSvg label = {item.zone_no} 
        // status={}
        /> */}
      {/* {/* <Text style={styles.dateTime}>{item.rfid_detected_time}</Text> */}
      {/* <Text style={styles.restaurentName}>{item?.zone_name}</Text>
      <Line />
      <Text style={styles.restaurenAddress}>
        Number of Areas: {item.area_count}
      </Text>
      <Text style={styles.restaurenAddress}>
        Number of Sub Areas: {item.sub_area_count}
      </Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: 'white',
    height: 122,
    width: '90%',
    alignSelf: 'center',
    margin: 5,
    borderRadius: 5,
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
