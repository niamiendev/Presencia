import XButton from '@/components/XButton'
import XColumn from '@/components/XColumn'
import XScreen from '@/components/XScreen'
import XText from '@/components/XText'
import { useAuth } from '@/context/AuthContext'
import { colors } from '@/themes/colors'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, StyleSheet, TouchableOpacity } from 'react-native'


const ProfileScreen = () => {

  const router = useRouter()
  const { logout, user } = useAuth()
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the camera is required.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  const handlelogout = () => {
    logout()
  }
  return (
    <XScreen>
      <TouchableOpacity onPress={pickImage} style={styles.avatar}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </TouchableOpacity>
      <XColumn>

        <XText fontSize={18} fontWeight={"600"}>{user && user.displayName}</XText>
        <XText color={colors.textSecondary}>{user && user.email}</XText>

      </XColumn>

      <XButton backgroundColor={colors.error} onPress={handlelogout}>
        <XText color={colors.background}>Se déconnecter</XText>
      </XButton>
    </XScreen>
  )
}

export default ProfileScreen

const size = 100

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.textSecondary,
    width: size,
    height: size,
    borderRadius: "50%",
    alignSelf: "center"
  },
  image: {
    width: size,
    height: size,
    borderRadius: "50%",
  },
})