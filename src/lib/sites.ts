import { db } from '@/lib/firebase'
import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore'

export type Site = {
  id: string
  name: string
  latitude: number
  longitude: number
  radius: number
  active: boolean
}

type NewSite = Omit<Site, 'id' | 'active'>

export const createSite = async (data: NewSite, adminUid: string) => {
  const ref = await addDoc(collection(db, 'sites'), {
    ...data,
    active: true,
    createdBy: adminUid,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export const setSiteActive = (id: string, active: boolean) =>
  updateDoc(doc(db, 'sites', id), { active })

export const subscribeSites = (
  onData: (sites: Site[]) => void,
  onError: (e: Error) => void
) => {
  const q = query(collection(db, 'sites'), orderBy('name'))
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Site, 'id'>) }))),
    onError
  )
}

export const subscribeSite = (
  id: string,
  onData: (site: Site | null) => void,
  onError: (e: Error) => void
) =>
  onSnapshot(
    doc(db, 'sites', id),
    (d) => onData(d.exists() ? { id: d.id, ...(d.data() as Omit<Site, 'id'>) } : null),
    onError
  )