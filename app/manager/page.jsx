'use client';
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  PushpinOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import LeafMapClient from "@/components/LeafMapClient";
import { useUser } from "@auth0/nextjs-auth0";
import ManagerTable from "@/components/ManagerTable";
import DashBoard from "@/components/DashBoard";
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
  getItem('Perimeter', '1', <PushpinOutlined />),
  getItem('Users', '2', <UserOutlined />),
  getItem('Dashboard', '3', <PieChartOutlined />)
];

const page = () => {

  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("1");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const renderComponent = () =>{
    switch(activeKey){
      case "1":
        return <LeafMapClient />
      case "2":
        return <ManagerTable />
      case "3":
        return <DashBoard />
      default:
        return <LeafMapClient />
    }
  }

  return (
    <>
     <Layout> 
        <NavBar />
      <Layout>
      <Sider  >
        {/* <div className="demo-logo-vertical" /> */}
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={(e)=>setActiveKey(e.key)}/>
      </Sider>

      <Layout>
        <Content style={{ margin: '0 16px' }}>
          {renderComponent()}
        </Content>
        </Layout>
      </Layout>
      
    </Layout>
    {/* <Footer style={{ textAlign: 'center' , zIndex : 1  }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
    </>
  )
}

export default page;