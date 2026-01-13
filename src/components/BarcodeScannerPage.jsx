import React, { useState, useRef, useEffect } from "react";
import { Avatar, Button, Checkbox, message } from "antd";
import { UserOutlined, CameraOutlined } from "@ant-design/icons";
import BarcodeInput from "./BarcodeInput";
import "./BarcodeScannerPage.css";
import { getCustomerByCode } from "../api/customer";
import { use } from "react";
import { code } from "framer-motion/client";

const BarcodeScannerPage = () => {
  const [currentPage, setCurrentPage] = useState("checklist");
  const [codeInput, setCodeInput] = useState("");
  const barcodeInputRef = useRef(null);
  const avatarUrl = `https://hundreds-fit-surgeon-dat.trycloudflare.com/images_nhanvien/${codeInput}.jpg`;
  const [healthStatus, setHealthStatus] = useState({
    good: false,
    notGood: false,
    symptoms: {
      stomachache: false,
      diarrhea: false,
      nausea: false,
      cough: false,
      fever: false,
      other: false,
    },
  });

  const [personalItems, setPersonalItems] = useState({
    noBring: false,
    bring: false,
    items: {
      phone: false,
      wallet: false,
      glasses: false,
      notebook: false,
      labInstrument: false,
      other: false,
    },
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      if (codeInput.trim() === "") return;
      try {
        const customerData = await getCustomerByCode(codeInput.trim());
        console.log("Customer Data:", customerData);
        message.success(`Customer found: ${customerData.name}`);
      } catch (error) {
        message.error("Customer not found or error occurred");
      }
    };
    fetchCustomer();
  }, [codeInput]);
  const handleHealthStatusChange = (field) => {
    setHealthStatus((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSymptomChange = (symptom) => {
    setHealthStatus((prev) => ({
      ...prev,
      symptoms: {
        ...prev.symptoms,
        [symptom]: !prev.symptoms[symptom],
      },
    }));
  };

  const handlePersonalItemChange = (field) => {
    setPersonalItems((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleItemChange = (item) => {
    setPersonalItems((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [item]: !prev.items[item],
      },
    }));
  };

  const handleFinish = () => {
    message.success("チェックリストが送信されました");
    // ここでデータを送信できます
  };

  const handleScanCamera = () => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.openCamera();
    }
  };

  const handleCodeScanned = (code) => {
    setCodeInput(code);
    message.success(`Quét thành công: ${code}`);
  };

  return (
    <div className="barcode-scanner-page">
      {/* Main Content */}
      <div className="main-content">
        <div className="checklist-container">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-top">
              <div className="code-input-section">
                <span className="input-label">Focus & scan</span>
                <div className="input-group">
                  <input
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Enter code..."
                    className="code-input"
                  />
                  <button
                    className="focus-scan-btn barcode-scan-button"
                    onClick={handleScanCamera}
                  >
                    <CameraOutlined />
                  </button>
                  <BarcodeInput
                    ref={barcodeInputRef}
                    onCodeScanned={handleCodeScanned}
                  />
                </div>
              </div>

              <Avatar
                shape="square"
                style={{ height: "130px", width: "120px" }}
                src={avatarUrl}
                icon={<UserOutlined />}
              />
            </div>

            <div className="sidebar-menu">
              <div className="menu-section">
                <div className="menu-title">開始</div>
                <div className="menu-subtitle">(Bắt đầu/ Start)</div>
              </div>
              <div className="menu-section">
                <div className="menu-title">終了</div>
                <div className="menu-subtitle">(Kết thúc/ End)</div>
              </div>
              <div className="menu-section">
                <div className="menu-title">訪問記歴</div>
                <div className="menu-subtitle">
                  (Lịch sử tham quan/ Visit history)
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="content-area">
            <h1 className="page-title">
              訪問チェックリスト (Khai báo vào xưởng/ Pre-visit checklist)
            </h1>

            {/* Health Status Section */}
            <div className="checklist-section">
              <h2 className="section-title">
                1. 健康状態 (Sức khỏe/ Health information):
              </h2>

              <div className="status-options">
                <label className="checkbox-label">
                  <Checkbox
                    checked={healthStatus.good}
                    onChange={() => handleHealthStatusChange("good")}
                  />
                  <span>良好 (Khỏe/ Good)</span>
                </label>
                <label className="checkbox-label">
                  <Checkbox
                    checked={healthStatus.notGood}
                    onChange={() => handleHealthStatusChange("notGood")}
                  />
                  <span>不良 (Không khỏe/ Not good)</span>
                </label>
              </div>

              <div className="symptoms-grid">
                <label className="symptom-box">
                  <Checkbox
                    checked={healthStatus.symptoms.stomachache}
                    onChange={() => handleSymptomChange("stomachache")}
                  />
                  <div className="symptom-icon">🤢</div>
                  <span className="symptom-label">腹痛</span>
                  <span className="symptom-text">Dau bung</span>
                  <span className="symptom-text">Stomachache</span>
                </label>

                <label className="symptom-box">
                  <Checkbox
                    checked={healthStatus.symptoms.diarrhea}
                    onChange={() => handleSymptomChange("diarrhea")}
                  />
                  <div className="symptom-icon">🚽</div>
                  <span className="symptom-label">下痢</span>
                  <span className="symptom-text">Tiêu chảy</span>
                  <span className="symptom-text">Diarrhea</span>
                </label>

                <label className="symptom-box">
                  <Checkbox
                    checked={healthStatus.symptoms.nausea}
                    onChange={() => handleSymptomChange("nausea")}
                  />
                  <div className="symptom-icon">😵</div>
                  <span className="symptom-label">吐き気</span>
                  <span className="symptom-text">Buồn nôn</span>
                  <span className="symptom-text">Nausea</span>
                </label>

                <label className="symptom-box">
                  <Checkbox
                    checked={healthStatus.symptoms.cough}
                    onChange={() => handleSymptomChange("cough")}
                  />
                  <div className="symptom-icon">😷</div>
                  <span className="symptom-label">咳</span>
                  <span className="symptom-text">Ho</span>
                  <span className="symptom-text">Cough</span>
                </label>

                <label className="symptom-box">
                  <Checkbox
                    checked={healthStatus.symptoms.fever}
                    onChange={() => handleSymptomChange("fever")}
                  />
                  <div className="symptom-icon">🌡️</div>
                  <span className="symptom-label">熱</span>
                  <span className="symptom-text">Sốt</span>
                  <span className="symptom-text">Fever</span>
                </label>

                <label className="symptom-box">
                  <Checkbox
                    checked={healthStatus.symptoms.other}
                    onChange={() => handleSymptomChange("other")}
                  />
                  <div className="symptom-icon">😁</div>
                  <span className="symptom-label">その他</span>
                  <span className="symptom-text">Khác</span>
                  <span className="symptom-text">Other</span>
                </label>
              </div>
            </div>

            {/* Personal Items Section */}
            <div className="checklist-section">
              <h2 className="section-title">
                2. 個人的な持ち込み物 (Vật dụng/ Personal things you bring):
              </h2>

              <div className="status-options">
                <label className="checkbox-label">
                  <Checkbox
                    checked={personalItems.noBring}
                    onChange={() => handlePersonalItemChange("noBring")}
                  />
                  <span>なし (Không có/No)</span>
                </label>
                <label className="checkbox-label">
                  <Checkbox
                    checked={personalItems.bring}
                    onChange={() => handlePersonalItemChange("bring")}
                  />
                  <span>あり (Có/ Yes)</span>
                </label>
              </div>

              <div className="items-grid">
                <label className="item-box">
                  <Checkbox
                    checked={personalItems.items.phone}
                    onChange={() => handleItemChange("phone")}
                  />
                  <div className="item-icon">📱</div>
                  <span className="item-label">携帯電話</span>
                  <span className="item-text">Điện thoại</span>
                  <span className="item-text">Phone</span>
                </label>

                <label className="item-box">
                  <Checkbox
                    checked={personalItems.items.wallet}
                    onChange={() => handleItemChange("wallet")}
                  />
                  <div className="item-icon">👛</div>
                  <span className="item-label">財布</span>
                  <span className="item-text">Ví</span>
                  <span className="item-text">Wallet</span>
                </label>

                <label className="item-box">
                  <Checkbox
                    checked={personalItems.items.glasses}
                    onChange={() => handleItemChange("glasses")}
                  />
                  <div className="item-icon">👓</div>
                  <span className="item-label">眼鏡</span>
                  <span className="item-text">Mắt kính</span>
                  <span className="item-text">Glass</span>
                </label>

                <label className="item-box">
                  <Checkbox
                    checked={personalItems.items.notebook}
                    onChange={() => handleItemChange("notebook")}
                  />
                  <div className="item-icon">📓</div>
                  <span className="item-label">ノート</span>
                  <span className="item-text">Bút/sổ tay</span>
                  <span className="item-text">Pen/Notebook</span>
                </label>

                <label className="item-box">
                  <Checkbox
                    checked={personalItems.items.labInstrument}
                    onChange={() => handleItemChange("labInstrument")}
                  />
                  <div className="item-icon">🔬</div>
                  <span className="item-label">実験機器</span>
                  <span className="item-text">Dụ cụ lab</span>
                  <span className="item-text">Lab Instru</span>
                </label>

                <label className="item-box">
                  <Checkbox
                    checked={personalItems.items.other}
                    onChange={() => handleItemChange("other")}
                  />
                  <div className="item-icon">😁</div>
                  <span className="item-label">その他</span>
                  <span className="item-text">Khác</span>
                  <span className="item-text">Other</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Finish Button */}
        <div className="footer-section">
          <button className="finish-btn" onClick={handleFinish}>
            終了 (Hoàn thành/ Finish)
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerPage;
