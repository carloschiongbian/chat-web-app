import React, { useState, useEffect } from "react";
import { Avatar, MenuProps } from "antd";
import { Row, Layout, Menu, Typography, Input } from "antd";
import { MessageOutlined, UserOutlined, SendOutlined } from "@ant-design/icons";
import "./chat.scss";
import { STATIC_MESSAGES } from "../../constant/static";

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
  const [input, setInput] = useState<any>("");
  const [messages, setMessages] = useState<any>([]);
  const [collapsed, setCollapsed] = useState(false);

  const renderMessageContainer = (message: any, index: any) => {
    return (
      <Row
        className="message-bubble"
        wrap={false}
        style={{
          justifyContent: message.fromOthers ? "flex-start" : "flex-end",
        }}
      >
        {message.fromOthers ? (
          <>
            <Avatar shape="square" icon={<UserOutlined />} />
            <Row className="content-chat-message" wrap={true} key={index}>
              <p>{message.content}</p>
            </Row>
          </>
        ) : (
          <>
            <Row className="content-chat-message" wrap={true} key={index}>
              <p>{message.content}</p>
            </Row>
            <Avatar shape="square" icon={<UserOutlined />} />
          </>
        )}
      </Row>
    );
  };

  const onEnter = (event: any) => {
    const whiteSpaceTest = /^\s*$/;
    const message = event?.target?.value || " ";

    if (
      (!whiteSpaceTest.test(message) && message !== undefined) ||
      (input !== undefined && !whiteSpaceTest.test(input))
    ) {
      const sentMessage = {
        fromOthers: false,
        content: !whiteSpaceTest.test(message) ? message : input,
      };
      setMessages([...messages, sentMessage]);
      setInput(undefined);
    }
  };

  const retrieveMessages = () => {
    setMessages(STATIC_MESSAGES);
  };

  useEffect(() => {
    retrieveMessages();
  }, []);

  return (
    <Layout className="layout-chat">
      <Sider
        collapsible
        collapsed={collapsed}
        style={{ backgroundColor: "#16213e" }}
        onCollapse={(value) => setCollapsed(value)}
      >
        {!collapsed && (
          <div className="sider-header">
            <Title level={2} className="sider-header-title">
              Convo
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
      </Sider>

      <Layout className="content-layout">
        <Header className="header-chat" />

        <Content className="content-chat">
          {messages.map((message, index) =>
            renderMessageContainer(message, index)
          )}
        </Content>

        <Row className="chat-input-container" wrap={false}>
          <TextArea
            value={input}
            id="chat-input"
            bordered={false}
            autoSize={{ minRows: 1, maxRows: 6 }}
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
