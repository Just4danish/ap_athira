import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import CardTagSvg from "./CardTagSvg"
import { Colors } from '../styles'
import Line from "./Line"
import NoJobLottie from "./NoJobLottie"
import { globalStyles } from '../styles';

export default function EmptyJob() {
  return (
    <View style = {styles.cardWrapper}>
        <CardTagSvg label = {"No jobs"} color={"red"}/>
        <Line/>
        <NoJobLottie/>
        <Text style={[globalStyles.h2_bold, {
          position:"absolute",
          bottom:30,
          alignSelf:"center"
        }]}>No Jobs Found !</Text>
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

