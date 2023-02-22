import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
  TextInput,
  Picker,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {globalStyles} from '../components/styles';
import {Colors} from '../components/styles';
import Animated, {useSharedValue} from 'react-native-reanimated';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {DriverJobContext} from '../context/DriverJobContext';
import {OperatorJobContext} from '../context/OperatorJobContext';
import {AxiosContext} from '../context/AxiosContext';
import {ToastContext} from '../context/ToastContext';
import NavigationContext from '../context/NavigationContext';
import AbaciLoader from '../components/AbaciLoader';
import AbaciModal from '../components/AbaciModal';
import _ from 'lodash';
import {AuthContext} from '../context/AuthContext';
import baseURL from '../helpers/baserURL';
import {InspectorJobContext} from '../context/InspectorJobContext';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PlusIcon from 'react-native-vector-icons/Feather';
import DropIcon from 'react-native-vector-icons/MaterialIcons';

const tempAvatar = require('../assets/images/avtar.png');
const tempEntityImage = require('../assets/images/no_restaurent_image.png');

export default function EntityInspectionsPage({navigation, route}) {
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

  const [followUpRadio, setFollowUpRadio] = useState('');
  const [reportRadio, setReportRadio] = useState('');
  // const [statusModalVisibility,setStatusModalVisibility]=useState(false);
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
  const [image, setImage] = useState(null);
  const [selectedTrap, setSelectedTrap] = useState({
    index: null,
    item: null,
  });
  const [totalGreaseTrapCollected, setTotalGreaseTrapCollected] = useState(0);
  const [firstAndLastCollection, setFirstAndLastCollection] = useState({
    firstCollection: null,
    lastCollection: null,
  });

  const inspectorContext = useContext(InspectorJobContext);

  const fetchEntityDetails = id => {
    setBackendLoadingStatus('loading');
    const url = `/inspector_api/entity_for_inspector/${id}`;
    authAxios
      .get(url)
      .then(response => {
        inspectorContext.setSelectedEntity(response.data);
        if (response.data.image !== null) {
          setImage({uri: baseURL + response.data.image + `?${new Date()}`});
        } else {
          setImage(tempEntityImage);
        }
        // operatorJobContext.setSelectedVehicle(response.data.vehicle_details)
        // driverJobContext.setAllJobs(response.data.jobs)
        setBackendLoadingStatus('success');
      })
      .catch(error => {
        toastContext.showToast(
          'Error while fetching Entity Details !',
          'short',
          'warning',
        );
        setBackendLoadingStatus('error');
      });
  };

  useEffect(() => {
    if (isFocused) {
      fetchEntityDetails(route.params?.entityId);
    } else {
    }
  }, [isFocused, toggleOnUpdate]);
  const contactModalCloseHandler = () => {
    setContactModalVisibility(false);
  };
  const onPressContactNumberClick = number => {
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
      let message = 'Error occured';
      toastContext.showToast(message, 'short', 'error');
    }
  };

  const onLocationClick = (gps_coordinates, label) => {
    const tempRegex =
      /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
    if (tempRegex.test(gps_coordinates)) {
      try {
        const [lat, lng] = gps_coordinates.split(', ');
        const scheme = Platform.select({
          ios: 'maps:0,0?q=',
          android: 'geo:0,0?q=',
        });
        // const latLng = `${'24.934737668227264'},${'55.47716251374936'}`;
        const latLng = `${lat},${lng}`;
        const url = Platform.select({
          ios: `${scheme}${label}@${latLng}`,
          android: `${scheme}${latLng}(${label})`,
        });
        Linking.openURL(url);
      } catch {
        let message = 'Invalid Coordinates';
        toastContext.showToast(message, 'short', 'error');
      }
    } else {
      let message = 'Invalid Coordinates';
      toastContext.showToast(message, 'short', 'error');
    }
  };
  const onSendSMSMessage = (number, message = '') => {
    setContactModalVisibility(false);
    const separator = Platform.OS === 'ios' ? '&' : '?';
    const url = `sms:${number}${separator}body=${message}`;
    try {
      Linking.openURL(url);
    } catch {
      let message = 'Please install WhatsApp to send direct messages';
      toastContext.showToast(message, 'short', 'error');
    }
  };
  const onSendWhatsappMessage = (number, message = '') => {
    let phoneNumber = parseInt(number, 10);
    phoneNumber = Platform.OS == 'ios' ? phoneNumber : '+' + phoneNumber;
    let url = 'whatsapp://send?text=' + message + '&phone=' + phoneNumber;
    try {
      Linking.openURL(url);
    } catch {
      let message = 'Please install WhatsApp to send direct messages';
      toastContext.showToast(message, 'short', 'error');
    }
    setContactModalVisibility(false);
  };

  // const toggleStatusModal=()=>{
  //   setStatusModalVisibility(!statusModalVisibility);
  // }

  return (
    <View>
      <AbaciLoader visible={backendLoadingStatus === 'loading'} />
      <AbaciModal
        visible={contactModalVisibility}
        onRequestClose={contactModalCloseHandler}>
        <Animated.Image source={require('../assets/images/avtar.png')} />
        <Text style={globalStyles.h2_bold}>
          {/* {operatorJobContext.selectedVehicle?.driver?.full_name} */}
        </Text>
        <Text style={globalStyles.h2_bold} selectable={true}>
          {/* {operatorJobContext.selectedVehicle?.driver?.email} */}
        </Text>
        <Text style={globalStyles.h2_bold} selectable={true}>
          {/* {operatorJobContext.selectedVehicle?.driver?.contact_number} */}
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
            onPress={
              () => onPressMobileNumberClick()
              // operatorJobContext.selectedVehicle?.driver?.contact_number
            }>
            <Animated.Image
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
            onPress={
              () => onSendSMSMessage()
              // operatorJobContext.selectedVehicle?.driver?.contact_number
            }>
            <Animated.Image
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
            onPress={
              () => onSendWhatsappMessage()
              // operatorJobContext.selectedVehicle?.driver?.contact_number
            }>
            <Animated.Image
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
      <ScrollView>
        <View
          style={{
            backgroundColor: 'red',
            height: 100,
            justifyContent: 'flex-start',
            alignContent: 'flex-start',
          }}>
          <Text
            style={[globalStyles.h1_bold, {color: 'white', paddingTop: 50}]}>
            Inspection Status
          </Text>
        </View>
        <View style={{paddingLeft: 10, paddingBottom: 10}}>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Status Of Restaurants
            <Icon name="asterisk" size={15} color="red" />
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              justifyContent: 'center',
              alignItems: 'center',
              height: 40,
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
            }}>
            <DropIcon name="arrow-drop-down" size={25} />
          </Text>
          {/* <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          /> */}
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Makhani Number
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Establishment Image
            <Icon name="asterisk" size={15} color="red" />
          </Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 150,
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
            }}>
            <PlusIcon name="plus-circle" size={40} color="#5BB8B2" />
          </View>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Establishment Name
            <Icon name="asterisk" size={15} color="red" />
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Establishment Name as per TL
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Trade License Number
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Trade License Expiry
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Trade License Image
          </Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 150,
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
            }}>
            <PlusIcon name="plus-circle" size={40} color="#5BB8B2" />
          </View>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Establishment Category
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              justifyContent: 'center',
              alignItems: 'center',
              height: 40,
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
            }}>
            <DropIcon name="arrow-drop-down" size={25} />
          </Text>
          {/* <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          /> */}
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Establishment Number
          </Text>
          <TextInput
            inputMode={'numeric'}
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Establishment Area
            <Icon name="asterisk" size={15} color="red" />
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              justifyContent: 'center',
              alignItems: 'center',
              height: 40,
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
            }}>
            <DropIcon name="arrow-drop-down" size={25} />
          </Text>
          {/* <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          /> */}
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Establishment Detailed Location
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Establishment Geostamp
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Number Of Seats
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Number Of Meals Per Day
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Job Card Number
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Job Card Image (FRONT)
          </Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 150,
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
            }}>
            <PlusIcon name="plus-circle" size={40} color="#5BB8B2" />
          </View>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Job Card Image (BACK)
          </Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 150,
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
            }}>
            <PlusIcon name="plus-circle" size={40} color="#5BB8B2" />
          </View>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Service done by
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              justifyContent: 'center',
              alignItems: 'center',
              height: 40,
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
            }}>
            <DropIcon name="arrow-drop-down" size={25} />
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Dumping Coupon Details
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Grease Trap Details
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Cleaning Company
            <Icon name="asterisk" size={15} color="red" />
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Contact Person Name
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Contact Person Designation
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Contact Person Mobile Number
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Contact Person Email
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Remarks
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 120,
            }}
          />
          <View style={{width: '100%'}}>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: 15,
                paddingTop: 16,
              }}>
              FOLLOW-UP DETAILS
            </Text>
          </View>
          <View style={styles.radiocontainer}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                color: '#2a2323',
                paddingTop: 16,
              }}>
              Inspection Follow-up
            </Text>
            <View style={styles.wrapper}>
              {['Yes', 'No'].map(followUpText => (
                <View key={followUpText} style={styles.radioText}>
                  <Text style={styles.text}>{followUpText}</Text>
                  <TouchableOpacity
                    style={styles.radiouter}
                    onPress={() => setFollowUpRadio(followUpText)}>
                    {followUpRadio === followUpText && (
                      <View style={styles.radioinner} />
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.radiocontainer}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                color: '#2a2323',
                paddingTop: 16,
              }}>
              Is the case Report to DM ?
            </Text>
            <View style={styles.wrapper}>
              {['Yes', 'No'].map(reportText => (
                <View key={reportText} style={styles.radioText}>
                  <Text style={styles.text}>{reportText}</Text>
                  <TouchableOpacity
                    style={styles.radiouter}
                    onPress={() => setReportRadio(reportText)}>
                    {reportRadio === reportText && (
                      <View style={styles.radioinner} />
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Select Inspection Status
            <Icon name="asterisk" size={15} color="red" />
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              color: '#2a2323',
              paddingTop: 16,
            }}>
            Completed Notes
          </Text>
          <TextInput
            numberOfLines={1}
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              width: '100%',
              textAlign: 'right',
              borderBottomColor: 'grey',
              borderBottomWidth: 2,
              height: '70%',
              borderRadius: 5,
              height: 40,
            }}
          />
          <View
            style={{
              alignSelf: 'center',
              backgroundColor: '#E64C4A',
              height: 45,
              width: 100,
              marginTop: 15,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EntityInspectionsPage2')}>
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  color: '#FFFFFF',
                  fontSize: 18,
                  marginBottom: 0,
                }}>
                Update
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontsize: 16,
    textTransform: 'capitalize',
  },
  wrapper: {
    justifyContent: 'space-evenly',
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  radiocontainer: {
    flex: 1,
  },
  radiouter: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignContent: 'center',
  },
  radioinner: {
    width: 12,
    height: 12,
    backgroundColor: 'red',
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  radioText: {
    marginHorizontal: 15,
    alignItems: 'center',
  },
});
