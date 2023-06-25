import { StyleSheet } from "react-native";
import colors from "../../constants/colors";

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.green,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
    },
    text: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '500',
    },
    icon: {
        width: 24,
        height: 24,
        marginLeft: 4,
        tintColor: '#FFFFFF'
    }
});

export default styles;
