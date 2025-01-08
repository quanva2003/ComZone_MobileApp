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
import EmptyNotification from "../../assets/no-notification.jpg";
import { NotificationContext } from "../context/NotificationContext";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native"; // Add this import
import PushNotificationScreen from "./PushNotification";

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
      return AuctionIcon;

    case AnnouncementType.AUCTION_REQUEST:
    case AnnouncementType.AUCTION_REQUEST_FAIL:
      return { uri: item.auctionRequest?.comic?.coverImage } || AuctionIcon;
    case AnnouncementType.EXCHANGE_NEW_REQUEST:
      return NewExchangeRequestIcon;

    case AnnouncementType.ORDER_CONFIRMED:
    case AnnouncementType.EXCHANGE_APPROVED:
    case AnnouncementType.EXCHANGE_SUCCESSFUL:
    case AnnouncementType.DELIVERY_FINISHED_SEND:
    case AnnouncementType.DELIVERY_FINISHED_RECEIVE:
    case AnnouncementType.REFUND_APPROVE:
      return ApproveIcon;

    case AnnouncementType.ORDER_FAILED:
    case AnnouncementType.EXCHANGE_REJECTED:
    case AnnouncementType.EXCHANGE_FAILED:
    case AnnouncementType.DELIVERY_FAILED_RECEIVE:
    case AnnouncementType.DELIVERY_FAILED_SEND:
    case AnnouncementType.REFUND_REJECT:
      return RejectIcon;

    case AnnouncementType.EXCHANGE_NEW_DEAL:
      return NewDealExchangeIcon;

    case AnnouncementType.EXCHANGE_PAY_AVAILABLE:
      return ExchangeWalletPayIcon;

    case AnnouncementType.DELIVERY_PICKING:
      return PackageIcon;

    case AnnouncementType.ORDER_DELIVERY:
    case AnnouncementType.EXCHANGE_DELIVERY:
    case AnnouncementType.DELIVERY_ONGOING:
      return ExchangeDeliveryIcon;

    case AnnouncementType.DELIVERY_RETURN:
      return DeliveryReturnIcon;

    case AnnouncementType.TRANSACTION_ADD:
      return WalletAddIcon;

    case AnnouncementType.TRANSACTION_SUBTRACT:
      return PayMoneyIcon;

    default:
      return DefaultIcon;
  }
};

const Notification = () => {
  const { announcements, unreadCount, markAsRead, fetchAnnouncements } =
    useContext(NotificationContext);
  const [activeTab, setActiveTab] = useState("USER");
  const navigation = useNavigation(); // Initialize useNavigation
  const [unreadUser, setUnreadUser] = useState(0);
  const [unreadSeller, setUnreadSeller] = useState(0);
  const [role, setRole] = useState(false);
  const filteredAnnouncements = announcements.filter(
    (item) => item.recipientType === activeTab
  );
  useEffect(() => {
    const hasSellerAnnouncements = announcements.some(
      (item) => item.recipientType === "SELLER"
    );
    setRole(hasSellerAnnouncements);
    const unreadUserCount = announcements.filter(
      (item) => item.recipientType === "USER" && !item.isRead
    ).length;

    const unreadSellerCount = announcements.filter(
      (item) => item.recipientType === "SELLER" && !item.isRead
    ).length;

    setUnreadUser(unreadUserCount);
    setUnreadSeller(unreadSellerCount);
  }, [announcements]);

  useFocusEffect(
    React.useCallback(() => {
      fetchAnnouncements();
    }, [])
  );

  const handlePress = (item) => {
    console.log("Handle Press triggered", item); // Check if the function is being called

    console.log("1231231111"); // Your existing log statement

    if (item.type === AnnouncementType.AUCTION) {
      navigation.navigate("AuctionDetail", { auctionData: item.auction });
      return;
    } else if (item.transaction) {
      navigation.navigate("TransactionHistory");
    } else if (item.order) {
      if (item.recipientType === "USER") navigation.navigate("OrderManagement");
    }
    console.log(item);
    markAsRead(item.id);
  };

  const renderAnnouncementItem = ({ item }) => {
    return (
      <View style={tw`p-2`}>
        <TouchableOpacity
          style={tw`bg-white rounded-lg p-4 mb-2 shadow-md flex-row items-center ${
            !item.isRead ? "bg-blue-50" : ""
          }`}
          onPress={() => {
            console.log("Button Pressed"); // Check if the press event is firing
            handlePress(item); // Then call handlePress
          }}
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
      {/* <PushNotificationScreen /> */}
      <Text style={tw`text-lg font-bold text-gray-800 my-4 text-center`}>
        Thông báo gần đây ({unreadCount})
      </Text>
      {role && (
        <View style={tw`flex-row justify-center mb-4`}>
          {/* User Tab */}
          <Pressable
            style={tw`px-14 py-2 rounded-full flex-row items-center relative ${
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
            {unreadUser > 0 && (
              <View
                style={[
                  tw`absolute bg-red-500 w-3 h-3 rounded-full`,
                  { top: -6, right: 6 }, // Adjust position as needed
                ]}
              />
            )}
          </Pressable>

          {/* Seller Tab */}
          <Pressable
            style={tw`px-14 py-2 rounded-full flex-row items-center ml-4 relative ${
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
            {unreadSeller > 0 && (
              <View
                style={[
                  tw`absolute bg-red-500 w-3 h-3 rounded-full`,
                  { top: -6, right: 12 }, // Adjust position as needed
                ]}
              />
            )}
          </Pressable>
        </View>
      )}
      <FlatList
        data={filteredAnnouncements}
        renderItem={renderAnnouncementItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={tw`flex-1 items-center justify-center mt-12`}>
            <Image
              source={EmptyNotification}
              style={tw`w-60 h-60 mr-1`} // Adjust size and spacing for the icon
              resizeMode="contain"
            />
            <Text style={tw`text-lg`}>Không có thông báo</Text>
          </View>
        }
      />
    </View>
  );
};

export default Notification;
