import React, { useState, useCallback, useRef } from "react";
import {
  Button,
  Input,
  Space,
  Card,
  Empty,
  Row,
  Col,
  message,
  Modal,
  Statistic,
} from "antd";
import {
  DeleteOutlined,
  ReloadOutlined,
  CameraOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import BarcodeScanner from "./BarcodeScanner";
import "./BarcodeScannerPage.css";

const BarcodeScannerPage = () => {
  const [results, setResults] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    unique: 0,
  });

  // Hàm thêm kết quả
  const addResult = useCallback((barcode, format, timestamp) => {
    const newResult = {
      id: Date.now(),
      barcode,
      format,
      timestamp,
    };
    setResults((prev) => {
      const updated = [newResult, ...prev];
      updateStatistics(updated);
      return updated;
    });
  }, []);

  // Hàm cập nhật thống kê
  const updateStatistics = (items) => {
    const total = items.length;
    const unique = new Set(items.map((item) => item.barcode)).size;
    setStatistics({ total, unique });
  };

  // Hàm xóa tất cả
  const handleClearAll = () => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc muốn xóa tất cả kết quả scan?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk() {
        setResults([]);
        setStatistics({ total: 0, unique: 0 });
        message.success("Đã xóa tất cả kết quả");
      },
    });
  };

  return (
    <div className="barcode-scanner-page">
      <BarcodeScanner />
    </div>
  );
};

export default BarcodeScannerPage;
