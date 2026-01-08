import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, BarcodeFormat } from "@zxing/browser";
import { DecodeHintType } from "@zxing/library";
import {
  Button,
  message,
  Spin,
  Empty,
  Card,
  Row,
  Col,
  Input,
  Space,
  Tag,
} from "antd";
import {
  CameraOutlined,
  StopOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./BarcodeScanner.css";

const BarcodeScanner = () => {
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState([]);
  const [codeReader, setCodeReader] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastScan, setLastScan] = useState("");
  const scanTimeoutRef = useRef(null);

  // Khởi tạo BarcodeReader
  useEffect(() => {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_128]);

    const reader = new BrowserMultiFormatReader(hints);
    setCodeReader(reader);

    return () => {
      if (reader) {
        reader.reset();
      }
    };
  }, []);

  // Hàm bắt đầu scan
  const startScanning = async () => {
    if (!codeReader) return;

    setLoading(true);
    try {
      // Kiểm tra xem browser hỗ trợ mediaDevices không
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        message.error(
          "Trình duyệt của bạn không hỗ trợ camera. Vui lòng dùng Chrome, Firefox hoặc Edge."
        );
        setLoading(false);
        return;
      }

      const constraints = {
        video: {
          facingMode: "environment", // Camera sau
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setScanning(true);
        scanBarcodes();
      }
    } catch (error) {
      if (error.name === "NotAllowedError") {
        message.error("Vui lòng cấp quyền truy cập camera");
      } else if (error.name === "NotFoundError") {
        message.error("Không tìm thấy camera");
      } else {
        message.error("Lỗi khi bật camera: " + error.message);
      }
      setLoading(false);
    }
  };

  // Hàm scan barcode
  const scanBarcodes = async () => {
    if (!videoRef.current || !codeReader || !scanning) return;

    try {
      const result = await codeReader.decodeFromVideoElement(videoRef.current);
      if (result) {
        const barcodeData = result.getText();

        // Tránh scan trùng lặp trong 1 giây
        if (barcodeData !== lastScan) {
          setLastScan(barcodeData);
          addResult(barcodeData, result.getBarcodeFormat());
          message.success(`Scan thành công: ${barcodeData}`);

          // Reset lastScan sau 1 giây
          scanTimeoutRef.current = setTimeout(() => {
            setLastScan("");
          }, 1000);
        }
      }
    } catch (error) {
      // Không log error vì có thể camera chưa sẵn sàng
    }

    // Tiếp tục scan
    if (scanning && videoRef.current) {
      requestAnimationFrame(scanBarcodes);
    }
  };

  // Hàm thêm kết quả scan
  const addResult = (barcode, format) => {
    const newResult = {
      id: Date.now(),
      barcode,
      format: format,
      timestamp: new Date().toLocaleString("vi-VN"),
    };
    setResults((prev) => [newResult, ...prev]);
  };

  // Hàm dừng scan
  const stopScanning = () => {
    setScanning(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setLoading(false);
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }
  };

  // Hàm xóa kết quả
  const clearResults = () => {
    setResults([]);
    message.info("Đã xóa tất cả kết quả");
  };

  // Hàm xuất CSV
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
            <div className="video-container">
              {scanning ? (
                <>
                  <video ref={videoRef} className="scanner-video" playsInline />
                  <div className="scan-overlay">
                    <div className="scan-line"></div>
                  </div>
                </>
              ) : (
                <Empty
                  description="Camera chưa được bật"
                  style={{ paddingTop: "100px" }}
                />
              )}
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
                        <div className="result-time">{item.timestamp}</div>
                      </Col>
                      <Col span={7}>
                        <Tag color="green">{item.format}</Tag>
                      </Col>
                    </Row>
                  </div>
                ))
              ) : (
                <Empty description="Chưa có kết quả" />
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BarcodeScanner;
