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

const ForgotPassword = () => {
  const router = useRouter()
  const { resetPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre adresse e-mail.')
      return
    }

    try {
      setSubmitting(true)
      await resetPassword(email)
      Alert.alert(
        'E-mail envoyé',
        'Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation. Pensez à vérifier vos spams.',
        [{ text: 'OK', onPress: () => router.back() }]
      )
    } catch (error: any) {
      Alert.alert('Erreur', getAuthErrorMessage(error?.code))
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
          Mot de passe oublié ?
        </XText>
        <XText fontSize={16} fontWeight='600' color={colors.textSecondary}>
          Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation
        </XText>
      </XColumn>

      <XColumn>
        <XInput
          icon='mail-outline'
          placeholder='Adresse e-mail'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
          autoComplete='email'
        />
      </XColumn>

      <XSpace height={24} />

      <XButton onPress={handleSubmit}>
        <XText color={colors.background}>Envoyer le lien</XText>
      </XButton>

      <XText
        color={colors.primary}
        textAlign='center'
        onPress={() => router.back()}
      >
        Retour à la connexion
      </XText>
    </XScreen>
  )
}

export default ForgotPassword

const styles = StyleSheet.create(
  {
    container:{
      justifyContent:"center",
      //alignItems:"center"
    }
  }
)