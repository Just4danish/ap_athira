import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import CardTagSvg from "./CardTagSvg"
import { Colors } from '../styles'
import Line from "./Line"

export default function JobCard({item}) {
  return (
    <View style = {styles.cardWrapper}>
        <CardTagSvg label = {item.jobId} color={item.jobStatus}/>
        <Text style={styles.dateTime}>{item.createdAt}</Text>
        <Text style={styles.restaurentName}>{item.restrauntName}</Text>
        <Line/>
        <Text style={styles.restaurenAddress}>{item.address}</Text>
        <Text style={styles.restaurenAddress}>No of Traps: {item.noOfTraps}</Text>
        <Text style={styles.restaurenAddress}>{item.capacity} Gallons(Total)</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    cardWrapper:{
      backgroundColor:"white",
      height:180,
      width:"90%",
      alignSelf:"center",
      margin:5,
      borderRadius:5,
      borderWidth:1,
      borderColor:"#d4d4d4"
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

