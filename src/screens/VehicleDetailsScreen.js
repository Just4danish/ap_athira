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
import {ScrollView} from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const tempAvatar = require('../assets/images/avtar.png');

export default function VehicleDetailsScreen({navigation, route}) {
  const [avatar, setAvatar] = useState(tempAvatar);
  const [color, setColor] = useState(vehicleStatusColors['Entered']);

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
  const [backendLoadingStatus, setBackendLoadingStatus] = useState('loading');
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
  const [selectedTrap, setSelectedTrap] = useState({
    index: null,
    item: null,
  });
  const [totalGreaseTrapCollected, setTotalGreaseTrapCollected] = useState(0);
  const [firstAndLastCollection, setFirstAndLastCollection] = useState({
    firstCollection: null,
    lastCollection: null,
  });

  const fetchVehicleDetails = vehicle_entry_details_id => {
    setBackendLoadingStatus('loading');
    const url = `/gtcc_api/vehicle_details_operator/${vehicle_entry_details_id}`;
    authAxios
      .get(url)
      .then(response => {
        operatorJobContext.setSelectedVehicle(response.data.vehicle_details);
        driverJobContext.setAllJobs(response.data.jobs.srs);
        operatorJobContext.setSelectedVehicleEntryTime(
          response.data.vehicle_entry_time,
        );

        operatorJobContext.setCouponsState(response.data.jobs.coupons);
        operatorJobContext.setCreditForSelectedGTCC(response.data.gtcc_credit);
        setBackendLoadingStatus('success');
      })

      .catch(error => {
        toastContext.showToast(
          'Error while fetching Vehicle Details !',
          'short',
          'error',
        );
        setBackendLoadingStatus('error');
      });
  };

  useEffect(() => {
    let tempColor = vehicleStatusColors['Entered'];
    if (operatorJobContext.selectedVehicle.current_status !== 'Entered') {
      tempColor =
        vehicleStatusColors[
          operatorJobContext.selectedVehicle.operator_acceptance
        ];
    }

    setColor(tempColor);
  }, [operatorJobContext.selectedVehicle.current_status]);

  useEffect(() => {
    if (isFocused) {
      fetchVehicleDetails(route.params?.vehicleDetails.id);
    } else {
      setGreaseTraps([]);
      setGreaseTrapsRaw([]);
      driverJobContext.setSelectedJob([]);
    }
  }, [isFocused, toggleOnUpdate]);

  const longPressHandler = (e, item, trapIndex, condition) => {
    setSelectedTrap({
      index: trapIndex,
      item: item,
    });
    setSelectedCondition(condition);
    setPopupShow(true);
    setYLocationForPopUp(e.nativeEvent.pageY - 70);
  };
  const contactModalCloseHandler = () => {
    setContactModalVisibility(false);
  };
  const onPressMobileNumberClick = number => {
    setContactModalVisibility(false);
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    try {
      Linking.openURL(phoneNumber);
    } catch {
      Alert.alert('Please install WhatsApp to send direct messages');
    }
  };
  const onSendSMSMessage = (number, message = '') => {
    setContactModalVisibility(false);
    const separator = Platform.OS === 'ios' ? '&' : '?';
    const url = `sms:${number}${separator}body=${message}`;
    try {
      Linking.openURL(url);
    } catch {
      Alert.alert('Please install WhatsApp to send direct messages');
    }
  };
  const onSendWhatsappMessage = (number, message = '') => {
    let phoneNumber = parseInt(number, 10);
    phoneNumber = Platform.OS == 'ios' ? phoneNumber : '+' + phoneNumber;
    let url = 'whatsapp://send?text=' + message + '&phone=' + phoneNumber;
    try {
      Linking.openURL(url);
    } catch {
      Alert.alert('Please install WhatsApp to send direct messages');
    }
    setContactModalVisibility(false);
  };

  const saveHandler = (type, item) => {
    let message = '';
    setItemToBePosted({
      type: type,
      item: item,
    });
    if (type === 'skip') {
      message = "Do you want to mark the grease trap as 'Skipped'?";
      setActivateSaveButton(true);
    } else if (type === 'save' || type === 'partial') {
      let okToSave = true;
      if (
        item.grease_trap_condtion === 'Not set' ||
        item.grease_trap_condtion === null ||
        item.waste_contents === 'Not set' ||
        item.waste_contents === null ||
        item.cover_condition === 'Not set' ||
        item.cover_condition === null ||
        item.buffle_wall_condition === 'Not set' ||
        item.buffle_wall_condition === null ||
        item.outlet_elbow_condition === 'Not set' ||
        item.outlet_elbow_condition === null
      ) {
        okToSave = false;
        message = 'You need to have an input for all the provided conditions !';
      }
      if (item.beforePics.length === 0 || item.afterPics.length === 0) {
        okToSave = false;
        const tempPrefix = message === '' ? 'Y' : `${message}\nAlso y`;
        message = `${tempPrefix}ou need to upload atleast an image of the grease trap for both before and after conditions!`;
      }

      if (okToSave) {
        message = `Are you sure to mark the grease trap work as ${
          type === 'save' ? '' : 'partially'
        } completed?`;
        message += `\nPlease press continue to save the entered details to the server !`;
        setActivateSaveButton(true);
      }
    }
    setMessageOnSaveModal(message);
    setSavingModalVisibility(true);

    // dataPosthandler()
  };
  const saveModalCloseHandler = () => {
    setMessageOnSaveModal('');
    setItemToBePosted(null);
    setActivateSaveButton(false);
    setSavingModalVisibility(false);
  };

  const publishHandler = () => {
    // const data = {
    //     vehicle_id: route.params?.jobDetails.id,
    //     status: 'Completed' }
    // const url = '/gtcc_api/update_service_request'
    // authAxios.post(url, data).then(response => {
    //     driverJobContext.setAllJobs(response.data)
    //     setBackendLoadingStatus('success')
    //     navigation.navigate('DriverHome')
    // })
    //     .catch(error => {
    //         setBackendLoadingStatus('error')
    //     })
  };

  useEffect(() => {
    if (operatorJobContext?.selectedVehicle?.driver?.avatar !== null) {
      setAvatar({
        uri: baseURL + operatorJobContext?.selectedVehicle?.driver?.avatar,
      });
    }
  }, [operatorJobContext.selectedVehicle]);

  return (
    <ScreenWrapper navigationShow={false} sideBarShow={false}>
      <ScrollView>
        <AbaciLoader visible={backendLoadingStatus === 'loading'} />
        <AbaciModal
          visible={contactModalVisibility}
          onRequestClose={contactModalCloseHandler}>
          <Image source={require('../assets/images/avtar.png')} />
          <Text style={globalStyles.h2_bold}>
            {operatorJobContext.selectedVehicle?.driver?.full_name}
          </Text>
          <Text style={globalStyles.h2_bold} selectable={true}>
            {operatorJobContext.selectedVehicle?.driver?.email}
          </Text>
          <Text style={globalStyles.h2_bold} selectable={true}>
            {operatorJobContext.selectedVehicle?.driver?.contact_number}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                margin: 20,
              }}
              onPress={() =>
                onPressMobileNumberClick(
                  operatorJobContext.selectedVehicle?.driver?.contact_number,
                )
              }>
              <Image
                style={{
                  margin: 10,
                  width: 45,
                  height: 45,
                  resizeMode: 'contain',
                }}
                source={require('../assets/images/phone.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                margin: 20,
              }}
              onPress={() =>
                onSendSMSMessage(
                  operatorJobContext.selectedVehicle?.driver?.contact_number,
                )
              }>
              <Image
                style={{
                  width: 45,
                  height: 45,
                  resizeMode: 'contain',
                }}
                source={require('../assets/images/message.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                margin: 20,
              }}
              onPress={() =>
                onSendWhatsappMessage(
                  operatorJobContext.selectedVehicle?.driver?.contact_number,
                )
              }>
              <Image
                style={{
                  marginLeft: 15,
                  width: 45,
                  height: 45,
                  resizeMode: 'contain',
                }}
                source={require('../assets/images/whatsapp.png')}
              />
            </TouchableOpacity>
          </View>
        </AbaciModal>
        <View style={{flex: 1, paddingTop: 50}}>
          <View style={styles.cardWrapper}>
            <View
              style={{
                width: '100%',
                height: 85,
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: Colors.gray,
              }}>
              <View
                style={{
                  width: '75%',
                  height: 75,
                }}>
                <VehicleTagSvg
                  label={
                    operatorJobContext.selectedVehicle?.vehicle?.vehicle_no
                  }
                  status={operatorJobContext.selectedVehicle?.current_status}
                  color={color}
                />
                <View
                  style={{
                    width: '100%',
                    height: 45,
                  }}>
                  <Text numberOfLines={1} style={styles.restaurentName}>
                    {operatorJobContext.selectedVehicle?.driver?.full_name}
                  </Text>
                  <Text numberOfLines={1} style={styles.dateTime}>
                    {moment(
                      operatorJobContext.selectedVehicle?.entry_time,
                    ).format('DD-MM-YYYY hh:mm:ss A')}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: '25%',
                  height: 75,
                }}>
                <TouchableOpacity
                  onPress={() => setContactModalVisibility(true)}>
                  <Image
                    style={{
                      // position: 'absolute',
                      // right: 0,
                      // top: 0,
                      margin: 10,
                      width: 65,
                      height: 65,
                      resizeMode: 'cover',
                      borderRadius: 40,
                    }}
                    source={avatar}
                    onError={e => setAvatar(tempAvatar)}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                marginTop: 10,
              }}>
              <Text
                style={[
                  styles.restaurenAddress,
                  {
                    fontFamily: 'Montserrat-Bold',
                  },
                ]}>
                {operatorJobContext.selectedVehicle?.gtcc?.establishment_name}
              </Text>
              <Text
                style={[
                  styles.restaurenAddress,
                  {
                    fontFamily: 'Montserrat-Bold',
                  },
                ]}>
                Status: {operatorJobContext.selectedVehicle?.gtcc?.status}
              </Text>
              <Text style={styles.restaurenAddress}>
                Vehicle Type:{' '}
                {operatorJobContext.selectedVehicle?.vehicle?.vehicle_type}
              </Text>
              <Text style={styles.restaurenAddress}>
                Chasis Number:{' '}
                {operatorJobContext.selectedVehicle?.vehicle?.chassis_no}
              </Text>
              <Text style={styles.restaurenAddress}>
                Tank Capacity:{' '}
                {
                  operatorJobContext.selectedVehicle?.vehicle
                    ?.vehicle_tank_capacity
                }{' '}
                gal
              </Text>
              <Text style={styles.restaurenAddress}>
                Total Grease Trap Collected:{' '}
                {operatorJobContext.selectedVehicle?.total_gallon_collected} gal
              </Text>
            </View>
          </View>
          <View style={styles.srcard}>
            <Pressable
              android_ripple={{color: Colors.light_blue}}
              style={{height: '100%'}}
              onPress={() => navigation.navigate('OperatorJobs')}>
              <Text style={styles.restaurentName}>{'\n'}Service Requests</Text>
              <Line />
              <Text style={styles.restaurenAddress}>
                No of SRs Collected: {driverJobContext.allJobs.length}
              </Text>
              {/* <Text style={styles.restaurenAddress}>Grease Trap Collected: {driverJobContext.totalGreaseTrapCollected + operatorJobContext.totalGreaseCollectedOnCoupon} gal</Text> */}
              <Text style={styles.restaurenAddress}>
                Grease Trap Collected on SR:{' '}
                {operatorJobContext.selectedVehicle.total_gallon_collected -
                  operatorJobContext.totalGreaseCollectedOnCoupon}{' '}
                gal
              </Text>
              <Text style={styles.restaurenAddress}>
                First Collection:{' '}
                {driverJobContext.firstAndLastCollection.firstCollection}
              </Text>
              <Text style={styles.restaurenAddress}>
                Last Collection:{' '}
                {driverJobContext.firstAndLastCollection.lastCollection}
              </Text>
            </Pressable>
          </View>
          <View style={styles.couponCard}>
            <Pressable
              android_ripple={{color: Colors.light_blue}}
              style={{height: '100%'}}
              onPress={() => navigation.navigate('CouponsPage')}>
              <Text style={styles.restaurentName}>{'\n'}Coupons</Text>
              <Line />
              <Text style={styles.restaurenAddress}>
                No of Coupons Scanned: {operatorJobContext.couponsState?.length}
              </Text>
              <Text style={styles.restaurenAddress}>
                Grease Trap Collected on coupons:{' '}
                {operatorJobContext.totalGreaseCollectedOnCoupon} gal
              </Text>
            </Pressable>
          </View>
          <View style={styles.submitButton}>
            <Pressable
              onPress={() => {
                navigation.navigate('DumpingReviewPage');
              }}
              android_ripple={{color: Colors.light_blue, borderless: true}}
              style={{
                height: '100%',
                width: '100%',
                justifyContent: 'center',
              }}>
              <Text style={styles.buttonLabel}>Review</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  main_wrapper: {
    flex: 1,
  },
  cardWrapper: {
    backgroundColor: 'white',
    height: 280,
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  dateTime: {
    // position: "absolute",
    color: Colors.dark_gray,
    fontFamily: 'Montserrat-Italic',
    marginLeft: 20,
    fontSize: 12,
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
  srcard: {
    backgroundColor: 'white',
    height: 190,
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  couponCard: {
    backgroundColor: 'white',
    height: 130,
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  submitButton: {
    backgroundColor: 'white',
    height: 50,
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
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
