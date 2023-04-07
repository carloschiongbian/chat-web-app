// Import the functions you need from the SDKs you need
import { firebaseConfig } from "./config";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useState } from "react";

// Initialize Firebase

export const getMessages = async (messages: any, setMessages: any) => {
  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);
  const messagesRef = collection(db, "messages");

  let temp: any = [];
  // const [messages, setMessages] = useState<any>([]);

  getDocs(messagesRef)
    .then((snapshot: any) => {
      snapshot.docs.map((doc: any) => {
        temp.push({
          id: new Date().getTime(),
          content: doc.data().content,
          fromOthers: doc.data().fromOthers,
        });
        // setMessages([
        //   ...messages,
        //   {
        //     id: new Date().getTime(),
        //     content: doc.data().content,
        //     fromOthers: doc.data().fromOthers,
        //   },
        // ]);
      });
      console.log(temp);
      setMessages(temp);
    })
    .catch((error: any) => {
      console.log("Error: ", error);
    })
    .catch((err: any) => console.log(err));
};
