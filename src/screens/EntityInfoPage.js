import {View, Text, KeyboardAvoidingView} from 'react-native';
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from 'react';
import {InspectorJobContext} from '../context/InspectorJobContext';
import {cardCategoriesList} from '../components/InspectorSearch/searchInCategoriesList';
import {useIsFocused} from '@react-navigation/native';
import {Colors, globalStyles} from '../components/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import AbaciModal from '../components/AbaciModal';
import ModalButton from '../components/Buttons/ModalButton';
import {AxiosContext} from '../context/AxiosContext';
import {ToastContext} from '../context/ToastContext';
import AbaciLoader from '../components/AbaciLoader';

export default function EntityInfoPage() {
  const inspectorContext = useContext(InspectorJobContext);
  const {authAxios} = useContext(AxiosContext);
  const isFocused = useIsFocused();
  const [editEnabled, setEditEnabled] = useState(false);
  const [entityInfo, setEntityInfo] = useState(null);
  const [entityInfoWhichAreEdited, setEntityInfoInfoWhichAreEdited] = useState(
    {},
  );
  const [focusedItem, setFocusedItem] = useState(null);
  const [warningModalVisibility, setWarningModalVisibility] = useState(false);
  const [enableSaveButton, setEnableSaveButton] = useState(false);
  const toastContext = useContext(ToastContext);
  const [backendLoadingStatus, setBackendLoadingStatus] = useState('success');

  const editHandler = () => {
    setEditEnabled(true);
  };
  const saveHandler = () => {
    // here we need to extract only those fields which had edited. entityInfoWhichAreEdited will contain all fields once edited regardless of those edited back to its original value.
    let data = {};
    Object.keys(entityInfoWhichAreEdited).map(key => {
      if (
        entityInfoWhichAreEdited[key] === inspectorContext.selectedEntity[key]
      ) {
        // pass
      } else {
        data = {...data, [key]: entityInfoWhichAreEdited[key]};
      }
    });
    const url = `/inspector_api/entity_update/${inspectorContext.selectedEntity.id}`;
    setEntityInfoInfoWhichAreEdited(data);
    setBackendLoadingStatus('loading');
    authAxios
      .post(url, data)
      .then(response => {
        toastContext.showToast(
          'Establishment details updated successfully!',
          'short',
          'success',
        );
        let modificationApprovalPendingFields =
          inspectorContext.selectedEntity.modificationApprovalPendingFields ===
          null
            ? {}
            : inspectorContext.selectedEntity.modificationApprovalPendingFields;
        // inspectorContext.setSelectedEntity({ ...entityInfo, modification_pending: true, modificationApprovalPendingFields: { ...modificationApprovalPendingFields, ...data } })
        // setEntityInfoInfoWhichAreEdited({})
        setEditEnabled(false);
        setBackendLoadingStatus('success');
      })
      .catch(error => {
        toastContext.showToast(
          'Error occured while updating the details!',
          'short',
          'error',
        );
        setBackendLoadingStatus('error');
      });
  };
  const checkForEdit = () => {
    // let tempInfo = {}
    // if (inspectorContext.selectedEntity.modification_pending) {
    //     tempInfo = { ...inspectorContext.selectedEntity, ...inspectorContext.selectedEntity.modificationApprovalPendingFields }
    // }
    // else {
    //     tempInfo = { ...inspectorContext.selectedEntity }
    // }
    const originalState = JSON.stringify({
      ...inspectorContext.selectedEntity,
      ...inspectorContext.selectedEntity?.modificationApprovalPendingFields,
    });
    const editedState = JSON.stringify(entityInfo);
    if (originalState === editedState) {
      return false;
    } else {
      return true;
    }
  };
  const cancelHandler = () => {
    const isEdited = checkForEdit();
    if (isEdited) {
      setWarningModalVisibility(true);
    } else {
      setEditEnabled(false);
    }
  };
  const changeValueHandler = (val, item) => {
    setEntityInfo(state => ({...state, [item.type]: val}));
    setEntityInfoInfoWhichAreEdited(state => ({...state, [item.type]: val}));
  };
  useEffect(() => {
    // let tempInfo = { ...inspectorContext.selectedEntity }
    // if (inspectorContext.selectedEntity?.modification_pending) {
    //     setEntityInfoInfoWhichAreEdited(inspectorContext.selectedEntity?.modificationApprovalPendingFields)
    //     tempInfo = { ...tempInfo, ...inspectorContext.selectedEntity?.modificationApprovalPendingFields }
    // }
    setEntityInfo({
      ...inspectorContext.selectedEntity,
      ...inspectorContext.selectedEntity?.modificationApprovalPendingFields,
    });
  }, []);

  useEffect(() => {
    const changed = checkForEdit();
    setEnableSaveButton(changed);
  }, [entityInfo]);

  return (
    <ScrollView
      style={{
        padding: 20,
        paddingTop: 50,
        flex: 1,
      }}>
      <AbaciLoader visible={backendLoadingStatus === 'loading'} />
      <AbaciModal
        visible={warningModalVisibility}
        onRequestClose={() => setWarningModalVisibility(false)}>
        <Text style={globalStyles.h2_bold}>
          Do you want to discard the changes you made?
        </Text>
        <View style={{flexDirection: 'row', marginTop: 20}}>
          <ModalButton
            color="red"
            onPress={() => {
              setEntityInfo(inspectorContext.selectedEntity);
              setWarningModalVisibility(false);
              setEntityInfoInfoWhichAreEdited({});
            }}
            label="Yes"
          />
          <ModalButton
            color="green"
            onPress={() => setWarningModalVisibility(false)}
            label="No"
          />
        </View>
      </AbaciModal>

      {entityInfo &&
        inspectorContext.selectedEntity &&
        cardCategoriesList.map((item, index) => (
          <View
            key={index}
            style={{
              width: '90%',
              borderBottomWidth: 0.5,
              borderBottomColor: Colors.gray,
              height: focusedItem === item ? 80 : 60,
              alignSelf: 'center',
              flexDirection: focusedItem === item ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: focusedItem === item ? 'flex-start' : 'center',
              paddingTop: focusedItem === item ? 10 : 0,
              paddingBottom: focusedItem === item ? 10 : 0,
            }}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                color: '#2a2323',
                fontSize: focusedItem === item ? 12 : 14,
              }}>
              {item.description}
            </Text>
            <TextInput
              numberOfLines={1}
              style={{
                fontFamily: 'Montserrat-Regular',
                color:
                  entityInfo[item.type] ===
                  inspectorContext.selectedEntity[item.type]
                    ? '#2a2323'
                    : 'red',
                // color: '#2a2323',
                fontSize: 14,
                width: focusedItem === item ? '100%' : 150,
                textAlign: focusedItem === item ? 'left' : 'right',
                borderColor: Colors.gray,
                borderWidth: focusedItem?.type === item?.type ? 0.5 : 0,
                height: '70%',
                borderRadius: 5,
                height: 40,
              }}
              editable={editEnabled}
              selectTextOnFocus={editEnabled}
              showSoftInputOnFocus={editEnabled}
              value={
                entityInfo === null
                  ? 'Not available'
                  : String(entityInfo[item.type])
              }
              onChangeText={val => {
                changeValueHandler(val, item);
              }}
              onFocus={() => setFocusedItem(item)}
              onBlur={() => setFocusedItem(null)}></TextInput>
          </View>
        ))}
      <View
        style={{
          width: '100%',
          height: 200,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {editEnabled ? (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              onPress={saveHandler}
              disabled={!enableSaveButton}
              style={{
                width: 50,
                height: 50,
                backgroundColor: enableSaveButton
                  ? '#38a344'
                  : Colors.dark_gray,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
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
                alignItems: 'center',
              }}>
              <Icon name="times-circle" size={30} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={editHandler}
            style={{
              width: 50,
              height: 50,
              backgroundColor: '#ea4873',
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon name="edit" size={30} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
