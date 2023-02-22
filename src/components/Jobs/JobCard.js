import { View, Text, StyleSheet } from 'react-native'
import React, {useEffect, useState} from 'react'
import CardTagSvg from "./CardTagSvg"
import { Colors } from '../styles'
import Line from "./Line"
import { jobStatusColors } from '../styles'
import moment from 'moment/moment'

export default function JobCard({ item }) {
  return (
    <View style={styles.cardWrapper}>
      <CardTagSvg label={item?.id} color={jobStatusColors[item?.status]} />
      <Text style={styles.dateTime}>{moment(item?.created_date).format('DD-MM-YYYY hh:mm:ss A')}</Text>
      <Text style={styles.restaurentName}>{item?.entity?.establishment_name}</Text>
      <Line />
      {item?.address && <Text style={styles.restaurenAddress}>{item?.address}</Text>}
      {item?.entity?.subarea?.area?.area && <Text style={styles.restaurenAddress}>Sub Area: {item?.entity?.subarea?.area?.area}</Text>}
      {item?.grease_trap_count && <Text style={styles.restaurenAddress}>No of Traps: {item?.grease_trap_count}</Text>}
      {item?.total_gallon_collected && <Text style={styles.restaurenAddress}>{item?.total_gallon_collected} Gallons(Total)</Text>}   
    </View>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: "white",
    height: 180,
    width: "90%",
    alignSelf: "center",
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#d4d4d4"
  },
  dateTime: {
    position: "absolute",
    color: Colors.dark_gray,
    fontFamily: "Montserrat-Italic",
    top: 15,
    right: 20
  },
  restaurentName: {
    color: Colors.dark_gray,
    fontFamily: "Montserrat-ExtraBold",
    marginLeft: 20,
  },
  restaurenAddress: {
    color: Colors.dark_gray,
    fontFamily: "Montserrat-Medium",
    marginLeft: 40,
    fontSize: 14,
  }
})

