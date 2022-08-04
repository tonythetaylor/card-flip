import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import CardsScreen from './screens/Cards';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import ChatScreen from './screens/Chat';
import HomeScreen from './screens/Home';
import AddCardScreen from './screens/AddCard';
import { LogBox } from 'react-native'

const ignoreWarns = [
  "Setting a timer for a long period of time",
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation",
  "ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from \'deprecated-react-native-prop-types\'.'",
  "AsyncStorage has been extracted from react-native",
  "EventEmitter.removeListener",
];
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
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name='RQH' component={HomeScreen} />
        <Stack.Screen name='Cards' component={CardsScreen} />
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Register' component={RegisterScreen} />
        <Stack.Screen name='Chat' component={ChatScreen} />
        <Stack.Screen name='AddRoom' component={AddCardScreen} />        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;