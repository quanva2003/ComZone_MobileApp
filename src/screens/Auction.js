import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import tw from "twrnc";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomCountDown from "../components/countdown/CustomCountdown";
import HeaderInfo from "../components/home/HeaderInfo";
import { Icon } from "react-native-elements"; // Assuming you're using react-native-elements

const Auction = () => {
  const [ongoingAuctions, setOngoingAuctions] = useState([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("ONGOING"); // Tracks the active tab
  const navigate = useNavigation();

  const fetchAuctions = async () => {
    try {
      const response = await axios.get(`${process.env.BASE_URL}auction`);
      const ongoing = response.data.filter(
        (auction) => auction.status === "ONGOING"
      );
      const upcoming = response.data.filter(
        (auction) => auction.status === "UPCOMING"
      );
      setOngoingAuctions(ongoing);
      setUpcomingAuctions(upcoming);
      setFilteredAuctions(ongoing); // Default to ongoing auctions
      setLoading(false);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      setLoading(false);
    }
  };

  // Fetch auctions when the component mounts
  useFocusEffect(
    React.useCallback(() => {
      fetchAuctions();
    }, [])
  );

  useEffect(() => {
    // Update filtered auctions when activeTab changes
    if (activeTab === "ONGOING") {
      setFilteredAuctions(ongoingAuctions);
    } else {
      setFilteredAuctions(upcomingAuctions);
    }
  }, [activeTab, ongoingAuctions, upcomingAuctions]);

  const handleChangeText = (text) => {
    setSearchText(text);
    const filtered = (
      activeTab === "ONGOING" ? ongoingAuctions : upcomingAuctions
    ).filter((auction) =>
      auction.comics.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredAuctions(filtered);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchText(""); // Clear search text on tab switch
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={tw`bg-white rounded-lg shadow-sm py-4 px-1 mb-4 w-43 items-center`}
      onPress={() => navigate.navigate("AuctionDetail", { auctionData: item })}
    >
      <Image
        source={{ uri: item.comics.coverImage }}
        style={tw`w-40 h-60  rounded-lg`}
      />
      <View style={tw`h-14`}>
        <Text
          style={[tw`text-sm mt-2 text-gray-800`, { fontFamily: "REM" }]}
          numberOfLines={2}
        >
          {item.comics.title}
        </Text>
      </View>
      <CustomCountDown
        endTime={new Date(item?.endTime).getTime()}
        auction={item}
      />
    </TouchableOpacity>
  );

  return (
    <View style={tw`p-5`}>
      <HeaderInfo />

      {/* Search Box */}
      <View
        style={tw`flex flex-row items-center bg-gray-100 rounded-full px-4 py-3 shadow-lg mt-4`}
      >
        <TouchableOpacity style={tw`mr-3`}>
          <Icon type="MaterialIcons" name="search" size={20} />
        </TouchableOpacity>
        <TextInput
          value={searchText}
          onChangeText={handleChangeText}
          placeholder="Bạn đang tìm kiếm truyện gì?"
          style={[
            tw`flex-1 text-base text-gray-800`,
            { fontFamily: "REM_thin" },
          ]}
        />
      </View>

      {/* Tabs */}
      <View
        style={tw`flex-row justify-around bg-gray-200 rounded-full p-2 mt-4`}
      >
        <TouchableOpacity
          style={[
            tw`flex-1 items-center p-2 rounded-full`,
            activeTab === "ONGOING" ? tw`bg-white` : tw`bg-gray-200`,
          ]}
          onPress={() => handleTabChange("ONGOING")}
        >
          <Text
            style={[
              tw`text-sm font-bold`,
              activeTab === "ONGOING" ? tw`text-black` : tw`text-gray-500`,
            ]}
          >
            Đang diễn ra
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            tw`flex-1 items-center p-2 rounded-full`,
            activeTab === "UPCOMING" ? tw`bg-white` : tw`bg-gray-200`,
          ]}
          onPress={() => handleTabChange("UPCOMING")}
        >
          <Text
            style={[
              tw`text-sm font-bold`,
              activeTab === "UPCOMING" ? tw`text-black` : tw`text-gray-500`,
            ]}
          >
            Sắp diễn ra
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <View style={tw`mt-5 pb-60`}>
          <FlatList
            data={filteredAuctions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            columnWrapperStyle={tw`justify-start gap-2`}
            key="auction-list"
            ListEmptyComponent={
              <View style={tw`items-center justify-center mt-10`}>
                <Text style={[tw`text-gray-500`, { fontFamily: "REM" }]}>
                  Không tìm thấy truyện phù hợp
                </Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
};

export default Auction;
