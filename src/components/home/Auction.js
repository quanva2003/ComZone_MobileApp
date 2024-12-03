import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import axios from "axios";
import CurrencySplitter from "../../assistants/Spliter";
import CountDown from "react-native-countdown-component";

const Auction = () => {
  const [ongoingAuctions, setOngoingAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchAuctions = async () => {
    try {
      const response = await axios.get(`${process.env.BASE_URL}auction`);
      const auctionComics = response.data.filter(
        (auction) => auction.status === "ONGOING"
      );
      setOngoingAuctions(auctionComics);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const renderItem = ({ item }) => {
    const endTime = new Date(item.endTime).getTime();

    return (
      <View
        style={tw`bg-white rounded-lg shadow-sm py-4 px-2 mb-4 w-43 items-center`}
      >
        <Image
          source={{ uri: item.comics.coverImage }}
          style={tw`w-35 h-45 rounded-lg`}
        />
        <Text
          style={[tw`text-sm mt-2 text-gray-800`, { fontFamily: "REM" }]}
          numberOfLines={1}
        >
          {item.comics.title}
        </Text>
        {/* <Text
          style={[tw`text-xs text-gray-500`, { fontFamily: "REM_regular" }]}
        >
          {item.comics.sellerId.name}
        </Text>
        <View style={tw`mt-2 items-center`}>
          <Text style={[{ fontFamily: "REM_bold" }]}>Giá hiện tại:</Text>
          <Text style={[tw`text-sm`, { fontFamily: "REM_bold" }]}>
            {CurrencySplitter(item.currentPrice)}đ
          </Text>
        </View> */}
        <View style={tw`flex-col gap-2 mt-2 items-center`}>
          <Text
            style={[tw`text-xs text-gray-500`, { fontFamily: "REM_regular" }]}
          >
            Thời gian còn lại:{" "}
          </Text>
          <CountDown
            until={(endTime - Date.now()) / 1000}
            size={16}
            onFinish={() => console.log("Auction ended")}
            digitStyle={{
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
            }}
            digitTxtStyle={{ color: "black" }}
            timeLabelStyle={{
              color: "grey",
              fontWeight: "semi-bold",
              fontSize: 16,
              fontFamily: "REM",
            }}
            separatorStyle={{
              color: "black",
            }}
            timeToShow={["H", "M", "S"]}
            timeLabels={{ d: "Ngày", h: "Giờ", m: "Phút", s: "Giây" }}
          />
        </View>
        <View style={tw`mt-3 flex items-center w-full`}>
          <TouchableOpacity style={tw`bg-black py-1 px-3 rounded-md `}>
            <Text style={[tw`text-white text-xs`, { fontFamily: "REM" }]}>
              XEM CHI TIẾT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={tw`py-4`}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <View>
          <FlatList
            data={ongoingAuctions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            columnWrapperStyle={tw`justify-around`}
            key="auction-list"
          />

          <View style={tw`items-center`}>
            <TouchableOpacity>
              <Text>Xem thêm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default Auction;
