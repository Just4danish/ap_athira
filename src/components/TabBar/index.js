import { NavigationContainer } from '@react-navigation/native';
import { indexOf } from 'lodash';
import React, { useState, useRef, useContext } from 'react';
import { useEffect } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Easing,
  Keyboard
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import NavigationContext from '../../context/NavigationContext';
// import TabContext from '../../context/TabContext';
import Home from '../../screens/Home/Home';
import { tabBarIcons } from './icons';
import SearchBox from './SearchBox';

const { width, height } = Dimensions.get('window');

const TabHeight = 60;

const ActiveIcon = ({ icon, width, activeIndex: i, translateX }) => {
  const yInputRange = [(i - 1) * width, i * width, (i + 1) * width];
  const yOutputRange = [width / 2, -width / 2, width / 2];
  const opacityOutputRange = [0, 1, 0];
  const translateY = translateX.interpolate({
    inputRange: yInputRange,
    outputRange: yOutputRange,
  });
  const opacity = translateX.interpolate({
    inputRange: yInputRange,
    outputRange: opacityOutputRange,
  });
  if (i === 0) {
    return null
  }
  else {
    return (
      <Animated.View
        style={[
          styles.activeIcon,
          {
            width: width * 0.75,
            height: width * 0.75,
            transform: [{ translateY }],
            opacity,
            backgroundColor: icon.backgroundColor,
          },
        ]}>
        <Svg width={icon.width} height={icon.height}>
          <Path d={icon.d} fill={icon.fill} />
        </Svg>
      </Animated.View>
    );
  }


};

const TabBarCurve = ({
  width,
  height,
  activeIndex = 0,
  activeIcon = '',
  translateX,
}) => {
  const [svgVal, setSvgVal] =
    useState(`M-0.08-0.05C-0.1,0.58,4.4,0.06,10.97,10.45c0,0,15.46,22.92,28.4,22.92c13.24,0,26.29-21.82,26.29-21.82
	C72.28,0.12,78.47-0.05,78.47-0.05`);
  return (
    <Animated.View style={[styles.curve, { transform: [{ translateX }] }]}>
      <Svg width={width} height={height}>
        <Path fill="#F6FAFC" d={svgVal} stroke="#dcddde" />
      </Svg>
      {
        activeIndex == 0 ?
          null
          :
          <ActiveIcon
            width={width}
            height={height}
            activeIndex={activeIndex}
            translateX={translateX}
            icon={activeIcon}
          />
      }

    </Animated.View>
  );
};

const TabBarMain = ({searchBox = true}) => {
  const [activeIndex, setActiveIndex] = useState(2);
  const navigationContext = useContext(NavigationContext)
  useEffect(() => {
    navigationContext.setTabPosition(navigationContext.tabs[activeIndex])
  }, [activeIndex])
 
  return (
    <View style={styles.container}>
      <TabBar setCurrentIndex={setActiveIndex} activeIndex={activeIndex} searchBox={searchBox}/>
    </View>
  );
};

const TabBar = ({ activeIndex, setCurrentIndex, searchBox }) => {
  const navigationContext = useContext(NavigationContext)
  const TabWidth = width / (navigationContext.tabs.length || 1);
  const AnimationValue = useRef(new Animated.Value(0));
  const pressHandler = (i) => {
    setCurrentIndex(i);
    Animated.timing(AnimationValue.current, {
      duration: 500 * Math.max(1, Math.abs(activeIndex - i) / 2),
      toValue: TabWidth * i,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
    // setTab(i);
    return true;
  }
  useEffect(() => {
    const currentTabIndex = navigationContext.tabs.indexOf(navigationContext.tabPosition)
    pressHandler(currentTabIndex)
  }, [navigationContext.toggleToMoveTabBarIcon])
  return (
    <View style={styles.tabBar}>
      {navigationContext.tabs.map((item, i) => {
        const opacityInputRange = [
          (i - 1) * TabWidth,
          i * TabWidth,
          (i + 1) * TabWidth,
        ];
        const opacityOutputRange = [1, 0, 1];
        const opacity = AnimationValue.current.interpolate({
          inputRange: opacityInputRange,
          outputRange: opacityOutputRange,
        });
        const tempStyle =
          activeIndex === i
            ? { ...styles.tabBar, width: TabWidth, height: TabHeight, opacity }
            : {
              ...styles.tabBar,
              width: TabWidth,
              height: TabHeight,
              opacity,
              borderTopColor: 'rgba(102, 102, 102, 0.1)',
            };

        return (
          <TouchableOpacity
            style={{ width: TabWidth, height: TabHeight }}
            key={i}
            onPress={() => pressHandler(i)}>
            <Animated.View style={tempStyle}>
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: tabBarIcons[item].backgroundColor },
                ]}>
                <Svg
                  width={tabBarIcons[item].width}
                  height={tabBarIcons[item].height}>
                  <Path d={tabBarIcons[item].d} fill={tabBarIcons[item].fill} />
                </Svg>
              </View>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
      <>

        {
          activeIndex === 0 && searchBox ?
            <SearchBox activeIndex={activeIndex} icon={tabBarIcons[navigationContext.tabs[activeIndex]]} />
            :
            null}

        <TabBarCurve
          translateX={AnimationValue.current}
          width={TabWidth}
          height={TabHeight}
          activeIndex={activeIndex}
          activeIcon={tabBarIcons[navigationContext.tabs[activeIndex]]}
        />
      </>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position:'absolute',
    bottom:0,
    // flex: 1,
    width,
    // height: '100%',
    position: 'relative',
    backgroundColor: '#F6FAFC',
    justifyContent: 'flex-end',
  },
  tab: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    width,
    height: TabHeight,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent',
    borderWidth: 1,
  },
  curve: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIcon: {
    position: 'absolute',
    top: 0,
    width: 52,
    height: 52,
    borderRadius: 40,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: "red",
    elevation: 5,
  },
});

export default TabBarMain;
