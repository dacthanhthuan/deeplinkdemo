import { StyleSheet } from "react-native";
import colors from "../../constants/colors";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderColor: colors.lightGrey,
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        marginVertical: 16
    },
    input: {
        color: colors.black,
        fontSize: 16,
        flex: 1
    },
    icon: {
        width: 16,
        height: 16,
        marginRight: 16
    }
});

export default styles;
