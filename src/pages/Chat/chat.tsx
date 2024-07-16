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
import { db, firebaseConfig } from "../../firebase/config";
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
  const location = useLocation();

  const messagesRef = collection(db, "messages");
  const localStorageTemp: any = localStorage.getItem("user");
  const user = JSON.parse(localStorageTemp);

  const renderMessageContainer = (message: any, index: any) => {
    const fromUser = user && message.sender_id === user?.id;
    let name = message.sender_name.split(" ");

    if (name.length > 1) {
      name = `${name[0][0]} ${name[1][0]}`;
    } else {
      name = `${name[0][0]} ${name[0][1]}`;
    }
    return (
      <>
        <Row
          wrap={false}
          style={{
            marginBlock: "3px",
            justifyContent: fromUser ? "flex-end" : "flex-start",
            color: "white",
            paddingRight: fromUser ? "55px" : 0,
            paddingLeft: fromUser ? 0 : "55px",
          }}
        >
          {message.sender_name}
        </Row>
        <Row
          className="message-bubble"
          wrap={false}
          key={index}
          style={{
            justifyContent: fromUser ? "flex-end" : "flex-start",
          }}
        >
          {fromUser ? (
            <>
              <Row
                wrap={false}
                style={{
                  columnGap: "5px",
                  width: "30%",
                  justifyContent: fromUser ? "flex-end" : "flex-start",
                }}
              >
                <Row className="content-chat-message">
                  <p>{message.content}</p>
                </Row>
                <Avatar size={50} shape="square">
                  {name}
                </Avatar>
              </Row>
            </>
          ) : (
            <Row
              style={{
                columnGap: "5px",
                width: "30%",
                justifyContent: fromUser ? "flex-end" : "flex-start",
              }}
            >
              <Avatar size={50} shape="square">
                {name}
              </Avatar>
              <Row className="content-chat-message" wrap={true}>
                <p>{message.content}</p>
              </Row>
            </Row>
          )}
        </Row>
      </>
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
        sender_id: user?.id,
        sender_name: user.name,
        content: !whiteSpaceTest.test(message) ? message : input,
      };
      handleSendMessage(sentMessage);
      setInput(undefined);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      
      
      
      const confirmationMessage = "Are you sure you want to leave this page?";
      console.log("leaving page");
      
      
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    onSnapshot(messagesRef, (snapshot) => {
      let docs: any = [];
      snapshot.docs.map((doc: any) => {
        docs.push({
          id: new Date().getTime(),
          date: doc.data().date,
          content: doc.data().content,
          sender_id: doc.data().sender_id,
          sender_name: doc.data().sender_name,
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
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={"/waiting-meme.png"}
              alt="waiting-meme"
              style={{ width: "250px", height: "200px" }}
            />
            <Title level={4} style={{ color: "white" }}>
              Waiting for a convo like...
            </Title>
          </Content>
        )}

        <Row className="chat-input-container" wrap={false}>
          <TextArea
            value={input}
            id="chat-input"
            bordered={false}
            autoSize
            onKeyDown={(event: any) => {
              if (event.key === "Enter") {
                event.preventDefault();
              }
            }}
            onPressEnter={(event) => onEnter(event)}
            onChange={(event) => setInput(event.target?.value)}
          />
          <Row className="send-button" onClick={() => onEnter(input)}>
            <SendOutlined style={{ color: "white" }} />
          </Row>
        </Row>
      </Layout>
    </Layout>
  );
};

export default Chat;
