import XButton from '@/components/XButton'
import XColumn from '@/components/XColumn'
import XPhotoSheet from '@/components/XPhotoSheet'
import XScreen from '@/components/XScreen'
import XText from '@/components/XText'
import { useAuth } from '@/context/AuthContext'
import { colors } from '@/themes/colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

const SIZE = 120

const ProfileScreen = () => {
  const { logout, user, photoURL, updatePhoto } = useAuth()
  const [sheetVisible, setSheetVisible] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { role } = useAuth()
  const router = useRouter()

  const handlePick = async (uri: string) => {
    setUploading(true)
    try {
      await updatePhoto(uri)
    } catch (e) {
      Alert.alert('Erreur', (e as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (e) {
      Alert.alert('Erreur', (e as Error).message)
    }
  }

  return (
    <>
      <XScreen>
        <TouchableOpacity
          onPress={() => setSheetVisible(true)}
          style={styles.avatar}
          disabled={uploading}
          activeOpacity={0.8}
        >
          {uploading ? (
            <ActivityIndicator color={colors.primary} />
          ) : photoURL ? (
            <Image
              key={photoURL}
              source={{ uri: photoURL }}
              style={styles.image}
            />
          ) : (
            <Ionicons name="camera" size={32} color={colors.primary} />
          )}
        </TouchableOpacity>

        <XColumn alignItems="center">
          <XText fontSize={18} fontWeight="600">
            {user?.displayName}
          </XText>
          <XText color={colors.textSecondary}>{user?.email}</XText>
        </XColumn>


        {role === 'admin' && (
          <XButton onPress={() => router.push('/(protected)/admin')}>
            <XText color={colors.background}>Gérer les sites</XText>
          </XButton>
        )}
        {role === 'admin' && (
        <XButton onPress={() => router.push('/(protected)/admin/history')}>
          <XText color={colors.background}>Voir les pointages</XText>
        </XButton>
        )}

        <XButton backgroundColor={colors.error} onPress={handleLogout}>
          <XText color={colors.background}>Se déconnecter</XText>
        </XButton>
      </XScreen>

      <XPhotoSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onPick={handlePick}
      />
    </>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.textSecondary,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: SIZE,
    height: SIZE,
  },
})

