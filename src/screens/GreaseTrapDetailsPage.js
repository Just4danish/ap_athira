import { View, Text, KeyboardAvoidingView, Image } from 'react-native'
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { InspectorJobContext } from '../context/InspectorJobContext'
import { cardCategoriesList } from '../components/InspectorSearch/searchInCategoriesList'
import { useIsFocused } from '@react-navigation/native'
import { Colors, globalStyles } from '../components/styles'
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import AbaciModal from '../components/AbaciModal'
import ModalButton from '../components/Buttons/ModalButton'
import { AxiosContext } from '../context/AxiosContext'
import { ToastContext } from '../context/ToastContext'
import AbaciLoader from '../components/AbaciLoader'
import baseURL from '../helpers/baserURL'
const noImage = require('../assets/images/noimage.png')


export default function GreaseTrapDetailsPage({ navigation, route }) {
  const [image, setImage] = useState(null)

  const inspectorContext = useContext(InspectorJobContext)
  const { authAxios } = useContext(AxiosContext)
  const isFocused = useIsFocused()
  const [editEnabled, setEditEnabled] = useState(false)
  const [itemInfo, setItemInfo] = useState(null)
  const [itemInfoWhichAreEdited, setItemInfoInfoWhichAreEdited] = useState({})
  const [focusedItem, setFocusedItem] = useState(null)
  const [warningModalVisibility, setWarningModalVisibility] = useState(false)
  const [enableSaveButton, setEnableSaveButton] = useState(false)
  const toastContext = useContext(ToastContext)
  const [backendLoadingStatus, setBackendLoadingStatus] = useState('success')

  useEffect(() => {
    if (itemInfo !== null) {
      if (itemInfo.grease_trap.image !== null) {
        setImage({ uri: baseURL + itemInfo?.grease_trap.image + `?${new Date()}` })
      }
      else {
        setImage(noImage)
      }
    }

  }, [itemInfo])

  const editHandler = () => {
    setEditEnabled(true)
  }
  const saveHandler = () => {
    // here we need to extract only those fields which had edited. itemInfoWhichAreEdited will contain all fields once edited regardless of those edited back to its original value.
    let data = {}
    Object.keys(itemInfoWhichAreEdited).map(key => {
      if (itemInfoWhichAreEdited[key] === inspectorContext.selectedEntity[key]) {
        // pass
      }
      else {
        data = { ...data, [key]: itemInfoWhichAreEdited[key] }
      }
    })
    const url = `/inspector_api/entity_update/${inspectorContext.selectedEntity.id}`
    setItemInfoInfoWhichAreEdited(data)
    setBackendLoadingStatus('loading')
    authAxios.post(url, data).then(response => {
      toastContext.showToast("Establishment details updated successfully!", 'short', 'success')
      let modificationApprovalPendingFields = inspectorContext.selectedEntity.modificationApprovalPendingFields === null ? {} : inspectorContext.selectedEntity.modificationApprovalPendingFields
      // inspectorContext.setSelectedEntity({ ...itemInfo, modification_pending: true, modificationApprovalPendingFields: { ...modificationApprovalPendingFields, ...data } })
      // setItemInfoInfoWhichAreEdited({})
      setEditEnabled(false)
      setBackendLoadingStatus('success')
    })
      .catch(error => {
        toastContext.showToast("Error occured while updating the details!", 'short', 'error')
        setBackendLoadingStatus('error')
      })
  }
  const checkForEdit = () => {
    // let tempInfo = {}
    // if (inspectorContext.selectedEntity.modification_pending) {
    //     tempInfo = { ...inspectorContext.selectedEntity, ...inspectorContext.selectedEntity.modificationApprovalPendingFields }
    // }
    // else {
    //     tempInfo = { ...inspectorContext.selectedEntity }
    // }
    const originalState = JSON.stringify({ ...inspectorContext.selectedEntity, ...inspectorContext.selectedEntity?.modificationApprovalPendingFields })
    const editedState = JSON.stringify(itemInfo)
    if (originalState === editedState) {
      return false
    }
    else {
      return true
    }
  }
  const cancelHandler = () => {
    const isEdited = checkForEdit()
    if (isEdited) {
      setWarningModalVisibility(true)
    }
    else {
      setEditEnabled(false)
    }
  }
  const changeValueHandler = (val, item) => {
    setItemInfo(state => (
      { ...state, [item.type]: val }
    ))
    setItemInfoInfoWhichAreEdited(state => (
      { ...state, [item.type]: val }
    ))
  }
  useEffect(() => {
    const tempItem = route.params?.item
    setItemInfo(tempItem.item)
  }, [route.params])

  useEffect(() => {
    const changed = checkForEdit()
    setEnableSaveButton(changed)
  }, [itemInfo])
  if (itemInfo === null){
    return null
  }
  else{
    return (
      <ScrollView
        style={{
          padding: 20,
          paddingTop: 50,
          flex: 1,
        }}>
        <AbaciLoader visible={backendLoadingStatus === 'loading'} />
        <AbaciModal visible={warningModalVisibility} onRequestClose={() => setWarningModalVisibility(false)}>
          <Text style={globalStyles.h2_bold}>Do you want to discard the changes you made?</Text>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <ModalButton
              color='red'
              onPress={() => {
                setItemInfo(inspectorContext.selectedEntity)
                setWarningModalVisibility(false)
                setItemInfoInfoWhichAreEdited({})
              }}
              label='Yes'
            />
            <ModalButton
              color='green'
              onPress={() => setWarningModalVisibility(false)}
              label='No'
            />
          </View>
        </AbaciModal>
        <View
        style = {{
          width:'100%',
          height:300,
          padding:20,
          backgroundColor:Colors.light_gray,
          borderRadius:10
        }}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain'
          }}
          source={image}
          onError={(e) => setImage(noImage)}
        />
        </View>
        <Item label="Grease Trap ID" value={itemInfo.grease_trap.grease_trap_id} editEnabled={editEnabled} />
        <Item label="Capacity" value={itemInfo.capacity} editEnabled={editEnabled} />
        <Item label="Label" value={itemInfo.label} editEnabled={editEnabled} />
        <Item label="Food Watch ID" value={itemInfo.grease_trap.foodwatch_id} editEnabled={editEnabled} />
        <Item label="Part Number" value={itemInfo.grease_trap.part_no} editEnabled={editEnabled} />
        <Item label="Material" value={itemInfo.grease_trap.material} editEnabled={editEnabled} />
        <Item label="Shape" value={itemInfo.grease_trap.shape} editEnabled={editEnabled} />
        <Item label="Manufacturer" value={itemInfo.grease_trap.manufacturer} editEnabled={editEnabled} />
        <Item label="Width" value={`${itemInfo.grease_trap.width} m`} editEnabled={editEnabled} />
        <Item label="Length" value={`${itemInfo.grease_trap.length} m`} editEnabled={editEnabled} />
        <Item label="Remarks" value={itemInfo.grease_trap.remarks} editEnabled={editEnabled} />
        <Item label="Status" value={itemInfo.grease_trap.status} editEnabled={editEnabled} />
        <View
          style={{
            width: '100%',
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {
            editEnabled ?
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-around'
                }}>
                <TouchableOpacity
                  onPress={saveHandler}
                  disabled={!enableSaveButton}
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: enableSaveButton ? '#38a344' : Colors.dark_gray,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Icon name="save" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={cancelHandler}
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: '#ea4873',
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Icon name="times-circle" size={30} color="white" />
                </TouchableOpacity>
              </View>
              :
              <TouchableOpacity
                onPress={editHandler}
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: '#ea4873',
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Icon name="edit" size={30} color="white" />
              </TouchableOpacity>
          }
  
        </View>
      </ScrollView>
    )
  }
  
}

const Item = ({
  label,
  value,
  editEnabled
}) => {
  return (
    <View
      style={{
        width: '90%',
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.gray,
        height: 60,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 0,
        paddingBottom: 0
      }}>
      <Text
        style={{
          fontFamily: 'Montserrat-Bold',
          color: '#2a2323',
          fontSize: 14
        }}
      >
        {label}
      </Text>

      <TextInput
        numberOfLines={1}
        style={{
          fontFamily: 'Montserrat-Regular',
          color: '#2a2323',
          // color: '#2a2323',
          fontSize: 14,
          width: 150,
          textAlign: 'right',
          borderColor: Colors.gray,
          borderWidth: 0,
          height: '70%',
          borderRadius: 5,
          height: 40
        }}
        editable={editEnabled}
        selectTextOnFocus={editEnabled}
        showSoftInputOnFocus={editEnabled}
        value={String(value)}
      // onChangeText={(val) => { changeValueHandler(val, item) }}
      // onFocus={() => setFocusedItem(item)}
      // onBlur={() => setFocusedItem(null)}
      >
      </TextInput>

    </View>
  )
}