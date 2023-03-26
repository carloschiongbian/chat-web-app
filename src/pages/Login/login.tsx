import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Layout, Card, Form, Typography, Input, Checkbox, Button } from "antd";

import "./login.scss";

const { Title } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();

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
    </Layout>
  );
};

export default Login;
