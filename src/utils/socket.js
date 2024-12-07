import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.BASE_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, []); // Empty dependency array means this effect runs once

  return socket;
};

export default useSocket;
