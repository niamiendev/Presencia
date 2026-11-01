import { getAuthErrorMessage } from '@/lib/authErrors'
import { auth, db, storage } from '@/lib/firebase'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'

export type Role = 'employee' | 'admin'

type AuthContextType = {
  user: User | null
  role: Role | null
  photoURL: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePhoto: (uri: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

type Props = { children: ReactNode }

// Lit le rôle ; crée le document s'il n'existe pas (comptes créés avant cette étape)
const fetchOrCreateRole = async (user: User): Promise<Role> => {
  const userRef = doc(db, 'users', user.uid)
  const snap = await getDoc(userRef)

  if (snap.exists()) {
    return (snap.data().role as Role) ?? 'employee'
  }

  await setDoc(userRef, {
    uid: user.uid,
    name: user.displayName ?? '',
    email: user.email ?? '',
    role: 'employee',
    createdAt: serverTimestamp(),
  })
  return 'employee'
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [photoURL, setPhotoURL] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Empêche l'écouteur de créer le document pendant register()
  const registering = useRef(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      setPhotoURL(currentUser?.photoURL ?? null)

      if (!currentUser) {
        setRole(null)
        setLoading(false)
        return
      }

      // register() s'occupe lui-même du document et du rôle
      if (registering.current) return

      try {
        setRole(await fetchOrCreateRole(currentUser))
      } catch (e) {
        console.error('fetchOrCreateRole error:', e)
        setRole('employee')
      } finally {
        setLoading(false)
      }
    })
    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch (error) {
      throw new Error(getAuthErrorMessage(error))
    }
  }

  const register = async (name: string, email: string, password: string) => {
    registering.current = true
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
      await updateProfile(cred.user, { displayName: name.trim() })

      // Le rôle est toujours "employee" à l'inscription (imposé aussi par les règles Firestore)
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        name: name.trim(),
        email: email.trim(),
        role: 'employee',
        createdAt: serverTimestamp(),
      })

      setRole('employee')
      setUser({ ...cred.user })
    } catch (error) {
      throw new Error(getAuthErrorMessage(error))
    } finally {
      registering.current = false
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim())
    } catch (error) {
      throw new Error(getAuthErrorMessage(error))
    }
  }

  const updatePhoto = async (uri: string) => {
    const currentUser = auth.currentUser
    if (!currentUser) throw new Error('Utilisateur non connecté.')

    try {
      const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)
        xhr.onerror = () => reject(new Error("Impossible de lire l'image."))
        xhr.responseType = 'blob'
        xhr.open('GET', uri, true)
        xhr.send(null)
      })

      const photoRef = ref(storage, `avatars/${currentUser.uid}/profile.jpg`)
      await uploadBytes(photoRef, blob, { contentType: 'image/jpeg' })

      const url = await getDownloadURL(photoRef)
      await updateProfile(currentUser, { photoURL: url })
      setPhotoURL(url)
    } catch (error) {
      console.error('updatePhoto error:', error)
      throw new Error(getAuthErrorMessage(error))
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      throw new Error(getAuthErrorMessage(error))
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, role, photoURL, loading, login, register, resetPassword, updatePhoto, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>")
  }
  return context
}