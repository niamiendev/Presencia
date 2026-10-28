import { colors } from '@/themes/colors'
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native'


type Props = TextProps & {
    fontWeight? : TextStyle["fontWeight"],
    textAlign? : TextStyle["textAlign"],
    fontSize?: number,
    color?:string
}

const XText = ({ color = colors.text,textAlign, fontSize, fontWeight, style, children, ...rest }: Props) => {
    return (
        <Text
            {...rest}
            style={
                [
                    styles.component,
                    {
                       fontSize, fontWeight, color, textAlign
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
       
    }
})