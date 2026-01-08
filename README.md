# ScanKhach - Barcode Scanner Application

Ứng dụng quét mã barcode 128 bằng camera điện thoại sử dụng **html5-qrcode**.

## 🚀 Tính năng

- ✅ Quét mã barcode 128 real-time từ camera điện thoại
- ✅ Hỗ trợ nhiều định dạng: CODE_128, CODE_39, EAN_13, UPC, QR Code
- ✅ Hiển thị danh sách kết quả quét
- ✅ Xuất dữ liệu ra file CSV
- ✅ Giao diện responsive (mobile-first)
- ✅ Xử lý tránh quét trùng lặp

## 📋 Yêu cầu

- Node.js 14+
- npm hoặc yarn
- Trình duyệt hỗ trợ WebRTC (Chrome, Firefox, Edge, Safari)
- Quyền truy cập camera

## 💻 Cài đặt

### 1. Clone hoặc tải dự án

```bash
cd ScanKhach
```

### 2. Cài đặt dependencies

```bash
npm install
```

Hoặc nếu dùng yarn:

```bash
yarn install
```

### 3. Chạy ứng dụng development

```bash
npm run dev
```

Ứng dụng sẽ tự động mở tại: `http://localhost:5173`

### 4. Build cho production

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

## 📦 Dependencies

- **React** 18.2.0 - Framework UI
- **html5-qrcode** 2.3.4 - Thư viện quét barcode
- **Ant Design** 5.26.7 - UI components
- **Vite** 2.9.9 - Build tool
- **React Router DOM** 7.7.1 - Routing

## 🎯 Cách sử dụng

### Quét mã barcode

1. **Bắt đầu camera**: Nhấn nút "Bắt đầu"
2. **Cho phép camera**: Cấp quyền truy cập camera khi trình duyệt yêu cầu
3. **Hướng camera**: Hướng camera vào mã barcode
4. **Quét tự động**: Mã barcode sẽ tự động được quét khi camera nhìn thấy
5. **Kết quả**: Kết quả hiển thị trong danh sách bên phải

### Quản lý kết quả

- **Xem chi tiết**: Mỗi kết quả hiển thị mã barcode, thời gian quét, định dạng
- **Xóa kết quả**: Nhấn nút "Xóa" để xóa tất cả kết quả
- **Xuất CSV**: Nhấn "Xuất CSV" để tải file dữ liệu

## 📱 Tối ưu Mobile

- ✅ Layout responsive - tự động thích ứng với màn hình nhỏ
- ✅ Camera sau (back camera) trên mobile
- ✅ Touch-friendly buttons
- ✅ Hiển thị đầy đủ và tối ưu trên điện thoại

## 🔧 Cấu hình

### Thay đổi định dạng barcode

Mở file `src/components/BarcodeScanner.jsx` và sửa:

```javascript
const hints = new Map();
hints.set(DecodeHintType.POSSIBLE_FORMATS, [
  BarcodeFormat.CODE_128,
  BarcodeFormat.QR_CODE, // Thêm QR code
  // ... các định dạng khác
]);
```

### Các định dạng barcode được hỗ trợ

- CODE_128 (mặc định)
- CODE_39
- CODE_93
- EAN_8
- EAN_13
- QR_CODE
- DATA_MATRIX
- PDF_417
- v.v...

## ⚙️ Tính năng nâng cao

### Giới hạn thời gian giữa các lần quét

Sửa timeout (hiện tại 1 giây):

```javascript
scanTimeoutRef.current = setTimeout(() => {
  setLastScan("");
}, 1000); // 1000ms = 1 giây
```

### Tùy chỉnh constraints camera

```javascript
const constraints = {
  video: {
    facingMode: "environment", // 'user' cho camera trước
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
};
```

## 🐛 Xử lý lỗi thường gặp

| Lỗi                                  | Giải pháp                                            |
| ------------------------------------ | ---------------------------------------------------- |
| "Vui lòng cấp quyền truy cập camera" | Cho phép camera trong cài đặt trình duyệt            |
| "Không tìm thấy camera"              | Kiểm tra xem thiết bị có camera không                |
| Camera không hiển thị                | Kiểm tra quyền truy cập camera, thử trình duyệt khác |
| Quét không chính xác                 | Đảm bảo ánh sáng đủ, mã barcode rõ ràng              |

## 📂 Cấu trúc dự án

```
ScanKhach/
├── src/
│   ├── components/
│   │   ├── BarcodeScanner.jsx       # Component quét barcode chính
│   │   ├── BarcodeScanner.css       # Styling scanner
│   │   ├── BarcodeScannerPage.jsx   # Trang scanner
│   │   └── BarcodeScannerPage.css   # Styling trang
│   ├── App.jsx                      # App chính
│   ├── App.css                      # Styling app
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── vite.config.js                   # Vite config
└── README.md                        # File này
```

## 🎨 Tùy chỉnh giao diện

### Đổi màu chính

Sửa file `App.css`:

```css
.app-header {
  background: linear-gradient(90deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}
```

### Đổi animatio scan

Sửa file `BarcodeScanner.css`:

```css
@keyframes scan {
  0%,
  100% {
    top: 0;
  }
  50% {
    top: 100px; /* Tăng để vạch scan dài hơn */
  }
}
```

## 📊 Export dữ liệu

File CSV được export với cấu trúc:

```
STT,Barcode,Format,Thời gian
1,"123456789","CODE_128","08/01/2026 14:30:45"
```

## 🔒 Bảo mật

- Tất cả dữ liệu quét lưu trữ cục bộ trên trình duyệt
- Không gửi dữ liệu lên server
- Không lưu trữ dữ liệu liên tục

## 📝 Licence

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại

## 🤝 Hỗ trợ

Nếu gặp vấn đề:

1. Kiểm tra console (F12) để xem lỗi
2. Thử làm mới trang (Ctrl+R)
3. Xóa cache và cookie
4. Thử trình duyệt khác

## 🚀 Cập nhật tương lai

- [ ] Hỗ trợ quét nhiều định dạng barcode
- [ ] Lưu trữ dữ liệu offline (IndexedDB)
- [ ] Tích hợp với backend API
- [ ] Báo cáo chi tiết dạng biểu đồ
- [ ] Hỗ trợ đa ngôn ngữ
- [ ] Chế độ tối (Dark mode)

---

**Tạo bởi**: ScanKhach Team  
**Phiên bản**: 1.0.0  
**Cập nhật**: January 2026
