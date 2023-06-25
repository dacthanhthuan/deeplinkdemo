import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import styles from './styles'

const Card = ({ title, style, image, servings, onPress }) => {

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, style]}>

            <Image style={styles.image} resizeMode="contain" source={{ uri: image }} />
            <Text numberOfLines={3} style={styles.title}>{title}</Text>
            {servings ? (
                <>
                    <Text style={styles.value}>{servings}</Text>
                </>
            ) : null}

        </TouchableOpacity>
    )
}
export default React.memo(Card);