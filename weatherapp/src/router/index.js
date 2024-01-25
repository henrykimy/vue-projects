// 뷰 라우터에서 사용될 기능
import { createRouter, createWebHistory } from 'vue-router';

// 컴포넌트 임포트
import HomeView from '../views/HomeView.vue';
import CityView from '../views/CityView.vue';

// 어플리케이션에서 사용되는 라우터 경로들
const routes = [
    // 홈
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {
            title: '홈'
        }
    },
    // 날씨 상세 화면
    {
        path: '/weather/:state/:city',
        name: 'cityView',
        component: CityView,
        meta: {
            title: '날씨'
        }
    },
]

// 라우터 등록
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

// 각 라우터 이동 전 웹사이트 title 변경해주기
router.beforeEach((to, from, next) => {
    document.title = `${ to.params.state ? `${to.params.city}, ${to.params.state}` : to.meta.title } | The Local Weather`;
    next();
});

export default router;