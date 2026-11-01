import XText from '@/components/XText'
import { fmtDateLong, fmtDuration, fmtTime, Pointage } from '@/lib/history'
import { colors } from '@/themes/colors'
import { StyleSheet, View } from 'react-native'

type Props = { item: Pointage; showName?: boolean }

const XPointageItem = ({ item, showName }: Props) => {
  const done = !!item.checkOut
  const duration = fmtDuration(item)

  return (
    <View style={styles.card}>
      <View style={{ flex: 1, gap: 2 }}>
        <XText fontSize={16} fontWeight="600">
          {showName ? item.name || item.email : fmtDateLong(item.date)}
        </XText>
        <XText color={colors.textSecondary} fontSize={13}>
          {item.siteName}
        </XText>
        <XText fontSize={14}>
          {fmtTime(item.checkIn)} → {fmtTime(item.checkOut)}
          {duration ? `  ·  ${duration}` : ''}
        </XText>
      </View>

      <View style={[styles.badge, { backgroundColor: done ? '#22c55e' : '#f59e0b' }]}>
        <XText color="#fff" fontSize={12}>
          {done ? 'Terminé' : 'En cours'}
        </XText>
      </View>
    </View>
  )
}

export default XPointageItem

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