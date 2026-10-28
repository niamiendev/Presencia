import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native'


type Props = ViewProps & {
    width?: number,
    padding?: number,
    alignItems? : ViewStyle["alignItems"],
    gap?: number
}

const XColumn = ({ alignItems = "center" , width, padding, style, children, ...rest }: Props) => {
    return (
        <View
            {...rest}
            style={
                [
                    styles.container,
                    {
                        width, padding, alignItems
                    },
                    style
                ]
            }
        >
            {children}
        </View>
    )
}

export default XColumn

const styles = StyleSheet.create({
    container: {
        backgroundColor: "transparent",
    }
})