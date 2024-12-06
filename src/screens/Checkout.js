import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import tw from "twrnc";
import CurrentAddress from "../components/address/CurrentAddress";
import Svg, { Circle, Path } from "react-native-svg";
import PaymentMethod from "../components/checkout/PaymentMethod";
import CurrencySplitter from "../assistants/Spliter";
import PaymentDetail from "../components/checkout/PaymentDetail";
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useRoute } from "@react-navigation/native";

const Checkout = ({ route, navigation }) => {
  const { selectedComics } = route.params || { selectedComics: [] };

  const [totalPrice, setTotalPrice] = useState(0);
  const [token, setToken] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isHandleLoading, setIsHandleLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [deliveryDetails, setDeliveryDetails] = useState([]);
  const [sellerDetailsGroup, setSellerDetailsGroup] = useState([]);
  const [totalDeliveryPrice, setTotalDeliveryPrice] = useState(0);
  const [isInvalidOrder, setIsInvalidOrder] = useState(false);
  const [notes, setNotes] = useState({});
  const bottomSheetRef = useRef(null);
  const [currentNoteSellerId, setCurrentNoteSellerId] = useState(null);
  const snapPoints = useMemo(() => ["25%"], []);
  const openNoteBottomSheet = (sellerId) => {
    console.log("Opening bottom sheet for seller", sellerId);
    setCurrentNoteSellerId(sellerId);

    // Try different methods to open
    if (bottomSheetRef.current) {
      bottomSheetRef.current.expand(); // Another method
    } else {
      console.error("Bottom sheet ref is null");
    }
  };

  const saveSellerNote = () => {
    if (currentNoteSellerId) {
      bottomSheetRef.current?.close();
      setCurrentNoteSellerId(null);
    }
  };

  const currentUserAddress = async () => {
    if (token) {
      try {
        setIsLoading(true);
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

        setSelectedAddress(defaultAddress);
        const sortedAddresses = [
          defaultAddress,
          ...addresses.filter((address) => address.is_default !== 1),
        ];

        setUserAddress(sortedAddresses);
        const resUserInfo = await axios.get(
          `${process.env.BASE_URL}users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserInfo(resUserInfo.data);
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setIsLoading(false);
      }
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

  const fetchDeliveryDetails = async () => {
    if (!selectedAddress) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
      setDeliveryDetails([]);
      setSellerDetailsGroup([]);
      setTotalDeliveryPrice(0);
      setIsInvalidOrder(false);

      const groupedSelectedComics = selectedComics.reduce((acc, comic) => {
        const sellerId = comic.sellerId.id;
        if (!acc[sellerId]) {
          acc[sellerId] = {
            comics: [],
          };
        }
        acc[sellerId].comics.push({
          comic,
          currentPrice: comic.price,
        });
        return acc;
      }, {});

      try {
        const deliveryDetailsPromises = Object.keys(groupedSelectedComics).map(
          async (sellerId) => {
            const sellerDetails = await axios.get(
              `${process.env.BASE_URL}seller-details/user/${sellerId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log("sellerDetails:", sellerDetails);

            setSellerDetailsGroup((prev) => [...prev, sellerDetails.data]);

            const sellerAddress = {
              district: sellerDetails.data.district.id,
              ward: sellerDetails.data.ward.id,
            };

            if (sellerDetails && selectedAddress) {
              try {
                // Use complete URL for deliveries endpoint
                const res = await axios.post(
                  `${process.env.BASE_URL}deliveries/details`,
                  {
                    fromDistrict: sellerAddress.district,
                    fromWard: sellerAddress.ward,
                    toDistrict: selectedAddress.district.id,
                    toWard: selectedAddress.ward.id,
                    comicsQuantity:
                      groupedSelectedComics[sellerId].comics.length,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                return {
                  sellerId: sellerId,
                  deliveryFee: parseInt(res.data.deliveryFee),
                  estDeliveryTime: res.data.estDeliveryTime,
                };
              } catch (err) {
                console.log(err);
                Alert.alert(
                  "Lỗi",
                  "Địa chỉ không phù hợp! Thông tin địa chỉ không hợp lệ hoặc ngoài vùng giao hàng của chúng tôi! Vui lòng sử dụng địa chỉ nhận hàng khác!"
                );
                setIsInvalidOrder(true);
                return null;
              }
            }
            return null;
          }
        );

        const deliveryDetails = await Promise.all(deliveryDetailsPromises);

        // Filter out null values and update state
        const validDeliveryDetails = deliveryDetails.filter(
          (detail) => detail !== null
        );
        setDeliveryDetails(validDeliveryDetails);

        // Calculate total delivery price
        const totalPrice = validDeliveryDetails.reduce(
          (sum, detail) => sum + detail.deliveryFee,
          0
        );
        setTotalDeliveryPrice(totalPrice);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDeliveryDetails();
  }, [selectedAddress]);

  const groupedComics = groupBySeller(selectedComics);
  const handleSubmit = async () => {
    // Validate inputs
    if (!selectedAddress) {
      Alert.alert("Lỗi", "Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    if (!selectedMethod) {
      Alert.alert("Lỗi", "Vui lòng chọn phương thức thanh toán");
      return;
    }

    setIsHandleLoading(true);

    // Group comics by seller
    const groupedSelectedComics = selectedComics.reduce((acc, comic) => {
      const sellerId = comic.sellerId.id;
      if (!acc[sellerId]) {
        acc[sellerId] = {
          comics: [],
        };
      }
      acc[sellerId].comics.push({
        comic,
        currentPrice: comic.price,
      });
      return acc;
    }, {});

    try {
      const orderedComicIds = [];
      for (const sellerId in groupedSelectedComics) {
        const sellerGroup = groupedSelectedComics[sellerId];
        console.log(
          "Seller Group Details:",
          sellerGroup.comics.map((item) => ({
            comicId: item.comic.id,
            comicTitle: item.comic.title,
            currentPrice: item.currentPrice,
          }))
        );

        // Calculate total price for this seller
        const sellerTotalPrice = sellerGroup.comics.reduce(
          (total, { comic, currentPrice }) => {
            const price = currentPrice || comic?.price;
            return total + Number(price);
          },
          0
        );

        // done
        const newUserDeliveryInfo = await axios.post(
          `${process.env.BASE_URL}delivery-information`,
          {
            name: selectedAddress.fullName,
            phone: selectedAddress.phone,
            provinceId: selectedAddress.province.id,
            districtId: selectedAddress.district.id,
            wardId: selectedAddress.ward.id,
            address: selectedAddress.fullAddress,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("sellerid", sellerId);
        console.log("done new user delivery info");
        const fetchSellerAddress = await axios.get(
          `${process.env.BASE_URL}seller-details/user/${sellerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sellerDetails = fetchSellerAddress.data;
        console.log("asdasd", sellerDetails);
        const newSellerDeliveryInfo = await axios.post(
          `${process.env.BASE_URL}delivery-information`,
          {
            name: sellerDetails.user.name,
            phone: sellerDetails.verifiedPhone,
            provinceId: sellerDetails.province.id,
            districtId: sellerDetails.district.id,
            wardId: sellerDetails.ward.id,
            address: sellerDetails.fullAddress,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("done new seller delivery info");
        const deliveryFee =
          deliveryDetails.find((detail) => detail.sellerId === sellerId)
            ?.deliveryFee || 0;
        // Create delivery
        const resDelivery = await axios.post(
          `${process.env.BASE_URL}deliveries/order`,
          {
            fromAddressId: newSellerDeliveryInfo.data.id,
            toAddressId: newUserDeliveryInfo.data.id,
            deliveryFee: deliveryFee,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("done delivery order");

        // Determine order type
        const orderType = sellerGroup.comics.some(
          ({ comic }) => comic.isAuction
        )
          ? "AUCTION"
          : "TRADITIONAL";

        // Create order
        const resOrder = await axios.post(
          `${process.env.BASE_URL}orders`,
          {
            sellerId: sellerId,
            totalPrice: Number(sellerTotalPrice + deliveryFee),
            paymentMethod: selectedMethod.toUpperCase(),
            deliveryId: resDelivery.data.id,
            addressId: selectedAddress.id,
            note: notes[sellerId] || "",
            type: orderType,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("done create order");
        const orderId = resOrder.data.id;

        // Create order items
        for (const { comic, currentPrice } of sellerGroup.comics) {
          const price = currentPrice || comic?.price;
          await axios.post(
            `${process.env.BASE_URL}order-items`,
            {
              comics: comic.id,
              order: orderId,
              price,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          orderedComicIds.push(comic.id);
        }
      }
      console.log("done create order items");
      const cartData = await AsyncStorage.getItem("cart");
      if (cartData) {
        let parsedCart = JSON.parse(cartData);

        parsedCart = parsedCart.filter(
          (cartItem) => !orderedComicIds.includes(cartItem.id)
        );

        await AsyncStorage.setItem("cart", JSON.stringify(parsedCart));
      }
      setIsHandleLoading(false);
      await AsyncStorage.removeItem("selectedComics");
      navigation.navigate("OrderComplete");
    } catch (error) {
      console.error("Error submitting order:", error);
      Alert.alert("Lỗi", "Không thể đặt hàng. Vui lòng thử lại.");
    } finally {
      setIsHandleLoading(false);
    }
  };
  const calculateTotalPrice = () => {
    const total = selectedComics.reduce((acc, comic) => acc + comic.price, 0);
    setTotalPrice(total);
  };
  const fetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      console.log("Token fetched:", storedToken);
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
    console.log("NEW TOKEN SET:", token);
    if (token) {
      currentUserAddress();
    }
    calculateTotalPrice();
  }, [token, selectedComics]);
  useEffect(() => {
    // Check if there is a new selectedAddress coming from AddressList screen
    if (route.params?.selectedAddress) {
      setSelectedAddress(route.params.selectedAddress); // Update selected address
    }
  }, [route.params?.selectedAddress]);
  console.log("token", token);
  console.log("delivery detail", deliveryDetails);
  console.log("total deli", totalDeliveryPrice);
  console.log("selected address:", selectedAddress);

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
      {isHandleLoading && (
        <View
          style={tw`absolute top-0 bottom-0 left-0 right-0 bg-black/50 z-50 items-center justify-center`}
        >
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      {/* Content */}
      <ScrollView style={tw`flex-1 p-4 mb-10`}>
        {/* Address */}
        <View style={tw`bg-white rounded-xl mb-3`}>
          {isLoading ? (
            <View style={tw`flex-1 items-center justify-center p-4`}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : selectedAddress ? (
            <TouchableOpacity
              style={tw`p-3 flex flex-row gap-2`}
              onPress={() =>
                navigation.navigate("AddressList", {
                  selectedAddress: selectedAddress,
                })
              }
            >
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-right"
                style={tw`mt-5 w-full`}
              >
                <Path d="m9 18 6-6-6-6" />
              </Svg>
            </TouchableOpacity>
          ) : (
            <Text style={tw`text-center py-4`}>Không có địa chỉ nào</Text>
          )}
        </View>
        {/* Comic */}
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
              <View style={tw`p-2 border-t border-gray-200 flex gap-2`}>
                <Text style={[tw`text-base`, { fontFamily: "REM_bold" }]}>
                  Ghi chú cho người bán
                </Text>
                <TextInput
                  style={tw`border border-gray-300 rounded-lg p-2`}
                  placeholder="Nhập ghi chú vào đây..."
                  value={notes[sellerId] || ""}
                  onChangeText={(text) =>
                    setNotes((prev) => ({
                      ...prev,
                      [sellerId]: text,
                    }))
                  }
                />
              </View>
            </View>
          ))
        )}
        <View style={tw`my-3`}>
          {isLoading ? (
            <View style={tw`flex-1 items-center justify-center p-4`}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : (
            userInfo &&
            totalPrice && (
              <PaymentMethod
                userInfo={userInfo}
                totalPrice={totalPrice}
                selectedMethod={selectedMethod}
                setSelectedMethod={setSelectedMethod}
              />
            )
          )}
        </View>
        <View style={tw`my-3`}>
          {isLoading ? (
            <View style={tw`flex-1 items-center justify-center p-4`}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : (
            userInfo &&
            totalPrice && (
              <PaymentDetail
                totalPrice={totalPrice}
                totalDeliveryPrice={totalDeliveryPrice}
              />
            )
          )}
        </View>
        <View style={tw`h-6`}></View>
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
            {CurrencySplitter(totalPrice + totalDeliveryPrice)} đ
          </Text>
        </View>

        <TouchableOpacity
          style={tw`bg-black py-4 px-4 justify-center items-center w-2/6`}
          onPress={handleSubmit}
          disabled={isLoading || !selectedAddress || !selectedMethod}
        >
          <Text
            style={[tw`text-white text-center`, { fontFamily: "REM_bold" }]}
          >
            {isLoading ? "Đang xử lý..." : "ĐẶT HÀNG"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Checkout;
