import { auth } from '@/lib/firebase'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

type Props = { children: ReactNode }

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Écoute l'état de connexion (et restaure la session au démarrage)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)

    } catch (error) {
      
    }finally{
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
      await updateProfile(cred.user, { displayName: name.trim() })

      setUser({ ...cred.user })
    } catch (error) {
      
    }finally{
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim())
    } catch (error) {
      
    }finally{
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      
    } catch (error) {
      
    }finally{
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur de <AuthProvider>')
  }
  return context
}