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

  // Request camera permission for Android
  const requestCameraPermission = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      // Close the stream immediately, we just needed to request permission
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error("Camera permission error:", error);
      return false;
    }
  };

  const startScanning = async () => {
    try {
      // Request camera permission first on Android
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        message.error(
          "Vui lòng cấp quyền truy cập camera. Kiểm tra cài đặt điện thoại!"
        );
        setIsScanning(false);
        scanningRef.current = false;
        setIsModalOpen(false);
        return;
      }

      if (!videoRef.current) {
        return;
      }

      codeReaderRef.current = new BrowserMultiFormatReader();
      setIsScanning(true);
      scanningRef.current = true;

      // Start scanning with proper constraints for Android
      await codeReaderRef.current.decodeFromVideoDevice(
        null, // Auto detect device
        videoRef.current,
        (result, err) => {
          if (result && !scanningRef.current) {
            return;
          }
          if (result) {
            const code = result.getText();
            console.log("Barcode detected:", code);
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
            console.warn("Scan error:", err.message);
          }
        }
      );
    } catch (error) {
      console.error("Lỗi khởi tạo scanner:", error);

      // More specific error messages for Android
      let errorMsg =
        "Không thể khởi tạo camera. Vui lòng kiểm tra quyền truy cập!";
      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        errorMsg =
          "Bị từ chối quyền truy cập camera. Vui lòng cấp quyền trong cài đặt!";
      } else if (
        error.name === "NotFoundError" ||
        error.name === "DevicesNotFoundError"
      ) {
        errorMsg = "Không tìm thấy camera. Kiểm tra thiết bị của bạn!";
      }

      message.error(errorMsg);
      setIsScanning(false);
      scanningRef.current = false;
      setIsModalOpen(false);
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
            autoPlay={true}
            playsInline={true}
            muted={true}
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
              transform: "scaleX(-1)", // Mirror for selfie cam if needed
            }}
          />
        </div>
      </Modal>
    </>
  );
});

BarcodeInput.displayName = "BarcodeInput";
export default BarcodeInput;
