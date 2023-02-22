import { View, Text, StyleSheet, Animated } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../styles'
import Line from "../Vehicles/Line"
import CouponTagSvg from './CouponTagSvg'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ImageView from "react-native-image-viewing";
import NoCouponsLottie from './NoCouponsLottie'

const backgroundImage = require('../../assets/images/bg_images_login.jpg');

export default function EmptyVehicles() {
  return (
    <View style={styles.cardWrapper}>
      <CouponTagSvg label={'No Coupons'} /> 
      <Line />
      <Text style={styles.restaurentName}>Please add the Coupons here !</Text>
      <NoCouponsLottie/>
    </View>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: "white",
    height: 260,
    width: "90%",
    alignSelf: "center",
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#d4d4d4"
  },
  imageWrapper: {
    backgroundColor: "white",
    height: 108,
    width: 192,
    alignSelf: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.light_gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10

  },
  dateTime: {
    position: "absolute",
    color: Colors.dark_gray,
    fontFamily: "Montserrat-Italic",
    top: 10,
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
    margin: 3,
    fontSize: 14,
  }
})

