import XButton from '@/components/XButton'
import XScreen from '@/components/XScreen'
import XText from '@/components/XText'
import { Site, subscribeSites } from '@/lib/sites'
import { colors } from '@/themes/colors'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'

export default function SitesScreen() {
  const router = useRouter()
  const [sites, setSites] = useState<Site[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    return subscribeSites(setSites, (e) => {
      console.error('subscribeSites error:', e)
      setError('Impossible de charger les sites.')
    })
  }, [])

  return (
    <XScreen edges={[]}>
      <XButton onPress={() => router.push('/(protected)/admin/new-site')}>
        <XText color={colors.background}>+ Nouveau site</XText>
      </XButton>

      {error ? <XText color={colors.error}>{error}</XText> : null}

      {sites === null && !error && <ActivityIndicator color={colors.primary} />}

      {sites?.length === 0 && (
        <XText color={colors.textSecondary} style={{ textAlign: 'center' }}>
          Aucun site pour le moment.
        </XText>
      )}

      {sites?.map((site) => (
        <Pressable
          key={site.id}
          style={styles.card}
          onPress={() => router.push(`/(protected)/admin/site/${site.id}`)}
        >
          <View style={{ flex: 1 }}>
            <XText fontSize={16} fontWeight="600">{site.name}</XText>
            <XText color={colors.textSecondary} fontSize={13}>
              Rayon : {site.radius} m
            </XText>
          </View>
          <View style={[styles.badge, { backgroundColor: site.active ? '#22c55e' : '#9ca3af' }]}>
            <XText color="#fff" fontSize={12}>{site.active ? 'Actif' : 'Inactif'}</XText>
          </View>
        </Pressable>
      ))}
    </XScreen>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
})