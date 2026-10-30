import XScreen from '@/components/XScreen'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'expo-router'
import { StyleSheet, Text } from 'react-native'

const ProfileScreen = () => {
  const router = useRouter()

  const { logout } = useAuth()


  const handlelogout = () => {
    logout()
    //if(!loading) router.replace("/")
  }
  return (
    <XScreen>
     
      <Text onPress={handlelogout}>Se déconnecter</Text>
    </XScreen>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})