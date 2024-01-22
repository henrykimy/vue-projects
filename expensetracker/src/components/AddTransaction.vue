<template>
    <h3>입출금 내역 추가</h3>
    <form id="form" @submit.prevent="onSubmit">
        <div class="btn-group">
            <button type="button" @click="setAmountSign('+')" class="btn bg-plus">입금내역 추가</button>
            <button type="button" @click="setAmountSign('-')" class="btn bg-minus">출금내역 추가</button>
        </div>
        <div class="form-control">
            <label for="text">{{ amountSign === '+' ? '입금' : '출금' }} 내용</label> <br/>
            <input type="text" v-model="text" id="text" :placeholder="getSignState + '내용'">
        </div>
        <div class="form-control">
            <label for="amount">금액<br/>
            </label> 
            <input :class="amountSign === '+' ? 'color-plus' : 'color-minus'" type="number" v-model="amount" id="amount" placeholder="금액">
        </div>
        <button :disabled="text.trim() === '' || (amount === '' || amount === 0)" class="btn">추가</button>
    </form>
</template>

<script setup>
/* ======== IMPORTS ======== */
import { ref, defineEmits, computed } from 'vue';
import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2';

/* ======== VARIABLES ======== */
// 알람
const toast = useToast();
// 입금 내용
const text = ref('');
// 금액
const amount = ref('');
// +/- 사인
let amountSign = ref('+');

/* COMPONENT EVENTS */
// 내역 추가 버튼 클릭 시 호출되는 emit
const emit = defineEmits(['transactionSubmitted']);

/* ======== FUNCTIONS ======== */

// 입금/출금 추가 버튼 클릭시
const setAmountSign = (sign) => {
    if (sign === '+') {
        text.value = '';
        amount.value = '';
        amountSign.value = sign;
    } else {
        text.value = '';
        amount.value = '';
        amountSign.value = sign;
    }
}

// 내용 placeholder 값 반환
const getSignState = computed(() => {
    return amountSign.value === '+' ? '입금' : '출금';
})

// 내역 추가 버튼 클릭 시
const onSubmit = () => {
    // 내용 체크
    if (!text.value) {
        toast.error(getSignState.value + '내용을 입력해주세요.');
        return;
    }
    
    // 금액 체크
    if (!amount.value) {
        toast.error('금액을 입력해주세요.');
        return;
    }

    Swal.fire({
        text: `${getSignState.value}내역을 추가하시겠십니까?`,
        confirmButtonText: "확인",
        showCancelButton: true,
        cancelButtonText: "취소",
        }).then((result) => {
            if (result.isConfirmed) {
                // emit에 같이 보낼 추가된 내역 데이터
                const transactionData = {
                    text: text.value,
                    amount: amount.value
                }
            
                // 출금시 - 처리
                transactionData.amount = amountSign.value === '+' ? transactionData.amount : -transactionData.amount;
            
                // emit 호출
                emit('transactionSubmitted', transactionData);
            
                // 빈값 처리
                text.value = '';
                amount.value = '';
            }
        });
}
</script>