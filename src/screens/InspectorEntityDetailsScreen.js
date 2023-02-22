import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
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
import ZoneTagSvg from '../components/Zones/ZoneTagSvg';
import {InspectorJobContext} from '../context/InspectorJobContext';
import {cardCategoriesList} from '../components/InspectorSearch/searchInCategoriesList';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EditIcon from 'react-native-vector-icons/FontAwesome5';
import {launchCamera} from 'react-native-image-picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const tempAvatar = require('../assets/images/avtar.png');
const tempEntityImage = require('../assets/images/no_restaurent_image.png');
const noImage = require('../assets/images/noimage.png');

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
        <View>
          <Image
            style={{
              width: '100%',
              height: 200,
              resizeMode: 'cover',
            }}
            source={image}
            onError={e => setImage(tempEntityImage)}
          />
          {/* <TouchableOpacity onPress={() => navigation.navigate('CamView')}> */}
          <EditIcon
            name="edit"
            size={20}
            color="#1ABBEE"
            style={{position: 'absolute', marginTop: 170, marginLeft: 350}}
            onPress={() => navigation.navigate('CamView')}
          />
          {/* </TouchableOpacity> */}
        </View>
        <View style={styles.cardWrapper}>
          <View
            style={{
              //   flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
              alignSelf: 'center',
            }}>
            {/* <ZoneTagSvg label={inspectorContext.selectedEntity?.id} status={'status'} /> */}
            <Text
              style={{
                fontFamily: 'Montserrat-ExtraBold',
                color: '#2a2323',
                fontSize: 15,
                marginTop: 20,
                marginBottom: 0,
              }}
              numberOfLines={1}>
              {inspectorContext.selectedEntity?.establishment_name}
            </Text>
            {/* <View>
              <TouchableOpacity
                onPress={() => navigation.navigate('EntityInfoPage')}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    color: Colors.light_blue,
                    fontSize: 15,
                    marginTop: 20,
                    marginBottom: 0,
                  }}>
                  Info
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
              alignSelf: 'center',
              borderBottomWidth: 0.5,
              borderBottomColor: Colors.gray,
            }}>
            <Text
              style={{
                fontFamily: 'Montserrat-Regular',
                color: '#2a2323',
                fontSize: 12,
                marginBottom: 10,
              }}>
              Trade Licence No: CN-
              {inspectorContext.selectedEntity?.trade_license_no}
            </Text>
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate('EntityInspectionsPage1')}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    color: Colors.light_blue,
                    fontSize: 15,
                    marginTop: 20,
                    marginBottom: 0,
                  }}>
                  Inspections
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => navigation.navigate('EntityInfoPage')}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    color: Colors.light_blue,
                    fontSize: 15,
                    marginTop: 20,
                    marginBottom: 0,
                  }}>
                  Info
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
              alignSelf: 'center',
              // borderBottomWidth: 0.5,
              // borderBottomColor: Colors.gray,
              paddingTop: 30,
              paddingBottom: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() =>
                    onPressContactNumberClick(
                      inspectorContext.selectedEntity?.phone_no,
                    )
                  }>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 50,
                      backgroundColor: '#ea4873',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon name="phone" size={25} color="white" />
                  </View>
                </TouchableOpacity>
                <View style={{paddingLeft: 4, justifyContent: 'center'}}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Medium',
                      color: '#2a2323',
                      fontSize: 14,
                    }}>
                    +971{inspectorContext.selectedEntity?.phone_no}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', paddingLeft: 35}}>
                <TouchableOpacity
                  onPress={() =>
                    onLocationClick(
                      inspectorContext.selectedEntity?.gps_coordinates,
                      inspectorContext.selectedEntity?.establishment_name,
                    )
                  }
                  // onPress={() => onLocationClick("24.934737668227264, 55.47716251374936", inspectorContext.selectedEntity?.establishment_name)}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 50,
                      backgroundColor: '#38a344',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon name="location-on" size={25} color="white" />
                  </View>
                </TouchableOpacity>
                <View style={{justifyContent: 'center', paddingLeft: 4}}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Medium',
                      color: '#2a2323',
                      fontSize: 13,
                    }}>
                    {inspectorContext.selectedEntity?.entity_location}
                  </Text>
                </View>
              </View>
            </View>
            {/* <TouchableOpacity
              onPress={() =>
                onPressContactNumberClick(
                  inspectorContext.selectedEntity?.phone_no,
                )
              }> */}
            {/* <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  backgroundColor: '#ea4873',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="phone" size={30} color="white" />
              </View> */}
            {/* </TouchableOpacity> */}
            {/* <TouchableOpacity
              onPress={() =>
                onLocationClick(
                  inspectorContext.selectedEntity?.gps_coordinates,
                  inspectorContext.selectedEntity?.establishment_name,
                )
              }
              // onPress={() => onLocationClick("24.934737668227264, 55.47716251374936", inspectorContext.selectedEntity?.establishment_name)}
            > */}
            {/* <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  backgroundColor: '#38a344',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="map-marker" size={30} color="white" />
              </View> */}
            {/* </TouchableOpacity> */}
          </View>
        </View>

        <View style={styles.contactPersonCard}>
          <TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '90%',
                alignSelf: 'center',
              }}>
              {/* <ZoneTagSvg label={inspectorContext.selectedEntity?.id} status={'status'} /> */}
              <View
                style={{
                  // backgroundColor: 'black',
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                {/* TODO place the image of the restaurant manager received from the backend data */}
                <Image source={require('../assets/images/avtar.png')} />
              </View>
              <View style={{width: '80%'}}>
                <View
                  style={{
                    width: '55%',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-ExtraBold',
                      color: '#2a2323',
                      fontSize: 13,
                      marginTop: 20,
                      marginBottom: 0,
                      width: '100%',
                    }}
                    numberOfLines={1}>
                    {/* <Icon name="user" size={15} color="black" />:{' '} */}
                    {
                      inspectorContext.selectedEntity?.active_contact_person
                        ?.full_name
                    }
                  </Text>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}>
                    <Text
                      style={{
                        marginTop: 20,
                        backgroundColor: '#D9D9D9',
                      }}
                      numberOfLines={1}>
                      {
                        inspectorContext.selectedEntity?.active_contact_person
                          .designation.designation
                      }
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', width: '80%'}}>
                  <View style={{width: '85%'}}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Regular',
                        color: '#2a2323',
                        fontSize: 12,
                        marginBottom: 10,
                        marginTop: 5,
                      }}>
                      +971
                      {
                        inspectorContext.selectedEntity?.active_contact_person
                          ?.contact_number
                      }
                    </Text>
                  </View>
                  <View
                    style={{justifyContent: 'center', alignContent: 'center'}}>
                    <AntIcon name="message1" size={25} color="#707070" />
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '90%',
                alignSelf: 'center',
              }}>
              {/* <Text
                style={{
                  fontFamily: 'Montserrat-Regular',
                  color: '#2a2323',
                  fontSize: 12,
                  marginBottom: 10,
                  marginTop: 5,
                }}>
                {
                  inspectorContext.selectedEntity?.active_contact_person
                    ?.contact_number
                }
              </Text> */}
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.greaseTrapCard}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
              alignSelf: 'center',
              borderBottomColor: Colors.gray,
              borderBottomWidth: 0.5,
              paddingBottom: 5,
            }}>
            {/* <ZoneTagSvg label={inspectorContext.selectedEntity?.id} status={'status'} /> */}
            <Text
              style={{
                fontFamily: 'Montserrat-ExtraBold',
                color: '#2a2323',
                fontSize: 13,
                marginTop: 20,
                marginBottom: 0,
                width: '100%',
              }}
              numberOfLines={1}>
              Grease Trap Details
            </Text>
          </View>
          <FlatList
            data={inspectorContext.selectedEntity?.entity_grease_trap_entity}
            renderItem={({item}) => <RenderGreaseTrap item={item} />}
            keyExtractor={item => item.id}
            horizontal={true}
            ListFooterComponent={() => <View style={{width: 50}} />}
          />
        </View>
        <View style={styles.fixtureCard}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
              alignSelf: 'center',
              borderBottomColor: Colors.gray,
              borderBottomWidth: 0.5,
              paddingBottom: 5,
            }}>
            {/* <ZoneTagSvg label={inspectorContext.selectedEntity?.id} status={'status'} /> */}
            <Text
              style={{
                fontFamily: 'Montserrat-ExtraBold',
                color: '#2a2323',
                fontSize: 13,
                marginTop: 20,
                marginBottom: 0,
                width: '100%',
              }}
              numberOfLines={1}>
              Fixture Details
            </Text>
          </View>
          <FlatList
            data={inspectorContext.selectedEntity?.entity_fixture_entity}
            renderItem={({item}) => <RenderFixture item={item} />}
            keyExtractor={item => item.id}
            horizontal={true}
            ListFooterComponent={() => <View style={{width: 50}} />}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const RenderGreaseTrap = item => {
  const [image, setImage] = useState(null);
  const [greaseTrap, setGreasTrap] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    if (item.item.grease_trap !== null) {
      setGreasTrap(item.item?.grease_trap);
      if (item.item?.grease_trap.image !== null) {
        setImage({
          uri: baseURL + item.item?.grease_trap.image + `?${new Date()}`,
        });
      } else {
        setImage(noImage);
      }
    }
  }, [item.item]);

  return (
    <View
      style={{
        width: 150,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('GreaseTrapDetailsPage', {item: item})
        }>
        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: Colors.light_gray,
            margin: 10,
            borderRadius: 5,
            padding: 10,
          }}>
          <Image
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
            source={image}
            onError={e => setImage(noImage)}
          />
        </View>
      </TouchableOpacity>
      <Text
        numberOfLines={1}
        style={{
          fontFamily: 'Montserrat-Medium',
          color: '#2a2323',
          fontSize: 13,
          // marginBottom: 10,
          width: 140,
          textAlign: 'center',
        }}>
        {greaseTrap?.trap_label}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          fontFamily: 'Montserrat-Medium',
          color: '#2a2323',
          fontSize: 13,
          marginBottom: 10,
          textAlign: 'center',
          width: 140,
        }}>
        {greaseTrap?.capacity} gal
      </Text>
    </View>
  );
};

