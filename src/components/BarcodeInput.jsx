import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { Modal, message } from "antd";
import "./BarcodeInput.css";

const BarcodeInput = forwardRef(({ onCodeScanned }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const scanningRef = useRef(false);

  useImperativeHandle(ref, () => ({
    openCamera: () => {
      setIsModalOpen(true);
      setTimeout(() => {
        startScanning();
      }, 300);
    },
  }));

  const startScanning = async () => {
    try {
      if (!videoRef.current) {
        return;
      }

      codeReaderRef.current = new BrowserMultiFormatReader();
      setIsScanning(true);
      scanningRef.current = true;

      // Start scanning
      const result = await codeReaderRef.current.decodeFromVideoDevice(
        null, // Auto detect device
        videoRef.current,
        (result, err) => {
          if (result && !scanningRef.current) {
            return;
          }
          if (result) {
            const code = result.getText();
            onCodeScanned(code);
            setIsModalOpen(false);
            if (codeReaderRef.current) {
              codeReaderRef.current.reset();
            }
            setIsScanning(false);
            scanningRef.current = false;
            message.success(`Quét thành công: ${code}`);
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error(err);
          }
        }
      );
    } catch (error) {
      console.error("Lỗi khởi tạo scanner:", error);
      message.error(
        "Không thể khởi tạo camera. Vui lòng kiểm tra quyền truy cập!"
      );
      setIsScanning(false);
      scanningRef.current = false;
    }
  };

  const handleCloseModal = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    setIsScanning(false);
    scanningRef.current = false;
    setIsModalOpen(false);
  };

  useEffect(() => {
    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  return (
    <>
      <Modal
        title="Quét mã barcode"
        open={isModalOpen}
        onCancel={handleCloseModal}
        width={500}
        footer={null}
        centered
      >
        <div style={{ width: "100%", overflow: "hidden" }}>
          <video
            ref={videoRef}
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
            }}
          />
        </div>
      </Modal>
    </>
  );
});

BarcodeInput.displayName = "BarcodeInput";
export default BarcodeInput;
