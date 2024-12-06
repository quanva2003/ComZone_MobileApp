import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Path } from "react-native-svg";
import moment from "moment";

const getStatusStyles = (status) => {
  switch (status) {
    case "PENDING":
    case "PACKAGING":
    case "DELIVERING":
      return {
        backgroundColor: "#fff2c9",
        borderRadius: 8,
        color: "#f89b28",
        paddingHorizontal: 8,
        paddingVertical: 4,
      };
    case "DELIVERED":
    case "SUCCESSFUL":
      return {
        backgroundColor: "#d4edda",
        borderRadius: 8,
        color: "#155724",
        paddingHorizontal: 8,
        paddingVertical: 4,
      };
    case "CANCELED":
    case "FAILED":
      return {
        backgroundColor: "#f8d7da",
        borderRadius: 8,
        color: "#721c24",
        paddingHorizontal: 8,
        paddingVertical: 4,
      };
    default:
      return {
        backgroundColor: "transparent",
        borderRadius: 8,
        color: "#000",
        paddingHorizontal: 8,
        paddingVertical: 4,
      };
  }
};

const translateStatus = (status) => {
  const statusTranslations = {
    PENDING: "Chờ xử lí",
    PACKAGING: "Đang đóng gói",
    DELIVERING: "Đang giao hàng",
    DELIVERED: "Đã giao thành công",
    SUCCESSFUL: "Hoàn tất",
    CANCELED: "Bị hủy",
    FAILED: "Thất bại",
  };

  return statusTranslations[status] || "Chưa xác định";
};