const RenderFixture = item => {
  const [image, setImage] = useState(null);
  const [fixture, setFixture] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    if (item.item.fixture !== null) {
      setFixture(item.item.fixture);
      if (item.item.fixture.image !== null) {
        setImage({uri: baseURL + item.item.fixture.image + `?${new Date()}`});
      } else {
        setImage(noImage);
      }
    }
  }, [item.item]);

  return (
    <View
      style={{
        width: 150,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('FixtureDetailsPage', {item: item})}>
        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: Colors.light_gray,
            margin: 10,
            borderRadius: 5,
            padding: 10,
          }}>
          <Image
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
            source={image}
            onError={e => setImage(noImage)}
          />
        </View>
      </TouchableOpacity>
      <Text
        numberOfLines={1}
        style={{
          fontFamily: 'Montserrat-Medium',
          color: '#2a2323',
          fontSize: 13,
          // marginBottom: 10,
          width: 140,
          textAlign: 'center',
        }}>
        {fixture?.fixture_id}
      </Text>
      <Text
        numberOfLines={1}
        style={{
          fontFamily: 'Montserrat-Medium',
          color: '#2a2323',
          fontSize: 13,
          marginBottom: 10,
          textAlign: 'center',
          width: 140,
        }}>
        {fixture?.fixture}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main_wrapper: {
    flex: 1,
  },
  cardWrapper: {
    backgroundColor: 'white',
    height: 170,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  contactPersonCard: {
    width: '100%',
    height: 75,
    borderBottomColor: '#d4d4d4',
    borderBottomWidth: 1,
    backgroundColor: 'white',
    marginTop: 5,
    marginBottom: 5,
  },

  dateTime: {
    position: 'absolute',
    color: Colors.dark_gray,
    fontFamily: 'Montserrat-Italic',
    top: 15,
    right: 20,
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
  greaseTrapCard: {
    width: '100%',
    height: 250,
    borderBottomColor: '#d4d4d4',
    borderBottomWidth: 1,
    backgroundColor: 'white',
    // marginTop: 5,
    marginBottom: 5,
  },
  fixtureCard: {
    width: '100%',
    height: 250,
    borderBottomColor: '#d4d4d4',
    borderBottomWidth: 1,
    backgroundColor: 'white',
    marginBottom: 100,
  },
  couponCard: {
    backgroundColor: 'white',
    height: 400,
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
    height: 50,
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 100,
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
