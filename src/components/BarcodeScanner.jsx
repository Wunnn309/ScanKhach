import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button, message, Empty, Card, Row, Col, Space, Tag } from "antd";
import {
  CameraOutlined,
  StopOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./BarcodeScanner.css";

const BarcodeScanner = () => {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastScan, setLastScan] = useState("");
  const scanTimeoutRef = useRef(null);
  const qrScannerRef = useRef(null);

  // Initialize scanner on mount
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (qrScannerRef.current) {
        qrScannerRef.current.clear();
      }
    };
  }, []);

  // Bắt đầu scan
  const startScanning = async () => {
    setLoading(true);
    try {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 15,
          qrbox: { width: 300, height: 100 },
          aspectRatio: 4,
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
          formatsToSupport: [
            "CODE_128",
            "CODE_39",
            "CODE_93",
            "CODABAR",
            "EAN_13",
            "EAN_8",
            "UPC_A",
            "UPC_E",
            "QR_CODE",
          ],
        },
        /* verbose= */ false
      );

      const success = (decodedText, decodedResult) => {
        // Tránh scan trùng lặp
        if (decodedText && decodedText !== lastScan) {
          setLastScan(decodedText);
          let format = "Unknown";

          if (
            decodedResult &&
            decodedResult.result &&
            decodedResult.result.format
          ) {
            format = decodedResult.result.format.format_name || "Unknown";
          }

          const newResult = {
            id: Date.now(),
            barcode: decodedText,
            format: format,
            timestamp: new Date().toLocaleString("vi-VN"),
          };
          setResults((prev) => [newResult, ...prev]);
          message.success(`Scan thành công: ${decodedText} (${format})`);

          // Reset lastScan sau 1 giây
          if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current);
          }
          scanTimeoutRef.current = setTimeout(() => {
            setLastScan("");
          }, 1000);
        }
      };

      const error = (err) => {
        // Ignore errors - continue scanning
      };

      scanner.render(success, error);
      qrScannerRef.current = scanner;
      setScanning(true);
      setLoading(false);
      message.success("Camera bắt đầu");
    } catch (error) {
      console.error("Scanner error:", error);
      message.error("Lỗi: " + error.message);
      setLoading(false);
    }
  };

  // Dừng scan
  const stopScanning = () => {
    setScanning(false);
    if (qrScannerRef.current) {
      qrScannerRef.current.clear();
      qrScannerRef.current = null;
    }
    message.info("Camera đã dừng");
  };

  // Xóa kết quả
  const clearResults = () => {
    setResults([]);
    message.info("Đã xóa tất cả kết quả");
  };

  // Xuất CSV
  const exportToCSV = () => {
    if (results.length === 0) {
      message.warning("Không có dữ liệu để xuất");
      return;
    }

    let csv = "STT,Barcode,Format,Thời gian\n";
    results.forEach((item, index) => {
      csv += `${index + 1},"${item.barcode}","${item.format}","${
        item.timestamp
      }"\n`;
    });

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
    );
    element.setAttribute("download", `barcodes_${new Date().getTime()}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    message.success("Đã xuất file CSV");
  };

  return (
    <div className="barcode-scanner-container">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <CameraOutlined />
                <span>Camera Scanner</span>
              </Space>
            }
            extra={
              <Space>
                {!scanning ? (
                  <Button
                    type="primary"
                    icon={<CameraOutlined />}
                    onClick={startScanning}
                    loading={loading}
                  >
                    Bắt đầu
                  </Button>
                ) : (
                  <Button danger icon={<StopOutlined />} onClick={stopScanning}>
                    Dừng
                  </Button>
                )}
              </Space>
            }
            className="scanner-card"
          >
            <div className="video-container" id="qr-reader">
              {/* Scanner will render here */}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <span>Kết quả Scan</span>
                <Tag color="blue">{results.length}</Tag>
              </Space>
            }
            extra={
              <Space>
                <Button
                  type="primary"
                  size="small"
                  onClick={exportToCSV}
                  disabled={results.length === 0}
                >
                  Xuất CSV
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={clearResults}
                  disabled={results.length === 0}
                >
                  Xóa
                </Button>
              </Space>
            }
            className="results-card"
          >
            <div className="results-list">
              {results.length > 0 ? (
                results.map((item, index) => (
                  <div key={item.id} className="result-item">
                    <Row align="middle" gutter={16}>
                      <Col span={1} className="item-number">
                        {index + 1}
                      </Col>
                      <Col span={16}>
                        <div className="result-barcode">{item.barcode}</div>
                        <div className="result-meta">
                          <span className="result-format">
                            Format: {item.format}
                          </span>
                          <span className="result-time">
                            {" "}
                            • {item.timestamp}
                          </span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))
              ) : (
                <Empty description="Chưa có kết quả scan" />
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BarcodeScanner;
