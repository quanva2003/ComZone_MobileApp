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

const AuctionsHistory = ({ route }) => {
  const [auctions, setAuctions] = useState([]);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const navigation = useNavigation();

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

  const getStatusStyles = (status, isWin) => {
    if (status === "SUCCESSFUL" && isWin) {
      return {
        backgroundColor: "#d4edda",
        borderRadius: 8,
        color: "#155724",
      };
    }
    switch (status) {
      case "ONGOING":
        return {
          backgroundColor: "#fff2c9",
          borderRadius: 8,
          color: "#f89b28",
        };
      case "FAILED":
      case "CANCELLED":
        return {
          backgroundColor: "#f8d7da",
          borderRadius: 8,
          color: "#721c24",
        };
      case "COMPLETED":
        return {
          backgroundColor: "#d4edda",
          borderRadius: 8,
          color: "#155724",
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
            ? "Đấu giá thành công"
            : auction.status === "SUCCESSFUL" ||
              (auction.status === "COMPLETED" && auction.winner?.id !== userId)
            ? "Đấu giá thất bại"
            : translateStatus(auction.status);

          const statusStyles = getStatusStyles(auction.status, isWin);

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
                    tw`p-2`,
                    { ...statusStyles },
                    statusText === "Đấu giá thất bại" && {
                      backgroundColor: "#f8d7da",
                      borderRadius: 4,
                    },
                  ]}
                >
                  <Text
                    style={[
                      { fontFamily: "REM" },
                      tw`text-xs`,
                      { ...statusStyles },
                      statusText === "Đấu giá thất bại" && {
                        color: "#721c24",
                      },
                    ]}
                  >
                    {statusText}
                  </Text>
                </View>
              </View>

              {/* Comic Details */}
              <View
                style={tw`flex-row items-center mt-2 border-t border-gray-300 pt-2`}
              >
                <Image
                  source={{ uri: auction.comics.coverImage }}
                  style={tw`h-22 w-16 mr-4`}
                />
                <View style={tw`h-24 flex justify-between flex-1`}>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[
                      tw`text-base max-w-[300px]`,
                      { fontFamily: "REM_bold" },
                    ]}
                  >
                    {auction.comics.title}
                  </Text>

                  {/* Bid Information */}
                  <View style={tw`flex-row items-center justify-between`}>
                    <View>
                      {/* Chỉ hiển thị giá hiện tại nếu không phải là người đặt giá cao nhất */}
                      {(!auction.highestBid ||
                        auction.highestBid.price !== auction.currentPrice) && (
                        <Text
                          style={[
                            tw`text-sm ${
                              auction.status === "ONGOING"
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`,
                            { fontFamily: "REM" },
                          ]}
                        >
                          {auction.status === "ONGOING"
                            ? `Giá hiện tại: ${auction.currentPrice?.toLocaleString()} đ`
                            : `Giá trúng: ${auction.currentPrice?.toLocaleString()} đ`}
                        </Text>
                      )}

                      {/* Hiển thị thông tin highestBid */}
                      {auction.highestBid && (
                        <View style={tw`mt-1`}>
                          {auction.highestBid.price === auction.currentPrice ? (
                            <Text
                              style={[
                                tw`text-sm text-green-600 bg-green-100 py-1 px-2 rounded-md`,
                                { fontFamily: "REM" },
                              ]}
                            >
                              Bạn đứng đầu với mức giá:{" "}
                              {auction.highestBid.price?.toLocaleString()} đ
                            </Text>
                          ) : (
                            <Text style={[tw`text-sm`, { fontFamily: "REM" }]}>
                              Bạn đã đặt giá:{" "}
                              <Text style={{ color: "#FF7F00" }}>
                                {auction.highestBid.price?.toLocaleString()} đ
                              </Text>
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
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
