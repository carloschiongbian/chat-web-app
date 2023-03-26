import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Row, Layout, Menu, theme, Typography, Card } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import "./chat.scss";

const { Title } = Typography;
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
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
          <Row className="content-chat-message" wrap={true}>
            <p>
              lnkjnknknkjnknkjnknjkmn, ,
              bblbnlkjnlknjknknlnkjnknknkjnknkjnknjkmn, , bblbnlkjnlknjknkn
              lnkjnknknkjnknkjnknjkmn, , bblbnlkjnlknjknkn
              lnkjnknknkjnknkjnknjkmn, , bblbnlkjnlknjknkn
              lnkjnknknkjnknkjnknjkmn, , bblbnlkjnlknjknkn
              lnkjnknknkjnknkjnknjkmn, , bblbnlkjnlknjknkn
            </p>
          </Row>
        </Content>
        <Footer className="footer-chat" style={{ textAlign: "center" }}>
          ©2023 Created by Julian Chiongbian
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Chat;
