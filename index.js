// // src/app.js
// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config';
// import { errorHandler } from './src/middlewares/errorHandler.js';
// import { requestLogger } from './src/middlewares/requestLogger.js';
// import userRoutes from './src/routes/userRoutes.js'; // Import user routes
// import UserBotController from './src/controllers/userBotController.js';
// import path from "node:path";

// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(express.json());
// app.use(requestLogger); // Log all requests
// app.use('/smax/ai', userRoutes); // Use user routes

// app.use('/images', express.static(path.join(__dirname, '../')));
// app.use(express.static(__dirname));
// app.use(express.static('public'));

// // Cấu hình CORS
// const corsOptions = {
//     origin: ["http://localhost:3000","https://37ba-118-70-15-19.ngrok-free.app", process.env.WEB_URL],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Phương thức được phép
//     allowedHeaders: ["Content-Type", "Authorization"], // Các header được phép
//     credentials: true, // Cho phép cookie nếu cần
// };

// app.use(cors(corsOptions));

// // Error Handling (Must be the last middleware)
// app.use(errorHandler);

// // // Initialize UserController
// const userController = new UserBotController();
// userController.initialize();

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

import fs from "node:fs"; // Import module fs để đọc/ghi file
import { Zalo } from "zca-js"; // Import thư viện zca-js
import express from "express";
import path from "path";
const app = express();
const zalo = new Zalo();
const __dirname = path.resolve();
const PORT = 3000;
// Router để hiển thị ảnh QR
app.get("/qr", (req, res) => {
  const imagePath = path.join(__dirname, "qr.png"); // Đường dẫn đến file ảnh
  res.sendFile(imagePath); // Gửi file ảnh về client
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
(async () => {
  try {
    // // Đăng nhập bằng QR
    const api = await zalo.loginQR();
    console.log("Đăng nhập thành công!");

    // // Lấy thông tin đăng nhập từ context của API
    const context = api.getContext();
    const credentials = {
      cookie: context.cookie.toJSON()?.cookies, // Lấy cookie từ context
      imei: context.imei, // Lấy imei
      userAgent: context.userAgent, // Lấy userAgent
    };

    fs.writeFileSync("./cookies.json", JSON.stringify(credentials, null, 4));
    console.log("Thông tin đăng nhập đã được lưu vào cookies.json!");
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
  }
})();
