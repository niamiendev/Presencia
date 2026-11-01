import XPointageItem from '@/components/XPointageItem'
import XText from '@/components/XText'
import { useAuth } from '@/context/AuthContext'
import { Pointage, subscribeMyMonth } from '@/lib/history'
import { colors } from '@/themes/colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HistoryScreen() {
  const { user } = useAuth()
  const [cursor, setCursor] = useState(() => {
    const n = new Date()
    return { year: n.getFullYear(), month: n.getMonth() }
  })
  const [items, setItems] = useState<Pointage[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    setItems(null)
    setError('')
    return subscribeMyMonth(user.uid, cursor.year, cursor.month, setItems, (e) => {
      console.error('subscribeMyMonth error:', e) // le lien de création d'index s'affiche ici
      setError("Impossible de charger l'historique.")
    })
  }, [user, cursor])

  const shift = (delta: number) =>
    setCursor(({ year, month }) => {
      const d = new Date(year, month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })

  const now = new Date()
  const isCurrent = cursor.year === now.getFullYear() && cursor.month === now.getMonth()
  const label = new Date(cursor.year, cursor.month, 1).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })

  const worked = items?.filter((p) => p.checkOut).length ?? 0

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => shift(-1)} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={colors.primary} />
        </Pressable>
        <XText fontSize={18} fontWeight="600" style={{ textTransform: 'capitalize' }}>
          {label}
        </XText>
        <Pressable onPress={() => shift(1)} hitSlop={12} disabled={isCurrent}>
          <Ionicons
            name="chevron-forward"
            size={26}
            color={isCurrent ? '#d1d5db' : colors.primary}
          />
        </Pressable>
      </View>

      {items && (
        <XText color={colors.textSecondary} style={styles.summary}>
          {items.length} jour(s) pointé(s) · {worked} journée(s) complète(s)
        </XText>
      )}

      {error ? (
        <XText color={colors.error} style={styles.center}>{error}</XText>
      ) : items === null ? (
        <ActivityIndicator color={colors.primary} style={styles.center} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <XPointageItem item={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <XText color={colors.textSecondary} style={styles.center}>
              Aucun pointage ce mois-ci.
            </XText>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  summary: { textAlign: 'center', marginBottom: 8 },
  list: { padding: 16, gap: 10, flexGrow: 1 },
  center: { textAlign: 'center', marginTop: 32 },
})