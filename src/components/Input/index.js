import React from "react";
import { View, Image, TextInput, Pressable } from "react-native";
import styles from "./styles";
import colors from "../../constants/colors";

const Input = ({ showSearchIcon, style, pressable, onPress, ...props }) => {

    const renderInput = () =>
    (
        <View style={[styles.container, style]}>
            {showSearchIcon ? (<Image style={styles.icon} source={require('../../../assets/search.png')} />)
                : null}
            <TextInput {...props} editable={!pressable} placeholderTextColor={colors.lightGrey} style={styles.input} />
        </View>
    );

    if (pressable) {
        return (
            <Pressable onPress={onPress}>
                {renderInput()}
            </Pressable>
        )
    }



    return renderInput();

};
Input.defaultProps = {
    placeholder: 'Search recipes',
    showSearchIcon: true,
}

export default React.memo(Input);