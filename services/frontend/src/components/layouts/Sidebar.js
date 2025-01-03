'use client';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function Sidebar() {
  return (
    <Sider width={200} style={{ background: '#fff' }}>
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          Dashboard
        </Menu.Item>
        <Menu.Item key="2" icon={<TeamOutlined />}>
          Khách hàng
        </Menu.Item>
        <Menu.Item key="3" icon={<CalendarOutlined />}>
          Tours
        </Menu.Item>
        <Menu.Item key="4" icon={<SettingOutlined />}>
          Cài đặt
        </Menu.Item>
      </Menu>
    </Sider>
  );
}
