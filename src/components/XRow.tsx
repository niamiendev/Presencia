import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native'


type Props = ViewProps & {
    width?: number,
    padding?: number,
    justifyContent? : ViewStyle["justifyContent"],
    gap?: number, 
    backgroundColor?:string
}

const XRow = ({ justifyContent = "space-between" , backgroundColor, width, padding, style, children, ...rest }: Props) => {
    return (
        <View
            {...rest}
            style={
                [
                    styles.container,
                    {
                        width, padding, justifyContent, backgroundColor
                    },
                    style
                ]
            }
        >
            {children}
        </View>
    )
}

export default XRow

const styles = StyleSheet.create({
    container: {
        flexDirection:"row",
        backgroundColor: "transparent",
        alignItems:"center"
    }
})