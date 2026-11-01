import { db } from '@/lib/firebase'
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where
} from 'firebase/firestore'

export type Pointage = {
  id: string
  uid: string
  name: string
  email: string
  siteName: string
  date: string // "YYYY-MM-DD"
  checkIn: Timestamp | null
  checkOut: Timestamp | null
}

const toPointage = (d: any): Pointage => ({ id: d.id, ...d.data() })

// Clé "YYYY-MM-DD" en heure locale
export const dateKey = (d: Date) => {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

// Historique d'un employé pour un mois donné (month : 0-11)
export const subscribeMyMonth = (
  uid: string,
  year: number,
  month: number,
  onData: (items: Pointage[]) => void,
  onError: (e: Error) => void
) => {
  const mm = String(month + 1).padStart(2, '0')
  const q = query(
    collection(db, 'pointages'),
    where('uid', '==', uid),
    where('date', '>=', `${year}-${mm}-01`),
    where('date', '<=', `${year}-${mm}-31`),
    orderBy('date', 'desc')
  )
  return onSnapshot(q, (snap) => onData(snap.docs.map(toPointage)), onError)
}


export const subscribeToday = (
  uid: string,
  key: string,
  onData: (p: Pointage | null) => void,
  onError: (e: Error) => void
) =>
  onSnapshot(
    doc(db, 'pointages', `${uid}_${key}`),
    (d) => onData(d.exists() ? ({ id: d.id, ...d.data() } as Pointage) : null),
    onError
  )

// Tous les pointages d'un jour (admin)
export const subscribeDay = (
  date: string,
  onData: (items: Pointage[]) => void,
  onError: (e: Error) => void
) => {
  const q = query(collection(db, 'pointages'), where('date', '==', date))
  return onSnapshot(
    q,
    (snap) =>
      onData(
        snap.docs
          .map(toPointage)
          .sort((a, b) => (a.checkIn?.toMillis() ?? 0) - (b.checkIn?.toMillis() ?? 0))
      ),
    onError
  )
}

// Helpers d'affichage
export const fmtTime = (t?: Timestamp | null) =>
  t ? t.toDate().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--'

export const fmtDuration = (p: Pointage) => {
  if (!p.checkIn || !p.checkOut) return null
  const min = Math.round((p.checkOut.toMillis() - p.checkIn.toMillis()) / 60000)
  return `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')}`
}

export const fmtDateLong = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}