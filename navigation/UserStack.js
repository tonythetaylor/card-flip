import React from 'react';
import { StyleSheet, Text, View, LogBox, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// import HomeScreen from '../screens/HomeScreen';
import DrawerNavigator from './DrawerNavigator';


const Stack = createStackNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" hidden={false} translucent={true} />
      <DrawerNavigator />
    </NavigationContainer>
  );
}