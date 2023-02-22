import {View, Text, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import VehicleTagSvg from './VehicleTagSvg';
import {Colors} from '../styles';
import Line from './Line';
import moment from 'moment/moment';
import {vehicleStatusColors} from '../styles';

export default function VehicleCard({item}) {
  const [color, setColor] = useState(vehicleStatusColors['Entered']);

  useEffect(() => {
    let tempColor = vehicleStatusColors['Entered'];
    if (item.current_status !== 'Entered') {
      tempColor = vehicleStatusColors[item.operator_acceptance];
    }

    setColor(tempColor);
  }, [item.current_status]);
  return (
    <View style={styles.cardWrapper}>
      <VehicleTagSvg label={item.vehicle?.vehicle_no} color={color} />
      <Text style={styles.dateTime}>
        {moment(item.entry_time).format('DD-MM-YYYY hh:mm:ss A')}
      </Text>
      <Text style={styles.restaurentName}>{item?.driver?.full_name}</Text>
      <Line />
      <Text
        style={[
          styles.restaurenAddress,
          {
            fontFamily: 'Montserrat-Bold',
          },
        ]}>
        {item.gtcc.establishment_name}
      </Text>
      {/* <Text style={styles.restaurenAddress}>Vehicle Type: {item?.vehicle.vehicle_type}</Text> */}
      <Text style={styles.restaurenAddress}>
        {item.total_gallon_collected} Gallons(Total)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: 'white',
    height: 180,
    width: '90%',
    alignSelf: 'center',
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d4d4d4',
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
