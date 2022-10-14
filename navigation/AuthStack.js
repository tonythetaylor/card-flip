import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Image } from 'react-native'

// import WelcomeScreen from '../screens/WelcomeScreen';
import Login from '../screens/Login';
import Register from '../screens/Register';

const Stack = createStackNavigator();

const ClthgLogoTitle = () => {
    return (
        <Image
            style={{ width: 100, height: 100, resizeMode: 'contain' }}
            // source={require('../assets/CLTHG-logo.png')}
        />
    );
}

export default function AuthStack() {

    return (
        <NavigationContainer>
            <Stack.Navigator 
            screenOptions={{
                headerTintColor: "black",
                headerBackTitle: "Back",
                headerShown: true,
                headerBackTitleVisible: true,
            }}>
                {/* <Stack.Screen name="Welcome" component={WelcomeScreen} /> */}
                <Stack.Screen
                    name="Sign In"
                    component={Login}
                    options={{
                        headerTitle: (props) => (<ClthgLogoTitle {...props} />)
                    }} />
                <Stack.Screen
                    name="Sign Up"
                    component={Register}
                    options={{
                        headerTitle: (props) => (<ClthgLogoTitle {...props} />)
                    }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}