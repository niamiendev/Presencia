import { colors } from '@/themes/colors'
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native'


type Props = TextProps & {
    fontWeight? : TextStyle["fontWeight"],
    fontSize?: number
}

const XText = ({ fontSize, fontWeight, style, children, ...rest }: Props) => {
    return (
        <Text
            {...rest}
            style={
                [
                    styles.component,
                    {
                       fontSize, fontWeight
                    },
                    style
                ]
            }
        >
            {children}
        </Text>
    )
}

export default XText

const styles = StyleSheet.create({
    component: {
        color: colors.text
    }
})