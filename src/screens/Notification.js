import React, { useState, useEffect, useReducer } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
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
import useSocket from "../utils/socket";

// Action Types
const AUCTION_ANNOUNCEMENT = "AUCTION_ANNOUNCEMENT";
const PLUS_UNREAD_ANNOUNCE = "PLUS_UNREAD_ANNOUNCE";
const SET_UNREAD_ANNOUNCE = "SET_UNREAD_ANNOUNCE";

// Action Creators
const auctionAnnouncement = (notification) => ({
  type: AUCTION_ANNOUNCEMENT,
  payload: notification,
});

const plusUnreadAnnounce = () => ({
  type: PLUS_UNREAD_ANNOUNCE,
});

const setUnreadAnnounce = (count) => ({
  type: SET_UNREAD_ANNOUNCE,
  payload: count,
});

// Reducer
const notificationReducer = (
  state = { unreadCount: 0, announcements: [] },
  action
) => {
  switch (action.type) {
    case AUCTION_ANNOUNCEMENT:
      return {
        ...state,
        announcements: [action.payload, ...state.announcements],
      };
    case PLUS_UNREAD_ANNOUNCE:
      return {
        ...state,
        unreadCount: state.unreadCount + 1,
      };
    case SET_UNREAD_ANNOUNCE:
      return {
        ...state,
        unreadCount: action.payload,
      };
    default:
      return state;
  }
};

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
    // Exchange-related icons
    case AnnouncementType.EXCHANGE_NEW_REQUEST:
      return NewExchangeRequestIcon;
    case AnnouncementType.EXCHANGE_APPROVED:
    case AnnouncementType.EXCHANGE_SUCCESSFUL:
      return ApproveIcon;
    case AnnouncementType.EXCHANGE_REJECTED:
    case AnnouncementType.EXCHANGE_FAILED:
      return RejectIcon;
    case AnnouncementType.EXCHANGE_NEW_DEAL:
      return NewDealExchangeIcon;
    case AnnouncementType.EXCHANGE_PAY_AVAILABLE:
      return ExchangeWalletPayIcon;
    case AnnouncementType.EXCHANGE_DELIVERY:
      return ExchangeDeliveryIcon;

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
  //   const [state, dispatch] = useReducer(notificationReducer, {
  //     unreadCount: 0,
  //     announcements: [],
  //   });
  const [announcements, setAnnouncements] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    const handleNewNotification = (newNotification) => {
      console.log("Notification received:", newNotification);
      // Removed dispatch calls
      setAnnouncements((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    if (socket) {
      socket.on("notification", handleNewNotification);
    }

    return () => {
      if (socket) {
        socket.off("notification", handleNewNotification);
      }
    };
  }, [socket]);

  const fetchUnreadAnnouncement = async () => {
    try {
      const response = await privateAxios.get(
        "announcements/user/unread-count"
      );
      setUnreadCount(response.data); // Updated to set unread count directly
      setLoading(false);
    } catch (error) {
      console.error("Error fetching unread announcements:", error);
      setLoading(false);
    }
  };

  const getUserAnnouncement = async () => {
    try {
      const response = await privateAxios.get("/announcements/user");
      const data = response.data || [];
      console.log("annoucncement", data);

      setAnnouncements(data);
      setUnreadCount(data.filter((item) => !item.isRead).length); // Updated to set unread count directly
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchUnreadAnnouncement();
    getUserAnnouncement();
  }, []);

  const handleMarkAsRead = async (announcementId) => {
    try {
      await privateAxios.post(`/announcements/${announcementId}/read`);

      // Update announcements and recalculate unread count
      const updatedAnnouncements = announcements.map((item) =>
        item.id === announcementId ? { ...item, isRead: true } : item
      );

      setAnnouncements(updatedAnnouncements);

      // Recalculate unread count
      const newUnreadCount = updatedAnnouncements.filter(
        (item) => !item.isRead
      ).length;
      setUnreadCount(newUnreadCount);
    } catch (error) {
      console.error("Error marking announcement as read:", error);
    }
  };

  // Render individual announcement item
  const renderAnnouncementItem = ({ item }) => {
    console.log("item:", item.type);

    return (
      <TouchableOpacity
        style={tw`bg-white rounded-lg p-4 mb-2 shadow-md flex-row items-center ${
          !item.isRead ? "bg-blue-50" : ""
        }`}
        onPress={() => handleMarkAsRead(item.id)}
      >
        <Image
          source={getAnnouncementIcon(item, item.type)}
          style={tw`w-12 h-12 mr-4 rounded-md`}
          resizeMode="contain"
        />
        <View style={tw`flex-1`}>
          <Text
            style={[tw`text-lg text-gray-800 mb-2`, { fontFamily: "REM_bold" }]}
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
    );
  };

  // Render loading or empty state
  if (loading) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-gray-50 p-4`}>
        <Text style={tw`text-gray-600 text-lg`}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50 p-2`}>
      <FlatList
        data={announcements}
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
