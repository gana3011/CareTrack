'use client';
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import {
  PieChartOutlined,
  PushpinOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import LeafMapClient from "@/components/LeafMapClient";
import ManagerTable from "@/components/ManagerTable";
import DashBoard from "@/components/DashBoard";
import ActiveShifts from "@/components/ActiveShifts";

const { Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const items = [
  getItem('Perimeter', '1', <PushpinOutlined />),
  getItem('Shifts', 'sub1', <UserOutlined />, [
    getItem('Active Shift', '2'),
    getItem('Shift History', '3'),
  ]),
  getItem('Dashboard', '4', <PieChartOutlined />),
];

const Page = () => {
  const [activeKey, setActiveKey] = useState("1");
  const [isMobile, setIsMobile] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderComponent = () => {
    switch (activeKey) {
      case "1": return <LeafMapClient />;
      case "2": return <ActiveShifts />;
      case "3": return <ManagerTable />;
      case "4": return <DashBoard />;
      default:  return <LeafMapClient />;
    }
  };

  return (
    <Layout>
      <NavBar />
    <Layout>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sider theme="light" width={200}>
            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={items}
              onClick={(e) => setActiveKey(e.key)}
            />
          </Sider>
        )}

        <Layout style={{ padding: isMobile ? "0" : "0 16px" }}>
          {isMobile && (
            <div className="bg-white">
              <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={["1"]}
                items={items}
                onClick={(e) => setActiveKey(e.key)}
              />
            </div>
          )}

          <Content
            style={{
              minHeight: "100vh",
              background: colorBgContainer,
              padding: "1rem",
            }}
          >
            {renderComponent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Page;
