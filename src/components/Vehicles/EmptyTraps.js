import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import TrapTagSvg from "./TrapTagSvg"
import { Colors } from '../styles'
import Line from "./Line"
import NoGreaseTrapLottie from "./NoGreaseTrapLottie"
import { globalStyles } from '../styles';

export default function EmptyTraps() {
  return (
    <View style = {styles.cardWrapper}>
        <TrapTagSvg label = {"No Grease Traps Found"} color={"red"}/>
        <Line/>
        <NoGreaseTrapLottie/>
        <Text style={[globalStyles.h2_bold, {
          position:"absolute",
          bottom:30,
          alignSelf:"center"
        }]}>No Grease Traps Found !</Text>
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
      borderColor:Colors.gray
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

