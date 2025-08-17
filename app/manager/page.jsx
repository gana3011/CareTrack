'use client';
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import {
  PieChartOutlined,
  PushpinOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, message, theme } from 'antd';
import LeafMapClient from "@/components/LeafMapClient";
import ManagerTable from "@/components/ManagerTable";
import DashBoard from "@/components/DashBoard";
import ActiveShifts from "@/components/ActiveShifts";
import CustomFooter from "@/components/CustomFooter";
import WorkerTable from "@/components/WorkerTable";

const { Content, Sider  } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const items = [
  getItem('Perimeter', '1', <PushpinOutlined />),
  getItem('Shifts', 'sub1', <UserOutlined />, [
    getItem('Active Shift', '2'),
    getItem('Shift History', '3'),
    getItem('Add Shift','4')
  ]),
  getItem('Dashboard', '5', <PieChartOutlined />),
];

const Page = () => {
  const [activeKey, setActiveKey] = useState("1");
  const [isMobile, setIsMobile] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

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
      case "1": return <LeafMapClient messageApi={messageApi}/>;
      case "2": return <ActiveShifts />;
      case "3": return <ManagerTable />;
      case "4": return <WorkerTable messageApi={messageApi}/>
      case "5": return <DashBoard />;
      default:  return <LeafMapClient messageApi={messageApi}/>;
    }
  };

  return (
    
    <Layout style={{ minHeight: "100vh"}}>
      {contextHolder}
      <NavBar />

      {/* Main layout with sider + content */}
      <Layout style={{ flex: "1 0 auto" }}>
        {!isMobile && (
          <Sider theme="light" width={200} className="border-r border-gray-200">
            <Menu
              className="custom-menu"
              theme="light"
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={items}
              onClick={(e) => setActiveKey(e.key)}
            />
          </Sider>
        )}

        <Layout  className="bg-white" style={{ padding: isMobile ? "0" : "0 16px" }}>
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
              background: colorBgContainer,
              padding: "1rem",
              flex: "1 0 auto",
            }}
          >
            {renderComponent()}
          </Content>
        </Layout>
      </Layout>

      {/* Footer always below sider + content */}
      <CustomFooter >
        © {new Date().getFullYear()} CareTrack
      </CustomFooter>
    </Layout>
  );
};

export default Page;
