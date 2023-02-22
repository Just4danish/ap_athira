import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors, globalStyles} from '../src/components/styles';
import {AuthContext} from '../src/context/AuthContext';
import baseURL from '../src/helpers/baserURL';
import DeviceInfo from 'react-native-device-info';
import {AxiosContext} from '../src/context/AxiosContext';
import {ToastContext} from '../src/context/ToastContext';
import AbaciLoader from '../src/components/AbaciLoader';

// const tempImage = require("../src/assets/images/no-logo.png")

export default function CustomDrawerContent({navigation}) {
  const authContext = useContext(AuthContext);
  // const [image, setImage] = useState(null)
  const [property, setProperty] = useState(null);
  const [garbageRoom, setGarbageRoom] = useState(null);
  const [garbageByQR, setGarbageByQR] = useState(false);
  const [operator, setOperator] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState('success');
  const {authAxios} = useContext(AxiosContext);
  const toastContext = useContext(ToastContext);
  useEffect(() => {
    if (
      authContext.authState.property_from_qr !== null &&
      typeof authContext.authState.property_from_qr !== 'undefined'
    ) {
      const tempProp = authContext.authState.property_from_qr;
      setGarbageByQR(true);
      setProperty(tempProp);
      setGarbageRoom(authContext.authState.garbageRoom);
    } else if (
      authContext.authState.property !== null &&
      typeof authContext.authState.property !== 'undefined'
    ) {
      const tempProp = authContext.authState.property;
      setGarbageByQR(false);
      setProperty(tempProp);
      setGarbageRoom(authContext.authState.garbageRoom);
    } else {
      setProperty(null);
      setGarbageRoom(null);
    }
    const operatorName =
      authContext.authState.first_name +
      ' ' +
      (authContext.authState.last_name !== null
        ? authContext.authState.last_name
        : '');
    const contactNo = authContext.authState.username;
    setOperator({
      name: operatorName,
      number: contactNo,
    });
  }, [authContext]);

  const logout = () => {
    Alert.alert(
      'Do you want to Logout from Fogwatch?',
      '',
      [
        {
          text: 'No',
          onPress: () => navigation.closeDrawer(),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            logoutConfirmHandler();
          },
          style: 'cancel',
        },
      ],
      {
        type: 'plain-text',
      },
    );
  };

  const logoutConfirmHandler = () => {
    setLoadingStatus('loading');
    const url = '/users_api/logout';
    authAxios
      .post(url)
      .then(response => {
        authContext.logout();
        navigation.closeDrawer();
        toastContext.showToast('Logged out successfully!', 'short', 'success');
        setTimeout(() => setLoadingStatus('success'), 500);
        // setLoadingStatus('success')
      })
      .catch(error => {
        toastContext.showToast(
          'Error in logging out!. Makesure you have an active connection',
          'short',
          'error',
        );
        setLoadingStatus('error');
      });
  };

  return (
    <View style={styles.main_wrapper}>
      <AbaciLoader visible={loadingStatus === 'loading'} />
      <View style={styles.logo_wrapper}>
        <Image
          style={styles.logo_image}
          source={require('../src/assets/images/logo.png')}
        />
      </View>
      <View style={styles.body_wrapper}>
        <Text style={globalStyles.h2_bold} ellipsizeMode="tail">
          Fogwatch
        </Text>
        <Text style={globalStyles.h2}>
          App Version: {DeviceInfo.getVersion()}
        </Text>
        {authContext?.authState?.userDetails?.user_type === 'Driver' ? (
          <DriverSidebarContents details={authContext.authState?.userDetails} />
        ) : authContext?.authState?.userDetails?.user_type === 'Operator' ? (
          <OperatorSidebarContents
            details={authContext.authState?.userDetails}
          />
        ) : authContext?.authState?.userDetails?.user_type === 'Inspector' ? (
          <InspectorSidebarContents
            details={authContext.authState?.userDetails}
          />
        ) : null}
      </View>
      <View style={styles.footer_wrapper}>
        <Pressable
          style={styles.logout_card}
          android_ripple={{color: Colors.green}}
          onPress={logout}>
          <Icon
            name="power-settings-new"
            size={30}
            style={styles.logout_icon}
          />
          <Text style={styles.logout_text}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const DriverSidebarContents = ({details}) => {
  const valueChecker = value => (value === null ? 'Not Available' : value);
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        paddingTop: 20,
      }}>
      <SidebarInfoItem label={'Driver'} value={details?.full_name} />
      {/* {details?.emp_id && ( */}
      {/* <SidebarInfoItem
        label={'Employee ID'}
        value={valueChecker(details?.emp_id)}
      /> */}
      {/* )} */}
      {/* {details?.emp_id === null ? null : (
        <SidebarInfoItem label={'Employee ID'} value={details?.emp_id} />
      )} */}

      <SidebarInfoItem
        label={'Driving License No.'}
        value={valueChecker(details?.license_no)}
      />
      <SidebarInfoItem
        label={'GTCC'}
        value={valueChecker(details?.gtcc?.establishment_name)}
        numberOfLines={2}
      />
      <SidebarInfoItem
        label={'GTCC TL No.'}
        value={valueChecker(details?.gtcc?.trade_license_no)}
      />
      <SidebarInfoItem
        label={'Foodwatch Business ID'}
        value={valueChecker(details?.gtcc?.foodwatch_business_id)}
      />
      <SidebarInfoItem
        label={'Driver Status'}
        value={valueChecker(details?.user_status)}
      />
    </View>
  );
};

