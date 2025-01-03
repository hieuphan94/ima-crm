'use client';
import { Layout, Menu, Dropdown, Space } from 'antd';
import { UserOutlined, GlobalOutlined } from '@ant-design/icons';

const { Header } = Layout;

export default function AppHeader() {
  const languageMenu = {
    items: [
      { key: 'vi', label: 'Tiếng Việt' },
      { key: 'en', label: 'English' },
    ],
  };

  return (
    <Header className="header">
      <div className="logo" />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Trang chủ</Menu.Item>
          <Menu.Item key="2">Tours</Menu.Item>
          <Menu.Item key="3">Dịch vụ</Menu.Item>
        </Menu>
        <Space>
          <Dropdown menu={languageMenu}>
            <GlobalOutlined style={{ color: 'white', fontSize: '18px' }} />
          </Dropdown>
          <UserOutlined style={{ color: 'white', fontSize: '18px' }} />
        </Space>
      </div>
    </Header>
  );
}
