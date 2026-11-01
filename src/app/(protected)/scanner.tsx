import XQrScanner from '@/components/XQrScanner'
import { useAuth } from '@/context/AuthContext'
import { punch } from '@/lib/pointage'
import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native'

export default function ScanScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const busy = useRef(false)
  const [loading, setLoading] = useState(false)

  const handleScan = async (data: string) => {
    if (busy.current || !user) return
    busy.current = true
    setLoading(true)

    try {
      const { type, siteName } = await punch(data, user)
      const hour = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      Alert.alert(
        type === 'in' ? 'Arrivée enregistrée ✅' : 'Départ enregistré 👋',
        `${siteName} à ${hour}`,
        [{ text: 'OK', onPress: () => router.back() }]
      )
    } catch (e) {
      Alert.alert('Pointage impossible', (e as Error).message, [
        { text: 'Réessayer', onPress: () => { busy.current = false } },
        { text: 'Annuler', style: 'cancel', onPress: () => router.back() },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <XQrScanner onScan={handleScan} />
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
})