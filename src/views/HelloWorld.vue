<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

defineProps<{ msg: string }>();

const router = useRouter();

// 导航项配置
const navigationItems = ref([
  {
    id: "konva-demo",
    title: "Konva 画布演示",
    description: "交互式画布，支持图形绘制、标注、全屏等功能",
    icon: "full-screen",
    path: "/konva-demo",
    color: "#1890ff",
    features: [
      "鼠标中键拖拽画布",
      "Ctrl + 滚轮缩放",
      "滚轮移动画布",
      "图形标注与编辑",
    ],
  },
  {
    id: "fullscreen-demo",
    title: "全屏组件演示",
    description: "展示全屏组件的各种使用方式和配置选项",
    icon: "cancel-full-screen",
    path: "/fullscreen-demo",
    color: "#52c41a",
    features: ["多种按钮主题", "不同尺寸选择", "事件监听", "跨浏览器兼容"],
  },
]);

// 导航到指定页面
const navigateTo = (path: string) => {
  router.push(path);
};

// 统计信息
const stats = ref([
  { label: "组件数量", value: "5+", color: "#1890ff" },
  { label: "演示页面", value: "2", color: "#52c41a" },
  { label: "功能特性", value: "10+", color: "#fa8c16" },
]);
</script>

<template>
  <div class="navigation-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-content">
        <div class="logo-section">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
          <img src="../assets/vue.svg" class="logo vue" alt="Vue logo" />
        </div>
        <div class="title-section">
          <h1>{{ msg }}</h1>
          <p class="subtitle">Vue 3 + TypeScript + Vite 组件演示</p>
        </div>
      </div>
    </header>

    <!-- 统计卡片 -->
    <section class="stats-section">
      <div class="stats-grid">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="stat-card"
          :style="{ borderColor: stat.color }"
        >
          <div class="stat-value" :style="{ color: stat.color }">
            {{ stat.value }}
          </div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- 导航卡片 -->
    <section class="navigation-section">
      <h2>功能演示</h2>
      <div class="nav-grid">
        <div
          v-for="item in navigationItems"
          :key="item.id"
          class="nav-card"
          @click="navigateTo(item.path)"
        >
          <div class="nav-card-header">
            <div class="nav-icon" :style="{ backgroundColor: item.color }">
              <SvgIcon :icon="item.icon" :size="24" color="white" />
            </div>
            <h3>{{ item.title }}</h3>
          </div>

          <p class="nav-description">{{ item.description }}</p>

          <div class="nav-features">
            <span
              v-for="feature in item.features"
              :key="feature"
              class="feature-tag"
            >
              {{ feature }}
            </span>
          </div>

          <div class="nav-footer">
            <span class="nav-link">立即体验 →</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 页面底部 -->
    <footer class="page-footer">
      <p>基于 Vue 3 + TypeScript + Vite 构建</p>
      <div class="footer-links">
        <a href="https://vuejs.org/" target="_blank">Vue 文档</a>
        <a href="https://vite.dev/" target="_blank">Vite 文档</a>
        <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.navigation-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  overflow-x: hidden;
}

.page-header {
  padding: 40px 20px;
  text-align: center;

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .logo-section {
    margin-bottom: 20px;

    .logo {
      height: 4em;
      margin: 0 10px;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.1);
        filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
      }

      &.vue:hover {
        filter: drop-shadow(0 0 20px #42b883aa);
      }
    }
  }

  .title-section {
    h1 {
      font-size: 3rem;
      margin: 0 0 10px 0;
      background: linear-gradient(45deg, #fff, #e0e7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
      margin: 0;
    }
  }
}

.stats-section {
  padding: 0 20px 40px;

  .stats-grid {
    max-width: 800px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 2px solid transparent;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15);
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 1rem;
      opacity: 0.9;
    }
  }
}

.navigation-section {
  padding: 40px 20px;
  background: rgba(0, 0, 0, 0.1);

  h2 {
    text-align: center;
    font-size: 2rem;
    margin: 0 0 40px 0;
    opacity: 0.9;
  }

  .nav-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
  }

  .nav-card {
    background: rgba(255, 255, 255, 0.95);
    color: #333;
    border-radius: 16px;
    padding: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);

      .nav-link {
        color: #1890ff;
        transform: translateX(5px);
      }
    }

    .nav-card-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;

      .nav-icon {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      h3 {
        margin: 0;
        font-size: 1.3rem;
        color: #333;
      }
    }

    .nav-description {
      margin: 0 0 20px 0;
      color: #666;
      line-height: 1.6;
    }

    .nav-features {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 20px;

      .feature-tag {
        background: #f0f9ff;
        color: #0369a1;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.8rem;
        border: 1px solid #bae6fd;
      }
    }

    .nav-footer {
      text-align: right;

      .nav-link {
        color: #666;
        font-weight: 500;
        transition: all 0.3s ease;
      }
    }
  }
}

.page-footer {
  padding: 40px 20px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  p {
    margin: 0 0 15px 0;
    opacity: 0.8;
  }

  .footer-links {
    display: flex;
    justify-content: center;
    gap: 20px;

    a {
      color: white;
      text-decoration: none;
      opacity: 0.8;
      transition: all 0.3s ease;

      &:hover {
        opacity: 1;
        text-decoration: underline;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .page-header {
    padding: 20px;

    .title-section h1 {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1rem;
    }
  }

  .stats-section {
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 15px;
    }
  }

  .navigation-section {
    .nav-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .nav-card {
      padding: 20px;
    }
  }

  .footer-links {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
