import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {Colors, globalStyles} from '../components/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AuthContext} from '../context/AuthContext';
import {AxiosContext} from '../context/AxiosContext';
import {ToastContext} from '../context/ToastContext';
import ConnectionErrorLottie from '../components/ConnectionErrorLottie';

import {_storeData} from '../helpers/asyncStorageHelper';
const backgroundImage = require('../assets/images/bg_images_login.jpg');
const logo = require('../assets/images/logo.png');
const dm_logo = require('../assets/images/dm_logo.png');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BootError = props => {
  const handleSubmit = () => {
    props.setToggle(state => !state);
  };

  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <View
        style={{
          height: windowHeight / 2,
          width: windowWidth,
        }}>
        <Image
          style={{
            width: '100%',
            height: '100%',
          }}
          source={backgroundImage}
        />
      </View>
      <View
        style={{
          height: windowHeight / 2,
          width: windowWidth,
          padding: 20,
          // flex: 2,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Image
            source={logo}
            resizeMode="contain"
            style={{
              width: '50%',
              height: 60,
              justifyContent: 'center',
            }}></Image>
          <Image
            source={dm_logo}
            resizeMode="contain"
            style={{
              width: '50%',
              height: 60,
              justifyContent: 'center',
            }}></Image>
        </View>
        {/* <Text style={globalStyles.h2_bold}>Fogwatch</Text> */}
          <View style={{
            marginTop:20,
          }}>
            <Text style={globalStyles.h3_bold}>
              Fogwatch Server Not reachable ! {'\n'}
              Please check your connection and retry !
            </Text>
            <ConnectionErrorLottie />
          </View>
          <Pressable
            style={styles.login_button}
            android_ripple={{color: 'green'}}
            onPress={handleSubmit}
            disabled={false}>
            {props.waitForAxios ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
              <Text style={{...globalStyles.h2_bold, color: Colors.white}}>
                Retry
              </Text>
            )}
          </Pressable>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text_input_section: {
    // backgroundColor: Colors.dark_green,
    // flexDirection: 'row',
    // borderRadius: 5,
    // marginTop: 10,
  },
  text_input_button_wrapper: {
    backgroundColor: Colors.white,
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 30,
    borderWidth: 1,
    borderColor: Colors.dark_green,
  },
  input_icon: {
    margin: 10,
  },
  login_button: {
    marginTop:20,
    height: 50,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:Colors.green
  },
  login_button_text: {
    color: Colors.green,
    fontFamily: 'Montserrat-Black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BootError;
