import AsyncStorage from '@react-native-async-storage/async-storage';

const _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(
        key,
        value
      );
    } catch (error) {
      // Error saving data
    }
  };

  export {_storeData}