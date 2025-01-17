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
import { CountUp } from "use-count-up";

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
import CustomModal from "../components/customModalAuction/customModalAuction";
import { privateAxios, publicAxios } from "../middleware/axiosInstance";
import { AuctionResult } from "../components/auction/AuctionResult";
import { useSocketContext } from "../context/SocketContext";
import AuctionNotification from "../components/auction/AuctionNotification";
import AuctionPublisher from "../components/auction/AuctionPulisher";

const AuctionDetail = ({ route }) => {
  const socket = useSocketContext();

  const navigation = useNavigation();
  const { auctionData } = route.params;
  const [highestBid, setHighestBid] = useState(null);
  const [auction, setAuction] = useState(auctionData);
  const [isHighest, setIsHighest] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const bottomSheetRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const handleAuctionEnd = () => {
    setAuctionEnded(true);
    setLoading(false);
  };
  useEffect(() => {
    if (socket) {
      console.log("Socket connected11111:", socket.id);
    }
  }, [socket]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const fetchedUserId = await AsyncStorage.getItem("userId");
        if (fetchedUserId !== null) {
          setUserId(fetchedUserId);
        } else {
          console.log("No userId found");
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const handleAuctionUpdated = (data) => {
      console.log("alibaba", data);

      setAuction(data);
    };

    socket.on("auctionUpdated", handleAuctionUpdated);

    return () => {
      socket.off("auctionUpdated", handleAuctionUpdated);
    };
  }, [auction]);

  const snapPoints = useMemo(() => ["10%", "60%"], []);
  const [isReady, setIsReady] = useState(false);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
  const [bids, setBids] = useState([]);
  const uniqueParticipantsCount = new Set(bids.map((bid) => bid?.user.id)).size;
  const [bidPrice, setBidPrice] = useState("");
  const [winner, setWinner] = useState(false);
  const handleWinnerUpdate = (isWinner) => {
    setWinner(isWinner);
  };

  const handleOpenBottomSheet = useCallback(() => {
    setBottomSheetIndex(1);
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    setBottomSheetIndex(-1);
  }, []);
  useEffect(() => {
    if (highestBid?.user?.id === userId) {
      setIsHighest(true);
    } else {
      setIsHighest(false);
    }
  }, [highestBid, userId]);
  const handleBuy = (auctionData, price, type) => {
    if (!auctionData || !auctionData.comics) return;
    console.log("AUCTIONDATA1", auctionData);

    const comic = { ...auctionData.comics };
    comic.price = price;
    comic.auctionId = auction?.id;
    comic.types = type;
    comic.depositAmount = auction?.depositAmount;

    console.log("Updated comic auction:", comic);

    navigation.navigate("Checkout", {
      selectedComics: [comic],
    });
  };
  const fetchBid = async () => {
    try {
      const responseBid = await publicAxios.get(`/bids/auction/${auction.id}`);

      const bidData = responseBid.data;
      console.log("zzzz", bidData);

      setBids(bidData);
      setHighestBid(responseBid.data[0]);
    } catch (error) {
      console.error("Error fetching comic details:", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchBid();
  }, [auction.id]);
  useEffect(() => {
    if (!userId) {
      setWinner(null);
      return;
    }
    console.log("12312321");

    let userParticipated = false;

    if (bids?.length > 0) {
      userParticipated = bids.some((bid) => bid.user.id === userId);
    }
    if (
      auction?.status === "SUCCESSFUL" ||
      auction?.status === "COMPLETED" ||
      auction?.status === "FAILED"
    ) {
      if (auction.winner?.id === userId) {
        setWinner(true);
      } else if (userParticipated) {
        setWinner(false);
      } else {
        setWinner(null);
      }
    } else {
      setWinner(null);
    }
  }, [auction?.status, auction?.winner, userId, bids]);

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

    const bidPayload = {
      auctionId: auction.id,
      userId: userId,
      price: numericBidPrice,
    };
    console.log("bidPayload", bidPayload);

    if (socket) {
      socket.emit("placeBid", bidPayload, (response) => {
        console.log("Bid placed successfully:", response);
      });

      Alert.alert(
        "Ra giá thành công",
        `Bạn vừa ra giá ${CurrencySplitter(numericBidPrice)} đ cho sản phẩm này`
      );
      setBidPrice("");
      bottomSheetRef.current?.close();
    } else {
      console.error("Socket not connected.");
    }

    // Close bottom sheet after bid
  };
  useEffect(() => {
    if (socket) {
      socket.on("bidUpdate", (data) => {
        if (data.placeBid.auction.id === auction.id) {
          setHighestBid(data.placeBid);
          setAuction(data.placeBid.auction);
          fetchBid();
        }
      });

      // Cleanup on unmount or socket disconnect
      return () => {
        socket.off("bidUpdate");
      };
    }
  }, [socket]);

  const coverImage =
    auction.comics?.coverImage ||
    "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE=";
  const allImages = [coverImage, ...auction.comics.previewChapter];
  console.log("all", allImages);
  const [currentImage, setCurrentImage] = useState(coverImage);
  const [modalVisible, setModalVisible] = useState(false);
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
  }, [auction.id]);
  useEffect(() => {
    bottomSheetRef.current?.close();
  }, []);
  useEffect(() => {
    // Small delay to ensure BottomSheet isn't visible on mount
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);
  const handleOpenDepositModal = () => setModalVisible(true);
  const handleCloseDepositModal = () => setModalVisible(false);

  const handleConfirmDeposit = () => {
    setHasDeposited(true);
    setModalVisible(false);
    Alert.alert(
      "Đặt cọc thành công",
      "Bạn đã đặt cọc thành công cho phiên đấu giá."
    );
  };
  useEffect(() => {
    setCurrentImage(auction.comics.coverImage || coverImage);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
    setLoading(false);
  }, [auction]);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

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
          style={tw`w-full h-80 mb-4`}
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
      <AuctionNotification
        auctionId={auction.id}
        onWinnerUpdate={handleWinnerUpdate}
      />
      {/* Thumbnail Navigator */}
      <View style={tw`mb-2 p-3`}>
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
      </View>
      <View>
        <AuctionResult isWinner={winner} />
      </View>
      <View style={tw`flex-col gap-2 mt-2 items-center bg-[#232323] p-2`}>
        <CustomCountDown
          endTime={new Date(auction?.endTime).getTime()}
          auction={auction}
          detail={"detail"}
          onAuctionEnd={handleAuctionEnd}
        />

        {/* Current Price and Price Step Section */}
        <View style={tw`flex-row w-full p-2 justify-between`}>
          {/* Row 1 */}
          <View style={tw`w-1/2 flex-col gap-2 items-center`}>
            {/* Current Price */}
            <Text
              style={[tw`text-sm text-white`, { fontFamily: "REM_regular" }]}
            >
              Giá hiện tại
            </Text>
            <Text style={[tw`text-2xl text-white`, { fontFamily: "REM_bold" }]}>
              <CountUp
                isCounting
                start={auction.currentPrice - auction.currentPrice / 2}
                end={auction.currentPrice}
                duration={1}
                thousandsSeparator=","
                style={{
                  fontFamily: "REM",
                  fontSize: 28,
                  fontWeight: "bold",
                  textShadow: "4px 4px #000",
                }}
              />
              đ
            </Text>
          </View>
          <View style={tw`w-[1px] h-full bg-gray-400 mx-2`} />
          <View style={tw`w-1/2 flex-col gap-2 items-center`}>
            {/* Price Step */}
            <Text
              style={[tw`text-sm text-white`, { fontFamily: "REM_regular" }]}
            >
              Bước giá tối thiểu
            </Text>
            <Text style={[tw`text-2xl text-white`, { fontFamily: "REM_bold" }]}>
              {CurrencySplitter(auction.priceStep)} đ
            </Text>
          </View>
        </View>

        <View style={tw`flex-row w-full p-2 justify-between`}>
          {/* Row 2 */}
          <View style={tw`w-1/2 flex-col gap-2 items-center`}>
            {/* Bid Count */}
            <Text
              style={[tw`text-sm text-white`, { fontFamily: "REM_regular" }]}
            >
              Lượt ra giá
            </Text>
            <Text style={[tw`text-2xl text-white`, { fontFamily: "REM_bold" }]}>
              <CountUp
                isCounting
                start={bids?.length || 0} // Start value defaults to 0 if bids is undefined or null
                end={bids?.length || 0} // End value defaults to 0 if bids is undefined or null
                duration={1}
                thousandsSeparator=","
                style={{
                  fontFamily: "REM",
                  fontSize: 28,
                  fontWeight: "bold",
                  textShadow: "4px 4px #000",
                }}
              />
            </Text>
          </View>
          <View style={tw`w-[1px] h-full bg-gray-400 mx-2`} />
          <View style={tw`w-1/2 flex-col gap-2 items-center`}>
            {/* Participants */}
            <Text
              style={[tw`text-sm text-white`, { fontFamily: "REM_regular" }]}
            >
              Người tham gia
            </Text>
            <Text style={[tw`text-2xl text-white`, { fontFamily: "REM_bold" }]}>
              {uniqueParticipantsCount}
            </Text>
          </View>
        </View>
      </View>

      {auction.comics.sellerId.id !== userId && (
        <View>
          {!hasDeposited ? (
            <View>
              {auctionData.currentPrice + auctionData.priceStep >=
                auctionData.maxPrice && (
                <Text
                  style={[
                    tw`text-[17px] pt-[10px] text-red-500 bg-red-100 rounded-md p-4`,
                    { fontFamily: "REM_regular" },
                  ]}
                >
                  Chỉ có thể mua ngay với giá{" "}
                  {auctionData.maxPrice.toLocaleString("vi-VN")}đ. Cân nhắc
                  trước khi đặt cọc
                </Text>
              )}
              <View
                style={[
                  tw`py-2 px-4 mt-3 w-full`,
                  { flexDirection: "row", alignItems: "center" },
                ]}
              >
                <View
                  style={[
                    tw`mr-4`,
                    { flexDirection: "row", alignItems: "center" },
                  ]}
                >
                  <Text
                    style={[
                      tw`text-sm`,
                      { color: "#000", fontFamily: "REM_bold" },
                    ]}
                  >
                    Số tiền cần cọc:
                  </Text>
                  <Text
                    style={[tw`text-base ml-2`, { fontFamily: "REM_bold" }]}
                  >
                    {CurrencySplitter(auction.depositAmount)} đ
                  </Text>
                </View>
                {!auctionEnded && auctionData.status !== "UPCOMING" && (
                  <TouchableOpacity
                    style={[
                      tw`py-2 px-1 rounded-full border items-center justify-center`,
                      {
                        backgroundColor: "#fff",
                        borderColor: "#000",
                        boxShadow: "2px 2px",
                        width: "40%",
                      },
                    ]}
                    onPress={handleOpenDepositModal}
                  >
                    <Text
                      style={[
                        tw`text-sm`,
                        { color: "#000", fontFamily: "REM_bold" },
                      ]}
                    >
                      Đặt cọc tại đây
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : isHighest ? (
            <View
              style={{
                fontSize: 20,
                color: "#28a745",
                fontWeight: "bold",
                padding: 10,
                borderRadius: 5,
                backgroundColor: "#d4edda",
                marginBottom: 5,
              }}
            >
              <Text
                style={{
                  color: "#28a745",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Bạn là người có giá cao nhất!
              </Text>
            </View>
          ) : (
            !auctionEnded && (
              <>
                {auction.currentPrice + auction.priceStep <
                  auction.maxPrice && (
                  <View
                    style={tw`w-full flex items-center justify-center py-2`}
                  >
                    <TouchableOpacity
                      style={[
                        tw`py-2 rounded-lg bg-black items-center justify-center mt-3 w-11/12`,
                      ]}
                      onPress={handleOpenBottomSheet}
                    >
                      <Text
                        style={[
                          tw`text-xl text-white`,
                          { fontFamily: "REM_bold" },
                        ]}
                      >
                        RA GIÁ
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {auction.currentPrice + auction.priceStep >=
                  auction.maxPrice && (
                  <Text
                    style={[
                      tw`text-[17px] pt-[10px]  text-red-500 bg-red-100 rounded-md p-4`,
                      { fontFamily: "REM_regular" },
                    ]}
                  >
                    Chỉ có thể mua ngay với giá{" "}
                    {auctionData.maxPrice.toLocaleString("vi-VN")}đ.Không thể ra
                    giá nữa vì giá tối thiểu lớn hơn giá mua ngay.
                  </Text>
                )}
              </>
            )
          )}

          {!auctionEnded && hasDeposited && (
            <View style={tw`w-full flex items-center justify-center py-2 px-4`}>
              <TouchableOpacity
                style={tw`py-2 px-4 rounded-lg bg-black w-full`}
                onPress={() => handleBuy(auction, auction.maxPrice, "maxPrice")}
              >
                <Text
                  style={[
                    tw`text-xl text-white text-center`,
                    { fontFamily: "REM_bold" },
                  ]}
                >
                  MUA NGAY VỚI {auction.maxPrice.toLocaleString("vi-VN")}đ
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {auction.status === "SUCCESSFUL" && auction.winner?.id === userId && (
            <View style={tw`w-full flex items-center justify-center py-2`}>
              <TouchableOpacity
                style={tw`py-2 px-6 rounded-lg bg-green-500`}
                onPress={() => {
                  handleBuy(auction, auction?.currentPrice, "currentPrice");
                }}
              >
                <Text
                  style={[tw`text-xl text-white`, { fontFamily: "REM_bold" }]}
                >
                  THANH TOÁN NGAY
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <CustomModal
        auction={auction}
        visible={modalVisible}
        onClose={handleCloseDepositModal}
        title="Xác nhận đặt cọc"
        description={
          <>
            Bạn có chắc chắn muốn đặt cọc{" "}
            <Text style={[tw`text-red-500`]}>
              {auction?.depositAmount.toLocaleString("vi-VN")}đ
            </Text>{" "}
            cho phiên đấu giá này không?
          </>
        }
        onConfirm={handleConfirmDeposit}
        confirmText="Xác nhận"
        cancelText="Hủy"
        navigation={navigation}
      />

      {/* RA GIÁ Button */}
      <AuctionPublisher comic={auction.comics} />
      {isReady && (
        <BottomSheet
          ref={bottomSheetRef}
          index={bottomSheetIndex}
          snapPoints={snapPoints}
          enablePanDownToClose={true} // This will allow users to close by dragging down
          onClose={handleCloseBottomSheet}
        >
          <BottomSheetView style={tw`p-4`}>
            <Text style={[tw`text-xl mb-4`, { fontFamily: "REM_bold" }]}>
              Ra giá
            </Text>

            <View style={tw`flex-row gap-2 items-center`}>
              <Text style={[tw`text-sm mb-2`, { fontFamily: "REM_regular" }]}>
                Giá đấu tối thiểu tiếp theo:
              </Text>
              <Text style={[tw`text-base mb-2`, { fontFamily: "REM_bold" }]}>
                {CurrencySplitter(auction.currentPrice + auction.priceStep)} đ
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
              onPress={() => {
                handleSubmitBid();
              }}
            >
              <Text
                style={[tw`text-white text-center`, { fontFamily: "REM_bold" }]}
              >
                XÁC NHẬN
              </Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheet>
      )}
    </ScrollView>
  );
};

export default AuctionDetail;
