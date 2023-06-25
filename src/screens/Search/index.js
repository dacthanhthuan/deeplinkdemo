import React, { useContext, useEffect, useState } from "react";
import { FlatList, SafeAreaView } from "react-native";
import styles from "./styles";
import Input from "../../components/Input";
import Card from "../../components/Card";

const Search = ({ navigation, route }) => {
    const { item } = route?.params || {};

    // console.log(item);
    const [filteredRecipes, setFilteredRecipes] = useState(item);
    const [keywork, setKeywork] = useState('');

    // console.log('keywork :>>', keywork)

    useEffect(() => {
        if (keywork?.length > 1) {
            const filteredItems = filteredRecipes?.filter(rec => rec?.name?.toLocaleLowerCase()?.includes(keywork?.toLocaleLowerCase()))
            setFilteredRecipes(filteredItems);
            //console.log('filteredItems :>> ', filteredItems)
        } else {
            setFilteredRecipes(item);
        }

    }, [keywork])

    return (
        <SafeAreaView style={styles.container} >
            <Input autoFocus onChangeText={setKeywork} value={keywork} />
            <FlatList
                data={filteredRecipes}
                numColumns={2}
                style={{ flexGrow: 1 }}
                keyExtractor={item => String(item?.id)}
                renderItem={({ item }) => (
                    <Card
                        onPress={() => navigation.navigate('RecipeDetails', { item })}
                        title={item?.name}
                        image={item?.images[0]}
                        servings={item?.city}
                    />
                )}
            />
        </SafeAreaView>
    )
};

export default React.memo(Search);