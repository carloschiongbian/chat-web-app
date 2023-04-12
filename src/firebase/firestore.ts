// Import the functions you need from the SDKs you need
import { firebaseConfig } from "./config";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesRef = collection(db, "messages");

export const sendMessage = (message: any) => {
  console.log("message: ", message);
  addDoc(messagesRef, { ...message });
};

export const getMessages = async (setMessages: any) => {
  let temp: any = [];

  try {
    getDocs(messagesRef).then((snapshot: any) => {
      snapshot.docs.map((doc: any) => {
        temp.push({
          id: new Date().getTime(),
          date: doc.data().date,
          content: doc.data().content,
          fromOthers: doc.data().fromOthers,
        });
      });

      setMessages(temp.sort((a: any, b: any) => a.date - b.date));
    });

    return {
      status: 200,
      message: "Success!",
    };
  } catch (error: any) {
    return {
      status: 401,
      message: `Failed: ${error}`,
    };
  }
};
