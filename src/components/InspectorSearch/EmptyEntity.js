import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '../styles'
import NoJobLottie from "../Zones/NoJobLottie"
import { globalStyles } from '../styles';

export default function EmptyEntity() {
  return (
    <View style = {styles.cardWrapper}>
        <NoJobLottie/>
        <Text style={[globalStyles.h2_bold, {
          position:"absolute",
          bottom:30,
          alignSelf:"center"
        }]}>No Results Found !</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: "white",
    height: 380,
    width: "90%",
    alignSelf: "center",
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#d4d4d4",
  },
  heading_wrapper: {
    width: '90%',
    height: 60,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: "#d4d4d4",
    alignSelf: 'center'
  },
  body_wrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignSelf: 'center',
    padding:20,
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
    margin: 20,
  },
  restaurenAddress: {
    color: Colors.dark_gray,
    fontFamily: "Montserrat-Medium",
    marginLeft: 20,
    margin: 3,
    fontSize: 14,
  }
})

