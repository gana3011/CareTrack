'use client';
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import LeafMapClient from "@/components/LeafMapClient";
import { useUser } from "@auth0/nextjs-auth0";
import ManagerTable from "@/components/ManagerTable";
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Location', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];

const page = () => {

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <>

     <Layout> 
        <NavBar />
      <Layout>
      <Sider  >
        {/* <div className="demo-logo-vertical" /> */}
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>

      <Layout>
        <Content style={{ margin: '0 16px' }}>
          <ManagerTable />
          <LeafMapClient />
        </Content>
        </Layout>
      </Layout>
      
    </Layout>
    <Footer style={{ textAlign: 'center' , zIndex : 1  }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
    </>
  )
}

export default page;