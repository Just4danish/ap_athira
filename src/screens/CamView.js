import {useIsFocused} from '@react-navigation/native';
import {useEffect} from 'react';
import {useState} from 'react';
import {View} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import CameraPermissionCheckWrapper from '../components/CameraPermissionCheckWrapper';

export default function CamView() {
  const devices = useCameraDevices();
  const device = devices?.back;
  const [showCam, setShowCam] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setShowCam(true);
    } else {
      setShowCam(false);
    }
  }, [isFocused]);
  return (
    <CameraPermissionCheckWrapper>
      <View style={{flex: 1}}>
        <View
          style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}>
          {device == null ? null : showCam ? (
            <Camera style={{flex: 1}} device={device} isActive={true} />
          ) : null}
        </View>
      </View>
    </CameraPermissionCheckWrapper>
  );
}
