<template>
    <header class="sticky top-0 bg-weather-primary shadow-lg">
        <nav class="container flex flex-col sm:flex-row items-center gap-4 text-white py-6">

            <!-- 해 아이콘 클릭 시 홈으로 이동 -->
            <RouterLink :to="{ name : 'home' }">
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-sun text-2xl"></i>
                    <p class="text-2xl">현지 날씨</p>
                </div>
            </RouterLink>

            <div class="flex gap-3 flex-1 justify-end">
                <!-- i 아이콘 - 클릭 시 모달 띄워짐 -->
                <i @click="toggleModal" class="fa-solid fa-circle-info text-xl hover:text-weather-secondary duration-150 cursor-pointer"></i>

                <!-- + 아이콘 - 클릭 시 해당 지역 localStorage에 추가됨 -->
                <i v-if="route.query.preview" @click="addCity" class="fa-solid fa-plus text-xl hover:text-weather-secondary duration-150 cursor-pointer"></i>
            </div>

            <!-- 모달 -->
            <BaseModal @close-modal="toggleModal" :modalActive="modalActive">
                <!-- slot에 넘겨질 내용 -->
                <div class="text-black">
                    <h2 class="text-2xl">사이트에 대해서:</h2>
                    <p class="mb-4">
                        이 사이트는 지역 검색을 통해 선택된 지역의 현재 및 미래 날씨를 보여주는 웹사이트입니다.
                    </p>
                    <h2 class="text-2xl">사용 방법: </h2>
                    <ol>
                        <li>지역을 검색해주세요.</li>
                        <li>지역을 선택하면 날씨 미리보기 화면으로 넘어갑니다.</li>
                        <li>미리보기 화면에서 상단 오른쪽에 위치한 "+" 아이콘을 클릭합니다.</li>
                        <li>이제 홈화면에서도 사용자가 추가한 날씨 정보를 확인 하실수 있습니다.</li>
                    </ol>
                    <h2 class="text-2xl">추가된 지역 삭제 방법</h2>
                    <p class="mb-4">
                        홈 화면에서 삭제하고픈 지역을 클릭하고 상세 화면 하단에 위치한 휴지통 아이콘을 클릭하면 해당 지역 날씨 정보가 지워집니다.
                    </p>
                </div>
                <!-- slot에 넘겨질 내용 -->
            </BaseModal>
        </nav>
    </header>
</template>

<script setup>
// 뷰 기능 임포트
import { ref } from 'vue';
import { uid } from 'uid';
import { useRoute, useRouter } from 'vue-router';

// 컴포넌트 임포트
import BaseModal from './BaseModal.vue';

/* 모달상태 */
const modalActive = ref(false);
/* 모달 show/visible 해주는 함수 */ 
const toggleModal = () => {
    modalActive.value = !modalActive.value;
}

// 
const savedCities = ref([]);
const route = useRoute();
const router = useRouter();
const addCity = () => {
    if(localStorage.getItem('savedCities')) {
        savedCities.value = JSON.parse(localStorage.getItem('savedCities'));
    }

    const locatonObj = {
        id: uid(),
        state: route.params.state,
        city: route.params.city,
        coords: {
            lat: route.query.lat,
            lng: route.query.lng,
        },
    }
    
    savedCities.value.push(locatonObj);
    localStorage.setItem('savedCities', JSON.stringify(savedCities.value));

    let query = Object.assign({}, route.query);
    delete query.preview;
    query.id = locatonObj.id;
    router.replace({ query })
}
</script>