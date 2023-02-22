import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
  BackHandler,
} from 'react-native';
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import {useSelector} from 'react-redux';
import {globalStyles, vehicleStatusColors} from '../components/styles';
import {Colors} from '../components/styles';
import CardTagSvg from '../components/Jobs/CardTagSvg';
import TrapTagSvg from '../components/Jobs/TrapTagSvg';
import Line from '../components/Jobs/Line';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  color,
  Easing,
  withTiming,
  BounceInLeft,
  FlipInYRight,
  ZoomInEasyDown,
  ZoomOutEasyDown,
  FadeIn,
  BounceOutRight,
} from 'react-native-reanimated';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import PopUpConditionSelector from '../components/PopUpConditionSelector';
import {conditions} from '../components/PopUpConditionSelector/conditions';
import {DriverJobContext} from '../context/DriverJobContext';
import {OperatorJobContext} from '../context/OperatorJobContext';
import {AxiosContext} from '../context/AxiosContext';
import {ToastContext} from '../context/ToastContext';
import NavigationContext from '../context/NavigationContext';
import EmptyTraps from '../components/Jobs/EmptyTraps';
import BeforeAndAfterImages from '../components/Jobs/BeforeAndAfterImages';
import AbaciLoader from '../components/AbaciLoader';
import AbaciModal from '../components/AbaciModal';
import _ from 'lodash';
import {BlurView} from '@react-native-community/blur';
import {AuthContext} from '../context/AuthContext';
import JobSavingLottie from '../components/Jobs/JobSavingLottie';
import moment from 'moment/moment';
import baseURL from '../helpers/baserURL';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import RestaurentDetailsCard from '../components/JobDetailsComponents/RestaurentDetailsCard';
import ModalButton from '../components/Buttons/ModalButton';
import ModalCloseButton from '../components/Buttons/ModalCloseButton';
import VehicleTagSvg from '../components/Vehicles/VehicleTagSvg';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import AbaciImage from '../components/AbaciImage';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const tempAvatar = require('../assets/images/avtar.png');

