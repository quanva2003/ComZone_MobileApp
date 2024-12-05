// useSocket.js
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(process.env.BASE_URL); // Adjust to your base URL

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setSocket(socketInstance);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Cleanup socket connection on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, []);

  return socket;
};

export default useSocket;
