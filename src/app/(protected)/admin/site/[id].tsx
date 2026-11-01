import XButton from '@/components/XButton'
import XScreen from '@/components/XScreen'
import XText from '@/components/XText'
import { buildSiteQr } from '@/lib/pointage'
import { setSiteActive, Site, subscribeSite } from '@/lib/sites'
import { colors } from '@/themes/colors'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

export default function SiteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [site, setSite] = useState<Site | null | undefined>(undefined)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!id) return
    return subscribeSite(id, setSite, (e) => {
      console.error('subscribeSite error:', e)
      setSite(null)
    })
  }, [id])

  if (site === undefined) {
    return (
      <XScreen edges={[]}>
        <ActivityIndicator color={colors.primary} />
      </XScreen>
    )
  }

  if (site === null) {
    return (
      <XScreen edges={[]}>
        <XText style={{ textAlign: 'center' }}>Site introuvable.</XText>
      </XScreen>
    )
  }

  const toggleActive = () => {
    const next = !site.active
    Alert.alert(
      next ? 'Activer ce site ?' : 'Désactiver ce site ?',
      next
        ? 'Les employés pourront de nouveau pointer.'
        : 'Les scans de ce QR code seront refusés.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: next ? 'Activer' : 'Désactiver',
          style: next ? 'default' : 'destructive',
          onPress: async () => {
            setBusy(true)
            try {
              await setSiteActive(site.id, next)
            } catch (e) {
              Alert.alert('Erreur', 'La modification a échoué.')
            } finally {
              setBusy(false)
            }
          },
        },
      ]
    )
  }

  return (
    <XScreen edges={[]}>
      <View style={{ alignItems: 'center', gap: 4 }}>
        <XText fontSize={22} fontWeight="700">{site.name}</XText>
        <XText color={colors.textSecondary}>
          {site.latitude.toFixed(5)}, {site.longitude.toFixed(5)} · rayon {site.radius} m
        </XText>
      </View>

      {/* Fond blanc obligatoire : un QR code a besoin d'une zone claire autour */}
      <View style={[styles.qrBox, !site.active && { opacity: 0.25 }]}>
        <QRCode value={buildSiteQr(site.id)} size={240} />
      </View>

      <XText color={site.active ? '#16a34a' : colors.error} style={{ textAlign: 'center' }}>
        {site.active ? 'Site actif' : 'Site inactif : les scans sont refusés'}
      </XText>

      <XText color={colors.textSecondary} fontSize={13} style={{ textAlign: 'center' }}>
        Imprimez ce QR code (capture d'écran ou impression) et placez-le à l'entrée du site.
      </XText>

      <XButton
        onPress={toggleActive}
        disabled={busy}
        backgroundColor={site.active ? colors.error : colors.primary}
      >
        <XText color={colors.background}>
          {site.active ? 'Désactiver le site' : 'Activer le site'}
        </XText>
      </XButton>
    </XScreen>
  )
}

const styles = StyleSheet.create({
  qrBox: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
  },
})