export default function JobDetailsScreen({navigation, route}) {
  const [avatar, setAvatar] = useState(tempAvatar);

  // const navigation = useNavigation()
  const authContext = useContext(AuthContext);
  const toastContext = useContext(ToastContext);
  const driverJobContext = useContext(DriverJobContext);
  const operatorJobContext = useContext(OperatorJobContext);
  const navigationContext = useContext(NavigationContext);
  const {authAxios} = useContext(AxiosContext);
  const [mounting, setMounting] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState({});
  const [contactModalVisibility, setContactModalVisibility] = useState(false);
  const isFocused = useIsFocused();
  const offsetScale = useSharedValue(0);
  const [greaseTraps, setGreaseTraps] = useState([]);
  const [greaseTrapsRaw, setGreaseTrapsRaw] = useState([]); // For comparison purpose to  decide on save handler
  const [needToSave, setNeedToSave] = useState(false);
  const [backendLoadingStatus, setBackendLoadingStatus] = useState('success');
  const [popupShow, setPopupShow] = useState(false);
  const [yLocationForPopUp, setYLocationForPopUp] = useState(0);
  const [statusColorResuarent, setStatusColorResuarent] = useState(
    Colors.green,
  );
  const [toggleOnUpdate, setToggleOnUpdate] = useState(false);
  const [toBeSkipped, setToBeSkipped] = useState(false);
  const [savingModalVisibility, setSavingModalVisibility] = useState(false);
  const [itemToBePosted, setItemToBePosted] = useState(null);
  const [toBePublished, setToBePublished] = useState(false);
  const [messageOnSaveModal, setMessageOnSaveModal] = useState('');
  const [activateSaveButton, setActivateSaveButton] = useState(false);
  const [editPossible, setEditPossible] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [jobIsEditable, setJobIsEditable] = useState(false);
  const [measuredWeight, setMeasuredWeight] = useState('');
  const [firstAndLastCollection, setFirstAndLastCollection] = useState({
    firstCollection: null,
    lastCollection: null,
  });
  const submitHandler = type => {
    if (measuredWeight === '' || measuredWeight === '0'){
      let message = "Please provide the measured weight"
      toastContext.showToast(message, 'short', 'error');
      return
    }
    setBackendLoadingStatus('loading');
    const url = `/gtcc_api/operator_dumping_acceptance_view`;

    data = {
      vehicle_entry_details_id: operatorJobContext.selectedVehicle.id,
      operator_acceptance: type,
      remarks: operatorJobContext.selectedVehicle.remarks,
      total_gallon_dumped: parseFloat(measuredWeight),
    };
    authAxios
      .post(url, data)
      .then(response => {
        operatorJobContext.setSelectedVehicle(response.data.vehicle_details);
        driverJobContext.setAllJobs(response.data.jobs.srs);
        operatorJobContext.setCouponsState(response.data.jobs.coupons);
        if (type === 'Accepted') {
          setBackendLoadingStatus('success');
          toastContext.showToast(
            'Dumping has been successfully submitted !',
            'short',
            'success',
          );
        } else if (type === 'Rejected') {
          setBackendLoadingStatus('success');
          toastContext.showToast(
            'Dumping has been successfully rejected !',
            'short',
            'success',
          );
        }
      })
      .catch(error => {
        let message = 'Error while submitting the Details, Please try again !';
        try {
          message = error.response.data.error;
        } catch {}
        setBackendLoadingStatus('error');
        toastContext.showToast(message, 'short', 'error');
        setShowDeleteModal(false);
      });
  };

  const measuredWeightHandler = (value) => {
    var rgx = /^[0-9]*\.?[0-9]*$/;
    if (value.match(rgx)){
        if (value[value.length - 1] === '.'){
          // const re = new RegExp('.', 'g');
          const countOfDots = value.match(/\./g).length;
          if (countOfDots === 1){
            setMeasuredWeight(String(value))
          }
        }
        else{
          setMeasuredWeight(String(parseFloat(value) || 0))
        }
    }
  }
  useEffect(() => {
    if (
      operatorJobContext?.selectedVehicle?.operator_acceptance === 'Pending' &&
      operatorJobContext?.selectedVehicle?.current_status === 'Entered'
    ) {
      setJobIsEditable(true);
    } else {
      setJobIsEditable(false);
    }
  }, [operatorJobContext]);

  const printHTML = async () => {
    await RNPrint.print({
      html: `
            <!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                <title>Delivery Order</title>
                <style>
                    @media print {
                        @page {
                            size: A3;
                        }
                    }
            
                    ul {
                        padding: 0;
                        margin: 0 0 1rem 0;
                        list-style: none;
                    }
            
                    body {
                        font-family: "Inter", sans-serif;
                        margin: 0;
                    }
            
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
            
                    table,
                    table th,
                    table td {
                        border: 1px solid silver;
                    }
            
                    table th,
                    table td {
                        text-align: right;
                        padding: 8px;
                    }
            
                    h1,
                    h4,
                    p {
                        margin: 0;
                    }
            
                    .container {
                        padding: 20px 0;
                        width: 1000px;
                        max-width: 90%;
                        margin: 0 auto;
                    }
            
                    .inv-title {
                        padding: 10px;
                        border: 1px solid silver;
                        text-align: center;
                        margin-bottom: 30px;
                    }
            
                    .inv-logo {
                        width: 150px;
                        display: block;
                        margin: 0 auto;
                        margin-bottom: 40px;
                    }
            
                    /* header */
                    .inv-header {
                        display: flex;
                        margin-bottom: 20px;
                    }
            
                    .inv-header> :nth-child(1) {
                        flex: 2;
                    }
            
                    .inv-header> :nth-child(2) {
                        flex: 1;
                    }
            
                    .inv-header h2 {
                        font-size: 20px;
                        margin: 0 0 0.3rem 0;
                    }
            
                    .inv-header ul li {
                        font-size: 15px;
                        padding: 3px 0;
                    }
            
                    /* body */
                    .inv-body table th,
                    .inv-body table td {
                        text-align: left;
                    }
            
                    .inv-body {
                        margin-bottom: 30px;
                    }
            
                    /* footer */
                    .inv-footer {
                        display: flex;
                        flex-direction: row;
                    }
            
                    .inv-footer> :nth-child(1) {
                        flex: 2;
                    }
            
                    .inv-footer> :nth-child(2) {
                        flex: 1;
                    }
                </style>
            </head>
            
            <body>
                <div class="container">
                    <div class="inv-title">
                        <h1>Delivery Order</h1>
                    </div>
                    <div class="inv-header">
                        <div>
                            <h2>Billed to:</h2>
                            <ul>
                                <li>${
                                  operatorJobContext?.selectedVehicle?.driver
                                    ?.full_name
                                }</li>
                                <li>${
                                  operatorJobContext?.selectedVehicle?.driver
                                    ?.contact_number
                                }</li>
                                <li>${
                                  operatorJobContext.selectedVehicle.gtcc
                                    .establishment_name
                                }</li>
                            </ul>
                        </div>
                        <div>
                            <table>
                                <tr>
                                    <th>Issue Date</th>
                                    <td>${
                                      operatorJobContext.selectedVehicleEntryTime
                                    }</td>
                                </tr>
                                <tr>
                                    <th>Total Amount</th>
                                    <td>AED ${(
                                      operatorJobContext.selectedVehicle
                                        .total_gallon_collected *
                                      1.5 *
                                      1.05
                                    ).toFixed(2)}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="inv-body">
                    ${
                      operatorJobContext?.allJobs?.length !== 0
                        ? `<h3>Service Requests</h3>
                        <table>
                            <thead>
                                <th>Establishment</th>
                                <th>Traps</th>
                                <th>Grease</th>
                                <th>Amount(AED)</th>
                            </thead>
                            <tbody>
                            ${driverJobContext.allJobs.map(
                              (item, index) =>
                                ` <tr>
                                        <td>
                                            <p>${
                                              item.entity.establishment_name
                                            }</p>
                                        </td>
                                        <td>${item.grease_trap_count}</td>
                                        <td>${item.total_gallon_collecte}</td>
                                        <td>${(
                                          Number(item.total_gallon_collected) *
                                          1.5
                                        ).toFixed(2)}</td>
                                    </tr>`,
                            )}
                                <tr>
                                    <td colspan="3" style="text-align: right;">Total for Service Requests</td>
                                    <td>${(
                                      (operatorJobContext.selectedVehicle
                                        .total_gallon_collected -
                                        operatorJobContext.totalGreaseCollectedOnCoupon) *
                                      1.5
                                    ).toFixed(2)} AED</td>
                                </tr>
                            </tbody>
                        </table>`
                        : ''
                    }
                        ${
                          operatorJobContext?.couponsState?.length !== 0
                            ? `<h3>Coupons</h3>
                            <table>
                                <thead>
                                    <th>Coupon Number</th>
                                    <th>Grease</th>
                                    <th>Amount(AED)</th>
                                </thead>
                                <tbody>
                                ${operatorJobContext.couponsState.map(
                                  (item, index) =>
                                    ` <tr>
                                            <td>${item.coupon_no}</td>
                                            <td>${item.total_gallons}</td>
                                            <td>${(
                                              Number(item.total_gallons) * 1.5
                                            ).toFixed(2)}</td>
                                        </tr>`,
                                )}
                                    <tr>
                                        <td colspan="3" style="text-align: right;">Total for Coupons</td>
                                        <td>${(
                                          operatorJobContext.totalGreaseCollectedOnCoupon *
                                          1.5
                                        ).toFixed(2)} AED</td>
                                    </tr>
                                </tbody>
                            </table>`
                            : ''
                        }
                    </div>
                    <div class="inv-footer">
                        <div><!-- required --></div>
                        <div>
                            <table>
                                <tr>
                                    <th>Sub total</th>
                                    <td>${(
                                      operatorJobContext.selectedVehicle
                                        .total_gallon_collected * 1.5
                                    ).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <th>VAT</th>
                                    <td>${(
                                      operatorJobContext.selectedVehicle
                                        .total_gallon_collected *
                                      1.5 *
                                      0.05
                                    ).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <th>Grand total</th>
                                    <td>${(
                                      operatorJobContext.selectedVehicle
                                        .total_gallon_collected *
                                      1.5 *
                                      1.05
                                    ).toFixed(2)}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </body>
            
            </html>
          `,
    });
  };

  return (
    <ScrollView>
      <AbaciLoader visible={backendLoadingStatus === 'loading'} />
      <View
        style={{
          backgroundColor: Colors.blue,
          width: '100%',
          height: 90,
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 5,
        }}>
        <Text
          style={{
            fontFamily: 'Montserrat-Medium',
            color: Colors.white,
            marginLeft: 10,
            fontSize: 18,
          }}>
          Delivery Order
        </Text>
      </View>
      <View
        style={{
          width: '100%',
          height: 100,
          flexDirection: 'row',
          paddingTop: 30,
          justifyContent: 'space-between',
          marginTop: 20,
          marginBottom: 20,
        }}>
        {/* <View style={{
                    width:'100%',

                }}></View> */}
        <View
          style={{
            width: '100%',
            alignItems: 'flex-start',
            paddingLeft: 10,
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Black',
              color: Colors.black,
              textAlign: 'right',
            }}>
            Billed to:
          </Text>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              paddingTop: 10,
            }}>
            <View
              style={{
                width: '60%',
              }}>
              <Text numberOfLines={1} style={styles.restaurentName}>
                {operatorJobContext?.selectedVehicle?.driver?.full_name}
              </Text>
              <Text
                style={[
                  styles.restaurentName,
                  {fontFamily: 'Montserrat-Medium'},
                ]}>
                {operatorJobContext.selectedVehicle.gtcc.establishment_name}
              </Text>
            </View>
            <View
              style={{
                width: '40%',
                alignItems: 'flex-end',
                padding: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: 12,
                  color: Colors.black,
                }}>
                Total Amount
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: 18,
                  color: Colors.light_blue,
                  // textAlign: 'left'
                }}>
                AED{' '}
                {(
                  operatorJobContext.selectedVehicle.total_gallon_collected *
                  1.5 *
                  1.05
                ).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: Colors.blue,
          width: '100%',
          height: 40,
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Montserrat-Medium',
            color: Colors.white,
            marginLeft: 10,
          }}>
          Service Requests
        </Text>
      </View>
      <ServiceRequestDetails
        isLabel={true}
        establishment="Establishment"
        traps="Traps"
        grease="Grease"
        amount="Amount (AED)"
      />
      {driverJobContext.allJobs.map((item, index) => (
        <ServiceRequestDetails
          key={index}
          establishment={item.entity.establishment_name}
          traps={item.grease_trap_count}
          grease={item.total_gallon_collected}
          amount={(Number(item.total_gallon_collected) * 1.5).toFixed(2)}
        />
      ))}
      <View
        style={{
          width: '100%',
          height: 28,
          paddingRight: 10,
          alignItems: 'center',
          justifyContent: 'space-around',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginBottom: 10,
        }}>
        <Text
          style={{
            fontFamily: 'Montserrat-Bold',
            fontSize: 12,
            color: Colors.black,
            textAlign: 'left',
            padding: 5,
          }}>
          Total For Service Requests :
        </Text>
        <Text
          style={{
            fontFamily: 'Montserrat-Bold',
            fontSize: 13,
            color: Colors.light_blue,
            textAlign: 'left',
            padding: 5,
          }}>
          {(
            (operatorJobContext.selectedVehicle.total_gallon_collected -
              operatorJobContext.totalGreaseCollectedOnCoupon) *
            1.5
          ).toFixed(2)}{' '}
          AED
        </Text>
      </View>
      {operatorJobContext.couponsState?.length !== 0 ? (
        <View style={styles.greaseTrapCard}>
          <View
            style={{
              backgroundColor: Colors.blue,
              width: '100%',
              height: 40,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Montserrat-Medium',
                color: Colors.white,
                marginLeft: 10,
              }}>
              Coupons
            </Text>
          </View>
          <CouponDetails
            isLabel={true}
            image="Coupon"
            couponNo="Coupon Number"
            grease="Grease"
            amount="Amount (AED)"
          />

          {operatorJobContext.couponsState.map((item, index) => (
            <CouponDetails
              key={index}
              image={item.image}
              couponNo={item.coupon_no}
              grease={item.total_gallons}
              amount={(Number(item.total_gallons) * 1.5).toFixed(2)}
            />
          ))}
          <View
            style={{
              width: '100%',
              height: 28,
              paddingRight: 10,
              alignItems: 'center',
              justifyContent: 'space-around',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 12,
                color: Colors.black,
                textAlign: 'left',
                padding: 5,
              }}>
              Total For Coupons :
            </Text>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 13,
                color: Colors.light_blue,
                textAlign: 'left',
                padding: 5,
              }}>
              {(operatorJobContext.totalGreaseCollectedOnCoupon * 1.5).toFixed(
                2,
              )}{' '}
              AED
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              height: 28,
              paddingRight: 10,
              alignItems: 'center',
              justifyContent: 'space-around',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 12,
                color: Colors.black,
                textAlign: 'left',
                padding: 5,
              }}>
              Value Added Tax (5%) :
            </Text>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 13,
                color: Colors.light_blue,
                textAlign: 'left',
                padding: 5,
              }}>
              {(
                operatorJobContext.selectedVehicle.total_gallon_collected *
                1.5 *
                0.05
              ).toFixed(2)}{' '}
              AED
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              height: 28,
              paddingRight: 10,
              alignItems: 'center',
              justifyContent: 'space-around',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginBottom: 5,
            }}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 14,
                color: Colors.black,
                textAlign: 'left',
                padding: 5,
              }}>
              Grand Total :
            </Text>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 14,
                color: Colors.light_blue,
                textAlign: 'left',
                padding: 5,
              }}>
              {(
                operatorJobContext.selectedVehicle.total_gallon_collected *
                1.5 *
                1.05
              ).toFixed(2)}{' '}
              AED
            </Text>
          </View>
        </View>
      ) : null}
      <View style={styles.measuredWeightCard}>
        <View
          style={{
            backgroundColor: Colors.blue,
            width: '100%',
            height: 40,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Montserrat-Medium',
              color: Colors.white,
              marginLeft: 10,
            }}>
            Measured Weight
          </Text>
        </View>
        <View
          style={{
            width: '90%',
            height: 40,
            borderColor: Colors.light_gray,
            borderWidth: 1,
            alignSelf: 'center',
            margin: 20,
            borderRadius: 5,
          }}>
          <TextInput
            // multiline={false}
            // numberOfLines={1}
            // // maxLength={200}
            onChangeText={measuredWeightHandler}
            value={measuredWeight}
            editable={jobIsEditable}
            // showSoftInputOnFocus={jobIsEditable}
            // autoCorrect={jobIsEditable}
            // style={{
            //   padding: 10,
            //   fontFamily: 'Montserrat-Medium',
            //   color: Colors.black,
            //   fontSize: 12,
            //   width: '95%',
            // }}
          />
        </View>
        {operatorJobContext.creditForSelectedGTCC <
        operatorJobContext.selectedVehicle.total_gallon_collected *
          1.5 *
          1.05 ? (
          <Text
            style={[globalStyles.h2_bold, {color: 'red', marginBottom: 10}]}>
            Insufficient balance !{' '}
          </Text>
        ) : null}
      </View>
      <View style={styles.greaseTrapCard}>
        <View
          style={{
            backgroundColor: Colors.blue,
            width: '100%',
            height: 40,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Montserrat-Medium',
              color: Colors.white,
              marginLeft: 10,
            }}>
            Remarks
          </Text>
        </View>
        <View
          style={{
            width: '90%',
            height: 120,
            borderColor: Colors.light_gray,
            borderWidth: 1,
            alignSelf: 'center',
            margin: 20,
            borderRadius: 5,
          }}>
          <TextInput
            multiline={true}
            numberOfLines={4}
            maxLength={200}
            onChangeText={text =>
              operatorJobContext.setSelectedVehicle(state => ({
                ...state,
                remarks: text,
              }))
            }
            value={
              operatorJobContext.selectedVehicle?.remarks === null
                ? ''
                : operatorJobContext.selectedVehicle?.remarks
            }
            editable={jobIsEditable}
            showSoftInputOnFocus={jobIsEditable}
            autoCorrect={jobIsEditable}
            style={{
              padding: 10,
              fontFamily: 'Montserrat-Medium',
              color: Colors.black,
              fontSize: 12,
              width: '95%',
            }}
          />
        </View>
        {operatorJobContext.creditForSelectedGTCC <
        operatorJobContext.selectedVehicle.total_gallon_collected *
          1.5 *
          1.05 ? (
          <Text
            style={[globalStyles.h2_bold, {color: 'red', marginBottom: 10}]}>
            Insufficient balance !{' '}
          </Text>
        ) : null}
      </View>
      {jobIsEditable ? (
        <View
          style={{
            width: '100%',
            height: 100,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              width: '25%',
              height: 40,
              backgroundColor: Colors.red,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 2,
            }}
            onPress={() => submitHandler('Rejected')}
            disabled={false}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                color: Colors.white,
              }}>
              Reject
            </Text>
          </TouchableOpacity>
          {operatorJobContext.creditForSelectedGTCC <
          operatorJobContext.selectedVehicle.total_gallon_collected *
            1.5 *
            1.05 ? null : (
            <>
              <TouchableOpacity
                style={{
                  width: '25%',
                  height: 40,
                  backgroundColor: Colors.green,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 2,
                }}
                onPress={() => submitHandler('Accepted')}
                disabled={false}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    color: Colors.white,
                  }}>
                  Confirm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '25%',
                  height: 40,
                  backgroundColor: Colors.light_blue,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 2,
                }}
                onPress={() => printHTML()}
                disabled={false}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    color: Colors.white,
                  }}>
                  Print DO
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : null}
    </ScrollView>
  );
}

