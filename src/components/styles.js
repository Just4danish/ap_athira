import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
} from 'react-native';

// colors
export const Colors = {
  white: '#ffffff',
  dark_gray: '#7a807c',
  gray: '#acb5ae',
  light_gray: '#e2e3e4',
  dark_green: '#489350',
  green: '#82c55b',
  light_green: '#199C69',
  blue: '#030F40',
  light_blue: '#7AB3ED',
  orange: '#F7B900',
  red: '#EB5B5B',
  yellow: '#c0ad21',
  black: '#2a2323',
  transparent_dark: 'rgba(0, 0, 0, 0.21)',
};

export const gradientSets = {
  set1: {
    start: '#2465FD',
    end: '#C25AFF',
  },
  set2: {
    start: '#0CB6CB',
    end: '#C4F987',
  },
  set3: {
    start: '#F24A5E',
    end: '#F879B3',
  },
};

export const jobStatusColors = {
  Initiated: Colors.gray,
  Assigned: Colors.blue,
  Processing: Colors.orange,
  Completed: Colors.green,
  Dumped: Colors.dark_green,
  Canceled: Colors.red,
  Initiated_transparent: 'rgba(171, 181, 173, 0.75)',
  Assigned_transparent: 'rgba(3, 15, 64, 0.75)',
  Processing_transparent: 'rgba(247, 185, 0, 0.75)',
  Completed_transparent: 'rgba(25, 156, 105, 0.75)',
  Dumped_transparent: 'rgba(72, 147, 80, 0.75)',
  Canceled_transparent: 'rgba(235, 91, 91, 0.75)',
};

export const trapStatusColors = {
  Completed: Colors.green,
  'Partially Completed': Colors.blue,
  Skipped: Colors.red,
  Pending: Colors.yellow,
};

export const vehicleStatusColors = {
  Entered: Colors.blue,
  Accepted: Colors.green,
  Rejected: Colors.red,
  Exited: Colors.yellow,
};

export const buttonColors = {
  red: Colors.red,
  green: Colors.green,
  orange: Colors.orange,
  gray: Colors.gray,
  yellow: Colors.yellow,
};

export const couponColors = {
  new: Colors.yellow,
  saved: Colors.green,
  Issued: Colors.yellow,
  Used: Colors.blue,
  Converted: Colors.green,
  Lost: Colors.red,
};

export const globalStyles = StyleSheet.create({
  main_wrapper: {
    flex: 1,
    backgroundColor: 'white',
    textAlign: 'center',
  },
  h1: {
    fontFamily: 'Montserrat-Light',
    fontSize: 18,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h1_regular: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h1_bold: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h1_dark: {
    fontFamily: 'Montserrat-Dark',
    fontSize: 18,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h2: {
    fontFamily: 'Montserrat-Light',
    fontSize: 15,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h2_regular: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h2_bold: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 15,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h2_dark: {
    fontFamily: 'Montserrat-Dark',
    fontSize: 15,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h3: {
    fontFamily: 'Montserrat-Light',
    fontSize: 12,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h3_regular: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h3_bold: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h3_dark: {
    fontFamily: 'Montserrat-Dark',
    fontSize: 12,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h4: {
    fontFamily: 'Montserrat-Light',
    fontSize: 10,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h4_regular: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 10,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h4_bold: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 10,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h4_dark: {
    fontFamily: 'Montserrat-Dark',
    fontSize: 10,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h5: {
    fontFamily: 'Montserrat-Light',
    fontSize: 8,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h5_regular: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 8,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h5_bold: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 8,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h5_dark: {
    fontFamily: 'Montserrat-Dark',
    fontSize: 8,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h6: {
    fontFamily: 'Montserrat-Light',
    fontSize: 6,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h6_regular: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 6,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h6_bold: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 6,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
  h6_dark: {
    fontFamily: 'Montserrat-Dark',
    fontSize: 6,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
});
