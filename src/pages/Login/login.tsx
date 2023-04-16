import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
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

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
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

  const handleGoogleSignInPopup = () => {
    signInWithPopup(auth, provider)
      .then((result: any) => {
        const user = result.user;

        getEmails().then((result: any) => {
          const temp = result.filter((docs: any) => docs.email === user.email);

          if (temp.length === 0) {
            addDoc(usersRef, {
              email: user.email,
              name: user.displayName,
              uid: user.uid,
            });
            navigate("/chat", {
              state: { user: user.displayName, uid: user.uid },
            });
          } else if (temp[0].email === user.email) {
            navigate("/chat", {
              state: { user: user.displayName, uid: user.uid },
            });
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
        style={{ flexDirection: "column", justifyContent: "center" }}
        className="layout-login-header"
      >
        {/* <Text strong={true} className="header">
          Minoot
        </Text> */}
        <Carousel autoplay dots={false} style={{ marginBottom: "3%" }}>
          <Text strong={true} className="header">
            Did your connection drop during a meeting?
          </Text>
          <Text strong={true} className="header">
            Is a call starting without you?
          </Text>
          <Text strong={true} className="header">
            Need a summary of everything that went down?
          </Text>
        </Carousel>
        <Row style={{ justifyContent: "center" }}>
          <Text strong={true} className="header" style={{ fontSize: "40px" }}>
            Minoot is your new buddy for planning
          </Text>
        </Row>
      </Col>
      <Card bordered={false} className="modal-login">
        {/* <Form
          name="basic"
          labelCol={{ span: 8 }}
          style={{ margin: "15px 0" }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            style={{ marginBottom: "20px" }}
            rules={[{ required: true, message: "Please input your email" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            style={{ marginBottom: "30px" }}
            rules={[{ required: true, message: "Please input your password" }]}
          >
            <Input.Password
              placeholder="Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
            style={{ marginTop: "-10px" }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item style={{ marginTop: "-10px" }}>
            <Button
              type="primary"
              htmlType="submit"
              block={true}
              style={{ backgroundColor: "#400d51" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ color: "white" }}> or </Divider> */}

        <Button
          size={"large"}
          block={true}
          onClick={() => handleGoogleSignInPopup()}
        >
          <GoogleOutlined />
        </Button>
      </Card>
    </Layout>
  );
};

export default Login;
