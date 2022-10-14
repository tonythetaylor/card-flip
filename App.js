import { LogBox } from 'react-native'

const ignoreWarns = [
  "Setting a timer for a long period of time",
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation",
  "ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from \'deprecated-react-native-prop-types\'.'",
  "AsyncStorage has been extracted from react-native",
  "EventEmitter.removeListener",
];

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import CardScreen from './screens/Cards';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import ChatScreen from './screens/Chat';
import CardsScreen from './screens/CardsScreen';
import AddCardScreen from './screens/AddCard';

import { StatusBar } from 'expo-status-bar';

import { CardsMainStackNavigator } from './navigation/StackNavigator';

import RootNavigation from './navigation';

const warn = console.warn;
console.warn = (...arg) => {
  for (let i = 0; i < ignoreWarns.length; i++) {
    if (arg[0].startsWith(ignoreWarns[i])) return;
  }
  warn(...arg);
};

LogBox.ignoreLogs(ignoreWarns);

const Stack = createStackNavigator();

const App = () => {
  return (
    <RootNavigation />
    // <NavigationContainer>
    //   <StatusBar style="light" />
    //   <CardsMainStackNavigator />
    //   <Stack.Navigator
    //     screenOptions={{
    //       headerStyle: { backgroundColor: 'black' },
    //       headerTintColor: '#fff',
    //       headerTitleStyle: {
    //         fontFamily: 'Cochin',
    //         fontWeight: 'bold',
    //         fontSize: 20,
    //       }
    //     }}
    //   >
    //     <Stack.Screen name='RQH' component={CardsScreen} />
    //     <Stack.Screen name='Cards' component={CardScreen} />
    //     <Stack.Screen name='Login' component={LoginScreen} />
    //     <Stack.Screen name='Register' component={RegisterScreen} />
    //     <Stack.Screen name='Chat' component={ChatScreen} />
    //     <Stack.Screen name='AddRoom' component={AddCardScreen} />
    //   </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default App;