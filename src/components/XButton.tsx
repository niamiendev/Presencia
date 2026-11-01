
import { colors } from '@/themes/colors';
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    type TouchableOpacityProps,
} from 'react-native';

type Props = TouchableOpacityProps & {
    backgroundColor?: string;
    width?: string;
    loading?: boolean
}

const XButton = ({
    backgroundColor = colors.primary,
    width,
    children,
    loading = false,
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
            {
                loading ?
                    <ActivityIndicator color={colors.background} />
                    :
                    children
            }

        </TouchableOpacity>
    )
}

export default XButton

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 16,
        //justifyContent:"center",
        alignItems: "center"
    },
})
