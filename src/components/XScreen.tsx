import { colors } from '@/themes/colors'
import { Platform } from 'expo'
import { StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context'

const XScreen = ({ style, children, ...rest }: SafeAreaViewProps) => {
    return (
        <SafeAreaView
            {...rest}
            style={
                [
                    styles.container,
                    {},
                    style
                ]
            }
        >
            <KeyboardAwareScrollView
                contentContainerStyle={[styles.content, style]}
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}
                bottomOffset={24}
            >

                {children}
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

export default XScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
        paddingTop: Platform.OS === "android" ? 16 : 0,
        gap: 16
    },
    content: {
        flexGrow: 1,
        //padding: 24,
        gap: 16,
    },
})