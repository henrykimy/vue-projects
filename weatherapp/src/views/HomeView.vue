<template>
    <main class="container text-white">
        <div class="pt-4 mb-8 relative">
            <!-- 지역 검색 input - 입력시 getSearchResults() 호출 -->
            <input 
                v-model="searchQuery" 
                @input="getSearchResults"
                type="text" 
                placeholder="지역을 검색해주세요." 
                class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]"
            >

            <!-- 검색어 연관 지역 리스트 - mapboxSearchResults 데이터가 있을시에만 렌더링 -->
            <ul 
                v-if="mapboxSearchResults" 
                class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
            >
                <!-- 검색오류 발생시 메세지 -->
                <p v-if="searchError">
                    오류가 발생했습니다. 다시 시도해주세요.
                </p>
                <!-- 관련 검색어에 대한 정보가 없을 시 -->
                <p v-if="!searchError && mapboxSearchResults.length === 0">
                    관련 지역이 없습니다. 다른 지역으로 검색해주세요.
                </p>

                <!-- 검색어 관련 지역 리스트 - 클릭 시 toPreviewCity() 함수 호출 상세 날씨 정보 화면으로 이동 -->
                <template v-else>
                    <li v-for="searchResult in mapboxSearchResults" 
                        :key="searchResult.id" 
                        class="py-2 cursor-pointer"
                        @click="toPreviewCity(searchResult)"
                    >
                        {{ searchResult.place_name }}
                    </li>
                </template>
            </ul>
        </div>

        <!-- 추가된 지역 날씨 정보 카드 섹션 -->
        <div class="flex flex-col gap-4">
            <!-- API 정보가 호출될때까지 로딩 효과 보여줄 수 있게 하는 Suspense 태그 -->
            <Suspense>
                <!-- 추가된 지역 날씨 정보 카드 리스트 -->
                <CityList />

                <!-- 로딩 효과 컴포넌트 -->
                <template #fallback>
                    <CityCardSkeleton />
                </template>
            </Suspense>
        </div>
    </main>
</template>

<script setup>
/* 뷰 기능 임포트 */
import { ref } from "vue";
import axios from 'axios';
import { useRouter } from "vue-router";

/* 컴포넌트 임포트 */
import CityList from "../components/CityList.vue";
import CityCardSkeleton from "../components/CityCardSkeleton.vue";

const queryTimeout = ref(null);
let mapboxSearchResults = ref(null);
const searchError = ref(null);

/* 검색어 */
const searchQuery = ref('');
/* 날씨 API 키 */
const API_KEY = "";
const getSearchResults = () => {
    /* 이전 검색 기록 조기화 */
    clearTimeout(queryTimeout.value);

    /* 키 입력시 0.3초 이후 검색 */
    queryTimeout.value = setTimeout(async () => {

        /* 검색어가 존재시에만 호출 */
        if(searchQuery.value !== '') {
            try {

                /* 날씨 API 호출해서 검색어 관련 지역 검색 */
                const result = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${API_KEY}&types=place&lang=kr`);

                /* 날씨 API 호출시 "features" 키에 데이터 존재 */
                mapboxSearchResults.value = result.data.features;

                return;
            } catch {
                /* 에러 발생시 에러 메세지 표시를 위해 true로 변경 */
                searchError.value = true;
            }
        }

        /* 검색어가 없을 경우 결과 데이터 null 처리 */
        mapboxSearchResults.value = null;

    }, 300)
}


/* 페이지 이동시 사용되는 라우터 */
const router = useRouter();
/* 날씨 상세화면으로 이동 함수 */
const toPreviewCity = (searchResult) => {

    /* 선택 지역 데이터의 "place_name"에 지역 이름, 국가 존재 */
    const [city, state] = searchResult.place_name.split(",");

    /* 라우터 사용해서 날씨 상세화면으로 이동 */
    router.push({
        name:'cityView',
        /* 지역, 국가 파라미터로 넘겨주기 */
        params: {
            state: state.replaceAll(" ", ""),
            city: city.replaceAll(" ", ""),
        },
        /* 쿼리 스트링 데이터 지정 , 미리보기 화면 여부 넘겨주기 */
        query: {
            lng: searchResult.geometry.coordinates[0], // 경도
            lat: searchResult.geometry.coordinates[1], // 위도
            preview: true, // 미리보기 여부
        }
    })
}
</script>