import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
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
import { AuthContext } from '../../context/AuthContext';
import baseURL from '../../helpers/baserURL';

// This is the max allowed image to be uploaded

const num_of_max_images = 4
const max_array_with_max_indexes = [...Array(num_of_max_images).keys()]

const defaultAddImage = require('../../assets/images/defaultAddImage.png')
const defaultImage = require('../../assets/images/defaultImage.png')
const defaultImageBW = require('../../assets/images/defaultImageBW.png')

export default function BeforeAndAfterImages({ beforePics, afterPics, setGreaseTraps, greaseTraps, selectedTrap, editPossible }) {
    const authContext = useContext(AuthContext)

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
            imagePickerHandler('camera')
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

    const modalCloseHandler = () => {
        setImagePickerModalVisible(false);
        setPositonForNewImage(null)
    }
    const deleteConfirmModalCloseHandler = () => {
        setIndexOfImageToBeDeleted(null)
        setDeleteAltertVisible(false)
    }


    useEffect(() => {
        let tempState = beforeAfterToggle === 'beforePics' ? [...selectedTrap.item.beforePics] : [...selectedTrap.item.afterPics]
        tempState = tempState.map(item => {
            if (typeof (item.id) === 'number') {
                return { uri: baseURL + item.url }
            }
            else {
                return { uri: item.url }
            }
        })
        setImagesToShow(tempState)
    }, [beforeAfterToggle, greaseTraps])


    const imageSetterForImagePicker = (image) => {
        try {
            const fileName = moment().unix().toString() + image?.assets[0]?.fileName.slice(-10)
            const uri = image?.assets[0]?.uri
            const data = {
                id: fileName,
                name: fileName,
                url: uri,
                image:image?.assets[0]
            }
            let tempPics = [...selectedTrap.item[beforeAfterToggle], data]
            let tempSelectedTrap = { ...selectedTrap.item, [beforeAfterToggle]: tempPics }
            let tempGreaseTraps = [...greaseTraps]
            tempGreaseTraps.splice(selectedTrap.index, 1, tempSelectedTrap)
            setGreaseTraps(tempGreaseTraps)
        }
        catch { }

        modalCloseHandler()
    }

    const imagePickerHandler = async (type) => {
        const selector = type === 'camera' ? launchCamera : launchImageLibrary
        selector({
            cameraType: 'back',
            mediaType: 'photo',
            maxWidth: 1280,
            maxHeight: 720,
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
                    
                        max_array_with_max_indexes.map((item, index) => (<TouchableImage key={index} index={index} selectedTrap={selectedTrap} beforeAfterToggle={beforeAfterToggle} imagePressHandler={imagePressHandler} imageLongPressHandler={imageLongPressHandler} editPossible={editPossible}/>))
                        : null}
                {
                    beforeAfterToggle === 'afterPics' ?
                        max_array_with_max_indexes.map((item, index) => (<TouchableImage key={index} index={index} selectedTrap={selectedTrap} beforeAfterToggle={beforeAfterToggle} imagePressHandler={imagePressHandler} imageLongPressHandler={imageLongPressHandler} editPossible={editPossible}/>))
                        : null}


            </View>
        </View>
    )
}


const TouchableImage = ({ index, selectedTrap, beforeAfterToggle, imagePressHandler, imageLongPressHandler, editPossible }) => {
    const authContext = useContext(AuthContext)
    let tempImage = null
    let tempDisabled = false
    let imageType = 'na'
    const length = beforeAfterToggle === 'beforePics' ? selectedTrap.item.beforePics.length : selectedTrap.item.afterPics.length

    if (index === length && authContext?.authState?.userDetails?.user_type === 'Driver' && editPossible) {
        tempImage = defaultAddImage
        imageType = 'new'
    }
    else {
        try {
            const url = typeof (selectedTrap.item[beforeAfterToggle][index].id) === 'number' ?
                baseURL + selectedTrap.item[beforeAfterToggle][index].url :
                selectedTrap.item[beforeAfterToggle][index].url
            tempImage = { uri: url }
            imageType = 'existing'
        }
        catch {
            // if (authContext?.authState?.userDetails?.user_type === 'Driver') {
                tempImage = defaultImage
                tempDisabled = true
            // }
            // else{
            //     return
            // }

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

}