import React from "react";
import { Layout, Menu } from "antd";
import { CameraOutlined, HomeOutlined } from "@ant-design/icons";
import BarcodeScannerPage from "./components/BarcodeScannerPage";
import "./App.css";

const { Header, Content, Footer } = Layout;

function App() {
  const [currentPage, setCurrentPage] = React.useState("scanner");

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="app-logo">
          <CameraOutlined style={{ marginRight: 10 }} />
          <span>ScanKhach - Barcode Scanner</span>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentPage]}
          onClick={(e) => setCurrentPage(e.key)}
          style={{ flex: 1 }}
        >
          <Menu.Item key="scanner" icon={<CameraOutlined />}>
            Scanner
          </Menu.Item>
        </Menu>
      </Header>

      <Content className="app-content">
        {currentPage === "scanner" && <BarcodeScannerPage />}
      </Content>

      <Footer className="app-footer">
        <p>© 2026 ScanKhach - Barcode Scanner Application</p>
        <p style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
          Sử dụng @zxing/browser để quét mã barcode 128 bằng camera điện thoại
        </p>
      </Footer>
    </Layout>
  );
}

export default App;
