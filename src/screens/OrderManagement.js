import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path, Rect } from "react-native-svg";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState(null);
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "all", title: "Tất cả" },
    { key: "PENDING", title: "Chờ xử lí" },
    { key: "PACKAGING", title: "Đang đóng gói" },
    { key: "DELIVERING", title: "Đang giao hàng" },
    { key: "DELIVERED", title: "Đã giao thành công" },
    { key: "SUCCESSFUL", title: "Hoàn tất" },
    { key: "CANCELED", title: "Bị hủy" },
    { key: "FAILED", title: "Thất bại" },
  ]);

  const fetchOrdersWithItems = async () => {
    try {
      const response = await axios.get(`${process.env.BASE_URL}orders/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const ordersData = response.data;

      const ordersWithItems = await Promise.all(
        ordersData.map(async (order) => {
          const itemsResponse = await axios.get(
            `${process.env.BASE_URL}order-items/order/${order.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const itemsData = itemsResponse.data;

          const refundRequestResponse = await axios.get(
            `${process.env.BASE_URL}refund-requests/order/${order.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const refundData = refundRequestResponse.data;

          return {
            ...order,
            items: itemsData,
            refundRequest: refundData,
            rejectReason: refundData?.rejectedReason,
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error);
    }
  };

  const fetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchOrdersWithItems();
    }
  }, [token]);

  const filterOrders = (status) =>
    status === "all"
      ? orders
      : orders.filter((order) => order.status === status);
  const translateStatus = (status) => {
    const statusTranslations = {
      PENDING: "Chờ xử lí",
      PACKAGING: "Đang đóng gói",
      DELIVERING: "Đang giao hàng",
      DELIVERED: "Đã giao thành công",
      SUCCESSFUL: "Hoàn tất",
      CANCELED: "Bị hủy",
      FAILED: "Thất bại",
      all: "Tất cả",
    };

    return statusTranslations[status] || status;
  };
  const renderScene = ({ route }) => {
    const filteredOrders = filterOrders(route.key);
    console.log(filteredOrders);
    if (filteredOrders.length === 0) {
      return (
        <View style={tw`flex-1 justify-center items-center`}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="84"
            height="84"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-library-big"
          >
            <Rect width="8" height="18" x="3" y="3" rx="1" />
            <Path d="M7 3v18" />
            <Path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z" />
          </Svg>
          <Text
            style={[tw`text-gray-500 text-2xl`, { fontFamily: "REM_bold" }]}
          >
            Chưa có giao dịch nào
          </Text>
        </View>
      );
    }
    return (
      <ScrollView
        contentContainerStyle={tw`pb-4`}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.map((item) => (
          <View key={item.id} style={tw`p-4 border-b border-gray-200`}>
            <View style={tw`flex-row items-center justify-between mb-3`}>
              <View style={tw`flex-row items-center gap-2`}>
                <Image
                  source={{ uri: item.items[0].comics.sellerId.avatar }}
                  style={tw`h-8 w-8 rounded-full`}
                />
                <Text style={[tw`text-sm`, { fontFamily: "REM_bold" }]}>
                  {item.items[0].comics.sellerId.name}
                </Text>
              </View>
              <View style={tw`p-2 rounded-lg bg-sky-400`}>
                <Text style={[{ fontFamily: "REM" }, tw`text-xs`]}>
                  {translateStatus(item.status)}
                </Text>
              </View>
            </View>
            {item.items.map((orderItem) => (
              <View key={orderItem.id} style={tw`flex-row items-center mt-2`}>
                <Image
                  source={{ uri: orderItem.comics.coverImage }}
                  style={tw`h-20 w-16 mr-4`}
                />
                <View style={tw`h-20 flex justify-between`}>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[
                      tw`text-base max-w-[300px]`,
                      { fontFamily: "REM_bold" },
                    ]}
                  >
                    {orderItem.comics.title}
                  </Text>
                  <Text
                    style={[tw`text-sm text-gray-600`, { fontFamily: "REM" }]}
                  >
                    {orderItem.price.toLocaleString()} VND
                  </Text>
                </View>
              </View>
            ))}
            {item.refundRequest && (
              <Text>Refund Reason: {item.refundRequest.reason}</Text>
            )}
            {item.rejectReason && (
              <Text>Reject Reason: {item.rejectReason}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View>
      <View style={tw`bg-black py-5 shadow-lg text-center`}>
        <TouchableOpacity
          style={tw`absolute top-4 left-4 bg-white rounded-full p-2 z-10`}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={[
            tw`text-center text-white text-2xl`,
            { fontFamily: "REM_bold" },
          ]}
        >
          ĐƠN HÀNG
        </Text>
      </View>
      <View style={tw`h-[90%]`}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={SceneMap(
            routes.reduce((scenes, route) => {
              scenes[route.key] = renderScene;
              return scenes;
            }, {})
          )}
          onIndexChange={setIndex}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              scrollEnabled
              style={tw`bg-white text-black`}
              activeColor={"#000000"}
              inactiveColor={"#ccc"}
              indicatorStyle={tw`bg-black`}
              tabStyle={{}}
            />
          )}
        />
      </View>
    </View>
  );
};

export default OrderManagement;