const OrderDetail = ({ route, navigation }) => {
  const { order } = route.params; // Assuming order is passed via route.params
  console.log("order detail", order);
  const itemsTotal = order.items.reduce((sum, item) => sum + item.price, 0);
  console.log("item total:", itemsTotal);

  const deliveryFee = order.delivery?.deliveryFee || 0;
  console.log("de fee:", deliveryFee);

  const totalPrice = itemsTotal + deliveryFee;
  console.log("total", totalPrice);
  const [expandedOrderId, setExpandedOrderId] = useState(false);
  return (
    <View style={tw`flex-1`}>
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
          Chi tiết đơn hàng
        </Text>
      </View>

      <ScrollView contentContainerStyle={tw`p-2`}>
        {/* Order Info */}
        <View style={tw`mb-4 border border-gray-300 rounded-lg bg-white`}>
          <View style={tw`bg-[#232323] p-2 rounded-t-lg`}>
            <Text style={[tw`text-lg  text-white`, { fontFamily: "REM_bold" }]}>
              Thông tin vận chuyển
            </Text>
          </View>
          <View style={tw`border-b border-gray-300`}>
            <View style={tw`flex gap-2 p-2`}>
              <Text style={[tw`text-sm mt-2`, { fontFamily: "REM_regular" }]}>
                Mã đơn hàng:{" "}
                {order.delivery.deliveryTrackingCode
                  ? order.delivery.deliveryTrackingCode
                  : "Chờ xác nhận của người bán"}
              </Text>
              <View style={tw`flex-row gap-2 items-start`}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#232323"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-truck"
                  style={tw`mt-1`}
                >
                  <Path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                  <Path d="M15 18H9" />
                  <Path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                  <Circle cx="17" cy="18" r="2" />
                  <Circle cx="7" cy="18" r="2" />
                </Svg>
                <View style={tw`flex-col gap-2`}>
                  <Text
                    style={[
                      tw`text-sm text-center`,
                      getStatusStyles(order.status),
                      { fontFamily: "REM_bold" },
                    ]}
                  >
                    {translateStatus(order.status)}
                  </Text>
                  <Text
                    style={[tw`text-xs px-2`, { fontFamily: "REM_regular" }]}
                  >
                    {moment(order.createdAt).format("HH:mm DD/MM/YYYY")}
                  </Text>
                </View>
              </View>
              <Text style={[tw`text-sm`, { fontFamily: "REM_regular" }]}>
                Hình thức thanh toán:{" "}
                {order.paymentMethod === "WALLET"
                  ? "Ví ComZone"
                  : "Thanh toán khi nhận hàng"}
              </Text>
            </View>
          </View>
          <View style={tw`p-2 flex-row gap-2`}>
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
            <View>
              <View style={tw`flex-row gap-1 items-center`}>
                <Text style={[{ fontFamily: "REM_bold" }]}>
                  {order.delivery.to.name}
                </Text>
                <Text style={[{ fontFamily: "REM_regular" }]}>
                  ({order.delivery.to.phone})
                </Text>
              </View>
              <Text
                style={[{ fontFamily: "REM_regular" }, tw`w-[65%]`]}
                numberOfLines={2}
              >
                {order.delivery.to.address}
              </Text>
            </View>
          </View>
          <View style={tw`p-2`}>
            {expandedOrderId && (
              <View style={tw`mt-2`}>
                <View style={tw`flex-row justify-between mb-2`}>
                  <Text
                    style={[tw`text-sm text-gray-600`, { fontFamily: "REM" }]}
                  >
                    Tổng tiền hàng
                  </Text>
                  <Text style={[tw`text-sm`, { fontFamily: "REM_bold" }]}>
                    {itemsTotal.toLocaleString()} đ
                  </Text>
                </View>
                <View style={tw`flex-row justify-between`}>
                  <Text
                    style={[tw`text-sm text-gray-600`, { fontFamily: "REM" }]}
                  >
                    Phí vận chuyển
                  </Text>
                  <Text style={[tw`text-sm`, { fontFamily: "REM_bold" }]}>
                    {deliveryFee.toLocaleString() || "0"} đ
                  </Text>
                </View>
              </View>
            )}
            <TouchableOpacity
              style={tw`mt-2 border-t border-gray-300 pt-2`}
              onPress={() => setExpandedOrderId(!expandedOrderId)}
            >
              <View style={tw`flex-row justify-between items-end`}>
                <Text style={[tw`text-sm`, { fontFamily: "REM_regular" }]}>
                  Thành tiền
                </Text>
                <View style={tw`flex-row gap-1 items-end`}>
                  <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>
                    {totalPrice.toLocaleString() || "0"} đ
                  </Text>
                  {!expandedOrderId ? (
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#232323"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-chevron-down"
                    >
                      <Path d="m6 9 6 6 6-6" />
                    </Svg>
                  ) : (
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#232323"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-chevron-up"
                    >
                      <Path d="m18 15-6-6-6 6" />
                    </Svg>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Items */}
        <View style={tw`mb-4 bg-white rounded-lg border border-gray-300 p-2`}>
          <View style={tw`flex-row gap-2 items-center`}>
            <Image
              source={{ uri: order.items[0].comics.sellerId.avatar }}
              style={tw`h-5 w-5 rounded-full`}
            />
            <Text style={[tw`text-lg`, { fontFamily: "REM_bold" }]}>
              {order.items[0].comics.sellerId.name}
            </Text>
          </View>
          {order.items.map((item, index) => (
            <View
              key={index}
              style={tw`flex-row items-center mt-2 border-t border-gray-300 pt-3`}
            >
              <Image
                source={{ uri: item.comics.coverImage }}
                style={tw`h-22 w-16 mr-4 rounded-lg`}
              />
              <View style={tw`flex h-22 justify-between`}>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={[tw`text-sm w-[65%]`, { fontFamily: "REM_bold" }]}
                >
                  {item.comics.title}
                </Text>
                <Text
                  style={[
                    tw`text-sm text-gray-600`,
                    { fontFamily: "REM_regular" },
                  ]}
                >
                  {item.price.toLocaleString()} đ
                </Text>
              </View>
            </View>
          ))}
          <View style={tw`mt-3`}>
            <Text style={[tw`text-base`, { fontFamily: "REM_bold" }]}>
              Ghi chú
            </Text>
            <Text style={{ fontFamily: "REM_regular" }}>
              {order.note ? order.note : "Không có ghi chú"}
            </Text>
          </View>
        </View>

        {/* Refund and Reject Reason */}
        {order.refundRequest && (
          <View style={tw`mb-4`}>
            <Text style={[tw`text-lg font-bold`, { fontFamily: "REM_bold" }]}>
              Yêu cầu hoàn tiền
            </Text>
            <Text style={tw`text-sm`}>
              Lý do hoàn tiền: {order.refundRequest}
            </Text>
          </View>
        )}
        {order.rejectReason && (
          <View style={tw`mb-4`}>
            <Text style={[tw`text-lg font-bold`, { fontFamily: "REM_bold" }]}>
              Lý do từ chối
            </Text>
            <Text style={tw`text-sm`}>Lý do: {order.rejectReason}</Text>
          </View>
        )}
      </ScrollView>
      {order.status === "DELIVERED" && (
        <View
          style={tw`absolute bottom-0 left-0 right-0 bg-white flex items-center p-2`}
        >
          <TouchableOpacity
            style={tw`bg-white py-2 px-5 justify-center items-center border rounded-lg`}
            //   onPress={handleSubmit}
            //   disabled={isLoading || !selectedAddress || !selectedMethod}
          >
            <Text
              style={[tw`text-black text-center`, { fontFamily: "REM_bold" }]}
            >
              Đánh giá
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default OrderDetail;
