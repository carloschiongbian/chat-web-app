import React, { useState, useEffect } from "react";
import { Avatar, Button, Col, MenuProps, Spin } from "antd";
import { Row, Layout, Menu, Typography, Input } from "antd";
import {
  MessageOutlined,
  UserOutlined,
  SendOutlined,
  LoadingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./chat.scss";
import { getMessages, sendMessage } from "../../firebase/firestore";
import {
  useLocation,
  useNavigate,
  useParams,
  useRoutes,
} from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { firebaseConfig } from "../../firebase/config";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";

const { Title } = Typography;
const { TextArea } = Input;
const { Header, Sider, Content, Footer } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [getItem("Chat", "1", <MessageOutlined />)];

const Chat: React.FC = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState<any>("");
  const [messages, setMessages] = useState<any>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const messagesRef = collection(db, "messages");
  const localStorageTemp: any = localStorage.getItem("user");
  const user = JSON.parse(localStorageTemp);

  // const retrieveData = async () => {
  //   setIsLoading(true);
  //   const response = await getMessages(setMessages);

  //   if (response.status === 200) {
  //     setIsLoading(false);
  //   }
  // };

  const renderMessageContainer = (message: any, index: any) => {
    const fromUser = message.sender === user.id;

    return (
      <Row
        className="message-bubble"
        wrap={false}
        key={index}
        style={{
          justifyContent: fromUser ? "flex-start" : "flex-end",
        }}
      >
        {fromUser ? (
          <>
            <Avatar shape="square" icon={<UserOutlined />} />
            <Row className="content-chat-message" wrap={true}>
              <p>{message.content}</p>
            </Row>
          </>
        ) : (
          <>
            <Row className="content-chat-message" wrap={true}>
              <p>{message.content}</p>
            </Row>
            <Avatar size={50} shape="square" icon={<UserOutlined />} />
          </>
        )}
      </Row>
    );
  };

  const handleSendMessage = async (message: any) => {
    sendMessage(message);
  };

  const handleGoogleSignOut = () => {
    signOut(auth)
      .then((response) => {
        console.log(response);
        console.log("logged out");
        navigate("/");
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  const onEnter = (event: any) => {
    const whiteSpaceTest = /^\s*$/;
    const message = event?.target?.value || " ";

    if (
      (!whiteSpaceTest.test(message) && message !== undefined) ||
      (input !== undefined && !whiteSpaceTest.test(input))
    ) {
      const sentMessage = {
        id: new Date().getTime(),
        date: new Date(),
        sender: user.id,
        content: !whiteSpaceTest.test(message) ? message : input,
      };
      handleSendMessage(sentMessage);
      setInput(undefined);
    }
  };

  useEffect(() => {
    onSnapshot(messagesRef, (snapshot) => {
      let docs: any = [];
      snapshot.docs.map((doc: any) => {
        docs.push({
          id: new Date().getTime(),
          date: doc.data().date,
          content: doc.data().content,
          sender: doc.data().sender,
        });
      });

      setMessages(docs.sort((a: any, b: any) => a.date - b.date));
    });
  }, []);

  return (
    <Layout className="layout-chat">
      <Sider
        collapsible
        className="sider"
        collapsed={collapsed}
        style={{ backgroundColor: "#16213e" }}
        onCollapse={(value) => setCollapsed(value)}
      >
        {!collapsed && (
          <div className="sider-header">
            <Title level={5} className="sider-header-title">
              What's The Tea 🍵
            </Title>
          </div>
        )}

        <Menu
          theme="dark"
          style={{ backgroundColor: "#16213e" }}
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />

        <Row>
          {!collapsed ? (
            <Button
              size="large"
              icon={<LogoutOutlined />}
              className="logout-button"
              onClick={() => handleGoogleSignOut()}
            >
              Log Out
            </Button>
          ) : (
            <Button
              size="large"
              icon={<LogoutOutlined />}
              className="logout-button"
              onClick={() => handleGoogleSignOut()}
            />
          )}
        </Row>
      </Sider>

      <Layout className="content-layout">
        <Header className="header-chat" />

        {messages.length > 0 && (
          <Content className="content-chat">
            {messages.map((message: any, index: any) =>
              renderMessageContainer(message, index)
            )}
          </Content>
        )}

        {messages.length === 0 && (
          <Content
            className="content-chat-spinner"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            />
          </Content>
        )}

        <Row className="chat-input-container" wrap={false}>
          <TextArea
            value={input}
            id="chat-input"
            bordered={false}
            autoSize
            onPressEnter={(event) => onEnter(event)}
            onChange={(event) => setInput(event.target?.value)}
          />
          <Row className="send-button" onClick={() => onEnter(input)}>
            <SendOutlined />
          </Row>
        </Row>
      </Layout>
    </Layout>
  );
};

export default Chat;
