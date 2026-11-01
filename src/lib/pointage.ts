import { db } from '@/lib/firebase'
import { User } from 'firebase/auth'
import { doc, getDoc, runTransaction, serverTimestamp, Timestamp } from 'firebase/firestore'

const QR_PREFIX = 'pointage:'
const MIN_DELAY_MS = 60 * 1000 // évite un départ accidentel juste après l'arrivée

export const buildSiteQr = (siteId: string) => `${QR_PREFIX}${siteId}`

const parseQr = (data: string): string => {
  if (!data.startsWith(QR_PREFIX)) {
    throw new Error("Ce QR code n'est pas un QR code de pointage.")
  }
  const siteId = data.slice(QR_PREFIX.length).trim()
  if (!/^[A-Za-z0-9_-]{5,40}$/.test(siteId)) throw new Error('QR code invalide.')
  return siteId
}

const todayKey = () => {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export type PunchResult = { type: 'in' | 'out'; siteName: string }

export const punch = async (data: string, user: User): Promise<PunchResult> => {
  const siteId = parseQr(data)

  const siteSnap = await getDoc(doc(db, 'sites', siteId))
  if (!siteSnap.exists() || !siteSnap.data().active) {
    throw new Error("Ce site n'existe pas ou n'est plus actif.")
  }
  const siteName = siteSnap.data().name as string

  const date = todayKey()
  const ref = doc(db, 'pointages', `${user.uid}_${date}`)

  // Transaction : deux scans simultanés ne peuvent pas créer deux arrivées
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref)

    if (!snap.exists()) {
      tx.set(ref, {
        uid: user.uid,
        name: user.displayName ?? '',
        email: user.email ?? '',
        siteId,
        siteName,
        date,
        checkIn: serverTimestamp(),
        checkOut: null,
      })
      return { type: 'in', siteName }
    }

    const p = snap.data()
    if (p.checkOut) throw new Error('Votre journée est déjà pointée (arrivée et départ).')

    const checkIn = p.checkIn as Timestamp
    if (Date.now() - checkIn.toMillis() < MIN_DELAY_MS) {
      throw new Error('Arrivée déjà enregistrée à l\'instant.')
    }

    tx.update(ref, { checkOut: serverTimestamp() })
    return { type: 'out', siteName }
  })
}