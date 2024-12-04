import { io } from "socket.io-client";

let socket;

export const connectSocket = async (url) => {
  if (!socket || !socket.connected) {
    socket = io(url, {
      reconnection: true,
    });

    return new Promise((resolve, reject) => {
      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
        resolve(socket);
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        reject(error);
      });
    });
  } else {
    console.log("Socket is already connected:", socket.id);
    return socket;
  }
};

export default socket;
