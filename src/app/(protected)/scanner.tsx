import { Image, StyleSheet, View } from 'react-native'

const Scanner = () => {
  return (
    <View style = {styles.container}>
      <Image
        source={require('@/assets/images/design.png')}
      />
    </View>
  )
}

export default Scanner

const styles = StyleSheet.create({
  container:{
    justifyContent:"center",
    alignItems:"center"
  }
})