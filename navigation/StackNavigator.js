import React from "react";
import { StyleSheet, View, Text, Button, TouchableOpacity, Image } from 'react-native'

import CardScreen from '../screens/Cards';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import ChatScreen from '../screens/Chat';
import CardsScreen from '../screens/CardsScreen';
import AddCardScreen from '../screens/AddCard';

import { createStackNavigator } from "@react-navigation/stack";

const CardsMainStack = createStackNavigator();

const CardsMainStackNavigator = () => {
    return (
        <CardsMainStack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Cochin',
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerShown: false,
        }}
      >
        <CardsMainStack.Screen name='CardsScreen' component={CardsScreen} />
        <CardsMainStack.Screen name='Cards' component={CardScreen} />
        <CardsMainStack.Screen name='Login' component={LoginScreen} />
        <CardsMainStack.Screen name='Register' component={RegisterScreen} />
        <CardsMainStack.Screen name='Chat' component={ChatScreen} />
        <CardsMainStack.Screen name='AddRoom' component={AddCardScreen} />
      </CardsMainStack.Navigator>
    )

}

export { CardsMainStackNavigator }