import XButton from '@/components/XButton'
import XScreen from '@/components/XScreen'
import XText from '@/components/XText'
import { useAuth } from '@/context/AuthContext'
import { createSite } from '@/lib/sites'
import { colors } from '@/themes/colors'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, TextInput } from 'react-native'

export default function NewSiteScreen() {
  const router = useRouter()
  const { user } = useAuth()

  const [name, setName] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [radius, setRadius] = useState('150')
  const [locating, setLocating] = useState(false)
  const [saving, setSaving] = useState(false)

  const useMyPosition = async () => {
    setLocating(true)
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync()
      if (!granted) {
        Alert.alert('Permission refusée', 'Autorisez la localisation dans les réglages.')
        return
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })
      setLatitude(pos.coords.latitude.toFixed(6))
      setLongitude(pos.coords.longitude.toFixed(6))
    } catch (e) {
      Alert.alert('Erreur', "Impossible d'obtenir la position.")
    } finally {
      setLocating(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    // Accepte la virgule comme séparateur décimal
    const lat = Number(latitude.replace(',', '.'))
    const lng = Number(longitude.replace(',', '.'))
    const rad = Number(radius)

    if (name.trim().length < 2) return Alert.alert('Erreur', 'Saisissez le nom du site.')
    if (!latitude || !longitude || Number.isNaN(lat) || Number.isNaN(lng))
      return Alert.alert('Erreur', 'Coordonnées invalides.')
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180)
      return Alert.alert('Erreur', 'Coordonnées hors limites.')
    if (!rad || rad < 20 || rad > 5000)
      return Alert.alert('Erreur', 'Le rayon doit être entre 20 et 5000 m.')

    setSaving(true)
    try {
      const id = await createSite(
        { name: name.trim(), latitude: lat, longitude: lng, radius: rad },
        user.uid
      )
      router.replace(`/(protected)/admin/site/${id}`)
    } catch (e) {
      console.error('createSite error:', e)
      Alert.alert('Erreur', 'Le site n’a pas pu être créé.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <XScreen edges={[]}>
      <XText fontWeight="600">Nom du site</XText>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Siège Abidjan"
        placeholderTextColor={colors.textSecondary}
      />

      <XButton onPress={useMyPosition} disabled={locating}>
        {locating ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <XText color={colors.background}>📍 Utiliser ma position actuelle</XText>
        )}
      </XButton>

      <XText fontWeight="600">Latitude</XText>
      <TextInput
        style={styles.input}
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numbers-and-punctuation"
        placeholder="5.359952"
        placeholderTextColor={colors.textSecondary}
      />

      <XText fontWeight="600">Longitude</XText>
      <TextInput
        style={styles.input}
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numbers-and-punctuation"
        placeholder="-4.008256"
        placeholderTextColor={colors.textSecondary}
      />

      <XText fontWeight="600">Rayon autorisé (mètres)</XText>
      <TextInput
        style={styles.input}
        value={radius}
        onChangeText={setRadius}
        keyboardType="number-pad"
        placeholder="150"
        placeholderTextColor={colors.textSecondary}
      />
      <XText color={colors.textSecondary} fontSize={13}>
        Le GPS a une précision de 5 à 30 m en général. Évitez de descendre sous 50 m.
      </XText>

      <XButton onPress={handleSave} disabled={saving}>
        {saving ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <XText color={colors.background}>Créer le site</XText>
        )}
      </XButton>
    </XScreen>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
})