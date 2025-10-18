export const API_CONFIG = {
  // 🎯 API URL thực tế từ localhost:5257
  BASE_URL: 'https://gateway-mobile.devnest.io.vn',
  

  API_KEY: '',
  
  // ⏱️ Timeout settings
  TIMEOUT: 10000, // 10 seconds
  
  // 🔄 Retry settings
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 secondQ
};

// 📋 **SWAGGER ENDPOINTS MAPPING:**
// Kiểm tra và đảm bảo các endpoints này khớp với Swagger docs của bạn
export const API_ENDPOINTS = {

  // 👥 USERS
  USERS: {
    LIST: '/api/account',                   // GET /users?page=1&limit=10
    DETAIL: '/api/account/{id}',           // GET /users/123
    CREATE: '/api/account',                // POST /users
    UPDATE: '/api/account/{id}',           // PUT /users/123
    DELETE: '/api/account/{id}',           // DELETE /users/123
    TOGGLE_STATUS: '/api/account/{id}/toggle-status', // PATCH /users/123/toggle-status
  },
  
  // 🔐 AUTHENTICATION
  AUTH: {
    LOGIN: '/api/auth/auth/login',       // POST /auth/admin/login
    VERIFY: '/api/auth/verify',           // GET /auth/verify
    REFRESH: '/api/auth/refresh',         // POST /auth/refresh
    REFRESH_TOKEN: '/api/auth/refresh-token', // POST /auth/refresh-token
  },
  
  // 📊 DASHBOARD
  DASHBOARD: {
    STATS: '/dashboard/stats',        // GET /dashboard/stats
  }
};

// 🌐 **REQUEST HEADERS CONFIGURATION:**
export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  // 🔑 JWT Token từ localStorage (tự động)
  ...(localStorage.getItem('admin_token') && { 
    'Authorization': `Bearer ${localStorage.getItem('admin_token')}` 
  }),
  // 🔐 API Key (chỉ khi có)
  ...(API_CONFIG.API_KEY && { 'X-API-Key': API_CONFIG.API_KEY }),
});

// 🎯 **QUICK SETUP CHECKLIST:**
// □ 1. Thay đổi BASE_URL thành URL Swagger API
// □ 2. Kiểm tra endpoints mapping với Swagger docs  
// □ 3. Cập nhật API_KEY nếu cần
// □ 4. Test connection với mock data
// □ 5. Switch sang real API khi ready

export default API_CONFIG;