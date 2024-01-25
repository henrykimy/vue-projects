<template>
    <header class="sticky top-0 bg-weather-primary shadow-lg">
        <nav class="container flex flex-col sm:flex-row items-center gap-4 text-white py-6">
            <RouterLink :to="{ name : 'home' }">
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-sun text-2xl"></i>
                    <p class="text-2xl">The Local Weather</p>
                </div>
            </RouterLink>

            <div class="flex gap-3 flex-1 justify-end">
                <i @click="toggleModal" class="fa-solid fa-circle-info text-xl hover:text-weather-secondary duration-150 cursor-pointer"></i>
                <i v-if="route.query.preview" @click="addCity" class="fa-solid fa-plus text-xl hover:text-weather-secondary duration-150 cursor-pointer"></i>
            </div>

            <BaseModal @close-modal="toggleModal" :modalActive="modalActive">
                <div class="text-black">
                    <h2 class="text-2xl">About:</h2>
                    <p class="mb-4">
                        The Local Weather allows you to track the current and future weather of cities of your choosing.
                    </p>
                    <h2 class="text-2xl">How it works: </h2>
                    <ol>
                        <li>Search for your city by entering the name into the search bar.</li>
                        <li>Select a city within the results, that will take you to the current weather for your selection.</li>
                        <li>Track the city by clicking on the "+" icon in the top right, ths will save the city to view at a later time on the home page.</li>
                    </ol>
                    <h2 class="text-2xl">Removing a city</h2>
                    <p class="mb-4">
                        If you no longer wish to track a city, cimply select the city within the home page. At the bottom of yhe page, there will be an option to delete the city.
                    </p>
                </div>
            </BaseModal>
        </nav>
    </header>
</template>

<script setup>
import { ref } from 'vue';
import { uid } from 'uid';
import BaseModal from './BaseModal.vue';
import { useRoute, useRouter } from 'vue-router';

const modalActive = ref(null);
const toggleModal = () => {
    modalActive.value = !modalActive.value;
}

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