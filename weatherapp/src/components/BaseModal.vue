<template>
    <!-- HTML body 태그로 이 컴포넌트 template 이동(teleport) -->
    <Teleport to="body">
        <!-- 모달 띄워지고 없어질때 전환 효과 위한 Transition -->
        <Transition name="modal-outer">
            <!-- v-show를 사용해서 보여주기/숨기기 -->
            <div v-show="modalActive" class="absolute w-full bg-black bg-opacity-30 h-screen top-0 left-0 flex justify-center px-8">

                <!-- 모달 내용 나오고 없어질때 전환 효과 위한 Transition -->
                <Transition name="modal-inner">

                    <!-- v-if를 사용해서 true 일 경우에만 렌더링 -->
                    <div v-if="modalActive" class="p-4 bg-white self-start mt-32 max-w-screen-md">

                        <!-- 슬롯 - SiteNavigation 컴포넌트 <BaseModal> 안에 있는 모달 내용 렌더링 -->
                        <slot />
                        
                        <!-- 닫기 버튼 - 클릭 시 emit 호출해서 모달 닫기 -->
                        <button @click="$emit('close-modal')" class="text-white mt-8 bg-weather-primary py-2 px-6">닫기</button>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
/*  */
defineEmits(['close-modal']);
const props = defineProps({
    modalActive: {
        type: Boolean,
        default: false,
    },
});
</script>

<style scoped>
.modal-outer-enter-active,
.modal-outer-leave-active {
    transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-outer-enter-from,
.modal-outer-leave-to {
    opacity: 0;
}

.modal-inner-enter-active {
    transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}
.modal-inner-leave-active {
    transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-inner-enter-from {
    opacity: 0;
    transform: scale(0.8);
}

.modal-inner-leave-to {
    transform: scale(0.8);
}
</style>