import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import CurrencySplitter from "../assistants/Spliter";
import { Icon } from "react-native-elements";
import CountDown from "react-native-countdown-component";
// import ComicsOfSeller from "../components/AuctionDetail/ComicsOfSeller";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomCountDown from "../components/countdown/CustomCountdown";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import useSocket from "../utils/socket";
import CustomModal from "../components/customModalAuction/customModalAuction";
import { privateAxios } from "../middleware/axiosInstance";

const AuctionDetail = ({ route }) => {
  const navigation = useNavigation();
  const { auction } = route.params;

  console.log("auction", auction);
  console.log("asdasd", auction.comics.coverImage);
  const bottomSheetRef = useRef(null);

  // Bottom sheet snap points
  const snapPoints = useMemo(() => ["60%"], []);

  // State for bid input
  const [bidPrice, setBidPrice] = useState("");

  // Callback to open bottom sheet
  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);
  const socket = useSocket(); // Use the socket from custom hook

  const handleSubmitBid = async () => {
    const numericBidPrice = parseFloat(bidPrice.replace(/[^0-9]/g, ""));
    const currentPrice = auction.currentPrice;

    if (numericBidPrice <= currentPrice) {
      Alert.alert(
        "Bid Error",
        `Bid must be higher than the current price of ${CurrencySplitter(
          currentPrice
        )} đ`
      );
      return;
    }

    const userId = await AsyncStorage.getItem("userId");
    const bidPayload = {
      auctionId: auction.id,
      userId: userId,
      price: numericBidPrice,
    };
    console.log("bidPayload", bidPayload);

    // Ensure socket is connected before emitting the event
    if (socket) {
      socket.emit("placeBid", bidPayload, (response) => {
        console.log("Bid placed successfully:", response);
      });

      Alert.alert(
        "Bid Submitted",
        `Your bid of ${CurrencySplitter(numericBidPrice)} đ has been placed`
      );
    } else {
      console.error("Socket not connected.");
    }

    // Close bottom sheet after bid
    bottomSheetRef.current?.close();
  };

  const endTime = auction?.endTime
    ? new Date(auction.endTime).getTime()
    : Date.now(); // Fallback to prevent errors

  const coverImage =
    auction.comics?.coverImage ||
    "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE=";
  const allImages = [coverImage, ...auction.comics.previewChapter];
  console.log("all", allImages);
  const [currentImage, setCurrentImage] = useState(coverImage);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const scrollViewRef = useRef(null);
  const [hasDeposited, setHasDeposited] = useState(false);

  useEffect(() => {
    const checkDepositStatus = async () => {
      try {
        const response = await privateAxios.get(
          `deposits/auction/user/${auction?.id}`
        );
        console.log("Deposit status response:", response.data);

        if (response.data) {
          setHasDeposited(true);
        } else {
          setHasDeposited(false);
        }
      } catch (error) {
        console.error("Error checking deposit status:", error);
        setHasDeposited(false); // Handle errors gracefully
      }
    };

    checkDepositStatus();
  }, [auction]);
  const handleOpenDepositModal = () => setModalVisible(true);
  const handleCloseDepositModal = () => setModalVisible(false);

  const handleConfirmDeposit = () => {
    setModalVisible(false);
    Alert.alert(
      "Đặt cọc thành công",
      "Bạn đã đặt cọc thành công cho phiên đấu giá."
    );
    // Add additional deposit logic here
  };
  useEffect(() => {
    setCurrentImage(auction.comics.coverImage || coverImage);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  }, [auction]);

  //   if (loading) {
  //     return (
  //       <View style={tw`flex-1 justify-center items-center`}>
  //         <ActivityIndicator size="large" color="#000" />
  //       </View>
  //     );
  //   }

  return (
    <ScrollView style={tw`flex-1`} ref={scrollViewRef}>
      {/* Back Button */}
      <TouchableOpacity
        style={tw`absolute top-4 left-4 z-10 bg-white rounded-full p-2 shadow`}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Cart Button */}

      {/* Current Image */}
      <View style={tw`relative`}>
        <Image
          source={{ uri: currentImage || coverImage }}
          style={tw`w-full h-100 mb-4`}
          onError={() => setCurrentImage(coverImage)} // Handle image load failure
        />
        <View
          style={tw`absolute bottom-7 left-2 bg-white px-2 py-1 rounded-full border border-gray-300`}
        >
          <Text style={tw`text-black text-sm`}>
            {allImages.indexOf(currentImage) + 1} / {allImages.length}
          </Text>
        </View>
      </View>

      {/* Thumbnail Navigator */}
      <View style={tw`mb-4`}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`flex-row justify-center`}
        >
          {allImages.map((url, index) => (
            <TouchableOpacity
              key={index}
              style={tw`mr-2`}
              onPress={() => setCurrentImage(url)}
            >
              <Image
                source={{ uri: url || coverImage }}
                style={tw.style(
                  `w-16 h-16 rounded-xl`,
                  url === currentImage ? `border-2 border-gray-800` : `border-2`
                )}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Comic Details */}
      <View style={tw`p-2`}>
        <View style={tw`bg-white py-2 px-4 rounded-lg`}>
          <Text style={[tw`text-xl mb-2`, { fontFamily: "REM_bold" }]}>
            {auction.comics.title}
          </Text>
          <View style={tw`flex-row items-center gap-2`}>
            <Text style={{ fontFamily: "REM" }}>của</Text>
            <Image
              source={{ uri: auction.comics.sellerId.avatar }}
              style={tw`rounded-full w-6 h-6`}
            />
            <Text style={{ fontFamily: "REM_semiBoldItalic" }}>
              {auction.comics.sellerId.name}
            </Text>
          </View>
        </View>

        {/* Description */}
      </View>
      <View style={tw`flex-col gap-2 mt-2 items-center bg-[#232323] p-2`}>
        
        <CustomCountDown
          endTime={new Date(auction?.endTime).getTime()}
          detail={"detail"}
        />

        {/* Current Price and Price Step Section */}
        <View style={tw`flex-row w-full p-2 justify-between`}>
          <View style={tw`flex-col gap-2 items-center w-1/2`}>
            <Text
              style={[tw`text-sm text-white`, { fontFamily: "REM_regular" }]}
            >
              Giá hiện tại
            </Text>
            <Text style={[tw`text-2xl text-white`, { fontFamily: "REM_bold" }]}>
              {CurrencySplitter(auction.currentPrice)} đ
            </Text>
          </View>
          <View style={tw`w-[1px] h-full bg-gray-400 mx-2`} />
          <View style={tw`flex-col gap-2 items-center w-1/2`}>
            <Text
              style={[tw`text-sm text-white`, { fontFamily: "REM_regular" }]}
            >
              Bước giá
            </Text>
            <Text style={[tw`text-2xl text-white`, { fontFamily: "REM_bold" }]}>
              {CurrencySplitter(auction.priceStep)} đ
            </Text>
          </View>
        </View>

        {/* Chip Component */}
        {hasDeposited ? (
          <TouchableOpacity
            style={tw`py-2 px-3 rounded-lg bg-black w-1/2 items-center justify-center mt-3`}
            onPress={handleOpenBottomSheet} // Open bottom sheet for bidding
          >
            <Text style={[tw`text-xl text-white`, { fontFamily: "REM_bold" }]}>
              RA GIÁ
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              tw`py-2 px-4 rounded-full border items-center justify-center mt-3`,
              {
                backgroundColor: "#fff",
                borderColor: "#000",
                boxShadow: "2px 2px",
              },
            ]}
            onPress={handleOpenDepositModal}
          >
            <Text
              style={[tw`text-sm`, { color: "#000", fontFamily: "REM_bold" }]}
            >
              Đặt cọc tại đây
            </Text>
          </TouchableOpacity>
        )}
        <CustomModal
          auction={auction}
          visible={modalVisible}
          onClose={handleCloseDepositModal}
          title="Xác nhận đặt cọc"
          description="Bạn có chắc chắn muốn đặt cọc cho phiên đấu giá này không?"
          onConfirm={handleConfirmDeposit}
          confirmText="Xác nhận"
          cancelText="Hủy"
        />
        {/* RA GIÁ Button */}
      </View>

      <View style={tw`w-full flex items-center justify-center py-2`}>
        <TouchableOpacity style={tw`py-2 px-6 rounded-lg bg-black`}>
          <Text style={[tw`text-xl text-white`, { fontFamily: "REM_bold" }]}>
            MUA NGAY VỚI GIÁ {auction.maxPrice.toLocaleString("vi-VN")}đ
          </Text>
        </TouchableOpacity>
      </View>
      <View style={tw`px-4 py-2`}>
        <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>
          Mô tả nội dung
        </Text>
        <Text style={[tw`text-sm mt-2`, { fontFamily: "REM_italic" }]}>
          {auction.comics.description}
        </Text>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <BottomSheetView style={tw`p-4`}>
          <Text style={[tw`text-xl mb-4`, { fontFamily: "REM_bold" }]}>
            Ra giá
          </Text>

          {/* <Text style={[tw`text-xl mb-4`, { fontFamily: "REM_bold" }]}>
            ĐẶT CỌC
            </Text> */}
          <View style={tw`flex-row gap-2 items-center`}>
            <Text style={[tw`text-sm mb-2`, { fontFamily: "REM_regular" }]}>
              Giá hiện tại:
            </Text>
            <Text style={[tw`text-lg mb-2`, { fontFamily: "REM_bold" }]}>
              {CurrencySplitter(auction.currentPrice)} đ
            </Text>
          </View>
          <TextInput
            style={tw`border border-gray-300 p-2 rounded-lg mb-4`}
            placeholder="Nhập giá"
            keyboardType="numeric"
            value={bidPrice}
            onChangeText={(text) => {
              // Format input as currency
              const cleaned = text.replace(/[^0-9]/g, "");
              setBidPrice(CurrencySplitter(cleaned));
            }}
          />

          <TouchableOpacity
            style={tw`bg-black p-3 rounded-lg`}
            onPress={handleSubmitBid}
          >
            <Text
              style={[tw`text-white text-center`, { fontFamily: "REM_bold" }]}
            >
              XÁC NHẬN
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </ScrollView>
  );
};

export default AuctionDetail;
