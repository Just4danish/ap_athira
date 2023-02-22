import { Image, TouchableOpacity } from 'react-native'
import React from 'react'

export default function ModalCloseButton({
    onPress
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: 20,
                height: 20,
                borderRadius: 10,
                margin: 10,
                justifyContent: "center"
            }}>
            <Image source={require('../../assets/images/close.png')}
                style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'cover'
                }} />
        </TouchableOpacity>
    )
}