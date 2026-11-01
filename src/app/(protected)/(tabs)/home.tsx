import { useAuth } from '@/context/AuthContext'
import { colors } from '@/themes/colors'
import { ActivityIndicator, View } from 'react-native'
import AdminHome from '../components/AdminHome'
import EmployeeHome from '../components/EmployeeHome'

const HomeScreen = () => {
  const { role, loading } = useAuth()

  if (loading || role === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    )
  }

  return role === 'admin' ? <AdminHome /> : <EmployeeHome />
}

export default HomeScreen