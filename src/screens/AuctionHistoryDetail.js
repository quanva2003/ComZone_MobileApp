import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import { StyleSheet } from "react-native";
const AuctionHistoryDetail = ({ route, navigation }) => {
  const { auction } = route.params;

  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null); // Store the logged-in user's ID

  useEffect(() => {
    fetchTokenAndUser();
  }, []);
  const handleBuy = (auction) => {
    console.log("auciton", auction);

    const auctionData = { ...auction.comics };
    auctionData.price = auction.highestBid.price;
    auctionData.auctionId = auction.id;
    auctionData.type = "AUCTION";
    console.log("auction data:", auctionData);

    navigation.navigate("Checkout", {
      selectedComics: [auctionData],
    });
  };
  const fetchTokenAndUser = async () => {
    const storedToken = await AsyncStorage.getItem("token");
    const storedUser = await AsyncStorage.getItem("userId");
    if (storedToken) {
      setToken(storedToken);
      fetchBids(storedToken);
    }
    if (storedUser) {
      setUserId(storedUser);
    }
  };

  const fetchBids = async (token) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.BASE_URL}bids/user/auction/${auction.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBids(response.data);
    } catch (error) {
      console.error("Error fetching bids:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
  const getStatusStyles = (status) => {
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
      alignSelf: "flex-start",
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
  const isWin =
    auction.status === "SUCCESSFUL" && auction.winner?.id === userId;

  const statusText = isWin
    ? "Đấu giá thành công"
    : auction.status === "SUCCESSFUL" ||
      (auction.status === "COMPLETED" && auction.winner?.id !== userId)
    ? "Đấu giá thất bại"
    : translateStatus(auction.status);

  const statusStyles = isWin
    ? getStatusStyles("SUCCESSFUL")
    : auction.status === "SUCCESSFUL" ||
      (auction.status === "COMPLETED" && auction.winner?.id !== userId)
    ? getStatusStyles("FAILED")
    : getStatusStyles(auction.status);

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`bg-black py-5 shadow-lg`}>
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
          CHI TIẾT ĐẤU GIÁ
        </Text>
      </View>

      <ScrollView style={tw`flex-1`}>
        {/* Auction Info */}
        <View style={tw`p-4`}>
          {/* Comic Info */}
          <View style={tw`flex-row mb-4`}>
            <Image
              source={{ uri: auction.comics.coverImage }}
              style={tw`w-24 h-32`}
            />
            <View style={tw`ml-4 flex-1`}>
              <Text style={[tw`text-lg mb-2`, { fontFamily: "REM_bold" }]}>
                {auction.comics.title}
              </Text>
              <View
                style={[
                  statusStyles,
                  styles.base,
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
          </View>

          {/* Auction Details */}
          <View style={tw`bg-gray-50 p-4 rounded-lg mb-4`}>
            <Text style={[tw`text-lg mb-2`, { fontFamily: "REM_bold" }]}>
              Thông tin đấu giá
            </Text>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={[tw`text-gray-600`, { fontFamily: "REM" }]}>
                Giá khởi điểm:
              </Text>
              <Text style={[tw``, { fontFamily: "REM_bold" }]}>
                {auction.reservePrice?.toLocaleString()} đ
              </Text>
            </View>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={[tw`text-gray-600`, { fontFamily: "REM" }]}>
                Giá hiện tại:
              </Text>
              <Text style={[tw``, { fontFamily: "REM_bold" }]}>
                {auction.currentPrice?.toLocaleString()} đ
              </Text>
            </View>
          </View>
          {auction.status === "SUCCESSFUL" && userId === auction.winner?.id && (
            <View style={tw`w-full flex items-center justify-center mb-2`}>
              <TouchableOpacity
                style={tw`py-3 px-6 bg-black rounded-lg`}
                onPress={() => handleBuy(auction)}
              >
                <Text
                  style={[
                    tw`text-lg text-center text-white`,
                    { fontFamily: "REM_bold" },
                  ]}
                >
                  Thanh toán
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Bids History */}
          <View>
            <Text style={[tw`text-lg mb-2`, { fontFamily: "REM_bold" }]}>
              Lịch sử đặt giá
            </Text>
            {bids.map((bid, index) => (
              <View
                key={bid.id}
                style={tw`flex items-center py-3 ${
                  index !== bids.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                <View style={tw`flex-row items-center justify-between w-full`}>
                  <Text style={[tw`text-gray-500`, { fontFamily: "REM" }]}>
                    {new Date(bid.createdAt).toLocaleString()}
                  </Text>
                  <Text style={[tw`text-blue-600`, { fontFamily: "REM_bold" }]}>
                    {bid.price?.toLocaleString()} đ
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AuctionHistoryDetail;
