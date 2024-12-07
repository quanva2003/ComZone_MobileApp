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

const AuctionHistoryDetail = ({ route, navigation }) => {
  const { auction } = route.params;
  console.log("auction hi", auction);

  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    const storedToken = await AsyncStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchBids(storedToken);
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
      console.log("bid user", response.data);

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
      FAILED: "Thất bại",
      CANCELLED: "Đã hủy",
    };
    return statusTranslations[status] || status;
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "SUCCESSFUL":
        return {
          backgroundColor: "#d4edda",
          color: "#155724",
        };
      case "FAILED":
      case "CANCELLED":
        return {
          backgroundColor: "#f8d7da",
          color: "#721c24",
        };
      case "COMPLETED":
        return {
          backgroundColor: "#d4edda",
          color: "#155724",
        };
      default:
        return {
          backgroundColor: "transparent",
          color: "#000",
        };
    }
  };

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
                  tw`px-3 py-1 rounded-lg self-start`,
                  getStatusStyles(auction.status),
                ]}
              >
                <Text
                  style={[
                    tw`text-sm`,
                    {
                      fontFamily: "REM",
                      color: getStatusStyles(auction.status).color,
                    },
                  ]}
                >
                  {translateStatus(auction.status)}
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
