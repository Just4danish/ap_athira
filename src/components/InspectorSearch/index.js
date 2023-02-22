import { View, Text, FlatList, Pressable } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import SearchBar from '../SearchBar'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, color, Easing, withTiming, BounceInLeft, BounceOutLeft } from 'react-native-reanimated';
import { Colors } from '../styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AxiosContext } from '../../context/AxiosContext';
import { InspectorJobContext } from '../../context/InspectorJobContext';
import AbaciLoader from '../AbaciLoader'
import { useNavigation } from '@react-navigation/native';
import { searchInCategoriesList } from './searchInCategoriesList.js'
import { ToastContext } from '../../context/ToastContext'

export default function index() {
  const navigation = useNavigation()
  const { authAxios } = useContext(AxiosContext)
  const inspectorJobContext = useContext(InspectorJobContext)
  const [backendLoadingStatus, setBackendLoadingStatus] = useState('success')
  const [searchInCategories, setSearchInCategories] = useState(searchInCategoriesList)
  const toastContext = useContext(ToastContext)
  const [searchValue, setSeachValue] = useState('')

  const searchHandler = (searchIn, searchType = 'new', pageNum = 1, ordering = 'ASC') => {
    inspectorJobContext.setSearchUpdateToggle({ status: false, type: null })
    inspectorJobContext.setSearchInType(searchIn)

    if (searchValue !== '') {
      setBackendLoadingStatus('loading')
      const url = `/inspector_api/search/?search_in=${searchIn}&search_text=${searchValue}&search_type=results&page=${pageNum}&ordering=${ordering}` + inspectorJobContext.filterPartForUrl
      inspectorJobContext.setSearchUrl(url)
      authAxios.get(url).then(response => {
        if (searchType === 'new' || searchType === 'sort' || searchType === 'filter') {
          inspectorJobContext.setSmartSeachResults(response?.data)
        }
        else {
          inspectorJobContext.setSmartSeachResults(state => ({ ...state, data: [...state.data, ...response?.data?.data] }))
        }
        navigation.navigate("SearchResults")
        setBackendLoadingStatus('success')

      })
        .catch(error => {
          let message = "Error occured, please try again !"

          if (error.message.includes("40")) {
            message = "No records available !"
          }
          else if (error.message.includes("50")) {
            message = "Please check your connection !"
          }
          toastContext.showToast(message, 'short', 'warning')
          setBackendLoadingStatus('error')

        })
    }
  }

  useEffect(() => {
    // This effect is to update the search results from other components.
    if (inspectorJobContext.searchUpdateToggle.status) {
      searchHandler(inspectorJobContext.searchInType, searchType = inspectorJobContext.searchUpdateToggle.type, pageNum = inspectorJobContext.pageNumber, ordering = inspectorJobContext.ordering)
    }
  }, [inspectorJobContext.searchUpdateToggle])



  return (
    <View>
      <AbaciLoader visible={backendLoadingStatus === 'loading'} />
      <SearchBar searchValue={searchValue} setSeachValue={setSeachValue} />
      <Animated.FlatList
        style={{
          width: '90%',
          minHeight: 100,
          backgroundColor: 'white',
          alignSelf: 'center',
          marginTop: 150,
          borderRadius: 10,
        }}
        data={searchInCategories}
        refreshing={backendLoadingStatus === 'loading'}
        renderItem={(item) => (
          <TouchableOpacity
            style={{
              width: '90%',
              height: 50,
              backgroundColor: 'white',
              alignSelf: 'center',
              justifyContent: 'flex-end',
              // margin: 10,
              borderBottomWidth: 1,
              borderBottomColor: Colors.light_gray
            }}
            onPress={() => {
              searchHandler(item.item.type)
              // inspectorJobContext.searchHandler(item.item.type)
              // navigation.navigate('SearchResults')
            }}
          >
            <Text
              style={{ color: Colors.dark_gray, paddingLeft: 5, fontFamily: "Montserrat-Medium", fontSize: 15, bottom: 5 }}
            >
              {item.item.description}
            </Text>
          </TouchableOpacity>
        )
        }
        entering={BounceInLeft}
        exiting={BounceOutLeft}
        ListFooterComponent={() => <View style={{ height: 60 }}
        />}
      />
    </View>

  )
}