// components/XPhotoSheet.tsx
import { colors } from '@/themes/colors'
import * as ImagePicker from 'expo-image-picker'
import { useRef } from 'react'
import { Alert, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {
  visible: boolean
  onClose: () => void
  onPick: (uri: string) => void
}

const XPhotoSheet = ({ visible, onClose, onPick }: Props) => {
  const insets = useSafeAreaInsets()
  const pendingAction = useRef<(() => Promise<void>) | null>(null)

  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  }

  // iOS : on attend la fin de la fermeture du Modal. Android : on lance tout de suite.
  const closeThen = (action: () => Promise<void>) => {
    if (Platform.OS === 'ios') {
      pendingAction.current = action
      onClose()
    } else {
      onClose()
      action()
    }
  }

  const handleDismiss = () => {
    const action = pendingAction.current
    pendingAction.current = null
    action?.()
  }

  const takePhoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync()
    if (!granted) {
      Alert.alert('Permission refusée', "Autorisez l'accès à la caméra dans les réglages.")
      return
    }
    const result = await ImagePicker.launchCameraAsync(options)
    if (!result.canceled) onPick(result.assets[0].uri)
  }

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync(options)
    if (!result.canceled) onPick(result.assets[0].uri)
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      onDismiss={handleDismiss}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose} />

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.handle} />
        <Text style={styles.title}>Photo de profil</Text>

        <Pressable style={styles.option} onPress={() => closeThen(takePhoto)}>
          <Text style={styles.optionText}>📷  Prendre une photo</Text>
        </Pressable>

        <Pressable style={styles.option} onPress={() => closeThen(pickFromGallery)}>
          <Text style={styles.optionText}>🖼️  Choisir dans la galerie</Text>
        </Pressable>

        <Pressable style={[styles.option, styles.cancel]} onPress={onClose}>
          <Text style={[styles.optionText, { color: colors.textSecondary }]}>Annuler</Text>
        </Pressable>
      </View>
    </Modal>
  )
}

export default XPhotoSheet

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: colors.textSecondary,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  optionText: { fontSize: 16 },
  cancel: { alignItems: 'center', marginTop: 4 },
})