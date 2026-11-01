import XPointageItem from '@/components/XPointageItem'
import XText from '@/components/XText'
import { dateKey, fmtDateLong, Pointage, subscribeDay } from '@/lib/history'
import { colors } from '@/themes/colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native'

export default function AdminHistoryScreen() {
  const [day, setDay] = useState(() => new Date())
  const [items, setItems] = useState<Pointage[] | null>(null)
  const [error, setError] = useState('')

  const key = dateKey(day)
  const isToday = key === dateKey(new Date())

  useEffect(() => {
    setItems(null)
    setError('')
    return subscribeDay(key, setItems, (e) => {
      console.error('subscribeDay error:', e)
      setError('Impossible de charger les pointages.')
    })
  }, [key])

  const shift = (delta: number) =>
    setDay((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + delta))

  const stillIn = items?.filter((p) => !p.checkOut).length ?? 0

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => shift(-1)} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={colors.primary} />
        </Pressable>
        <XText fontSize={17} fontWeight="600" style={{ textTransform: 'capitalize' }}>
          {isToday ? "Aujourd'hui" : fmtDateLong(key)}
        </XText>
        <Pressable onPress={() => shift(1)} hitSlop={12} disabled={isToday}>
          <Ionicons
            name="chevron-forward"
            size={26}
            color={isToday ? '#d1d5db' : colors.primary}
          />
        </Pressable>
      </View>

      {items && (
        <XText color={colors.textSecondary} style={styles.summary}>
          {items.length} présent(s) · {stillIn} sans départ
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
          renderItem={({ item }) => <XPointageItem item={item} showName />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <XText color={colors.textSecondary} style={styles.center}>
              Aucun pointage ce jour.
            </XText>
          }
        />
      )}
    </View>
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