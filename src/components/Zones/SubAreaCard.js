import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import ZoneTagSvg from './ZoneTagSvg';
import {Colors, globalStyles} from '../styles';
import Line from './Line';

export default function SubAreaCard({item}) {
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
            {item.sub_area}
          </Text>
        </View>
        {/* <Text style={[globalStyles.h2_regular, {fontSize: 14}]}>
          {item.sub_area_count} Sub Areas
        </Text> */}
        <Text style={[globalStyles.h2_regular, {fontSize: 14}]}>
          {/* TODO the value for entity shall be updated from the backend data */}
          {item.entity.total_count} Entities
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
        </View>
        {/* <ZoneTagSvg label = {item.id} 
        status={}
        />
         <Text style={styles.dateTime}>{item.rfid_detected_time}</Text> 
        <Text style={styles.restaurentName}>{item?.area}</Text>
        <Line/>
        <Text style={styles.restaurenAddress}>Number of Sub Areas: {item.sub_area_count}</Text> */}
      </View>

      {/* <ZoneTagSvg label = {item.id} 
        status={}
        />
        <Text style={styles.dateTime}>{item.rfid_detected_time}</Text>
        <Text style={styles.restaurentName}>{item?.sub_area}</Text>
        <Line/>
        <Text style={styles.restaurenAddress}>Number of Entities: {item.entity_count}</Text> */}
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
