import XButton from '@/components/XButton'
import XColumn from '@/components/XColumn'
import XRow from '@/components/XRow'
import XScreen from '@/components/XScreen'
import XSpace from '@/components/XSpace'
import XText from '@/components/XText'
import { colors } from '@/themes/colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'

const HomeScreen = () => {

  const router = useRouter()
  const now = new Date().toLocaleTimeString('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
})


  return (
    <XScreen>
      <XRow gap={24} justifyContent='space-between' >

        <Image
          source={require('@/assets/images/logo.png')}
          style={{ width: 50 }}
          resizeMode='contain'
        />

        <TouchableOpacity onPress={() => router.navigate("/(protected)/(tabs)/profile")} >
          <Ionicons name='person-outline' size={24} />
        </TouchableOpacity>
      </XRow>
      <XColumn alignItems='flex-start' gap={8}>
        <XText fontSize={24} fontWeight={"bold"}>Bonjour, Marie</XText>
        <XText color={colors.textSecondary}>Lundi 14 avril 2025</XText>
      </XColumn>
      <XSpace height={8} />
      <XText fontSize={48} fontWeight={"800"} textAlign='center' >{now}</XText>
      <XSpace height={16} />
      <XRow justifyContent='flex-start' gap={24} style={styles.card}>
        <Ionicons name='time-outline' size={32} />
        <XColumn alignItems='flex-start' gap={18}>
          <XText fontWeight={"800"} fontSize={24}>Pas encore pointé</XText>
          <XText color={colors.textSecondary}>Votre arrivée n'a pas encore{"\n"}été enregistré</XText>
        </XColumn>
      </XRow>
      <XSpace height={8} />
      <XButton>
        <XRow gap={8}>
          <Ionicons name='scan' size={18} color={colors.card} />
          <XText color={colors.card} >Scanner pour pointer</XText>
        </XRow>
      </XButton>
      <XSpace height={18} />
      <XRow gap={8} justifyContent='center'>
        <Ionicons name='timer-outline' size={18} color={colors.textSecondary} />
        <XText color={colors.textSecondary} >Aucune heure d'arrivée</XText>
      </XRow>
    </XScreen>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  card: {
    alignItems: "flex-start",
    backgroundColor: colors.info,
    padding: 16,
    borderRadius: 16
  }
})