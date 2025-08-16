'use client';

import React from "react";
import { Layout, Menu, Dropdown, Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined, HomeOutlined } from "@ant-design/icons";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";

const { Header } = Layout;

const NavBar = () => {
  const { user, isLoading } = useUser();

  const menuItems = [
    {
      key: "profile",
      label: <Link href="/profile">Profile</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "logout",
      label: <a href="/api/auth/logout">Log out</a>,
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff",
        padding: "0 24px",
        boxShadow: "0 2px 8px #f0f1f2",
      }}
    >
      {/* Left side - Logo + Home */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Link href="/" style={{ fontSize: "20px", fontWeight: "bold" }}>
          Healthcare App
        </Link>
      </div>

      {/* Right side - Auth */}
      <div>
        {!isLoading && !user && (
          <Link href="/auth/login">
            <Button type="primary">Log in</Button>
          </Link>
        )}
        {user && (
          <Dropdown
            menu={{ items: menuItems }}
            placement="bottomRight"
            arrow
            trigger={["click"]}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                gap: "8px",
              }}
            >
              <Avatar src={user.picture} alt="Profile" size="large" />
              <span>{user.name}</span>
            </div>
          </Dropdown>
        )}
      </div>
    </Header>
  );
};

export default NavBar;
