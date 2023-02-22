import React from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Alert, Modal, Linking, TurboModuleRegistry } from 'react-native'
import { BlurView } from "@react-native-community/blur";
import { Colors } from './styles';
import ModalCloseButton from './Buttons/ModalCloseButton';

export default function AbaciModal({
    children,
    visible,
    onRequestClose,
    ModalHeight = '35%',
    padding = 20,
    blurView = true,
    modalCloseButton = true,
    customStyle = {
        backgroundColor: "white",
        height: ModalHeight,
        width: '90%',
        alignSelf: 'center',
        marginTop: "40%",
        borderRadius: 5,
        elevation: 25,
        borderWidth: 0.5,
        borderColor: Colors.light_gray,
        justifyContent: 'center',
        alignItems: "center",
        padding: padding
    }
}) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onRequestClose}
        >
            <TouchableOpacity
                style={{
                    flex: 1
                }}
                activeOpacity={1}
                onPressOut={onRequestClose}
            >

                {
                    blurView ?
                        <BlurView
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                            }}
                            blurType="dark"
                            blurAmount={10}
                            reducedTransparencyFallbackColor="white"
                        />
                        : null}
                <TouchableWithoutFeedback>
                    <View
                        style={customStyle}>
                        {children}
                        {
                            modalCloseButton ?
                                <ModalCloseButton onPress={onRequestClose} />
                                :
                                null
                        }
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    )
}