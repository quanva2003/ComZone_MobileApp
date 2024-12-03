import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Circle, Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

const AddressList = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const MAX_ADDRESSES = 3;

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      const resUserAddress = await axios.get(
        `${process.env.BASE_URL}user-addresses/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(
        "Raw address data:",
        JSON.stringify(resUserAddress.data, null, 2)
      );

      setAddresses(resUserAddress.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const renderAddressItem = ({ item }) => {
    return (
      <View style={tw`p-3 flex flex-row gap-2 bg-white mb-3 rounded-lg`}>
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-map-pin"
          style={tw`mt-2 w-1/6`}
        >
          <Path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
          <Circle cx="12" cy="10" r="3" />
        </Svg>
        <View style={tw`w-4/5`}>
          <View style={tw`flex-row gap-1 items-center`}>
            <Text style={[tw`text-base`, { fontFamily: "REM_bold" }]}>
              {item.fullName}
            </Text>
            <Text
              style={[tw`text-base`, { fontFamily: "REM_regular" }]}
            >{`(${item.phone})`}</Text>
            {item.isDefault && (
              <View style={tw`py-1 px-2 rounded-lg bg-sky-700`}>
                <Text
                  style={[
                    tw`text-xs text-white`,
                    { fontFamily: "REM_regular" },
                  ]}
                >
                  Mặc định
                </Text>
              </View>
            )}
          </View>
          <Text
            style={[tw`text-sm`, { fontFamily: "REM_regular" }]}
            numberOfLines={2}
          >
            {item.fullAddress}
          </Text>
        </View>

        <View>
          <Text style={[tw`text-sm`, { fontFamily: "REM_regular" }]}>Sửa</Text>
        </View>
      </View>
    );
  };
  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`bg-black py-5 shadow-lg`}>
        <TouchableOpacity
          style={tw`absolute top-4 left-4 bg-white rounded-full p-2 z-10`}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={[
            tw`text-center text-white text-xl`,
            { fontFamily: "REM_bold" },
          ]}
        >
          Chọn địa chỉ nhận hàng
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={tw`text-red-500 text-center`}>{error}</Text>
      ) : addresses.length === 0 ? (
        <Text style={tw`text-center text-gray-600`}>No addresses found.</Text>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAddressItem}
          contentContainerStyle={tw`py-4 p-4`}
        />
      )}
      {/* Add New Address Button */}
      {addresses.length < MAX_ADDRESSES && (
        <TouchableOpacity
          style={tw`mt-4 bg-white py-2 px-4 rounded-lg flex-row items-center gap-2 justify-center`}
          onPress={() => navigation.navigate("AddAddress")}
        >
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
            class="lucide lucide-circle-plus"
          >
            <Circle cx="12" cy="12" r="10" />
            <Path d="M8 12h8" />
            <Path d="M12 8v8" />
          </Svg>
          <Text
            style={[tw`text-black text-center`, { fontFamily: "REM_regular" }]}
          >
            Thêm địa chỉ mới
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AddressList;
