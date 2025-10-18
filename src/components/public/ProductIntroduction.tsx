// src/components/public/ProductIntroduction.tsx
import { Newspaper, Brain, TrendingUp, Shield, Zap } from 'lucide-react';

const ProductIntroduction = () => {
  const features = [
    {
      icon: <Brain size={32} />,
      title: 'AI Phân tích thông minh',
      description: 'Công nghệ AI tiên tiến phân tích và tóm tắt tin tức một cách chính xác'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Xu hướng thời sự',
      description: 'Theo dõi và phân tích xu hướng tin tức nóng nhất trong thời gian thực'
    },
    {
      icon: <Shield size={32} />,
      title: 'Thông tin đáng tin cậy',
      description: 'Lọc và xác minh nguồn tin, đảm bảo độ chính xác cao'
    },
    {
      icon: <Zap size={32} />,
      title: 'Cập nhật tức thời',
      description: 'Nhận thông báo tin tức quan trọng ngay khi có thông tin mới'
    }
  ];

  return (
    <section className="intro-section">
      {/* Hero */}
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            � AI News Analyzer
          </h1>
          <h2 className="hero-subtitle">
            Phân tích tin tức thông minh với AI
          </h2>
          <p className="hero-description">
            Ứng dụng phân tích và tóm tắt tin tức sử dụng công nghệ AI tiên tiến.
            Theo dõi xu hướng, lọc tin chính thống, cập nhật tức thời mọi lúc mọi nơi.
          </p>
          <div className="hero-buttons">
            <a href="#download" className="btn-hero primary">
              Tải ứng dụng ngay
            </a>
            <a href="/login" className="btn-hero secondary">
              Đăng nhập Admin
            </a>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-image-placeholder">
            <span style={{ fontSize: '120px' }}>�🤖</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="features">
        <div className="container">
          <h3 className="features-title">Tại sao chọn AI News Analyzer?</h3>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .intro-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
        }

        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 40px;
          min-height: 600px;
        }

        .hero-content {
          max-width: 540px;
        }

        .hero-title {
          font-size: 56px;
          font-weight: 800;
          margin-bottom: 16px;
          line-height: 1.1;
          letter-spacing: -1px;
        }

        .hero-subtitle {
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 20px;
          opacity: 0.95;
        }

        .hero-description {
          font-size: 18px;
          line-height: 1.7;
          opacity: 0.9;
          margin-bottom: 36px;
        }

        .hero-buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-hero {
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-hero.primary {
          background: #fff;
          color: #667eea;
        }

        .btn-hero.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }

        .btn-hero.secondary {
          background: rgba(255,255,255,0.2);
          color: #fff;
          border: 2px solid rgba(255,255,255,0.4);
        }

        .btn-hero.secondary:hover {
          background: rgba(255,255,255,0.3);
          border-color: rgba(255,255,255,0.6);
        }

        .hero-image {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-image-placeholder {
          width: 400px;
          height: 400px;
          background: rgba(255,255,255,0.15);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .features {
          background: #fff;
          padding: 80px 40px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .features-title {
          text-align: center;
          font-size: 36px;
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: 56px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 32px;
        }

        .feature-card {
          text-align: center;
          padding: 32px 24px;
          border-radius: 16px;
          background: var(--gray-50);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          background: #fff;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          transform: translateY(-4px);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .feature-card h4 {
          font-size: 20px;
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: 12px;
        }

        .feature-card p {
          font-size: 15px;
          color: var(--gray-600);
          line-height: 1.6;
        }

        @media (max-width: 968px) {
          .hero {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 60px 24px;
            text-align: center;
          }

          .hero-content {
            max-width: 100%;
          }

          .hero-title {
            font-size: 42px;
          }

          .hero-subtitle {
            font-size: 26px;
          }

          .hero-buttons {
            justify-content: center;
          }

          .hero-image-placeholder {
            width: 300px;
            height: 300px;
          }

          .hero-image-placeholder span {
            font-size: 80px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ProductIntroduction;
