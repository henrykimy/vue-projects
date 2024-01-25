<template>
    <div>
        <!-- 날씨 상세화면이 보여질때까지 로딩 효과를 보여줄수 있는 Suspense 태그 -->
        <Suspense>
            <!-- 날씨 상세화면 컴포넌트 -->
            <AsyncCityView />

            <!-- 로딩 효과 컴포넌트 -->
            <template #fallback>
                <CityViewSkeleton />
            </template>
        </Suspense>
    </div>
</template>

<script setup>
import AsyncCityView from '../components/AsyncCityView.vue';
import CityViewSkeleton from '../components/CityViewSkeleton.vue';

</script>