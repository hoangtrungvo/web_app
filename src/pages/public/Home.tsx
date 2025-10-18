// src/pages/public/Home.tsx
import ProductIntroduction from '../../components/public/ProductIntroduction';
import AppDownload from '../../components/public/AppDownload';

const Home = () => {
  return (
    <div className="home-page">
      <ProductIntroduction />
      <AppDownload />
      
      <style>{`
        .home-page {
          min-height: 100vh;
          background: #fff;
        }
      `}</style>
    </div>
  );
};

export default Home;
