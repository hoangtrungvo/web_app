// API Configuration Instructions
// Hướng dẫn cấu hình API cho Pet Store Admin System

## 🎯 TÌNH TRẠNG API INTEGRATION:

### ✅ ĐÃ HOÀN THÀNH:

#### 1. **API Service Layer** (`src/services/api.ts`)
- ✅ Complete REST API functions cho tất cả modules
- ✅ Authentication với JWT token management  
- ✅ Error handling và response parsing
- ✅ TypeScript type safety hoàn chỉnh

#### 2. **Custom Hooks** (`src/hooks/`)
- ✅ `useOrders`: Orders management với mock data fallback
- ✅ `useProducts`: Products CRUD với mock data fallback  
- ✅ `useUsers`: Users management với mock data fallback
- ✅ Loading states, error handling, pagination support

#### 3. **Components Integration**
- ✅ `OrderManagement`: Đã tích hợp hoàn chỉnh với useOrders hook
- 🔄 `ProductManagement`: Cần tích hợp useProducts hook
- 🔄 `UserManagement`: Cần tích hợp useUsers hook

### 🚀 CÁCH SỬ DỤNG:

#### **1. Cấu hình Backend URL:**
```typescript
// Trong src/services/api.ts, thay đổi:
const BASE_URL = 'http://localhost:5000/api'; // TODO: Thay bằng URL backend thực tế
```

#### **2. Sử dụng trong Components:**
```typescript
// Ví dụ trong ProductManagement.tsx
import { useProducts } from '../hooks';

const ProductManagement = () => {
  const { 
    products, 
    loading, 
    error, 
    createProduct, 
    updateProduct, 
    deleteProduct 
  } = useProducts();

  // Component sẽ tự động:
  // - Load dữ liệu từ API khi mount
  // - Fallback về mock data nếu API không khả dụng
  // - Hiển thị loading và error states
};
```

#### **3. Authentication Flow:**
```typescript
// Login sẽ tự động lưu token:
const { token, user } = await authApi.login(username, password);
// Token được lưu vào localStorage và dùng cho các API calls

// Logout sẽ xóa token:
authApi.logout();
```

### 🔧 CẦN LÀM TIẾP:

#### **1. Tích hợp ProductManagement:**
- Import `useProducts` hook
- Thay thế mock data array bằng hook data
- Update event handlers để sử dụng API functions

#### **2. Tích hợp UserManagement:**
- Import `useUsers` hook  
- Thay thế mock data array bằng hook data
- Update event handlers để sử dụng API functions

#### **3. Backend API Requirements:**
Khi tạo backend, đảm bảo các endpoints sau:

**Products:**
- `GET /api/products?page=1&limit=50` - List products with pagination
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product  
- `DELETE /api/products/:id` - Delete product

**Users:**
- `GET /api/users?page=1&limit=50` - List users with pagination
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/toggle-status` - Toggle user active status

**Orders:**
- `GET /api/orders?page=1&limit=50` - List orders with pagination
- `GET /api/orders/:id` - Get order by ID  
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/orders/stats` - Get order statistics

**Auth:**
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### 🎯 HIỆN TẠI:
- Orders Management: **100% hoàn thành** ✅
- Products Management: **50% hoàn thành** (cần tích hợp hook)
- Users Management: **50% hoàn thành** (cần tích hợp hook)
- API Service: **100% hoàn thành** ✅
- Custom Hooks: **100% hoàn thành** ✅

### 💡 LỢI ÍCH:
1. **Graceful Degradation**: App hoạt động với mock data khi API chưa sẵn sàng
2. **Type Safety**: Full TypeScript support cho tất cả API calls
3. **Error Handling**: Automatic error handling và fallback
4. **Loading States**: Built-in loading indicators
5. **Easy Integration**: Chỉ cần thay đổi BASE_URL khi có backend

Bạn có thể **test ngay bây giờ** với mock data, và khi có backend chỉ cần thay đổi URL!