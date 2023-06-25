import React from "react";
import { TouchableOpacity, Text, Image } from "react-native";
import styles from "./styles";

const Button = ({ children, onPress, img, style }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
            <Text style={styles.text}>{children}</Text>
            {img ? (
                <Image style={styles.icon} source={img} />
            ) :
                (<></>)
            }
        </TouchableOpacity>
    )
};

export default React.memo(Button);