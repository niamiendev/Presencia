import { colors } from '@/themes/colors'
import { Platform } from 'expo'
import { StyleSheet } from 'react-native'
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context'


const XScreen = ({ style, children, ...rest }: SafeAreaViewProps) => {
    return (
        <SafeAreaView
            {...rest}
            style={
                [
                    styles.container,
                    {

                    },
                    style
                ]
            }
        >

            {children}
        </SafeAreaView>
    )
}

export default XScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:colors.background,
        padding:16,
        paddingTop: Platform.OS === "android" ? 16 : 0
    }
})