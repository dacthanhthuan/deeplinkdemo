import React, { useEffect, useState } from "react";
import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native'
import Home from "./src/screens/Home";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import Search from "./src/screens/Search";
import RecipeDetails from "./src/screens/RecipeDetails";

const Stack = createStackNavigator();

const App = () => {

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#FFFFFF',
    },
  };

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerTitleAlign: 'center', headerShadowVisible: false }}>
        <Stack.Screen component={Home} name="Home" />
        <Stack.Screen component={Search} name="Search" />
        <Stack.Screen component={RecipeDetails} name="RecipeDetails" />
      </Stack.Navigator>
    </NavigationContainer>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default App;
