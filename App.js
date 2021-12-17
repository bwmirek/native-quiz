import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import ResultsScreen from './screens/ResultsScreen';
import RulesScreen from './screens/RulesScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function Root() {
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const visited = await AsyncStorage.getItem('@visited');
      if (visited !== true) {
        await AsyncStorage.setItem('@visited', true);
        navigation.navigate('Rules');
      }
    })();
  }, []);

  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen}/>
      <Drawer.Screen name="Quiz" component={QuizScreen}/>
      <Drawer.Screen name="Results" component={ResultsScreen}/>
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Root"
          component={Root}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Rules" component={RulesScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