const ServiceRequestDetails = ({
  isLabel = false,
  establishment,
  traps,
  grease,
  amount,
}) => {
  return (
    <View
      style={{
        width: '95%',
        height: 50,
        borderBottomColor: Colors.gray,
        borderBottomWidth: 0.5,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      <View
        style={{
          width: '40%',
        }}>
        <Text
          style={{
            fontFamily: isLabel ? 'Montserrat-Bold' : 'Montserrat-Medium',
            fontSize: isLabel ? 13 : 11,
            color: Colors.dark_gray,
            textAlign: isLabel ? 'center' : 'left',
            padding: 5,
          }}
          numberOfLines={2}>
          {establishment}
        </Text>
      </View>
      <View
        style={{
          width: '15%',
        }}>
        <Text
          style={{
            fontFamily: isLabel ? 'Montserrat-Bold' : 'Montserrat-Medium',
            fontSize: isLabel ? 13 : 11,
            color: Colors.dark_gray,
            textAlign: 'center',
            padding: 5,
          }}
          numberOfLines={2}>
          {traps}
        </Text>
      </View>
      <View
        style={{
          width: '20%',
        }}>
        <Text
          style={{
            fontFamily: isLabel ? 'Montserrat-Bold' : 'Montserrat-Medium',
            fontSize: isLabel ? 13 : 11,
            color: Colors.dark_gray,
            textAlign: 'center',
            padding: 5,
          }}
          numberOfLines={2}>
          {grease}
        </Text>
      </View>
      <View
        style={{
          width: '25%',
        }}>
        <Text
          style={{
            fontFamily: isLabel ? 'Montserrat-Bold' : 'Montserrat-Medium',
            fontSize: isLabel ? 13 : 11,
            color: Colors.dark_gray,
            textAlign: 'center',
            padding: 5,
          }}
          numberOfLines={2}>
          {amount}
        </Text>
      </View>

      <Text style={globalStyles.h2_bold}>{/* {JSON.stringify(item)} */}</Text>
    </View>
  );
};

const CouponDetails = ({isLabel = false, couponNo, image, grease, amount}) => {
  return (
    <View
      style={{
        width: '95%',
        height: 50,
        borderBottomColor: Colors.gray,
        borderBottomWidth: 0.5,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      {isLabel ? (
        <View
          style={{
            width: '20%',
          }}>
          <Text
            style={{
              fontFamily: isLabel ? 'Montserrat-Bold' : 'Montserrat-Medium',
              fontSize: isLabel ? 13 : 11,
              color: Colors.dark_gray,
              textAlign: isLabel ? 'center' : 'left',
              padding: 5,
            }}>
            {image}
          </Text>
        </View>
      ) : (
        <AbaciImage
          width={60}
          height={40}
          borderWidth={1}
          borderColor={Colors.light_gray}
          uri={baseURL + image}
          borderRadius={5}
          showFullScreenOnClick={true}
        />
      )}
      <View
        style={{
          width: '35%',
        }}>
        <Text
          style={{
            fontFamily: isLabel ? 'Montserrat-Bold' : 'Montserrat-Medium',
            fontSize: isLabel ? 13 : 11,
            color: Colors.dark_gray,
            textAlign: isLabel ? 'center' : 'left',
            padding: 5,
          }}>
          {couponNo}
        </Text>
      </View>
      <View
        style={{
          width: '20%',
        }}>
        <Text
          style={{
            fontFamily: isLabel ? 'Montserrat-Bold' : 'Montserrat-Medium',
            fontSize: isLabel ? 13 : 11,
            color: Colors.dark_gray,
            textAlign: 'center',
            padding: 5,
          }}
          numberOfLines={2}>
          {grease}
        </Text>
      </View>
      <View
        style={{
          width: '25%',
        }}>
        <Text
          style={{
            fontFamily: isLabel ? 'Montserrat-Bold' : 'Montserrat-Medium',
            fontSize: isLabel ? 13 : 11,
            color: Colors.dark_gray,
            textAlign: 'center',
            padding: 5,
          }}
          numberOfLines={2}>
          {amount}
        </Text>
      </View>

      <Text style={globalStyles.h2_bold}>{/* {JSON.stringify(item)} */}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main_wrapper: {
    flex: 1,
  },
  cardWrapper: {
    backgroundColor: 'white',
    height: 160,
    paddingTop: 30,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 5,
  },
  dateTime: {
    // position: "absolute",
    color: Colors.dark_gray,
    fontFamily: 'Montserrat-Italic',
    marginLeft: 20,
    // top: 15,
    // right: 20
  },
  restaurentName: {
    color: Colors.dark_gray,
    fontFamily: 'Montserrat-ExtraBold',
    marginLeft: 20,
  },
  restaurenAddress: {
    color: Colors.dark_gray,
    fontFamily: 'Montserrat-Medium',
    marginLeft: 30,
    fontSize: 14,
    margin: 5,
  },
  measuredWeightCard: {
    backgroundColor: 'white',
    height: 120,
    width: '100%',
    alignSelf: 'center',
    // marginTop: 20,
    // margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  greaseTrapCard: {
    backgroundColor: 'white',
    minHeight: 200,
    width: '100%',
    alignSelf: 'center',
    // marginTop: 20,
    // margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  couponCard: {
    backgroundColor: 'white',
    height: '12%',
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  submitButton: {
    backgroundColor: 'white',
    height: '6%',
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 25,
    backgroundColor: '#F8A836',
    elevation: 5,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },

  buttonLabel: {
    fontFamily: 'Montserrat-Bold',
    color: Colors.white,
    fontSize: 16,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  trapDetails: {
    fontFamily: 'Montserrat-Bold',
    color: Colors.dark_gray,
    margin: 10,
    marginLeft: 20,
  },
  conditionsLabel: {
    fontFamily: 'Montserrat-Medium',
    color: Colors.dark_gray,
    margin: 8,
    marginLeft: 40,
  },
});
