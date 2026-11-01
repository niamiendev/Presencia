import { colors } from '@/themes/colors'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context'

type Props = SafeAreaViewProps & {
  paddingHorizontal?: number
}

const XScreen = ({
  paddingHorizontal = 16,
  style,
  children,
  ...rest
}: Props) => {
  return (
    <SafeAreaView
      {...rest}
      style={[styles.container, { paddingHorizontal }, style]}
    >
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >

        <ScrollView
          contentContainerStyle={[styles.content]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>


    </SafeAreaView>
  )
}

export default XScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop:Platform.OS === 'ios' ? 0 : 16
  },
  content: {
    flexGrow: 1,
    gap: 16,
  },
  
})