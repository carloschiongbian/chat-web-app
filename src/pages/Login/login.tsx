import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Card,
  Form,
  Typography,
  Input,
  Checkbox,
  Button,
  Modal,
  Col,
  Carousel,
  Row,
} from "antd";
import "./login.scss";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase/config";
import { UserContext } from "../../context/context";
import { verifyAccessCode } from "../../firebase/firestore";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState<number>();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [emailExists, setEmailExists] = useState<boolean>(false);

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const usersRef = collection(db, "users");

  const getEmails = async () => {
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map((snapshot: any) => snapshot.data());
  };

  // const handleVerification = async (code: number | undefined) => {
  //   setIsLoading(true);
  //   const result = await verifyAccessCode(code);
  //   console.log(result);
  //   if (result?.status === 200) {
  //     setTimeout(() => {
  //       setIsVerified(true);
  //       setIsLoading(false);
  //     }, 1000);
  //   } else {
  //     setTimeout(() => {
  //       setIsLoading(false);
  //     }, 1000);
  //   }
  // };

  // const verifyCode = (input: any) => {
  //   if (!isNaN(Number(input))) {
  //     setCode(input);
  //   }
  // };

  const handleGoogleSignInPopup = () => {
    signInWithPopup(auth, provider)
      .then((result: any) => {
        const user = result.user;
        console.log("user: ", user);

        const userDetails = {
          id: user.uid,
          name: user.displayName,
        };
        getEmails().then((result: any) => {
          const temp = result.filter((docs: any) => docs.email === user.email);

          if (temp.length === 0) {
            addDoc(usersRef, {
              email: user.email,
              name: user.displayName,
              uid: user.uid,
            });
            localStorage.setItem("user", JSON.stringify(userDetails));
            navigate("/chat");
          } else if (temp[0].email === user.email) {
            localStorage.setItem("user", JSON.stringify(userDetails));
            navigate("/chat");
          }
        });
      })
      .catch((error: any) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error[${errorCode}]: ${errorMessage}`);
      });
  };

  const handleGoogleSignOut = () => {
    signOut(auth)
      .then((response) => {
        console.log(response);
        // setIsSignedIn(false);
        // Sign-out successful.
      })
      .catch((error) => {
        console.log(error);
        // An error happened.
      });
  };

  const onFinish = (values: any) => {
    console.log("Success:", values);
    navigate("/chat");
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Layout className="layout-login">
      <Col
        className="layout-login-header"
        style={{
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        }}
      >
        {/* <Text strong={true} className="header">
          Minoot
        </Text> */}
        {/* <Carousel autoplay dots={false}>
          <Text strong={true} className="header">
            Did your connection drop during a meeting?
          </Text>
          <Text strong={true} className="header">
            Is a call starting without you?
          </Text>
          <Text strong={true} className="header">
            Need a summary of everything that went down?
          </Text>
          <Text strong={true} className="header">
            Do you need your... meeting minutes?
          </Text>
        </Carousel> */}
        {/* {!isVerified && (
          <Row
            style={{
              justifyContent: "center",
              rowGap: "10px",
              fontWeight: "bold",
            }}
          >
            <Input
              placeholder="Enter your code"
              value={code}
              size="large"
              style={{ outline: "none" }}
              onChange={(e) => verifyCode(e.target.value)}
              maxLength={6}
            />
            <Button
              icon={isVerified ? <CheckCircleOutlined /> : null}
              type="primary"
              loading={isLoading}
              style={{ backgroundColor: "#16213e" }}
              onClick={() => handleVerification(code)}
            >
              Verify
            </Button>
          </Row>
        )} */}
        {/* {isVerified && ( */}
        <Col>
          <Row style={{ justifyContent: "center" }}>
            {/* <Text strong={true} className="header" style={{ fontSize: "40px" }}>
              Minoot is your new buddy for planning
            </Text> */}
            <Text strong={true} className="header" style={{ fontSize: "40px" }}>
              What's the 🍵?
            </Text>
          </Row>

          <Card bordered={false} className="modal-login">
            <Button
              size={"large"}
              block={true}
              onClick={() => handleGoogleSignInPopup()}
            >
              <GoogleOutlined />
            </Button>
          </Card>
        </Col>
        {/* )} */}
      </Col>
    </Layout>
  );
};

export default Login;
