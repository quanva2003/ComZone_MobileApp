import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Home from "./src/screens/Home";
import Exchange from "./src/screens/Exchange";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SignIn from "./src/screens/SignIn";
import SignUp from "./src/screens/SignUp";
import { Icon } from "react-native-elements";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import ComicDetail from "./src/screens/ComicDetail";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
SplashScreen.preventAutoHideAsync();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#cccccc",
        tabBarStyle: { backgroundColor: "#000000" },
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Trang chủ"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              type="MaterialIcons"
              name="home"
              color={focused ? "#fff" : "#666"}
              size={focused ? 30 : 24} // Increase size if focused
            />
          ),
        }}
      />
      <Tab.Screen
        name="Trao đổi"
        component={Exchange}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              type="MaterialIcons"
              name="swap-horiz"
              color={focused ? "#fff" : "#666"}
              size={focused ? 30 : 24} // Increase size if focused
            />
          ),
        }}
      />
      <Tab.Screen
        name="Đấu giá"
        component={Exchange}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              type="MaterialIcons"
              name="gavel"
              color={focused ? "#fff" : "#666"}
              size={focused ? 30 : 24} // Increase size if focused
            />
          ),
        }}
      />
      <Tab.Screen
        name="Truyện tranh"
        component={Exchange}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              type="AntDesign"
              name="book"
              color={focused ? "#fff" : "#666"}
              size={focused ? 30 : 24} // Increase size if focused
            />
          ),
        }}
      />
      <Tab.Screen
        name="Tôi"
        component={Exchange}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              type="MaterialIcons"
              name="account-circle"
              color={focused ? "#fff" : "#666"}
              size={focused ? 30 : 24} // Increase size if focused
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [loaded, error] = useFonts({
    REM: require("./assets/fonts/REM.ttf"),
    REM_italic: require("./assets/fonts/REM-Italic.ttf"),
    REM_bold: require("./assets/fonts/REM-Bold.ttf"),
    REM_thinItalic: require("./assets/fonts/REM-ThinItalic.ttf"),
    REM_thin: require("./assets/fonts/REM-Thin.ttf"),
    REM_regular: require("./assets/fonts/REM-Regular.ttf"),
    REM_medium: require("./assets/fonts/REM-Medium.ttf"),
    REM_semiBoldItalic: require("./assets/fonts/REM-SemiBoldItalic.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { marginTop: 25 },
          }}
          initialRouteName="Main"
        >
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="ComicDetail" component={ComicDetail} />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
