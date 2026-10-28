import { StyleSheet, View, ViewProps } from 'react-native'


type Props = ViewProps & {
    width?: number,
    height?: number
}

const XSpace = ({ width, height, style, children, ...rest }: Props) => {
    return (
        <View
            {...rest}
            style={
                [
                    styles.container,
                    {
                        width, height
                    },
                    style
                ]
            }
        >
            {children}
        </View>
    )
}

export default XSpace

const styles = StyleSheet.create({
    container: {
        backgroundColor: "transparent",
    }
})