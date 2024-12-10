import { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function usePushNotifications() {
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  useEffect(() => {
    // Add listeners for notifications
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received:", response);
      });

    return () => {
      // Clean up listeners
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const schedulePushNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Local Notification",
        body: "This is a local notification for testing on an emulator.",
        data: { customData: "Emulator test" },
      },
      trigger: {
        seconds: 5, 
      },
    });
  };

  return {
    notification,
    schedulePushNotification,
  };
}
