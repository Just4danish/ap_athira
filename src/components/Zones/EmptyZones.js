import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import ZoneTagSvg from "./ZoneTagSvg"
import { Colors } from '../styles'
import Line from "./Line"
import NoJobLottie from "./NoJobLottie"
import { globalStyles } from '../styles';

export default function EmptyZones() {
  return (
    <View style = {styles.cardWrapper}>
        <ZoneTagSvg label = {"No Zones"} status={"Entered"} width = {160}/>
        <Line/>
        <NoJobLottie/>
        <Text style={[globalStyles.h2_bold, {
          position:"absolute",
          bottom:30,
          alignSelf:"center"
        }]}>No Zones Found !</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    cardWrapper:{
      backgroundColor:"white",
      height:380,
      width:"90%",
      alignSelf:"center",
      marginTop:100,
      margin:5,
      borderRadius:5,
      borderWidth:1,
      borderColor:Colors.gray,
      paddingTop:5,
    //   elevation:5,
    },
    dateTime:{
        position:"absolute",
        color: Colors.dark_gray,
        fontFamily:"Montserrat-Italic",
        top:15,
        right:20
    },
    restaurentName:{
        color: Colors.dark_gray,
        fontFamily:"Montserrat-ExtraBold",
        marginLeft:20,
    },
    restaurenAddress:{
        color: Colors.dark_gray,
        fontFamily:"Montserrat-Medium",
        marginLeft:40,
        fontSize:14,
    }
  })

