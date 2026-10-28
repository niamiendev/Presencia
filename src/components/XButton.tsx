
import { colors } from '@/themes/colors'
import {
    StyleSheet,
    TouchableOpacity,
    type TouchableOpacityProps,
} from 'react-native'

type Props = TouchableOpacityProps & {
    backgroundColor?: string,
    width?: string
}

const XButton = ({
    backgroundColor = colors.primary,
    width,
    children,
    style,
    ...rest
}: Props) => {
    return (
        <TouchableOpacity
            {...rest}
            style={[
                styles.container,
                { backgroundColor, width },
                style,
            ]}
        >
            {children}
        </TouchableOpacity>
    )
}

export default XButton

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 16,
        //justifyContent:"center",
        alignItems:"center"
    },
})
