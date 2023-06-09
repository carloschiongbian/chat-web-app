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
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

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
  const location = useLocation();
  console.log(location);

  const retrieveData = async () => {
    setIsLoading(true);
    const response = await getMessages(setMessages);

    if (response.status === 200) {
      setIsLoading(false);
    }
  };

  const renderMessageContainer = (message: any, index: any) => {
    return (
      <Row
        className="message-bubble"
        wrap={false}
        key={index}
        style={{
          justifyContent: message.fromOthers ? "flex-start" : "flex-end",
        }}
      >
        {message.fromOthers ? (
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
            <Avatar shape="square" icon={<UserOutlined />} />
          </>
        )}
      </Row>
    );
  };

  const handleSendMessage = (message: any) => {
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
        fromOthers: false,
        content: !whiteSpaceTest.test(message) ? message : input,
      };
      handleSendMessage(sentMessage);
      retrieveData();
      setInput(undefined);
    }
  };

  useEffect(() => {
    retrieveData();
  }, [onEnter]);

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
            <Title level={2} className="sider-header-title">
              Minoot
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

        <Row style={{ height: "100%" }}>
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
            autoSize={{ minRows: 0, maxRows: 6 }}
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
