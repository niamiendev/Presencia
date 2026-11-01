import XButton from '@/components/XButton'
import XColumn from '@/components/XColumn'
import XInput from '@/components/XInput'
import XRow from '@/components/XRow'
import XScreen from '@/components/XScreen'
import XSpace from '@/components/XSpace'
import XText from '@/components/XText'
import { useAuth } from '@/context/AuthContext'
import { getAuthErrorMessage } from '@/lib/authErrors'
import { colors } from '@/themes/colors'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState("")

  const { login } = useAuth()
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.')
      return
    }
    try {
      setSubmitting(true)
      await login(email, password)
      // Pas de router.replace : Stack.Protected redirige automatiquement
    } catch (error: any) {
      setError((error as Error).message)
      Alert.alert('Connexion impossible', getAuthErrorMessage(error.code))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <XScreen edges={[]}
        paddingHorizontal={0}>
        <View style={styles.content}>

          <XRow gap={24} justifyContent='center'>
            <Image
              source={require('@/assets/images/logo.png')}
              style={{ width: 50 }}
              resizeMode='contain'
            />
            <Image
              source={require('@/assets/images/text.png')}
              style={{ width: 150 }}
              resizeMode='contain'
            />
          </XRow>
          <XSpace height={8} />

          <XColumn alignItems='flex-start'>
            <XText fontSize={32} fontWeight='900'>
              Bienvenue
            </XText>
            <XText fontSize={16} fontWeight='600' color={colors.textSecondary}>
              Connectez-vous pour gérer votre présence
            </XText>
          </XColumn>

          <XColumn gap={16}>
            <XInput
              icon='mail-outline'
              placeholder='Adresse e-mail'
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
              autoComplete='email'
            />
            <XInput
              icon='lock-closed-outline'
              placeholder='Mot de passe'
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize='none'
              autoComplete='password'
            />
          </XColumn>

          <XText
            color={colors.primary}
            textAlign='right'
            onPress={() => router.navigate('/(auth)/forgot')}
          >
            Mot de passe oublié ?
          </XText>

          <XSpace height={24} />
          {error ? <XText color={colors.error}>{error}</XText> : null}

          <XButton width='100%' onPress={handleLogin}  >
            <XText color={colors.background}>Se connecter</XText>
          </XButton>

          <XText
            color={colors.primary}
            textAlign='center'
            onPress={() => router.navigate('/(auth)/register')}
          >
            Créer un compte
          </XText>
        </View>
      </XScreen>
    </TouchableWithoutFeedback>
  )
}

export default Login

const styles = StyleSheet.create(
  {
   
    content: {
      flex: 1,
      justifyContent: 'center',
      gap: 24,
      zIndex: 1,
      paddingHorizontal: 16
    },
    container: {
      justifyContent: "center",
    }
  }
)

