import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { AppState, StyleSheet, Text, View } from "react-native";
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
import Profile from "./src/screens/Profile";
import Cart from "./src/screens/Cart";
import Checkout from "./src/screens/Checkout";
import OrderComplete from "./src/screens/OrderComplete";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import OrderManagement from "./src/screens/OrderManagement";
import AddressList from "./src/screens/AddressList";
import WalletDeposit from "./src/screens/WalletDeposit";
import AuctionDetail from "./src/screens/AuctionDetail";
import socket, { connectSocket } from "./src/utils/socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartProvider } from "./src/context/CartContext";
import SearchResults from "./src/screens/SearchResult";
import Auction from "./src/screens/Auction";
import Comic from "./src/screens/Comic";
import { io } from "socket.io-client";
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
        name="Đấu giá"
        component={Auction}
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
        component={Comic}
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
        component={Profile}
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
  // useEffect(() => {
  //   const initializeSocket = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("token");
  //       const userId = await AsyncStorage.getItem("userId");

  //       console.log("token", token);
  //       console.log("userId", userId);

  //       if (token && userId) {
  //         const url = process.env.BASE_URL;
  //         const socketInstance = await connectSocket(url);
  //         socketInstance.emit("joinRoom", userId);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching token or userId:", error);
  //     }
  //   };

  //   initializeSocket();

  //   return () => {
  //     if (socket?.connected) {
  //       socket.disconnect();
  //       console.log("Socket disconnected");
  //     }
  //   };
  // }, []);
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CartProvider>
        <NavigationContainer>
          <SafeAreaProvider>
            <StatusBar style="auto" />
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                contentStyle: { marginTop: 25 },
              }}
              initialRouteName="SignIn"
            >
              <Stack.Screen name="SignIn" component={SignIn} />
              <Stack.Screen name="SignUp" component={SignUp} />
              <Stack.Screen name="Main" component={MainTabs} />
              <Stack.Screen name="ComicDetail" component={ComicDetail} />
              <Stack.Screen name="AuctionDetail" component={AuctionDetail} />
              <Stack.Screen name="Cart" component={Cart} />
              <Stack.Screen name="Checkout" component={Checkout} />
              <Stack.Screen name="OrderComplete" component={OrderComplete} />
              <Stack.Screen
                name="OrderManagement"
                component={OrderManagement}
              />
              <Stack.Screen name="AddressList" component={AddressList} />
              <Stack.Screen name="WalletDeposit" component={WalletDeposit} />
              <Stack.Screen name="SearchResults" component={SearchResults} />
            </Stack.Navigator>
          </SafeAreaProvider>
        </NavigationContainer>
      </CartProvider>
    </GestureHandlerRootView>
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
