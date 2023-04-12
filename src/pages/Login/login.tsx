import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import {
  Layout,
  Card,
  Form,
  Typography,
  Input,
  Checkbox,
  Button,
  Modal,
} from "antd";
import "./login.scss";
import SignIn from "../../google_login/SignIn";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase/config";

const { Title } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [emailExists, setEmailExists] = useState<boolean>(false);

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const usersRef = collection(db, "users");

  const verifyEmailExists = async (user: any) => {
    const snapshot = await getDocs(usersRef);

    return snapshot.docs.map((snapshot: any) => snapshot.data());
    // getDocs(usersRef).then((snapshot: any) => {
    //   snapshot.docs.map((doc: any) => {
    //     return doc.data();
    //   });
    // });
  };

  const handleGooglePopup = () => {
    signInWithPopup(auth, provider)
      .then((result: any) => {
        const user = result.user;

        verifyEmailExists(user).then((result: any) => {
          const temp = result.filter((docs: any) => docs.email === user.email);

          if (temp.length === 0) {
            addDoc(usersRef, {
              email: user.email,
              name: user.displayName,
              uid: user.uid,
            });
          } else if (temp[0].email === user.email) {
            setEmailExists(true);
            console.log("User has already been added to the list");
          }
        });
      })
      .catch((error: any) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error[${errorCode}]: ${errorMessage}`);

        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
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
      <Card bordered={false} className="modal-login">
        <Title level={3} className="modal-login-title">
          Welcome
        </Title>

        <Form
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

          <Button
            type="primary"
            size={"large"}
            onClick={() => handleGooglePopup()}
          >
            Google
          </Button>

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
      </Card>

      <Modal
        open={emailExists}
        onCancel={() => setEmailExists(false)}
        cancelButtonProps={null}
        centered={true}
      >
        <Title level={3} style={{ textAlign: "center" }}>
          This email is already being used.
        </Title>
      </Modal>
    </Layout>
  );
};

export default Login;
