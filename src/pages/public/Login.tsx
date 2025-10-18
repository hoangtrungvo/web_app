// src/pages/public/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading, error: authError, loginError, clearError } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when form changes
  useEffect(() => {
    if (localError) setLocalError("");
    if (authError) clearError();
  }, [form.username, form.password, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    // Validation
    if (!form.username || !form.password) {
      setLocalError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);

    try {
      const success = await login({
        username: form.username,
        password: form.password,
      });

      if (success) {
        navigate("/admin");
      } else {
        alert(loginError);
      }
      // Error will be handled by authError state from useAuth hook
    } catch (error) {
      alert(loginError);
      setLocalError("Đã xảy ra lỗi không mong muốn");
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🐾</div>
          <h1>Admin</h1>
          <p>Đăng nhập để quản lý hệ thống</p>
        </div>

        {displayError && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="admin"
              disabled={loading || authLoading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              disabled={loading || authLoading}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-primary btn-block" disabled={loading || authLoading}>
            {loading || authLoading ? (
              <>
                <div className="spinner-small" />
                Đang đăng nhập...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Đăng nhập
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="demo-info">
            <strong>🧪 Tài khoản test:</strong>
            <br />
            <strong>Admin:</strong> admin_test / admin123
            <br />
            <strong>Staff:</strong> staff_test / staff123
            <br />
            <strong>User:</strong> user_test / user123 (không có quyền)
          </p>
          <a href="/" className="back-home">
            ← Về trang chủ
          </a>
        </div>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .login-card {
          background: #fff;
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          margin: 0 auto 20px;
        }

        .login-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: 8px;
        }

        .login-header p {
          color: var(--gray-500);
          font-size: 14px;
        }

        .alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 14px;
        }

        .alert-error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .login-form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: var(--gray-700);
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid var(--gray-200);
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group input:disabled {
          background-color: var(--gray-50);
          cursor: not-allowed;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 14px 20px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .btn-block {
          width: 100%;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .login-footer {
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid var(--gray-200);
        }

        .demo-info {
          background: #eff6ff;
          color: #1e40af;
          padding: 16px;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .demo-info strong {
          font-weight: 700;
        }

        .back-home {
          color: var(--primary);
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .back-home:hover {
          color: var(--primary-dark);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 32px 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
