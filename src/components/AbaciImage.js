import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImageView from "react-native-image-viewing";

export default function AbaciImage({
    width = 200,
    height = 200,
    borderWidth = 1,
    borderColor = 'red',
    uri,
    borderRadius = 0,
    noImage = require('../assets/images/noimage.png'),
    showFullScreenOnClick = false
}) {
    const [imageSource, setImageSource] = useState({ uri: uri })
    const [imageWidth, setImageWidth] = useState(0)
    const [imageHeight, setImageHeight] = useState(0)
    const [fullScreenVisible, setFullScreenVisible] = useState(false)
    const isFocused = useIsFocused()
    useEffect(() => {
        if (isFocused) {
            Image.getSize(uri, (imageWidthOriginal, imageHeightOriginal) => {
                if (imageHeightOriginal > imageWidthOriginal) {
                    setImageHeight(height)
                    setImageWidth(imageWidthOriginal / imageHeightOriginal * height)
                }
                else {
                    setImageWidth(width)
                    setImageHeight(imageHeightOriginal / imageWidthOriginal * width)
                }

            })
        }

    }, [isFocused])
    const fullScreenShowHandler = () =>{
        setFullScreenVisible(true)
    }
    return (
        <View
            style={{
                width: width,
                height: height,
                borderColor: borderColor,
                borderWidth: borderWidth,
                borderRadius: borderRadius,
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center'
            }}
            onError={() => setImageSource(noImage)}
        >
            {
                showFullScreenOnClick ?
                    <ImageView
                        images={[imageSource]}
                        imageIndex={0}
                        visible={fullScreenVisible}
                        onRequestClose={() => {
                            setFullScreenVisible(false)
                        }}
                        keyExtractor={(imageSrc, index) => index}
                    />
                    : null
            }
            <TouchableOpacity
            disabled={!showFullScreenOnClick}
            onPress={fullScreenShowHandler}>
                <Image
                    style={{
                        width: imageWidth,
                        height: imageHeight,
                        resizeMode: 'stretch'
                    }}
                    source={imageSource} />
            </TouchableOpacity>
        </View>
    )
}