const OperatorSidebarContents = ({details}) => {
  const valueChecker = value => (value === null ? 'Not Available' : value);
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        paddingTop: 20,
      }}>
      <SidebarInfoItem
        label={'Operator'}
        value={valueChecker(details?.full_name)}
      />
      <SidebarInfoItem
        label={'Employee ID'}
        value={valueChecker(details?.emp_id)}
      />
      {/* <SidebarInfoItem label={'Email'} value={valueChecker(details?.email)} /> */}
      <SidebarInfoItem
        label={'Contact Number'}
        value={valueChecker(details?.contact_number)}
      />
      <SidebarInfoItem
        label={'Operator Status'}
        value={valueChecker(details?.user_status)}
      />
    </View>
  );
};

const InspectorSidebarContents = ({details}) => {
  const valueChecker = value => (value === null ? 'Not Available' : value);
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        paddingTop: 20,
      }}>
      <SidebarInfoItem
        label={'Operator'}
        value={valueChecker(details?.full_name)}
      />
      <SidebarInfoItem
        label={'Employee ID'}
        value={valueChecker(details?.emp_id)}
      />
      <SidebarInfoItem label={'Email'} value={valueChecker(details?.email)} />
      <SidebarInfoItem
        label={'Contact Number'}
        value={valueChecker(details?.contact_number)}
      />
      <SidebarInfoItem
        label={'Operator Status'}
        value={valueChecker(details?.user_status)}
      />
    </View>
  );
};

const SidebarInfoItem = ({label, value, numberOfLines = 1}) => (
  <View
    style={{
      width: '90%',
      justifyContent: 'space-around',
      marginTop: 10,
      borderBottomColor: Colors.light_gray,
      borderBottomWidth: 1,
      paddingBottom: 5,
    }}>
    <Text
      style={{
        fontFamily: 'Montserrat-Bold',
        color: 'black',
      }}>
      {label}
    </Text>
    <Text
      style={{
        fontFamily: 'Montserrat-Regular',
        color: 'black',
      }}
      numberOfLines={numberOfLines}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  main_wrapper: {
    flex: 1,
    paddingTop: 30,
  },
  logo_wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  logo_image: {
    resizeMode: 'contain',
    width: '65%',
    backgroundColor: 'white',
  },
  property_image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    backgroundColor: 'white',
  },
  body_wrapper: {
    flex: 5,
  },
  footer_wrapper: {
    flex: 3,
    justifyContent: 'flex-end',
  },
  logout_icon: {
    color: 'white',
  },
  logout_text: {
    color: 'white',
    fontSize: 15,
    marginLeft: 20,
  },
  logout_card: {
    width: '100%',
    height: 50,
    borderTopColor: '#78cf8d',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    backgroundColor: Colors.light_blue,
    borderWidth: 1,
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
  },

  item_text: {
    color: Colors.gray,
    fontSize: 18,
    marginLeft: 20,
  },
  property_wrapper: {
    height: '75%',
    width: '75%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  property_title: {
    color: Colors.gray,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  operator_title: {
    color: Colors.gray,
    fontSize: 18,
    marginLeft: 10,
  },
});
