<template>
  <div class="home-banner">
    <div class="banner-content">
      <div class="banner-text">
        <h1 class="banner-title">前端进阶笔记</h1>
        <p class="banner-subtitle">Cheeka Hao</p>
        <p class="banner-tagline">learning notebook</p>
        <div class="banner-actions">
          <a href="/javascript/es6/" class="action-btn primary">开始阅读</a>
          <a href="https://github.com/cheekahao/learning" class="action-btn secondary">GitHub</a>
        </div>
      </div>
      <div class="banner-image">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeBanner'
}
</script>

<style scoped>
.home-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  border-radius: 12px;
  margin: 2rem 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.banner-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}

.banner-text {
  flex: 1;
}

.banner-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.banner-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  opacity: 0.9;
}

.banner-tagline {
  font-size: 1.1rem;
  opacity: 0.8;
  margin: 0 0 2rem 0;
}

.banner-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.action-btn.primary {
  background: #fff;
  color: #667eea;
}

.action-btn.primary:hover {
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.action-btn.secondary {
  background: transparent;
  color: white;
  border-color: white;
}

.action-btn.secondary:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
}

.banner-image {
  flex-shrink: 0;
}

.logo-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }

  .banner-title {
    font-size: 2.5rem;
  }

  .banner-actions {
    justify-content: center;
  }
}
</style>
