import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import tw from "twrnc";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path, Rect } from "react-native-svg";
import { convertToVietnameseDate } from "../utils/convertToVietnameseDate";
import { StyleSheet } from "react-native";

const AuctionsHistory = ({ route }) => {
  const [auctions, setAuctions] = useState([]);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const navigation = useNavigation();
  console.log(process.env.BASE_URL);

  const [routes] = useState([
    { key: "ALL", title: "Tất cả" },
    { key: "ONGOING", title: "Đang diễn ra" },
    { key: "SUCCESSFUL", title: "Kết Thúc" },
    { key: "COMPLETED", title: "Hoàn thành" },
    { key: "FAILED", title: "Bị Hủy" },
  ]);

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
    if (userInfo) setUserId(parseUserInfo.id);
  };

  const fetchAuctionsWithDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.BASE_URL}deposits/user/auction`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const depositsData = response.data;
      const auctionsData = depositsData.map((deposit) => deposit.auction);

      const auctionsWithDetails = await Promise.all(
        auctionsData.map(async (auction) => {
          try {
            const highestBidResponse = await axios.get(
              `${process.env.BASE_URL}bids/highest-bid/${auction.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return {
              ...auction,
              highestBid: highestBidResponse.data,
            };
          } catch (error) {
            console.error(`Error fetching highest bid for auction:`, error);
            return auction;
          }
        })
      );

      setAuctions(auctionsWithDetails);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchToken();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.activeTab) {
        setActiveTab(route.params.activeTab);
        navigation.setParams({ activeTab: undefined });
      }

      if (token) {
        fetchAuctionsWithDetails();
      }
    }, [token, route.params?.activeTab])
  );

  const translateStatus = (status) => {
    const statusTranslations = {
      ONGOING: "Đang diễn ra",
      SUCCESSFUL: "Đấu giá thành công",
      COMPLETED: "Hoàn thành",
      FAILED: "Đấu giá thất bại",
      CANCELLED: "Đã hủy",
      ALL: "Tất cả",
    };
    return statusTranslations[status] || status;
  };

  const getStatusChipStyles = (status) => {
    switch (status) {
      case "SUCCESSFUL":
        return styles.successful;
      case "UPCOMING":
        return styles.upcoming;
      case "ONGOING":
        return styles.ongoing;
      case "FAILED":
        return styles.failed;
      case "CANCELED":
        return styles.canceled;
      case "COMPLETED":
        return styles.completed;
      default:
        return styles.default;
    }
  };

  const styles = StyleSheet.create({
    base: {
      borderRadius: 8,
      paddingVertical: 4,
      paddingHorizontal: 10,
      fontWeight: "bold",
      display: "flex", // Use 'flex' for layouts
    },
    successful: {
      color: "#4caf50",
      backgroundColor: "#e8f5e9",
    },
    upcoming: {
      color: "#ff9800",
      backgroundColor: "#fff3e0",
    },
    ongoing: {
      color: "#2196f3",
      backgroundColor: "#e3f2fd",
    },
    failed: {
      color: "#e91e63",
      backgroundColor: "#fce4ec",
    },
    canceled: {
      color: "#f44336",
      backgroundColor: "#ffebee",
    },
    completed: {
      color: "#009688",
      backgroundColor: "#e0f2f1",
    },
    default: {
      color: "#000",
      backgroundColor: "#fff",
    },
  });

  const getAuctionResultColor = (isWin) => {
    return isWin ? "#D6FFD8" : "rgb(255 173 201)";
  };

  const renderScene = ({ route }) => {
    const filteredAuctions =
      route.key === "ALL"
        ? auctions
        : auctions.filter((auction) => auction.status === route.key);

    if (isLoading) {
      return <ActivityIndicator size="large" color="#000" />;
    }

    if (filteredAuctions.length === 0) {
      return (
        <View style={tw`flex-1 justify-center items-center`}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="84"
            height="84"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#232323"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-hard-hat"
          >
            <Path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" />
            <Path d="M14 6a6 6 0 0 1 6 6v3" />
            <Path d="M4 15v-3a6 6 0 0 1 6-6" />
            <Rect x="2" y="15" width="20" height="4" rx="1" />
          </Svg>
          <Text
            style={[tw`text-gray-500 text-2xl`, { fontFamily: "REM_bold" }]}
          >
            Chưa có cuộc đấu giá
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
        {filteredAuctions.map((auction) => {
          const isWin =
            auction.status === "SUCCESSFUL" && auction.winner?.id === userId;

          // Determine the status text based on the auction state and user's win status
          const statusText = isWin
            ? "Thành công"
            : auction.status === "SUCCESSFUL" ||
              (auction.status === "COMPLETED" && auction.winner?.id !== userId)
            ? "Thất bại"
            : translateStatus(auction.status);

          // Cập nhật logic cho statusStyles
          const statusStyles = isWin
            ? getStatusChipStyles("SUCCESSFUL")
            : auction.status === "SUCCESSFUL" ||
              (auction.status === "COMPLETED" && auction.winner?.id !== userId)
            ? getStatusChipStyles("FAILED")
            : getStatusChipStyles(auction.status);

          // Cập nhật logic cho borderColor
          const borderColor =
            auction.status === "COMPLETED" && auction.winner?.id !== userId
              ? getStatusChipStyles("FAILED") // Dùng màu của trạng thái "FAILED"
              : auction.status === "COMPLETED"
              ? "transparent"
              : auction.status === "ONGOING"
              ? getStatusChipStyles("ONGOING")
              : getAuctionResultColor(isWin);

          return (
            <TouchableOpacity
              key={auction.id}
              style={tw`p-4 border-b border-gray-200 bg-white my-2`}
              onPress={() => {
                if (auction.status === "ONGOING") {
                  navigation.navigate("AuctionDetail", {
                    auctionData: auction,
                  });
                } else {
                  navigation.navigate("AuctionHistoryDetail", { auction });
                }
              }}
            >
              {/* Seller and Status Header */}
              <View style={tw`flex-row items-center justify-between mb-3`}>
                <View style={tw`flex-row items-center gap-2`}>
                  <Image
                    source={{ uri: auction.comics.sellerId.avatar }}
                    style={tw`h-8 w-8 rounded-full`}
                  />
                  <Text style={[tw`text-sm`, { fontFamily: "REM_bold" }]}>
                    {auction.comics.sellerId.name}
                  </Text>
                </View>
                <View
                  style={[
                    statusStyles,styles.base,
                    { backgroundColor: statusStyles.backgroundColor },
                  ]}
                >
                  <Text
                    style={{
                      color: statusStyles.color,
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {statusText}
                  </Text>
                </View>
              </View>

              {/* Comic Details */}
              <View style={tw`flex-row`}>
                <Image
                  source={{ uri: auction.comics.coverImage }}
                  style={tw`h-20 w-16 mr-3`}
                />
                <View style={tw`flex-1`}>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[tw`text-sm`, { fontFamily: "REM_bold" }]}
                  >
                    {auction.comics.title}
                  </Text>
                  {auction?.winner?.id === userId &&
                  auction.status === "SUCCESSFUL" ? (
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={tw`text-xs text-orange-500 mt-1`}
                    >
                      Vui lòng thanh toán trước{" "}
                      {convertToVietnameseDate(auction?.paymentDeadline)}nếu
                      không bạn sẽ mất cọc
                    </Text>
                  ) : auction?.winner?.id === userId &&
                    auction.status === "FAILED" ? (
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={tw`text-xs text-red-500 mt-1`}
                    >
                      Bạn đã mất cọc do không thanh toán trước{" "}
                      {convertToVietnameseDate(auction?.paymentDeadline)}
                    </Text>
                  ) : null}
                  {/* Bid Information */}
                  <View style={tw`mt-2`}>
                    {auction.highestBid &&
                    auction.highestBid.price === auction.currentPrice ? (
                      <Text
                        style={[
                          tw`text-xs text-green-600 bg-green-100 rounded px-2 py-1`,
                          { alignSelf: "flex-start" },
                        ]}
                      >
                        Bạn đứng đầu với mức giá:{" "}
                        {auction.highestBid.price?.toLocaleString()} đ
                      </Text>
                    ) : (
                      <Text style={tw`text-sm`}>
                        {auction.highestBid ? (
                          <>
                            Bạn đã đặt giá:{" "}
                            <Text style={tw`text-orange-500`}>
                              {auction.highestBid.price?.toLocaleString()} đ
                            </Text>
                          </>
                        ) : (
                          <Text style={tw`text-xs text-orange-500`}>
                            Bạn chưa ra giá.
                          </Text>
                        )}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

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
          LỊCH SỬ ĐẤU GIÁ
        </Text>
      </View>
      <View style={tw`flex-1`}>
        <TabView
          navigationState={{
            index: routes.findIndex((route) => route.key === activeTab),
            routes,
          }}
          renderScene={SceneMap(
            Object.fromEntries(
              routes.map((route) => [route.key, () => renderScene({ route })])
            )
          )}
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

export default AuctionsHistory;
