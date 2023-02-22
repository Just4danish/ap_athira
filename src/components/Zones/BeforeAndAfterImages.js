import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import BeforeAfterSvg from './BeforeAfterSvg'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated'
import ImageView from "react-native-image-viewing";
import { Colors, globalStyles } from '../styles';
import { CamLottie, GalleryLottie } from './PickImageLotties';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import moment from 'moment/moment';
// import AwesomeAlert from 'react-native-awesome-alerts';
import { BlurView } from "@react-native-community/blur";
import _ from 'lodash'

// This is the max allowed image to be uploaded

const num_of_max_images = 4
const max_array_with_max_indexes = [...Array(num_of_max_images).keys()]

const defaultAddImage = require('../../assets/images/defaultAddImage.png')
const defaultImage = require('../../assets/images/defaultImage.png')
const defaultImageBW = require('../../assets/images/defaultImageBW.png')

export default function BeforeAndAfterImages({ beforePics, afterPics, setGreaseTraps, greaseTraps, selectedTrap }) {
    const [visible, setIsVisible] = useState(false);
    const [beforeAfterToggle, setBeforeAfterToggle] = useState('beforePics')
    const [beforePicsState, setBeforePicsState] = useState([])
    const [afterPicsState, setAfterPicsState] = useState([])
    const [imagesToShow, setImagesToShow] = useState([])
    const [imagesIndexToShow, setImagesIndexToShow] = useState([])
    const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false)
    const [positonForNewImage, setPositonForNewImage] = useState(null)
    const [deleteAltertVisible, setDeleteAltertVisible] = useState(false)
    const [indexOfImageToBeDeleted, setIndexOfImageToBeDeleted] = useState(null)
    // const imageSetter = (picArray) => {
    //     let fistAddImageAdded = false
    //     let tempState = []
    //     for (let i = 0; i < 4; i++) {
    //         let item = null
    //         try {
    //             const tempUrl = picArray[i].url === null ? defaultImageBW : { uri: picArray[i].url }
    //             item = { ...picArray[i], url: tempUrl }
    //         }
    //         catch {
    //             if (fistAddImageAdded) {
    //                 item = { id: `${i}${moment().unix().toString()}`, name: `defaultImage.png`, url: defaultImage }
    //             }
    //             else {
    //                 item = { id: `${i}${moment().unix().toString()}`, name: `defaultAddImage.png`, url: defaultAddImage }
    //                 fistAddImageAdded = true
    //             }
    //         }
    //         tempState.push(item)
    //     }
    //     return tempState
    // }
    // useEffect(() => {
    //     setBeforePicsState(imageSetter(beforePics))
    // }, [beforePics])
    // useEffect(() => {
    //     setAfterPicsState(imageSetter(afterPics))
    // }, [afterPics])

    const imagePressHandler = (imageType, item, index) => {
        // first lets check the pressed item is a file url or default image locally loaded.
        if (imageType === 'existing') {
            setIsVisible(true)
            setImagesIndexToShow(index)
        }
        else {
            const data = {
                type: beforeAfterToggle,
                index: index,
                item: item
            }
            setPositonForNewImage(data)
            setImagePickerModalVisible(true)
        }

    }
    const imageDeleteHandler = () => {
        let tempPics = [...selectedTrap.item[beforeAfterToggle]]
        tempPics.splice(indexOfImageToBeDeleted, 1)
        let tempSelectedTrap = { ...selectedTrap.item, [beforeAfterToggle]: tempPics }
        let tempGreaseTraps = [...greaseTraps]
        tempGreaseTraps.splice(selectedTrap.index, 1, tempSelectedTrap)
        setGreaseTraps(tempGreaseTraps)
        setIndexOfImageToBeDeleted(null)
        setDeleteAltertVisible(false)
    }
    const imageLongPressHandler = (item, index) => {
        // if (item.name !== 'defaultAddImage.png') {
        setDeleteAltertVisible(true)
        setIndexOfImageToBeDeleted(index)
        // }
        // const data
    }

    const imagesToShowMaker = (images) => {

        let tempImages = []
        for (let i = 0; i < images.length; i++) {
            tempImages = [...tempImages, { uri: images[i].url }]
        }
        return tempImages

    }
    const modalCloseHandler = () => {
        setImagePickerModalVisible(false);
        setPositonForNewImage(null)
    }
    const deleteConfirmModalCloseHandler = () => {
        setIndexOfImageToBeDeleted(null)
        setDeleteAltertVisible(false)
    }


    useEffect(() => {
        const tempState = beforeAfterToggle === 'beforePics' ? [...selectedTrap.item.beforePics] : [...selectedTrap.item.afterPics]
        setImagesToShow(imagesToShowMaker(tempState))
    }, [beforeAfterToggle, greaseTraps])


    const imageSetterForImagePicker = (image) => {
        const fileName = moment().unix().toString() + image?.assets[0]?.fileName.slice(-10)
        const uri = image?.assets[0]?.uri
        const data = {
            id: fileName,
            name: fileName,
            url: uri
        }
        let tempPics = [...selectedTrap.item[beforeAfterToggle], data]
        let tempSelectedTrap = { ...selectedTrap.item, [beforeAfterToggle]: tempPics }
        let tempGreaseTraps = [...greaseTraps]
        tempGreaseTraps.splice(selectedTrap.index, 1, tempSelectedTrap)
        setGreaseTraps(tempGreaseTraps)
        modalCloseHandler()
    }

    const imagePickerHandler = async (type) => {
        const selector = type === 'camera' ? launchCamera : launchImageLibrary
        selector({
            mediaType: 'photo',
            maxWidth: 1280,
            maxHeight: 720,
            cameraType: 'back',
        },
            imageSetterForImagePicker
        )
    }


    return (
        <View>
            <ImageView
                images={imagesToShow}
                imageIndex={imagesIndexToShow}
                visible={visible}
                onRequestClose={() => {
                    setIsVisible(false)
                }}
                keyExtractor={(imageSrc, index) => index}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteAltertVisible}
                onRequestClose={deleteConfirmModalCloseHandler}

            >
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

                <View
                    style={{
                        backgroundColor: "white",
                        height: '50%',
                        width: '90%',
                        alignSelf: 'center',
                        marginTop: "40%",
                        borderRadius: 5,
                        elevation: 25,
                        borderWidth: 0.5,
                        borderColor: Colors.light_gray,
                        justifyContent: 'center'
                    }}>
                    <TouchableOpacity onPress={deleteConfirmModalCloseHandler} style={{ position: "absolute", right: 0, top: 0, borderWidth: 1, width: 20, height: 20, borderRadius: 10, borderColor: Colors.light_gray, margin: 10, justifyContent: "center" }}>
                        <Text style={globalStyles.h2_bold}>X</Text>
                    </TouchableOpacity>
                    <Animated.Image
                        entering={FadeIn}
                        style={{
                            width: '50%',
                            height: '50%',
                            resizeMode: "contain",
                            margin: 10,
                            borderRadius: 5,
                            borderWidth: 0.5,
                            borderColor: "gray",
                            alignSelf: 'center'
                        }}
                        source={imagesToShow[indexOfImageToBeDeleted]} />
                    <Text style={globalStyles.h2_bold}>
                        Are you sure to delete the above image?
                    </Text>
                    <View style={{
                        flexDirection: "row",
                        alignContent: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity style={{
                            width: 100,
                            height: 30,
                            backgroundColor: '#9bc5a0',
                            borderRadius: 5,
                            elevation: 5,
                            margin: 10,
                            justifyContent: "center"
                        }}
                            onPress={deleteConfirmModalCloseHandler}>
                            <Text style={[globalStyles.h2_bold, { color: "white" }]}>
                                Cancel
                            </Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            width: 100,
                            height: 30,
                            backgroundColor: '#d67171',
                            borderRadius: 5,
                            elevation: 5,
                            margin: 10,
                            justifyContent: "center"
                        }}
                            onPress={imageDeleteHandler}>
                            <Text style={[globalStyles.h2_bold, { color: "white" }]}>
                                Confirm
                            </Text>

                        </TouchableOpacity>


                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={imagePickerModalVisible}
                onRequestClose={modalCloseHandler}

            >
                <BlurView
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                    }}
                    blurType="dark"
                    blurAmount={5}
                    reducedTransparencyFallbackColor="white"
                />
                <View
                    style={{
                        backgroundColor: "white",
                        height: '30%',
                        width: '90%',
                        alignSelf: 'center',
                        marginTop: "40%",
                        borderRadius: 5,
                        elevation: 25,
                        borderWidth: 0.5,
                        borderColor: Colors.light_gray,
                    }}>
                    <TouchableOpacity onPress={modalCloseHandler} style={{ position: "absolute", right: 0, top: 0, borderWidth: 1, width: 20, height: 20, borderRadius: 10, borderColor: Colors.light_gray, margin: 10, justifyContent: "center" }}>
                        <Text style={globalStyles.h2_bold}>X</Text>
                    </TouchableOpacity>
                    <Text
                        style={[globalStyles.h2_bold,
                        {
                            marginTop: 30, margin: 10
                        }]}>Please select the images from Camera or Gallery !</Text>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity
                            onPress={() => imagePickerHandler('camera')}
                            style={{
                                width: '35%',
                                height: '50%',
                                alignSelf: "center",
                                borderWidth: 1,
                                borderColor: Colors.light_gray,
                                borderRadius: 5,
                                margin: "5%"
                            }}>
                            <CamLottie />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => imagePickerHandler('gallery')}
                            style={{
                                width: '35%',
                                height: '50%',
                                alignSelf: "center",
                                borderWidth: 1,
                                borderColor: Colors.light_gray,
                                margin: "5%",
                                borderRadius: 5,
                            }}>
                            <GalleryLottie />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={{
                // backgroundColor: "black",
                width: "80%",
                height: 25,
                flexDirection: "row",
                borderBottomColor: "#A19D9D",
                borderBottomWidth: 0.5,
                margin: "10%",
                marginTop: 5,
                marginBottom: 5,
            }}>
                <TouchableOpacity style={{
                    backgroundColor: beforeAfterToggle === 'beforePics' ? "#66B552" : "#A19D9D",
                    width: "30%",
                    height: 25,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: beforeAfterToggle === 'beforePics' ? 3 : 0,
                    borderTopLeftRadius: 10
                }}
                    onPress={() => setBeforeAfterToggle('beforePics')}
                >
                    <Text
                        style={{
                            fontFamily: "Montserrat-Medium"
                        }}
                    >Before</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    backgroundColor: beforeAfterToggle === 'afterPics' ? "#66B552" : "#A19D9D",
                    width: "30%",
                    height: 25,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: beforeAfterToggle === 'beforePics' ? 3 : 0,
                    borderTopRightRadius: 10
                }}
                    onPress={() => setBeforeAfterToggle('afterPics')}
                >
                    <Text
                        style={{
                            fontFamily: "Montserrat-Medium"
                        }}
                    >After</Text>

                </TouchableOpacity>
            </View>
            <View style={{
                width: "100%",
                height: 100,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {
                    beforeAfterToggle === 'beforePics' ?
                    max_array_with_max_indexes.map((item, index) => {
                        let tempImage = null
                        let tempDisabled = false
                        let imageType = 'na'
                        if (index === selectedTrap.item.beforePics.length) {
                            tempImage = defaultAddImage
                            imageType = 'new'
                        }
                        else {
                            try {
                                tempImage = { uri: selectedTrap.item[beforeAfterToggle][index].url }
                                imageType = 'existing'
                            }
                            catch {
                                tempImage = defaultImage
                                tempDisabled = true
                            }
                        }

                        return (
                            <TouchableOpacity
                                disabled={tempDisabled}
                                key={index}
                                onPress={() => imagePressHandler(imageType, tempImage, index)}
                                onLongPress={() => imageType === 'new' ? null : imageLongPressHandler(tempImage, index)}
                            >
                                <Animated.Image
                                    entering={FadeIn}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        resizeMode: "contain",
                                        margin: 10,
                                        borderRadius: 5,
                                        borderWidth: 0.5,
                                        borderColor: "gray"
                                    }}
                                    source={tempImage} />
                            </TouchableOpacity>)
                //     })
                })
                :null}
                                {
                    beforeAfterToggle === 'afterPics' ?
                    max_array_with_max_indexes.map((item, index) => {
                        let tempImage = null
                        let tempDisabled = false
                        let imageType = 'na'
                        if (index === selectedTrap.item.afterPics.length) {
                            tempImage = defaultAddImage
                            imageType = 'new'
                        }
                        else {
                            try {
                                tempImage = { uri: selectedTrap.item[beforeAfterToggle][index].url }
                                imageType = 'existing'
                            }
                            catch {
                                tempImage = defaultImage
                                tempDisabled = true
                            }
                        }

                        return (
                            <TouchableOpacity
                                disabled={tempDisabled}
                                key={index}
                                onPress={() => imagePressHandler(imageType, tempImage, index)}
                                onLongPress={() => imageType === 'new' ? null : imageLongPressHandler(tempImage, index)}
                            >
                                <Animated.Image
                                    entering={FadeIn}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        resizeMode: "contain",
                                        margin: 10,
                                        borderRadius: 5,
                                        borderWidth: 0.5,
                                        borderColor: "gray"
                                    }}
                                    source={tempImage} />
                            </TouchableOpacity>)
                //     })
                })
                :null}


            </View>
        </View>
    )
}