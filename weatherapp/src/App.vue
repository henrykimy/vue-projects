<template>
  <div class="flex flex-col min-h-screen font-NanumGothic bg-weather-secondary">
    <!-- 네비게이션 컴포넌트 -->
    <SiteNavigation />

    <!-- 라우터뷰 - 화면 전환 효과를 위한 메타 Component v-slot지정 -->
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <!-- 화면 전환 효과를 위한 component 태그 -->
        <component :is="Component"/>
      </Transition>
    </RouterView>

  </div>
</template>

<script setup>
// 컴포넌트 임포트
import SiteNavigation from './components/SiteNavigation.vue'; // 네비게이션

// 뷰 기능 임포트
import { RouterView } from 'vue-router'; // 라우터뷰
</script>

<style>
/*  */
.page-enter-active,
.page-leave-active {
  transition: 600ms ease all;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>