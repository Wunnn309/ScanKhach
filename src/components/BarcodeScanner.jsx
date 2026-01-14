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
    setScanning(true); // Set trước để render element

    // Delay để element được render trước
    setTimeout(() => {
      try {
        const scanner = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 10, // Lower FPS for better Android compatibility
            qrbox: { width: 300, height: 300 }, // Smaller box for faster detection
            aspectRatio: 4,
            rememberLastUsedCamera: true,
            showTorchButtonIfSupported: true,
            // More flexible settings for Android
            videoConstraints: {
              facingMode: { ideal: "environment" }, // Try back, fallback to any
              width: { min: 320, ideal: 640, max: 1280 },
              height: { min: 240, ideal: 480, max: 720 },
            },
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
            console.log("Scan successful:", decodedText, format);
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
          // Log errors for debugging but continue scanning
          console.warn("QR Scanner error:", err);
        };

        scanner.render(success, error);
        qrScannerRef.current = scanner;
        setLoading(false);
        message.success("Camera bắt đầu");
      } catch (error) {
        console.error("Scanner error:", error);

        // Better error messages for Android
        let errorMsg = "Lỗi: " + error.message;
        if (error.message && error.message.includes("permission")) {
          errorMsg = "Bị từ chối quyền truy cập camera. Vui lòng cấp quyền!";
        } else if (error.message && error.message.includes("camera")) {
          errorMsg = "Không tìm thấy camera hoặc camera đang bị sử dụng!";
        }

        message.error(errorMsg);
        setScanning(false);
        setLoading(false);
      }
    }, 500); // Delay 500ms để element được render
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
      {scanning ? (
        // Full screen camera mode
        <>
          <div className="video-container" id="qr-reader">
            {/* Scanner renders here */}
          </div>
          <div
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
              zIndex: 1000,
            }}
          >
            <Button
              danger
              size="large"
              icon={<StopOutlined />}
              onClick={stopScanning}
              style={{
                fontSize: "16px",
                padding: "10px 20px",
                height: 50,
                width: 50,
                borderRadius: "50%",
              }}
            />
          </div>
        </>
      ) : (
        // Normal mode with results
        <Row gutter={[16, 16]} style={{ padding: "20px" }}>
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
                  <Button
                    type="primary"
                    icon={<CameraOutlined />}
                    onClick={startScanning}
                    loading={loading}
                  >
                    Bắt đầu
                  </Button>
                </Space>
              }
              className="scanner-card"
            >
              <div
                style={{
                  width: "100%",
                  background: "#000",
                  borderRadius: "8px",
                  overflow: "hidden",
                  minHeight: "400px",
                }}
              >
                Nhấn "Bắt đầu" để bật camera
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
      )}
    </div>
  );
};

export default BarcodeScanner;
