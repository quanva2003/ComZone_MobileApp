import React, { useState, useEffect, useReducer, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import tw from "twrnc";
import { privateAxios } from "../middleware/axiosInstance";
import { AnnouncementType } from "../common/enums/announcementType.enum";
import EmptyNotification from "../../assets/announcement-icons/no-notification.jpg";
import OrderIcon from "../../assets/announcement-icons/orderIcon.png";
import AuctionIcon from "../../assets/announcement-icons/auction-icon.png";
import NewExchangeRequestIcon from "../../assets/announcement-icons/exchange-icon.png";
import ApproveIcon from "../../assets/announcement-icons/approve-icon.png";
import RejectIcon from "../../assets/announcement-icons/reject-icon.png";
import NewDealExchangeIcon from "../../assets/announcement-icons/deal-icon.png";
import ExchangeWalletPayIcon from "../../assets/announcement-icons/wallet-icon.png";
import ExchangeDeliveryIcon from "../../assets/announcement-icons/truck-icon.png";
import DeliveryReturnIcon from "../../assets/announcement-icons/delivery-return-icon.png";
import PackageIcon from "../../assets/announcement-icons/package-icon.png";
import WalletAddIcon from "../../assets/announcement-icons/wallet-add-icon.png";
import PayMoneyIcon from "../../assets/announcement-icons/pay-icon.png";
import DefaultIcon from "../../assets/announcement-icons/notification-icon-462x512-tqwyit2p.png";
import { useSocketContext } from "../context/SocketContext";
import { NotificationContext } from "../context/NotificationContext";
import { useFocusEffect } from "@react-navigation/native";

const getAnnouncementIcon = (item, type) => {
  switch (type) {
    // Order-related icons
    case AnnouncementType.ORDER_NEW:
      return OrderIcon;
    case AnnouncementType.ORDER_CONFIRMED:
      return ApproveIcon;

    // Auction-related icons
    case AnnouncementType.AUCTION:
      if (item.auction?.comics?.coverImage) {
        return { uri: item.auction.comics.coverImage };
      }

      // Fallback to default auction icon
      return AuctionIcon;

    // Delivery-related icons
    case AnnouncementType.DELIVERY_PICKING:
      return PackageIcon;
    case AnnouncementType.DELIVERY_ONGOING:
      return ExchangeDeliveryIcon;
    case AnnouncementType.DELIVERY_FINISHED_SEND:
    case AnnouncementType.DELIVERY_FINISHED_RECEIVE:
      return ApproveIcon;
    case AnnouncementType.DELIVERY_FAILED_SEND:
    case AnnouncementType.DELIVERY_FAILED_RECEIVE:
      return RejectIcon;
    case AnnouncementType.DELIVERY_RETURN:
      return DeliveryReturnIcon;

    // Transaction-related icons
    case AnnouncementType.TRANSACTION_ADD:
      return WalletAddIcon;
    case AnnouncementType.TRANSACTION_SUBTRACT:
      return PayMoneyIcon;

    // Default icon for unknown types
    default:
      return DefaultIcon;
  }
};
const Notification = () => {
  const { announcements, unreadCount, markAsRead, fetchAnnouncements } =
    useContext(NotificationContext);
  const [activeTab, setActiveTab] = useState("USER");

  const filteredAnnouncements = announcements.filter(
    (item) => item.recipientType === activeTab
  );
  useFocusEffect(
    React.useCallback(() => {
      fetchAnnouncements();
    }, [])
  );
  // Render individual announcement item
  const renderAnnouncementItem = ({ item }) => {
    console.log("item:", item.type);

    return (
      <View style={tw`p-2`}>
        <TouchableOpacity
          style={tw`bg-white rounded-lg p-4 mb-2 shadow-md flex-row items-center ${
            !item.isRead ? "bg-blue-50" : ""
          }`}
          onPress={() => markAsRead(item.id)}
        >
          <Image
            source={getAnnouncementIcon(item, item.type)}
            style={tw`w-12 h-12 mr-4 rounded-md`}
            resizeMode="contain"
          />
          <View style={tw`flex-1`}>
            <Text
              style={[
                tw`text-lg text-gray-800 mb-2`,
                { fontFamily: "REM_bold" },
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                tw`text-base text-gray-600 mb-1`,
                { fontFamily: "REM_regular" },
              ]}
            >
              {item.message}
            </Text>
            <Text
              style={[
                tw`text-xs text-gray-400 text-right`,
                { fontFamily: "REM_regular" },
              ]}
            >
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Render loading or empty state

  return (
    <View style={tw`flex-1 bg-gray-50 p-2`}>
      <Text style={tw`text-lg font-bold text-gray-800 my-4 text-center`}>
        Thông báo gần đây
      </Text>
      <View style={tw`flex-row justify-center mb-4`}>
        <Pressable
          style={tw`px-14 py-2 rounded-full ${
            activeTab === "USER" ? "bg-blue-500" : "bg-gray-300"
          }`}
          onPress={() => setActiveTab("USER")}
        >
          <Text
            style={tw`text-white text-sm ${
              activeTab === "USER" ? "font-bold" : ""
            }`}
          >
            Người Dùng
          </Text>
        </Pressable>
        <Pressable
          style={tw`px-14 py-2 rounded-full ml-4 ${
            activeTab === "SELLER" ? "bg-blue-500" : "bg-gray-300"
          }`}
          onPress={() => setActiveTab("SELLER")}
        >
          <Text
            style={tw`text-white text-sm ${
              activeTab === "SELLER" ? "font-bold" : ""
            }`}
          >
            Người Bán
          </Text>
        </Pressable>
      </View>
      <Text style={tw`text-lg font-bold text-center mb-4`}>
        Notifications ({unreadCount})
      </Text>
      <FlatList
        data={filteredAnnouncements}
        renderItem={renderAnnouncementItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={tw`flex-1 items-center justify-center mt-12`}>
            <Text style={tw`text-gray-500 text-base`}>No notifications</Text>
          </View>
        }
      />
    </View>
  );
};

export default Notification;
