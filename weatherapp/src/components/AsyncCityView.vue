<template>
    <div class="flex flex-col flex-1 items-center">
        <!-- 안내 메세지 - 미리보기 화면에서만 렌더링 -->
        <div v-if="route.query.preview" class="text-white p-4 bg-weather-secondary w-full text-center">
            <p>미리보기 화면입니다. 홈화면 고정을 원하시면 "+" 아이콘을 클릭해서 추가해주세요.</p>
        </div>

        <!-- 날씨 정보 -->
        <div class="flex flex-col items-center text-white py-12">
            <!-- 지역명 -->
            <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>

            <!-- 지역 온도 -->
            <p class="text-sm mb-12">
                {{ 
                    /* 현지 날짜 정보 */
                    new Date(weatherData.currentTime).toLocaleDateString(
                        "kr",
                        {
                            weekday: "short",
                            day: "2-digit",
                            month: "long",
                        }
                    )
                 }}
                 {{ 
                    /* 현지 시간 정보 */
                    new Date(weatherData.currentTime).toLocaleTimeString(
                        "en-us",
                        {
                            timeStyle: "short",
                        }
                    )
                 }}
            </p>
            
            <!-- 온도 -->
            <p class="text-8xl mb-8">
                {{ Math.round(weatherData.current.temp) }}&deg;
            </p>

            <!-- 체감온도 -->
            <p>
                체감온도 {{ Math.round(weatherData.current.feels_like) }}&deg;
            </p>

            <!-- 날씨 정보 -->
            <p class="capitalize">
                {{ weatherData.current.weather[0].description }}
            </p>

            <!-- 시간에 따른 해 이미지 -->
            <img class="w-[150px] h-auto" :src="`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`" alt="">
        </div>
        
        <!-- 나눔선 -->
        <hr class="border-white border-opacity-10 border w-full">
        
        <!-- 시간별 날씨 정보 -->
        <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-white">
                <h2 class="mb-4">시간별 날씨 정보</h2>
                <div class="flex gap-10 overflow-x-scroll">
                    <div v-for="hourData in weatherData.hourly" :key="hourData.dt" class="flex flex-col gap-4 items-center">
                        <p class="whitespace-nowrap text-mb">
                            {{ new Date(hourData.currentTime).toLocaleTimeString("en-us", {hour:"numeric"}) }}
                        </p>
                        <img class="w-auto h-[50px] object-cover" :src="`https://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`" alt="">
                        <p class="text-xl">{{ Math.round(hourData.temp) }}&deg;</p>
                    </div>
                </div>
            </div>
        </div>
        
        <hr class="border-white border-opacity-10 border w-full">

        <!-- 일주일 날씨 정보 -->
        <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-white">
                <h2 class="mb-4">일주일 날씨 정보</h2>
                <div v-for="day in weatherData.daily" :key="day.dt" class="flex items-center">
                    <p class="flex-1">
                        {{ 
                            new Date(day.dt * 1000).toLocaleDateString(
                                "kr",
                                {
                                    weekday: "long",
                                }
                            )
                         }}
                    </p>
                    <img class="w-[50] h-[50px] object-cover" :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`" alt="">
                    <div class="flex gap-2 flex-1 justify-end">
                        <p>최저: {{ Math.round(day.temp.min) }}</p>
                        <p>최고: {{ Math.round(day.temp.max) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 해당 지역 날씨 정보 삭제 -->
        <div v-if="!route.query.preview" @click="removeCity" class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150 hover:text-red-500">
            <i class="fa-solid fa-trash"></i>
            <p>삭제</p>
        </div>
    </div>
</template>

<script setup>
/* 뷰 기능 임포트 */
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

/* 라우트 - params, queryStr 데이터 가져오기용 */
const route = useRoute();

/* 날씨 API 키 */
const API_KEY = '';
const getWeatherdata = async () => {
    try {
        const weatherData = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${route.query.lat}&lon=${route.query.lng}&lang=kr&exclude={part}&appid=${API_KEY}&units=metric`)

        // cal current date & time
        const localOffset = new Date().getTimezoneOffset() * 60000;
        const utc = weatherData.data.current.dt * 1000 + localOffset;
        weatherData.data.currentTime = utc + 1000 * weatherData.data.timezone_offset;

        // cal hourly weather offset
        weatherData.data.hourly.forEach(hour => {
            const utc = hour.dt * 1000 + localOffset;
            hour.currentTime = utc + 1000 * weatherData.data.timezone_offset;
        });

        // Flicker Delay
        await new Promise((res) => setTimeout(res,1000));

        return weatherData.data;
    } catch (error) {
        console.log(error);
    }
}

const weatherData = await getWeatherdata();

/*  */
const router = useRouter();
const removeCity = () => {
    const cities = JSON.parse(localStorage.getItem('savedCities'));
    const updatedCities = cities.filter((city) => city.id !== route.query.id);
    localStorage.setItem('savedCities', JSON.stringify(updatedCities));
    router.push({
        name: "home",
    });
}
</script>