import { Text, TouchableOpacity } from 'react-native'
import { globalStyles, buttonColors } from '../styles'
import React from 'react'

export default function ModalButton({
    color,
    onPress,
    label,
    disabled = false
}) {
    return (
        <TouchableOpacity style={{
            width: 100,
            height: 30,
            backgroundColor: disabled ? buttonColors.gray : buttonColors[color],
            borderRadius: 5,
            elevation: 5,
            margin: 10,
            justifyContent: "center"
        }}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[globalStyles.h2_bold, { color: "white" }]}>
                {label}
            </Text>

        </TouchableOpacity>
    )
}