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
import {globalStyles, trapStatusColors} from '../components/styles';
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
import {ScrollView} from 'react-native-gesture-handler';
import Geolocation from 'react-native-geolocation-service';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const tempAvatar = require('../assets/images/avtar.png');
const tempEntityImage = require('../assets/images/no_restaurent_image.png');

export default function JobDetailsScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const toastContext = useContext(ToastContext);
  const driverJobContext = useContext(DriverJobContext);
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
  const [avatar, setAvatar] = useState(tempAvatar);
  const [entityImage, setEntityImage] = useState(tempEntityImage);
  const [location, setLocation] = useState('');
  const [scrollingItemIndex, setScrollingItemIndex] = useState(0);
  const [selectedTrap, setSelectedTrap] = useState({
    index: null,
    item: null,
  });
  const fetchJobDetails = jobId => {
    setBackendLoadingStatus('loading');
    const url = `/gtcc_api/service_request_grease_traps_for_mobile/${jobId}`;

    authAxios
      .get(url)
      .then(response => {
        driverJobContext.setSelectedJob(response.data);
        if (response.data?.restaurant?.image !== null) {
          setEntityImage({uri: baseURL + response.data?.restaurant?.image});
        }
        if (response.data?.restaurantContact?.avatar !== null) {
          setAvatar({uri: baseURL + response.data?.restaurantContact?.avatar});
        }
        const tempGreaseTraps = [];
        //TODO replace temporaryGreaseTrap with backend data
        response.data.greaseTraps.map(item => {
          let tempBeforePics = [];
          let tempAfterPics = [];
          item.service_request_detail.map(innerItem => {
            try {
              let fileUrlArray = innerItem.image.split('/');
              let fileName = fileUrlArray[fileUrlArray.length - 1];
              let newImageData = {
                id: innerItem.id,
                name: fileName,
                url: innerItem.image,
              };
              if (innerItem.image_type === 'Before') {
                tempBeforePics.push(newImageData);
              } else if (innerItem.image_type === 'After') {
                tempAfterPics.push(newImageData);
              }
            } catch {
              // Pass
            }
          });
          const tempNewItem = {
            ...item,
            beforePics: tempBeforePics,
            afterPics: tempAfterPics,
          };
          tempGreaseTraps.push(tempNewItem);
        });
        //TODO Replace setTemporaryGreaseTrap with setGreaseTraps

        setGreaseTraps(tempGreaseTraps);
        setGreaseTrapsRaw(tempGreaseTraps);
        setBackendLoadingStatus('success');
      })
      .catch(error => {
        toastContext.showToast(
          'Error while fetching Job Details !',
          'short',
          'warning',
        );
        setBackendLoadingStatus('error');
      });
  };
  useEffect(() => {
    if (isFocused) {
      fetchJobDetails(route.params?.jobDetails.id);
      if (authContext.authState?.userDetails?.user_type === 'Driver') {
        setEditPossible(route.params?.jobDetails?.status === 'Processing');
      }
      Geolocation.getCurrentPosition(
        position => {
          setLocation(JSON.stringify(position.coords));
        },
        error => {},
        {enableHighAccuracy: true, timeout: 1500, maximumAge: 1000},
      );
    } else {
      setGreaseTraps([]);
      setGreaseTrapsRaw([]);
      driverJobContext.setSelectedJob([]);
    }
  }, [isFocused, toggleOnUpdate]);
  useEffect(() => {
    if (!isFocused) {
      setSelectedCondition(null);
      offsetScale.value = 0;
      setPopupShow(false);
    }
  }, [isFocused]);
  useEffect(() => {
    let tempToBePublished = false;
    if (editPossible) {
      tempToBePublished = true;
      greaseTrapsRaw.map((item, index) => {
        if (item.status === 'Pending') {
          tempToBePublished = false;
        }
      });
    }
    setToBePublished(tempToBePublished);
  }, [greaseTrapsRaw, editPossible, isFocused]);
  const conditionChangeHandler = (e, item, trapIndex, condition) => {
    if (editPossible) {
      setSelectedTrap({
        index: trapIndex,
        item: item,
      });
      setSelectedCondition(condition);
      setPopupShow(true);
      setYLocationForPopUp(e.nativeEvent.pageY - 70);
    } else {
      toastContext.showToast(
        'You can edit the details only if the Job is in Processing stage !',
        'long',
        'warning',
      );
    }
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

  const dataPosthandler = () => {
    const item = {...itemToBePosted.item};
    const type =
      itemToBePosted.type === 'skip'
        ? 'Skipped'
        : itemToBePosted.type === 'partial'
        ? 'Partially Completed'
        : 'Completed';
    var formdata = new FormData();
    setBackendLoadingStatus('loading');
    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", `Bearer ${authContext.getAccessToken()}`);
    formdata.append('id', item.id);
    formdata.append(
      'grease_trap_condtion',
      item.grease_trap_condtion === null
        ? 'Not set'
        : item.grease_trap_condtion,
    );
    formdata.append(
      'waste_contents',
      item.waste_contents === null ? 'Not set' : item.waste_contents,
    );
    formdata.append(
      'cover_condition',
      item.cover_condition === null ? 'Not set' : item.cover_condition,
    );
    formdata.append(
      'buffle_wall_condition',
      item.buffle_wall_condition === null
        ? 'Not set'
        : item.buffle_wall_condition,
    );
    formdata.append(
      'outlet_elbow_condition',
      item.outlet_elbow_condition === null
        ? 'Not set'
        : item.outlet_elbow_condition,
    );
    formdata.append('status', type);

    item.beforePics.map((item, index) => {
      if (typeof item.id === 'number') {
        formdata.append('beforePicsUntouched', item.id);
      } else {
        const fileName = `${index}_before_${moment().valueOf()}${item.image[
          'fileName'
        ].slice(-5)}`;
        const file = {
          uri: item.image['uri'],
          name: fileName,
          type: item.image['type'],
        };

        formdata.append('beforePicsNew', file);
      }
    });
    item.afterPics.map((item, index) => {
      if (typeof item.id === 'number') {
        formdata.append('afterPicsUntouched', item.id);
      } else {
        const fileName = `${index}_after_${moment().valueOf()}${item.image[
          'fileName'
        ].slice(-5)}`;
        const file = {
          uri: item.image['uri'],
          name: fileName,
          type: item.image['type'],
        };

        formdata.append('afterPicsNew', file);
      }
    });
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authContext.getAccessToken()}`,
      },
      body: formdata,
      redirect: 'follow',
    };
    saveModalCloseHandler();
    fetch(
      baseURL + '/gtcc_api/update_service_request_grease_trap_details',
      requestOptions,
    )
      .then(response => {
        return response.text();
      })
      .then(data => {
        driverJobContext.setSelectedJob(data);
        setToggleOnUpdate(state => !state);
        setBackendLoadingStatus('success');
      })
      .catch(error => {
        setBackendLoadingStatus('error');
      });
    // }
  };

  const publishHandler = () => {
    const data = {
      id: route.params?.jobDetails.id,
      status: 'Completed',
      publish_location: location,
    };
    const url = '/gtcc_api/update_service_request';
    setBackendLoadingStatus('loading');
    authAxios
      .post(url, data)
      .then(response => {
        driverJobContext.setAllJobs(response.data);
        setBackendLoadingStatus('success');
        navigation.navigate('DriverHome');
      })
      .catch(error => {
        setBackendLoadingStatus('error');
      });
  };

  const onScroll = useCallback(event => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    const roundPositiveIndex = Math.abs(roundIndex);
    setScrollingItemIndex(roundPositiveIndex);
  }, []);

  return (
    <ScrollView>
      <AbaciLoader visible={backendLoadingStatus === 'loading'} />
      <AbaciModal
        visible={savingModalVisibility}
        onRequestClose={saveModalCloseHandler}
        height="50%">
        <Text style={globalStyles.h2_bold}>{messageOnSaveModal}</Text>
        <View style={{flexDirection: 'row', marginTop: 20}}>
          <ModalButton
            color="red"
            onPress={saveModalCloseHandler}
            label="Cancel"
          />
          <ModalButton
            color="green"
            onPress={dataPosthandler}
            label="Continue"
            disabled={!activateSaveButton}
          />
        </View>
      </AbaciModal>
      <AbaciModal
        visible={contactModalVisibility}
        onRequestClose={contactModalCloseHandler}>
        <Image
          style={{
            margin: 10,
            width: 75,
            height: 75,
            resizeMode: 'cover',
            borderRadius: 40,
          }}
          source={avatar}
          onError={e => setAvatar(tempAvatar)}
        />
        <Text style={globalStyles.h2_bold}>
          {driverJobContext.selectedJob?.restaurantContact?.full_name}
        </Text>
        <Text style={globalStyles.h2_regular} selectable={true}>
          {driverJobContext.selectedJob?.restaurantContact?.email}
        </Text>
        <Text style={globalStyles.h2_regular} selectable={true}>
          {driverJobContext.selectedJob?.restaurantContact?.contact_number}
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
                driverJobContext.selectedJob?.restaurantContact?.contact_number,
              )
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
            onPress={() =>
              onSendSMSMessage(
                driverJobContext.selectedJob?.restaurantContact?.contact_number,
              )
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
            onPress={() =>
              onSendWhatsappMessage(
                driverJobContext.selectedJob?.restaurantContact?.contact_number,
              )
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
      <RestaurentDetailsCard
        setContactModalVisibility={setContactModalVisibility}
        navigation={navigation}
        toBePublished={toBePublished}
        publishHandler={publishHandler}
        avatar={avatar}
        setAvatar={setAvatar}
        entityImage={entityImage}
        setEntityImage={setEntityImage}
      />
      <View
        style={{
          width: '100%',
          height: 600,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: '50%',
            height: 10,
            alignSelf: 'center',
            marginTop: 5,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          {/* TODO temporary grease trap to be replaced with backend data */}
          {greaseTraps.map((item, index) => (
            <View
              key={index}
              style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                backgroundColor:
                  index === scrollingItemIndex
                    ? Colors.gray
                    : Colors.light_gray,
                borderColor: Colors.gray,
                borderWidth: 1,
              }}
            />
          ))}
        </View>
        <Animated.FlatList
          entering={BounceInLeft}
          persistentScrollbar={true}
          onScroll={onScroll}
          data={greaseTraps}
          renderItem={({item, index}) => (
            <View style={styles.greaseTrapCard}>
              <TrapTagSvg
                item={item}
                needToSave={needToSave}
                saveHandler={saveHandler}
                toBeSkipped={toBeSkipped}
                savePossible={editPossible}
              />
              <TouchableOpacity>
                <Text style={styles.trapDetails}>
                  {item.grease_trap?.grease_trap?.description} -{' '}
                  {item.grease_trap?.grease_trap?.capacity} (Total Capacity)
                </Text>
              </TouchableOpacity>
              {conditions.map((conditionItem, conditionIndex) => {
                return (
                  <TouchableOpacity
                    key={conditionIndex}
                    disabled={
                      authContext?.authState?.userDetails?.user_type !==
                      'Driver'
                    }
                    onPress={e =>
                      conditionChangeHandler(e, item, index, conditionItem)
                    }>
                    <Text style={styles.conditionsLabel}>
                      {conditionItem.type} :{' '}
                      <Text style={styles.conditionsValue}>
                        {' '}
                        {item[conditionItem.key] === null
                          ? 'Not set'
                          : item[conditionItem.key]}
                      </Text>
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <BeforeAndAfterImages
                beforePics={item.beforePics}
                afterPics={item.afterPics}
                setGreaseTraps={setGreaseTraps}
                greaseTraps={greaseTraps}
                selectedTrap={{item: item, index: index}}
                editPossible={editPossible}
              />
              {/* 

                        */}
              <Text style={globalStyles.h2_bold}>{item.status}</Text>
            </View>
          )}
          alwaysBounceHorizontal={true}
          horizontal={true}
          keyExtractor={(item, index) => index}
          ListEmptyComponent={
            <View style={styles.greaseTrapCard}>
              <EmptyTraps />
            </View>
          }
          ListFooterComponent={
            <View style={{width: windowWidth * 0.05}}></View>
          }
        />
        {toBePublished ? (
          <View
            style={{
              width: '90%',
              height: 60,
              backgroundColor: '#c11027',
              borderRadius: 5,
              margin: 30,
              alignContent: 'center',
              justifyContent: 'center',
            }}>
            <Pressable
              onPress={publishHandler}
              android_ripple={{color: 'red', borderless: true}}>
              <Text style={[globalStyles.h2_bold, {color: 'white'}]}>
                Publish the SR
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      {popupShow ? (
        <PopUpConditionSelector
          yLocationForPopUp={yLocationForPopUp}
          setPopupShow={setPopupShow}
          selectedCondition={selectedCondition}
          setGreaseTraps={setGreaseTraps}
          greaseTraps={[...greaseTraps]}
          setNeedToSave={setNeedToSave}
          selectedTrap={selectedTrap}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main_wrapper: {
    flex: 1,
  },
  cardWrapper: {
    backgroundColor: 'white',
    height: '32%',
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d4d4d4',
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
    marginLeft: 40,
    fontSize: 14,
  },
  greaseTrapCard: {
    backgroundColor: 'white',
    height: windowHeight * 0.57,
    width: windowWidth * 0.9,
    marginLeft: windowWidth * 0.05,
    alignSelf: 'center',
    marginTop: 5,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  trapDetails: {
    fontFamily: 'Montserrat-Bold',
    color: Colors.dark_gray,
    margin: 10,
    marginLeft: 20,
  },
  conditionsLabel: {
    fontFamily: 'Montserrat-Regular',
    color: Colors.dark_gray,
    margin: 8,
    marginLeft: 40,
  },
  conditionsValue: {
    fontFamily: 'Montserrat-Italic',
    color: Colors.dark_gray,
    margin: 8,
    marginLeft: 40,
  },
});
