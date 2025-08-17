'use client';

import React from 'react';
import { Dropdown, Avatar, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';

const NavBar = () => {
  const { user, isLoading } = useUser();

  const menuItems = [
    {
      key: 'logout',
      label: <a href="/api/auth/logout">Log out</a>,
      icon: <LogoutOutlined />
    }
  ];

  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      <Link href="/" className="text-lg sm:text-2xl font-bold" style={{ color: '#1677ff' }}>
        CareTrack
      </Link>

      <div className="flex items-center gap-4">
        {!isLoading && !user && (
          <Link href="/auth/login">
            <Button type="primary" className="rounded-md">
              Log in
            </Button>
          </Link>
        )}
        {user && (
          <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow trigger={['click']}>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar src={user.picture} alt="Profile" size="large" />
              <span className="hidden sm:inline font-medium text-gray-700">{user.name}</span>
            </div>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default NavBar;
