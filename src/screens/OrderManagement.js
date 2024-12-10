import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path, Rect } from "react-native-svg";

const OrderManagement = ({ route }) => {
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [routes] = useState([
    { key: "ALL", title: "Tất cả" },
    { key: "PENDING", title: "Chờ xác nhận" },
    { key: "PROCESSING", title: "Đang xử lý" },
    { key: "DELIVERING", title: "Đang giao" },
    { key: "DELIVERED", title: "Đã giao" },
    { key: "SUCCESSFUL", title: "Hoàn tất" },
    { key: "CANCELLED", title: "Đã hủy" },
  ]);
  console.log(process.env.BASE_URL);

  const fetchOrdersWithItems = async () => {
    try {
      setIsLoading(true);
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
          const itemsTotal = itemsData.reduce(
            (sum, item) => sum + item.price,
            0
          );
          const deliveryFee = order.delivery?.deliveryFee || 0;
          const totalPrice = itemsTotal + deliveryFee;
          return {
            ...order,
            items: itemsData,
            itemsTotal,
            deliveryFee,
            totalPrice,
            refundRequest: refundData,
            rejectReason: refundData?.rejectedReason,
          };
        })
      );

      setOrders(ordersWithItems);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error);
    } finally {
      setIsLoading(false);
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
  const fetchUser = async () => {
    const userInfo = await AsyncStorage.getItem("currentUser");
    const parseUserInfo = JSON.parse(userInfo);
    console.log("a", parseUserInfo);

    if (userInfo) setUserId(parseUserInfo.id);
  };
  useEffect(() => {
    fetchUser();
    fetchToken();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Kiểm tra nếu có activeTab trong params
      if (route.params?.activeTab) {
        setActiveTab(route.params.activeTab);
        // Reset params để tránh set lại tab khi quay lại màn hình
        navigation.setParams({ activeTab: undefined });
      }

      // Fetch data
      if (token) {
        fetchOrdersWithItems();
      }
    }, [token, route.params?.activeTab])
  );

  const filterOrders = (status) =>
    status === "ALL"
      ? orders
      : orders.filter((order) => order.status === status);
  const translateStatus = (status) => {
    const statusTranslations = {
      PENDING: "Chờ xác nhận",
      PROCESSING: "Đang xử lý",
      DELIVERING: "Đang giao",
      DELIVERED: "Đã giao",
      SUCCESSFUL: "Hoàn tất",
      CANCELLED: "Đã hủy",
      FAILED: "Thất bại",
      ALL: "Tất cả",
    };

    return statusTranslations[status] || status;
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "PENDING":
      case "PROCESSING":
      case "DELIVERING":
        return {
          backgroundColor: "#fff2c9",
          borderRadius: 8,
          color: "#f89b28",
        };
      case "DELIVERED":
      case "SUCCESSFUL":
        return {
          backgroundColor: "#d4edda",
          borderRadius: 8,
          color: "#155724",
        };
      case "CANCELLED":
      case "FAILED":
        return {
          backgroundColor: "#f8d7da",
          borderRadius: 8,
          color: "#721c24",
        };
      default:
        return {
          backgroundColor: "transparent",
          borderRadius: 8,
          color: "#000",
        };
    }
  };

  const renderScene = ({ route }) => {
    const filteredOrders = filterOrders(route.key);

    if (isLoading) {
      return <ActivityIndicator size="large" color="#000" />;
    } else {
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
            <TouchableOpacity
              key={item.id}
              style={tw`p-4 border-b border-gray-200 bg-white my-2`}
              onPress={() => {
                navigation.navigate("OrderDetail", { order: item });
              }}
            >
              <View style={tw`flex-row items-center justify-between mb-3`}>
                <View style={tw`flex-row items-center gap-2`}>
                  <Image
                    source={{ uri: item.delivery.from.user.avatar }}
                    style={tw`h-8 w-8 rounded-full`}
                  />
                  <Text style={[tw`text-sm`, { fontFamily: "REM_bold" }]}>
                    {item.delivery.from.user.name}
                  </Text>
                </View>
                <View style={[tw`p-2`, { ...getStatusStyles(item.status) }]}>
                  <Text
                    style={[
                      { fontFamily: "REM" },
                      tw`text-xs`,
                      { ...getStatusStyles(item.status) },
                    ]}
                  >
                    {translateStatus(item.status)}
                  </Text>
                </View>
              </View>

              {item.items.map((orderItem) => (
                <View
                  key={orderItem.id}
                  style={tw`flex-row items-center mt-2 border-t border-gray-300 pt-2`}
                >
                  <Image
                    source={{ uri: orderItem.comics.coverImage }}
                    style={tw`h-22 w-16 mr-4`}
                  />
                  <View style={tw`h-24 flex justify-between`}>
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
                    <View
                      style={tw`flex-row items-center justify-between w-[90%]`}
                    >
                      <Text
                        style={[
                          tw`text-sm text-gray-600`,
                          { fontFamily: "REM" },
                        ]}
                      >
                        {orderItem.price.toLocaleString()} đ
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
              {expandedOrderId === item.id && (
                <View style={tw`mt-4`}>
                  <View style={tw`flex-row justify-between mb-2`}>
                    <Text
                      style={[tw`text-sm text-gray-600`, { fontFamily: "REM" }]}
                    >
                      Tổng tiền hàng
                    </Text>
                    <Text style={[tw`text-sm`, { fontFamily: "REM_bold" }]}>
                      {item.itemsTotal?.toLocaleString() || "0"} đ
                    </Text>
                  </View>
                  <View style={tw`flex-row justify-between`}>
                    <Text
                      style={[tw`text-sm text-gray-600`, { fontFamily: "REM" }]}
                    >
                      Phí vận chuyển
                    </Text>
                    <Text style={[tw`text-sm`, { fontFamily: "REM_bold" }]}>
                      {item.deliveryFee?.toLocaleString() || "0"} đ
                    </Text>
                  </View>
                </View>
              )}
              <TouchableOpacity
                style={tw`mt-4 border-t border-gray-300 pt-2`}
                onPress={() =>
                  setExpandedOrderId(
                    expandedOrderId === item.id ? null : item.id
                  )
                }
              >
                <View style={tw`flex-row justify-between items-end`}>
                  <Text style={[tw`text-sm`, { fontFamily: "REM_regular" }]}>
                    Thành tiền
                  </Text>
                  <View style={tw`flex-row gap-1 items-end`}>
                    <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>
                      {item.totalPrice?.toLocaleString() || "0"} đ
                    </Text>
                    {!expandedOrderId ? (
                      <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#232323"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-chevron-down"
                      >
                        <Path d="m6 9 6 6 6-6" />
                      </Svg>
                    ) : (
                      <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#232323"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-chevron-up"
                      >
                        <Path d="m18 15-6-6-6 6" />
                      </Svg>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
              {item.status === "DELIVERED" && (
                <View style={tw`flex-row w-full justify-between mt-2`}>
                  <TouchableOpacity
                    style={tw`py-2 px-4 bg-white border border-gray-300 items-center text-center rounded-lg`}
                  >
                    <Text
                      style={[
                        tw`text-sm text-black text-center`,
                        { fontFamily: "REM_regular" },
                      ]}
                    >
                      Gặp vấn đề khi nhận hàng
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={tw`py-2 px-4 bg-[#232323] border border-[#232323] items-center text-center rounded-lg`}
                    onPress={() =>
                      navigation.navigate("FeedbackSeller", {
                        item,
                        userId,
                      })
                    }
                  >
                    <Text
                      style={[
                        tw`text-sm text-white text-center`,
                        { fontFamily: "REM_regular" },
                      ]}
                    >
                      Đã nhận được hàng
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {item.refundRequest && (
                <Text>Refund Reason: {item.refundRequest.reason}</Text>
              )}
              {item.rejectReason && (
                <Text>Reject Reason: {item.rejectReason}</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    }
  };

  const AllOrdersRoute = () => renderScene({ route: { key: "ALL" } });
  const PendingOrdersRoute = () => renderScene({ route: { key: "PENDING" } });
  const ProcessingOrdersRoute = () =>
    renderScene({ route: { key: "PROCESSING" } });
  const DeliveringOrdersRoute = () =>
    renderScene({ route: { key: "DELIVERING" } });
  const DeliveredOrdersRoute = () =>
    renderScene({ route: { key: "DELIVERED" } });
  const CancelledOrdersRoute = () =>
    renderScene({ route: { key: "CANCELLED" } });
  const SuccessfulOrdersRoute = () =>
    renderScene({ route: { key: "SUCCESSFUL" } });

  return (
    <View style={tw`flex-1`}>
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
      <View style={tw`flex-1`}>
        <TabView
          navigationState={{
            index: routes.findIndex((route) => route.key === activeTab),
            routes,
          }}
          renderScene={SceneMap({
            ALL: AllOrdersRoute,
            PENDING: PendingOrdersRoute,
            PROCESSING: ProcessingOrdersRoute,
            DELIVERING: DeliveringOrdersRoute,
            DELIVERED: DeliveredOrdersRoute,
            SUCCESSFUL: SuccessfulOrdersRoute,
            CANCELLED: CancelledOrdersRoute,
          })}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: "black" }}
              style={{ backgroundColor: "white" }}
              labelStyle={{
                fontFamily: "REM_bold",
                fontSize: 12,
                textTransform: "none",
              }}
              scrollEnabled={true}
              tabStyle={{ width: "auto" }}
              activeColor="black"
              inactiveColor="gray"
            />
          )}
          onIndexChange={(index) => setActiveTab(routes[index].key)}
        />
      </View>
    </View>
  );
};

export default OrderManagement;
