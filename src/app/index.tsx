import XColumn from '@/components/XColumn'
import XScreen from '@/components/XScreen'
import XSpace from '@/components/XSpace'
import XText from '@/components/XText'
import { useAuth } from '@/context/AuthContext'
import { colors } from '@/themes/colors'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, Image } from 'react-native'

export default function Index() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    const timer = setTimeout(() => {
      //router.replace(user ? '/(protected)/(tabs)/home' : '/(auth)/login')
    }, 2000)

    return () => clearTimeout(timer)
  }, [loading, user])

  return (
    <XScreen style={{ justifyContent: 'center', alignItems: 'center' }}>
      <XColumn gap={24} alignItems='center'>
        <Image
          source={require('@/assets/images/logo.png')}
          resizeMode='contain'
        />
        <Image
          source={require('@/assets/images/text.png')}
          style={{ width: 250 }}
          resizeMode='contain'
        />
      </XColumn>

      <XSpace height={32} />

      <XText
        color={colors.textSecondary}
        fontSize={18}
        style={{ textAlign: 'center' }}
      >
        Votre présence,{'\n'}en toute simplicité
      </XText>

      <XSpace height={64} />

      <ActivityIndicator color={colors.primary} size='large' />
    </XScreen>
  )
}