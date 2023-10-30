// Import the functions you need from the SDKs you need
import { firebaseConfig } from "./config";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import * as firebase from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesRef = collection(db, "messages");
const accessCodesRef = collection(db, "access_codes");

export const sendMessage = (message: any) => {
  addDoc(messagesRef, { ...message });
};

export const verifyAccessCode = async (code: number | undefined) => {
  let temp: any = [];
  try {
    await getDocs(accessCodesRef).then((snapshot: any) => {
      snapshot.docs.map((doc: any) => {
        console.log("doc: ", doc);
        temp.push({
          id: doc.data().id,
          code: doc.data().code,
          used: doc.data().used,
        });
      });
    });

    const document = temp.map((object: any) => {
      if (Number(object.code) === Number(code)) return object;
    });

    if (!temp.length)
      return {
        status: 400,
        message: "No access codes in the database.",
      };

    console.log("document: ", document);
    if (!document.used) {
      // const ref = docRef.get();
      const docRef = doc(db, "access_codes", document.id);
      const docObject = {
        id: document.id,
        code: "000000",
        used: !document.used,
      };
      await updateDoc(docRef, docObject);
      return {
        status: 200,
        verified: true,
        data: document,
        message: "Access code has been verified.",
      };
    } else {
      return {
        status: 400,
        data: document,
        message: "Access code has already been used.",
      };
    }
  } catch (error: any) {
    return {
      status: 401,
      message: `Failed: ${error}`,
    };
  }
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
          sender: doc.data().sender,
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
