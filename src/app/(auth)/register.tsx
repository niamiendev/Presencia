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
import { Alert, Image, StyleSheet } from 'react-native'

const Register = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { register } = useAuth()

  const [submitting, setSubmitting] = useState(false)

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.')
      return
    }
    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.')
      return
    }

    try {
      setSubmitting(true)
      await register(name, email, password)
      // Pas de router.replace : Stack.Protected redirige automatiquement
    } catch (error: any) {
      Alert.alert('Inscription impossible', getAuthErrorMessage(error?.code))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <XScreen style = { styles.container}>
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
          Créer un compte
        </XText>
        <XText fontSize={16} fontWeight='600' color={colors.textSecondary}>
          Inscrivez-vous pour gérer votre présence
        </XText>
      </XColumn>

      <XColumn gap={16}>
        <XInput
          icon='person-outline'
          placeholder='Nom complet'
          value={name}
          onChangeText={setName}
          autoCapitalize='words'
          autoComplete='name'
        />
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
          autoComplete='new-password'
        />
        <XInput
          icon='lock-closed-outline'
          placeholder='Confirmer le mot de passe'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize='none'
          autoComplete='new-password'
        />
      </XColumn>

      <XSpace height={24} />

      <XButton onPress={handleRegister}>
        <XText color={colors.background}>S'inscrire</XText>
      </XButton>

      <XText
        color={colors.primary}
        textAlign='center'
        onPress={() => router.back()}
      >
        Déjà un compte ? Se connecter
      </XText>
    </XScreen>
  )
}

export default Register

const styles = StyleSheet.create(
  {
    container:{
      justifyContent:"center",
      //alignItems:"center"
    }
  }
)