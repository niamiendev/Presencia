import { getAuthErrorMessage } from '@/lib/authErrors'
import { auth, storage } from '@/lib/firebase'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

type AuthContextType = {
  user: User | null
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

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null)
  const [photoURL, setPhotoURL] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setPhotoURL(currentUser?.photoURL ?? null)
      setLoading(false)
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
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
      await updateProfile(cred.user, { displayName: name.trim() })
      setUser({ ...cred.user })
    } catch (error) {
      throw new Error(getAuthErrorMessage(error))
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
      // Lecture du fichier local en Blob (méthode fiable en React Native)
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
      value={{ user, photoURL, loading, login, register, resetPassword, updatePhoto, logout }}
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