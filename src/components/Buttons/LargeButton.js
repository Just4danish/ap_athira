import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'

export default function LargeButton({
    onPress,
    label,
    color = "#F8A836",
    rippleColor = 'yellow'
}) {
  return (
    <View style={[styles.button, {backgroundColor:color}]}>
    <Pressable
        onPress={onPress}
        android_ripple={{ color: rippleColor, borderless: true }}
    >
        <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
</View>
  )
}


const styles = StyleSheet.create({
    button: {
        width: 200,
        height: 50,
        borderRadius: 50,
        elevation: 5,
        justifyContent: "center",
        marginTop: 15,
        alignSelf:'center'
    },
    buttonLabel: {
        fontFamily: "Montserrat-Bold",
        color: 'ffffff',
        fontSize: 16,
        alignSelf: 'center',
        justifyContent: "center",
    },

})
