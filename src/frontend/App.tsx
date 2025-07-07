import React, { useState } from 'react'
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Colors } from './theme/colors'
import { Fonts } from './theme/fonts'
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'
import { ClerkProviderWrapper } from './utils/clerk'

import Header from './components/HeaderComponent'
import Sidebar from './components/SidebarComponent'

import LoginScreen from "./views/LoginScreen"
import HomeScreen from "./views/HomeScreen"
import ClientsScreen from "./views/ClientsScreen"
import SettingsScreen from "./views/SettingsScreen"
import ProfileScreen from "./views/ProfileScreen"

// Root stack type (only Login and Main)
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

// Main app stack type (all app screens)
export type MainStackParamList = {
  Home: undefined;
  Clients: undefined;
  Settings: undefined;
  Profile: { clientId: string };
};

const RootStack = createStackNavigator<RootStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();

// Create a wrapper component for each screen that includes sidebar functionality
const ScreenWrapper = ({ children, sidebarOpen, toggleSidebar }: {
  children: React.ReactNode,
  sidebarOpen: boolean,
  toggleSidebar: () => void
}) => {
  return (
    <View style={{ flex: 1 }}>
      {children}
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
    </View>
  );
};

const MainNavigator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Header onMenuPress={toggleSidebar} />
      <MainStack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <MainStack.Screen name="Home">
          {() => (
            <ScreenWrapper sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
              <HomeScreen />
            </ScreenWrapper>
          )}
        </MainStack.Screen>
        <MainStack.Screen name="Clients">
          {() => (
            <ScreenWrapper sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
              <ClientsScreen />
            </ScreenWrapper>
          )}
        </MainStack.Screen>
        <MainStack.Screen name="Settings">
          {() => (
            <ScreenWrapper sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
              <SettingsScreen />
            </ScreenWrapper>
          )}
        </MainStack.Screen>
        <MainStack.Screen name="Profile">
          {() => (
            <ScreenWrapper sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
              <ProfileScreen />
            </ScreenWrapper>
          )}
        </MainStack.Screen>
      </MainStack.Navigator>
    </>
  );
};

const App = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProviderWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={Colors.azul} barStyle="light-content" />
        <NavigationContainer>
          <RootStack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
            }}
          >
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen name="Main" component={MainNavigator} />
          </RootStack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </ClerkProviderWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cinzaFundo,
  },
});

export default App;
