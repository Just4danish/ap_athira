import { View, Text, StyleSheet, Animated, Image } from 'react-native'
import React, { useContext, useEffect, useState, useRef } from 'react'
import { Colors, globalStyles, couponColors } from '../styles'
import Line from "../Vehicles/Line"
import CouponTagSvg from './CouponTagSvg'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ImageView from "react-native-image-viewing";
import baseURL from '../../helpers/baserURL'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AbaciModal from '../AbaciModal'
import ModalButton from '../Buttons/ModalButton'
import { AxiosContext } from '../../context/AxiosContext'
import AbaciLoader from '../AbaciLoader'
import { ToastContext } from '../../context/ToastContext'
import { OperatorJobContext } from '../../context/OperatorJobContext'
import AbaciImage from '../AbaciImage'
import moment from 'moment/moment'



export default function CouponCard({ item }) {
  const [visible, setIsVisible] = useState(false);
  // const [imagesToShow, setImageToShow] = useState([]);
  const [idToBeDeleted, setIdToBeDeleted] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [backendLoadingStatus, setBackendLoadingStatus] = useState('success')
  const toastContext = useContext(ToastContext)
  const { authAxios } = useContext(AxiosContext)
  const operatorJobContext = useContext(OperatorJobContext)
  const imageRef = useRef()

  const deleteConfirmHandler = () => {
    setBackendLoadingStatus('loading')
    const url = `/gtcc_api/adddeletecoupon/${item.id}`
    authAxios.delete(url).then(response => {
      setBackendLoadingStatus('success')
      // let tempState = []
      // operatorJobContext.couponsState.map(
      //   innerItem => {
      //     if (innerItem.id !== item.id) {
      //       tempState.push(innerItem)
      //     }
      //   })
      operatorJobContext.setCouponsState(response.data?.data)
      toastContext.showToast("Coupon has been deleted successfully!", 'short', 'success')
      setShowDeleteModal(false)
    })
      .catch(error => {
        let message = "Error occured, please try again!"
        try {
          message = error.response.data.response
        }
        catch { }
        setBackendLoadingStatus('error')
        toastContext.showToast(message, 'short', 'error')
        setShowDeleteModal(false)
      })

  }
  return (
    <View style={styles.cardWrapper}>
      <AbaciLoader visible={backendLoadingStatus === 'loading'} />
      <AbaciModal visible={showDeleteModal} onRequestClose={() => setShowDeleteModal(false)}>
        <Text style={globalStyles.h2_bold}>Are you sure to delete the coupon?</Text>
        <View style={{
          flexDirection: 'row',
          paddingTop: 30
        }}>
          <ModalButton
            color='red'
            onPress={deleteConfirmHandler}
            label='Yes'
          />
          <ModalButton
            color='green'
            onPress={() => setShowDeleteModal(false)}
            label='No'
          />

        </View>

      </AbaciModal>
      <View style={{
        width: '100%',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        <CouponTagSvg label={item.coupon_no} status={item.status} />
        <View style={{
          width: 50,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <TouchableOpacity
            onPress={() => setShowDeleteModal(true)}>
            <Icon name="delete" size={30} color={Colors.red} />
          </TouchableOpacity>

        </View>


      </View>
      <Text style={globalStyles.h2_bold}>Coupon Scanned by: {item?.converted_by?.full_name}</Text>
      <Text style={globalStyles.h3_regular}>Time: {moment(item?.convreted_on).format('h:mm:ss a D MMM, YYYY')}</Text>
      <Text style={globalStyles.h3_regular}>Waste Collected: {item.total_gallons} gal</Text>
      <View style={styles.imageWrapper}>
        <AbaciImage uri={baseURL + item.image} borderColor={Colors.gray} borderRadius={5} width={200} height={100} showFullScreenOnClick={true} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: "white",
    height: 260,
    width: "90%",
    alignSelf: "center",
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#d4d4d4"
  },
  imageWrapper: {
    marginTop: 20
  },
  dateTime: {
    position: "absolute",
    color: Colors.dark_gray,
    fontFamily: "Montserrat-Italic",
    top: 10,
    right: 20
  },
  restaurentName: {
    color: Colors.dark_gray,
    fontFamily: "Montserrat-ExtraBold",
    marginLeft: 20,
  },
  restaurenAddress: {
    color: Colors.dark_gray,
    fontFamily: "Montserrat-Medium",
    marginLeft: 40,
    margin: 3,
    fontSize: 14,
  }
})

