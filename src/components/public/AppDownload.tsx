// src/components/public/AppDownload.tsx
import { Smartphone } from 'lucide-react';

const AppDownload = () => {
  return (
    <section className="download-section" id="download">
      <div className="download-container">
        <div className="download-content">
          <div className="download-icon">
            <Smartphone size={48} />
          </div>
          <h2>Tải ứng dụng AI News Analyzer</h2>
          <p>
            Phân tích tin tức thông minh, cập nhật xu hướng thời sự tức thời.
            Nhận thông báo tin tức quan trọng và tóm tắt AI độc quyền trên app.
          </p>

          <div className="download-buttons">
            <a href="#" className="download-btn ios">
              <div className="btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              </div>
              <div className="btn-text">
                <small>Tải trên</small>
                <strong>App Store</strong>
              </div>
            </a>

            <a href="#" className="download-btn android">
              <div className="btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396"/>
                </svg>
              </div>
              <div className="btn-text">
                <small>Tải trên</small>
                <strong>Google Play</strong>
              </div>
            </a>
          </div>

          <div className="download-stats">
            <div className="stat">
              <strong>50K+</strong>
              <span>Lượt tải</span>
            </div>
            <div className="stat">
              <strong>4.9⭐</strong>
              <span>Đánh giá</span>
            </div>
            <div className="stat">
              <strong>25K+</strong>
              <span>Người dùng</span>
            </div>
          </div>
        </div>

        <div className="download-image">
          <div className="phone-mockup">
            <div className="phone-screen">
              <div style={{ fontSize: '80px', textAlign: 'center', paddingTop: '60px' }}>
                📱�🤖
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>� AI News Analyzer</h3>
            <p>Ứng dụng phân tích tin tức thông minh hàng đầu Việt Nam</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Tính năng</h4>
              <a href="#">Phân tích AI</a>
              <a href="#">Tóm tắt tin tức</a>
              <a href="#">Xu hướng thời sự</a>
            </div>
            <div>
              <h4>Hỗ trợ</h4>
              <a href="#">Liên hệ</a>
              <a href="#">FAQ</a>
              <a href="#">Chính sách</a>
            </div>
            <div>
              <h4>Công ty</h4>
              <a href="#">Về chúng tôi</a>
              <a href="/login">Admin</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 AI News Analyzer. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        .download-section {
          background: var(--gray-50);
          padding: 100px 40px;
        }

        .download-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .download-content {
          max-width: 540px;
        }

        .download-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .download-content h2 {
          font-size: 40px;
          font-weight: 800;
          color: var(--gray-900);
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .download-content p {
          font-size: 18px;
          color: var(--gray-600);
          line-height: 1.7;
          margin-bottom: 36px;
        }

        .download-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }

        .download-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 24px;
          background: var(--gray-900);
          color: #fff;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .download-btn:hover {
          background: var(--gray-800);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        .btn-icon {
          font-size: 32px;
        }

        .btn-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .btn-text small {
          font-size: 11px;
          opacity: 0.8;
        }

        .btn-text strong {
          font-size: 16px;
          font-weight: 700;
        }

        .download-stats {
          display: flex;
          gap: 40px;
          padding: 24px 0;
          border-top: 1px solid var(--gray-200);
        }

        .stat {
          display: flex;
          flex-direction: column;
        }

        .stat strong {
          font-size: 24px;
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: 4px;
        }

        .stat span {
          font-size: 13px;
          color: var(--gray-500);
        }

        .phone-mockup {
          width: 300px;
          height: 600px;
          background: var(--gray-900);
          border-radius: 40px;
          padding: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          margin: 0 auto;
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 32px;
          overflow: hidden;
        }

        .site-footer {
          background: var(--gray-900);
          color: #fff;
          padding: 60px 40px 24px;
          margin-top: 80px;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 3fr;
          gap: 60px;
          margin-bottom: 40px;
        }

        .footer-brand h3 {
          font-size: 24px;
          margin-bottom: 12px;
        }

        .footer-brand p {
          color: rgba(255,255,255,0.7);
          font-size: 14px;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }

        .footer-links h4 {
          font-size: 16px;
          margin-bottom: 16px;
          font-weight: 700;
        }

        .footer-links a {
          display: block;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 10px;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: #fff;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .footer-bottom p {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
        }

        @media (max-width: 968px) {
          .download-container {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }

          .download-content {
            max-width: 100%;
          }

          .download-icon {
            margin: 0 auto 24px;
          }

          .download-buttons {
            justify-content: center;
          }

          .download-stats {
            justify-content: center;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }

          .footer-links {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>
    </section>
  );
};

export default AppDownload;
