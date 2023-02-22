import React, {useState, createContext, useEffect} from 'react';

const NavigationContext = createContext();
const {Provider} = NavigationContext;

const NavigationProvider = ({children}) => {
  const [sidebarSwitch, setSidebarSwitch] = useState(false);
  const [tabBarVisibility, setTabBarVisibility] = useState(false);
  const [tabPosition, setTabPosition] = useState('home');
  const [toggleToMoveTabBarIcon, setToggleToMoveTabBarIcon] = useState(false);
  const [tabs, setTabs] = useState(['search', 'camera', 'home', 'filter', 'new'])

  const hideSidebarSwitch = () => {
    setSidebarSwitch(false)
  }
  const showSideBarSwitch = () => {
    setSidebarSwitch(true)
  }
  const hideTabbar = () => {
    setTabBarVisibility(false)
  }
  const showTabBar = () => {
    setTabBarVisibility(true)
  }
  useEffect(()=>{
    if(tabPosition === 'camera'){
      hideTabbar()
      hideSidebarSwitch()
    }
  },[tabPosition])
  return <Provider value={{sidebarSwitch, 
    hideSidebarSwitch, 
    showSideBarSwitch,
    hideTabbar,
    showTabBar,
    tabBarVisibility,
    tabPosition,
    setTabPosition,
    tabs,
    setTabs,
    toggleToMoveTabBarIcon, 
    setToggleToMoveTabBarIcon
  }}>{children}</Provider>;
};

export {NavigationContext as default, NavigationProvider};
