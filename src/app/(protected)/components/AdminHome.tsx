import XButton from '@/components/XButton'
import XColumn from '@/components/XColumn'
import XRow from '@/components/XRow'
import XScreen from '@/components/XScreen'
import XText from '@/components/XText'
import { useAuth } from '@/context/AuthContext'
import { dateKey, Pointage, subscribeDay } from '@/lib/history'
import { buildSiteQr } from '@/lib/pointage'
import { Site, subscribeSites } from '@/lib/sites'
import { colors } from '@/themes/colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Image,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'

const AdminHome = () => {
  const router = useRouter()
  const { user, photoURL, role } = useAuth()

  const [sites, setSites] = useState<Site[] | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [items, setItems] = useState<Pointage[]>([])

  const now = new Date()
  const today = dateKey(now)
  const dateLabel = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const isAdmin = !!user && role === 'admin'

  // Les écoutes ne démarrent que si l'utilisateur est bien un admin connecté
  useEffect(() => {
    if (!isAdmin) return
    return subscribeSites(setSites, (e) => {
      console.error('subscribeSites error:', e)
      setSites([])
    })
  }, [isAdmin])

  useEffect(() => {
    if (!isAdmin) return
    return subscribeDay(today, setItems, (e) => console.error('subscribeDay error:', e))
  }, [isAdmin, today])

  const activeSites = sites?.filter((s) => s.active) ?? []
  const selected = activeSites.find((s) => s.id === selectedId) ?? activeSites[0]

  const present = items.length
  const stillIn = items.filter((p) => !p.checkOut).length

  return (
    <XScreen>
      <XRow justifyContent="space-between">
        <Image source={require('@/assets/images/icon.png')} resizeMode="contain" />
        <TouchableOpacity onPress={() => router.navigate('/(protected)/(tabs)/profile')}>
          {photoURL ? (
            <Image key={photoURL} source={{ uri: photoURL }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-outline" size={24} />
          )}
        </TouchableOpacity>
      </XRow>

      <XColumn alignItems="flex-start" gap={8}>
        <XText fontSize={24} fontWeight="bold">
          Bonjour, {user?.displayName}
        </XText>
        <XText color={colors.textSecondary}>{dateLabel}</XText>
      </XColumn>

      {/* Résumé du jour */}
      <XRow gap={12}>
        <View style={[styles.stat, { backgroundColor: '#dcfce7' }]}>
          <XText fontSize={28} fontWeight="800">{present}</XText>
          <XText color={colors.textSecondary} fontSize={13}>Présent(s)</XText>
        </View>
        <View style={[styles.stat, { backgroundColor: '#fef3c7' }]}>
          <XText fontSize={28} fontWeight="800">{stillIn}</XText>
          <XText color={colors.textSecondary} fontSize={13}>Sans départ</XText>
        </View>
      </XRow>

      {/* QR code du site */}
      {sites === null ? (
        <ActivityIndicator color={colors.primary} />
      ) : !selected ? (
        <View style={styles.card}>
          <XText style={{ textAlign: 'center' }}>Aucun site actif.</XText>
          <XButton onPress={() => router.push('/(protected)/admin/new-site')}>
            <XText color={colors.background}>Créer un site</XText>
          </XButton>
        </View>
      ) : (
        <View style={styles.card}>
          {activeSites.length > 1 && (
            <View style={styles.chips}>
              {activeSites.map((s) => {
                const on = s.id === selected.id
                return (
                  <Pressable
                    key={s.id}
                    onPress={() => setSelectedId(s.id)}
                    style={[styles.chip, on && { backgroundColor: colors.primary }]}
                  >
                    <XText fontSize={13} color={on ? colors.background : colors.textSecondary}>
                      {s.name}
                    </XText>
                  </Pressable>
                )
              })}
            </View>
          )}

          <XText fontSize={18} fontWeight="700" style={{ textAlign: 'center' }}>
            {selected.name}
          </XText>

          <View style={styles.qrBox}>
            <QRCode value={buildSiteQr(selected.id)} size={220} />
          </View>

          <XText color={colors.textSecondary} fontSize={13} style={{ textAlign: 'center' }}>
            Les employés scannent ce code pour pointer leur arrivée et leur départ.
          </XText>
        </View>
      )}

      <XButton onPress={() => router.push('/(protected)/admin/history')}>
        <XText color={colors.background}>Voir les pointages</XText>
      </XButton>

      <XButton onPress={() => router.push('/(protected)/admin')}>
        <XText color={colors.background}>Gérer les sites</XText>
      </XButton>

      <Pressable onPress={() => router.navigate('/(protected)/scanner')} hitSlop={12}>
        <XText color={colors.textSecondary} fontSize={13} style={{ textAlign: 'center' }}>
          Pointer moi-même
        </XText>
      </Pressable>
    </XScreen>
  )
}

export default AdminHome

const styles = StyleSheet.create({
  avatar: { width: 52, height: 52, borderRadius: 26 },
  stat: { flex: 1, padding: 16, borderRadius: 16, alignItems: 'center' },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    gap: 12,
    alignItems: 'center',
  },
  qrBox: { backgroundColor: '#fff', padding: 16, borderRadius: 16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
})