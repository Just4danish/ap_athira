import React from 'react'
import { View,Text,StyleSheet } from 'react-native';

export default function Test({tab}){
    return <View style={styles.container}>
        <Text>Working : {tab}</Text>
    </View>
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ffffff'
    }
})