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
import { useContext, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartProvider } from "./src/context/CartContext";
import SearchResults from "./src/screens/SearchResult";
import Auction from "./src/screens/Auction";
import Comic from "./src/screens/Comic";
import OrderDetail from "./src/screens/OrderDetail";
import FeedbackSeller from "./src/screens/FeedbackSeller";
import AuctionsHistory from "./src/screens/AuctionsHistory";
import AuctionHistoryDetail from "./src/screens/AuctionHistoryDetail";
import Ionicons from "@expo/vector-icons/Ionicons";
import Notification from "./src/screens/Notification";
import { SocketProvider } from "./src/context/SocketContext";
import { NotificationContext, NotificationProvider } from "./src/context/NotificationContext";
import TransactionHistory from "./src/screens/TransactionHistory";
import AddNewAddress from "./src/screens/AddNewAddress";
import EditAddress from "./src/screens/EditAddress";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
SplashScreen.preventAutoHideAsync();

const MainTabs = () => {
  const { unreadCount } = useContext(NotificationContext); // Get unread count from context
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
        name="Thông báo"
        component={Notification}
        options={({ route }) => ({
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="notifications-sharp"
              size={24}
              color={focused ? "#fff" : "#666"}
            />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : null, // Show the badge if unreadCount is greater than 0
          tabBarBadgeStyle: {
            backgroundColor: "red", // Customize the badge background color
            color: "white", // Customize the text color of the badge
          },
        })}
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
        <SocketProvider>
          <NotificationProvider>
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
                  <Stack.Screen
                    name="AuctionDetail"
                    component={AuctionDetail}
                  />
                  <Stack.Screen name="Cart" component={Cart} />
                  <Stack.Screen name="Checkout" component={Checkout} />
                  <Stack.Screen
                    name="OrderComplete"
                    component={OrderComplete}
                  />
                  <Stack.Screen
                    name="OrderManagement"
                    component={OrderManagement}
                  />
                  <Stack.Screen name="AddressList" component={AddressList} />
                  <Stack.Screen
                    name="WalletDeposit"
                    component={WalletDeposit}
                  />
                  <Stack.Screen
                    name="SearchResults"
                    component={SearchResults}
                  />
                  <Stack.Screen name="OrderDetail" component={OrderDetail} />
                  <Stack.Screen
                    name="FeedbackSeller"
                    component={FeedbackSeller}
                  />
                  <Stack.Screen
                    name="AuctionsHistory"
                    component={AuctionsHistory}
                  />
                  <Stack.Screen
                    name="AuctionHistoryDetail"
                    component={AuctionHistoryDetail}
                  />
                  <Stack.Screen
                    name="TransactionHistory"
                    component={TransactionHistory}
                  />
                  <Stack.Screen
                    name="AddNewAddress"
                    component={AddNewAddress}
                  />
                  <Stack.Screen name="EditAddress" component={EditAddress} />
                </Stack.Navigator>
              </SafeAreaProvider>
            </NavigationContainer>
          </NotificationProvider>
        </SocketProvider>
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
