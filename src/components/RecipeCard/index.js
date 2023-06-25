import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import styles from './styles'
import Rating from "../Rating";

const RecipeCard = ({ title, style, image, author, rating, time, onPress }) => {

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={styles.title}>{title}</Text>
                    <Rating rating={rating} />

                </View>
                <Image style={styles.image} resizeMode="contain" source={{ uri: image }} />
            </View>


            <View style={styles.footer}>
                {author?.image ? (
                    <View style={styles.row}>
                        <Image style={styles.authorImage} resizeMode="contain" source={{ uri: author?.image }} />
                        <Text style={styles.footerText}>By {author?.name}</Text>
                    </View>
                ) : <View style={styles.row}>
                    <Image style={styles.authorImage} resizeMode="contain" source={require('../../../assets/avatar.jpg')} />
                    <Text style={styles.footerText}>By No Author</Text>
                </View>
                }
                {time ? (
                    <View style={styles.row}>
                        <Image style={styles.timerIcon} resizeMode="contain" source={require('../../../assets/timer.png')} />
                        <Text style={styles.footerText}>{time}:00 AM</Text>
                    </View>
                ) : <View style={styles.row}>
                    <Image style={styles.timerIcon} resizeMode="contain" source={require('../../../assets/timer.png')} />
                    <Text style={styles.footerText}>7:00 AM</Text>
                </View>}
            </View>
        </TouchableOpacity>
    )
}
export default React.memo(RecipeCard);