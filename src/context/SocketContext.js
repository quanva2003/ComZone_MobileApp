import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        // Fetch userId from AsyncStorage
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          // console.error("UserId not found in AsyncStorage.");
          return;
        }

        // Establish socket connection
        const newSocket = io(process.env.BASE_URL, {
          transports: ["websocket"],
          autoConnect: true,
          query: { user: userId }, // Pass userId as a query parameter
        });

        // Emit 'joinRoom' event when socket connects
        newSocket.on("connect", () => {
          console.log(`Connected to server with socket ID: ${newSocket.id}`);
          newSocket.emit("joinRoom", userId);
        });

        // Handle connection errors
        newSocket.on("connect_error", (err) => {
          console.error("Socket connection error:", err.message);
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => newSocket.close();
      } catch (error) {
        console.error("Error initializing socket:", error);
      }
    };

    initializeSocket();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
