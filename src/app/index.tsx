import XColumn from '@/components/XColumn'
import XScreen from '@/components/XScreen'
import XText from '@/components/XText'
import { useAuth } from '@/context/AuthContext'
import { colors } from '@/themes/colors'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native'

export default function Index() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    const timer = setTimeout(() => {
      router.replace(user ? '/(protected)/(tabs)/home' : '/(auth)/login')
    }, 1000)

    return () => clearTimeout(timer)
  }, [loading, user])

  return (
    <XScreen
      edges={[]}
      paddingHorizontal={0}
      contentStyle={styles.screenContent}
    >
      <View style={styles.content}>
        <XColumn gap={16} alignItems="center">
          <Image source={require('@/assets/images/logo.png')} />
          <Image
            source={require('@/assets/images/text.png')}
            style={{ width: 250 }}
            resizeMode="contain"
          />
        </XColumn>

        <XText
          color={colors.textSecondary}
          fontSize={18}
          style={{ textAlign: 'center' }}
        >
          Votre présence,{'\n'}en toute simplicité
        </XText>

        <ActivityIndicator color={colors.primary} size="large" />
      </View>

      <Image
        style={styles.design}
        source={require('@/assets/images/design.png')}
        resizeMode="cover"
      />
    </XScreen>
  )
}

const styles = StyleSheet.create({
  screenContent: {
    gap: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    zIndex: 1,
  },
  design: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    aspectRatio: 1080 / 600, // largeur / hauteur réelles de ton PNG
  },
})