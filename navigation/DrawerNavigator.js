import React from "react";

import {
  createDrawerNavigator, DrawerItem, DrawerContentScrollView,
  DrawerItemList
} from "@react-navigation/drawer";
import { View, Text, Image, TouchableOpacity} from "react-native";
import { CardsMainStackNavigator, EventsStackNavigator } from "./StackNavigator";
import { getAuth, signOut } from 'firebase/auth';
import { useAuthentication, signOutNow } from '../utils/hooks/useAuthentication';

import { Avatar } from 'react-native-elements';
import HomeScreen from "../screens/HomeScreen";

const auth = getAuth();

const Drawer = createDrawerNavigator();

function AppDrawerContent(props) {
  const { user } = useAuthentication();
  console.log('USER', auth.currentUser.uid)
  return (
<View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            backgroundColor: '#ffffff',
            marginBottom: 0,
            // shadowOpacity: .1
          }}
        >
          <View>
          <Text>{user?.displayName}</Text>
          </View>
          
          <View style={{ marginLeft: 20 }}>
          <Avatar
            rounded
            source={{
              uri: auth?.currentUser?.photoURL,
            }}
          />
        </View>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 0,
          left: 0,
          bottom: 50,
          backgroundColor: '#ffffff',
          padding: 20,
        }}
      >
        <DrawerItem
          label="Log out"
          onPress={() => signOut(auth)}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        />
      </TouchableOpacity>
    </View>
  );
}

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: 'black' },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontFamily: 'Cochin',
        fontWeight: 'bold',
        fontSize: 20,
      },
    }}
      drawerContent={props => <AppDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="RQH" component={CardsMainStackNavigator} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;