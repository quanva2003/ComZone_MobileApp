import React, { createContext, useReducer, useEffect } from "react";
import { useSocketContext } from "./SocketContext";
import { privateAxios } from "../middleware/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create Context
export const NotificationContext = createContext();

const SET_ANNOUNCEMENTS = "SET_ANNOUNCEMENTS";
const ADD_NOTIFICATION = "ADD_NOTIFICATION";
const MARK_AS_READ = "MARK_AS_READ";
const SET_UNREAD_COUNT = "SET_UNREAD_COUNT";
const SET_AUCTION_ANNOUNCE = "SET_AUCTION_ANNOUNCE"; // New action for auction announce

const notificationReducer = (state, action) => {
  switch (action.type) {
    case SET_ANNOUNCEMENTS:
      return {
        ...state,
        announcements: action.payload,
      };
    case ADD_NOTIFICATION:
      return {
        ...state,
        announcements: [action.payload, ...state.announcements],
        unreadCount: state.unreadCount + 1,
      };
    case MARK_AS_READ:
      return {
        ...state,
        announcements: state.announcements.map((notif) =>
          notif.id === action.payload ? { ...notif, isRead: true } : notif
        ),
        unreadCount: state.unreadCount - 1,
      };
    case SET_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.payload,
      };
    case SET_AUCTION_ANNOUNCE:
      return {
        ...state,
        auctionAnnounce: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  announcements: [],
  unreadCount: 0,
  auctionAnnounce: null,
};

export const NotificationProvider = ({ children }) => {
  const socket = useSocketContext();
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const fetchAnnouncements = async () => {
    const userId = await AsyncStorage.getItem("userId");
    console.log("userid", userId);

    if (userId) {
      try {
        const response = await privateAxios.get("/announcements/user");
        const unreadResponse = await privateAxios.get(
          "/announcements/user/unread-count"
        );
        dispatch({
          type: SET_ANNOUNCEMENTS,
          payload: response.data,
        });
        dispatch({
          type: SET_UNREAD_COUNT,
          payload: unreadResponse.data,
        });
      } catch (error) {
        // console.error("Error fetching announcements:", error);
      }
    }
  };

  // Fetch notifications and unread count on mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Handle new notifications via socket
  useEffect(() => {
    const handleNewNotification = (newNotification) => {
      console.log("NEW NOTIFICATION", newNotification);

      // If it's an auction notification, store it separately
      if (newNotification.auction) {
        dispatch({
          type: SET_AUCTION_ANNOUNCE,
          payload: newNotification, // Save auction notification
        });
      } else {
        dispatch({
          type: ADD_NOTIFICATION,
          payload: newNotification,
        });
      }
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

  const markAsRead = async (id) => {
    try {
      await privateAxios.post(`/announcements/${id}/read`);
      console.log("Announcement marked as read.");
      dispatch({ type: MARK_AS_READ, payload: id });
    } catch (error) {
      console.error("Error marking announcement as read:", error);
    }
  };
  const fetchUnreadAnnouncementForAuction = async (id) => {
    try {
      const response = await privateAxios.get(
        `/announcements/auction/${id}/unread`
      );
      if (response.data !== "") {
        dispatch({
          type: SET_AUCTION_ANNOUNCE,
          payload: response.data,
        });
      }
    } catch (error) {
      console.error("Failed to fetch unread announcement:", error);
    }
  };
  return (
    <NotificationContext.Provider
      value={{
        announcements: state.announcements,
        unreadCount: state.unreadCount,
        auctionAnnounce: state.auctionAnnounce, // Provide auction-specific notification
        markAsRead,
        fetchAnnouncements,
        fetchUnreadAnnouncementForAuction,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
