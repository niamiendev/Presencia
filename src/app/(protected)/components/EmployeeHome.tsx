import XButton from '@/components/XButton'
import XColumn from '@/components/XColumn'
import XRow from '@/components/XRow'
import XScreen from '@/components/XScreen'
import XSpace from '@/components/XSpace'
import XText from '@/components/XText'
import { useAuth } from '@/context/AuthContext'
import { dateKey, fmtTime, Pointage, subscribeToday } from '@/lib/history'
import { colors } from '@/themes/colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'

const formatElapsed = (ms: number) => {
  const min = Math.max(0, Math.floor(ms / 60000))
  return `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')}`
}

const EmployeeHome = () => {
  const router = useRouter()
  const { user, photoURL } = useAuth()

  // Horloge en direct
  const [nowDate, setNowDate] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNowDate(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Pointage du jour (change seul à minuit)
  const todayKey = dateKey(nowDate)
  const [pointage, setPointage] = useState<Pointage | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    setError('')
    return subscribeToday(user.uid, todayKey, setPointage, (e) => {
      console.error('subscribeToday error:', e)
      setError('Impossible de charger votre statut.')
    })
  }, [user, todayKey])

  const time = nowDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const date = nowDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const status = !pointage ? 'none' : pointage.checkOut ? 'out' : 'in'

  const config = {
    none: {
      icon: 'time-outline' as const,
      bg: colors.info,
      title: 'Pas encore pointé',
      text: "Votre arrivée n'a pas encore\nété enregistrée",
      button: "Scanner pour pointer l'arrivée",
      footerIcon: 'timer-outline' as const,
      footer: "Aucune heure d'arrivée",
    },
    in: {
      icon: 'log-in-outline' as const,
      bg: '#dcfce7',
      title: `Arrivé à ${fmtTime(pointage?.checkIn)}`,
      text: pointage?.siteName ?? '',
      button: 'Scanner pour pointer le départ',
      footerIcon: 'timer-outline' as const,
      footer: pointage?.checkIn
        ? `Temps écoulé : ${formatElapsed(nowDate.getTime() - pointage.checkIn.toMillis())}`
        : 'Enregistrement en cours…',
    },
    out: {
      icon: 'checkmark-circle-outline' as const,
      bg: '#e0e7ff',
      title: 'Journée terminée',
      text: `${fmtTime(pointage?.checkIn)} → ${fmtTime(pointage?.checkOut)}`,
      button: '',
      footerIcon: 'checkmark-done-outline' as const,
      footer:
        pointage?.checkIn && pointage?.checkOut
          ? `Durée : ${formatElapsed(pointage.checkOut.toMillis() - pointage.checkIn.toMillis())}`
          : '',
    },
  }[status]

  return (
    <XScreen>
      <XRow justifyContent="space-between">
        <Image source={require('@/assets/images/icon.png')} resizeMode="contain" />
        <TouchableOpacity onPress={() => router.navigate('/(protected)/(tabs)/profile')}>
          {photoURL ? (
            <Image key={photoURL} source={{ uri: photoURL }} style={styles.image} />
          ) : (
            <Ionicons name="person-outline" size={24} />
          )}
        </TouchableOpacity>
      </XRow>

      <XColumn alignItems="flex-start" gap={8}>
        <XText fontSize={24} fontWeight="bold">
          Bonjour, {user?.displayName}
        </XText>
        <XText color={colors.textSecondary}>{date}</XText>
      </XColumn>

      <XSpace height={8} />
      <XText fontSize={48} fontWeight="800" textAlign="center">
        {time}
      </XText>
      <XSpace height={16} />

      <XRow justifyContent="flex-start" gap={24} style={[styles.card, { backgroundColor: config.bg }]}>
        <Ionicons name={config.icon} size={32} />
        <XColumn alignItems="flex-start" gap={18}>
          <XText fontWeight="800" fontSize={24}>
            {config.title}
          </XText>
          <XText color={colors.textSecondary}>{config.text}</XText>
        </XColumn>
      </XRow>

      {error ? <XText color={colors.error}>{error}</XText> : null}

      <XSpace height={8} />

      {status !== 'out' && (
        <XButton onPress={() => router.navigate('/(protected)/scanner')}>
          <XRow gap={8}>
            <Ionicons name="scan" size={18} color={colors.background} />
            <XText color={colors.background}>{config.button}</XText>
          </XRow>
        </XButton>
      )}

      <XSpace height={18} />

      <XRow gap={8} justifyContent="center">
        <Ionicons name={config.footerIcon} size={18} color={colors.textSecondary} />
        <XText color={colors.textSecondary}>{config.footer}</XText>
      </XRow>
    </XScreen>
  )
}

export default EmployeeHome

const SIZE = 52
const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 16,
  },
  image: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
  },
})