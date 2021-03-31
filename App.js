import { Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from './screen/public/SignInScreen';
import SignUpScreen from './screen/public/SignUpScreen';
import HomeScreen from './screen/private/HomeScreen';
import ChatScreen from './screen/private/ChatScreen';
import { Header, Icon } from 'react-native-elements';
import React from 'react';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function StackScreens() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function SlideScreens() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StackScreens" component={StackScreens} />
        <Stack.Screen name="SlideScreens" component={SlideScreens} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
