import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import tw from "twrnc";
import CurrentAddress from "../components/address/CurrentAddress";
import Svg, { Circle, Path } from "react-native-svg";

const Checkout = ({ route, navigation }) => {
  const { selectedComics } = route.params || { selectedComics: [] };

  const [totalPrice, setTotalPrice] = useState(0);
  const [token, setToken] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState();
  const currentUserAddress = async () => {
    if (token) {
      const resUserAddress = await axios.get(
        `${process.env.BASE_URL}user-addresses/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(resUserAddress.data);

      const addresses = resUserAddress.data || [];
      const defaultAddress = addresses.find(
        (address) => address.isDefault === true
      );
      console.log("fff", defaultAddress);

      setSelectedAddress(defaultAddress);
      const sortedAddresses = [
        defaultAddress,
        ...addresses.filter((address) => address.is_default !== 1),
      ];
      console.log("a", sortedAddresses);

      setUserAddress(sortedAddresses);
    }
  };
  const groupBySeller = (comics) => {
    return comics.reduce((grouped, comic) => {
      if (!comic.sellerId) return grouped;
      const sellerId = comic.sellerId.id;
      if (!grouped[sellerId]) {
        grouped[sellerId] = [];
      }
      grouped[sellerId].push(comic);
      return grouped;
    }, {});
  };

  const groupedComics = groupBySeller(selectedComics);

  const calculateTotalPrice = () => {
    const total = selectedComics.reduce((acc, comic) => acc + comic.price, 0);
    setTotalPrice(total);
  };
  const fetchToken = async () => {
    const storedToken = await AsyncStorage.getItem("token");
    console.log(token);

    setToken(storedToken);
  };
  useEffect(() => {
    calculateTotalPrice();
    fetchToken();
  }, [selectedComics]);
  useEffect(() => {
    if (token) currentUserAddress();
  }, [token]);
  console.log("bbb", selectedAddress.fullName);

  return (
    <View style={tw`flex-1`}>
      {/* Header */}
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
          THANH TOÁN
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={tw`flex-1 p-4 mb-10`}>
        {/* <CurrentAddress userAddress={userAddress} /> */}
        <View style={tw`bg-white rounded-xl mb-3`}>
          <View style={tw`flex-1 p-3 flex-row gap-2`}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-map-pin"
              style={tw`mt-2`}
            >
              <Path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <Circle cx="12" cy="10" r="3" />
            </Svg>
            <View style={tw`flex`}>
              <View style={tw`flex-row gap-1`}>
                <Text style={[tw`text-base`, { fontFamily: "REM_bold" }]}>
                  {selectedAddress.fullName}
                </Text>
                <Text
                  style={[tw`text-base`, { fontFamily: "REM_regular" }]}
                >{`(${selectedAddress.phone})`}</Text>
              </View>
              <Text
                style={[tw`text-sm`, { fontFamily: "REM_regular" }]}
                numberOfLines={2}
              >
                {selectedAddress.fullAddress}
              </Text>
            </View>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-chevron-right"
              style={tw`mt-2`}
            >
              <Path d="m9 18 6-6-6-6" />
            </Svg>
          </View>
        </View>
        {Object.keys(groupedComics).length === 0 ? (
          <View style={tw`flex-1 justify-center items-center`}>
            <Text style={tw`text-xl font-bold`}>Giỏ hàng của bạn trống</Text>
          </View>
        ) : (
          Object.keys(groupedComics).map((sellerId) => (
            <View key={sellerId} style={tw`bg-white mb-3 rounded-xl`}>
              <View style={tw` p-2 flex-row`}>
                <Image
                  source={{ uri: groupedComics[sellerId][0].sellerId.avatar }}
                  style={tw`w-10 h-10 rounded-full mr-2`}
                />
                <Text style={[tw`text-xl`, { fontFamily: "REM_bold" }]}>
                  {groupedComics[sellerId][0].sellerId.name}{" "}
                </Text>
              </View>

              {groupedComics[sellerId].map((comic) => (
                <View key={comic.id} style={tw`mb-2 rounded-lg`}>
                  <View
                    style={tw`flex-row items-center p-2 border-t border-gray-300`}
                  >
                    <Image
                      source={{ uri: comic.coverImage }}
                      style={tw`w-16 h-24 rounded-md mr-4`}
                    />
                    <View style={tw`flex-1`}>
                      <Text
                        style={[tw`text-lg`, { fontFamily: "REM_regular" }]}
                        numberOfLines={2}
                      >
                        {comic.title}
                      </Text>
                      <Text
                        style={[tw`text-xl mt-2`, { fontFamily: "REM_bold" }]}
                      >
                        {comic.price.toLocaleString()} đ
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* Footer */}
      <View
        style={tw`absolute bottom-0 left-0 right-0 bg-white flex flex-row items-center`}
      >
        <View style={tw`flex flex-col pl-4 w-4/6 items-end pr-2`}>
          <Text style={[tw`text-sm`, { fontFamily: "REM_regular" }]}>
            Tổng thanh toán:
          </Text>
          <Text style={[tw`text-xl`, { fontFamily: "REM_bold" }]}>
            {totalPrice.toLocaleString()} đ
          </Text>
        </View>

        <TouchableOpacity
          style={tw`bg-black py-4 px-4 justify-center items-center w-2/6`}
          onPress={() => console.log("Proceed to Payment")}
        >
          <Text
            style={[tw`text-white text-center`, { fontFamily: "REM_bold" }]}
          >
            ĐẶT HÀNG
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Checkout;
