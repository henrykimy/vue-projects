<template>
    <h3>입출금 내역</h3>
    <div class="btn-group">
        <button type="button" :disabled="transactions.length === 0" @click="filterTransactionData('')" class="btn">전체내역</button>
        <button type="button" :disabled="transactions.length === 0" @click="filterTransactionData('+')" class="btn bg-plus">입금내역</button>
        <button type="button" :disabled="transactions.length === 0" @click="filterTransactionData('-')" class="btn bg-minus">출금내역</button>
    </div>

    <ul id="list" class="list" v-if="conditnListTF">
        <li 
            v-for="transaction in conditnList" 
            :key="transaction.id"
            :class="transaction.amount < 0 ? 'minus' : 'plus'"
        >
            {{ transaction.text }}
            <span>{{ transaction.amount.toLocaleString() }} ₩</span>
        </li>
    </ul>

    <ul id="list" class="list" v-else>
        <li 
            v-for="transaction in transactions" 
            :key="transaction.id"
            :class="transaction.amount < 0 ? 'minus' : 'plus'"
        >
            {{ transaction.text }}
            <span>{{ transaction.amount.toLocaleString() }} ₩</span>
            <button @click="deleteTransaction(transaction.id)" class="delete-btn">X</button>
        </li>
    </ul>
</template>

<script setup>
/* ======== IMPORTS ======== */
import { defineProps, defineEmits, ref, toRefs } from 'vue';
import Swal from 'sweetalert2';



/* ======== VARIABLES ======== */
let conditnList = ref([]);
let conditnListTF = ref(false);
const props = defineProps({
    transactions: {
        type: Array,
        required: true,
    },
});

/* ======== COMPONENT EVENTS */
const emit = defineEmits(['transactionDeleted']);



/* ======== FUNCTIONS ======== */
// 선택 입출금 내역 삭제
const deleteTransaction = (id) => {
    // 선택된 내역
    let transaction = props.transactions.filter((transaction) => 
        transaction.id === id
    );

    // 입금/출금 여부 설정
    let signState = transaction[0].amount > 0 ? '입금' : '출금';

    // 확인 팝업
    Swal.fire({
        text: `${signState}내역을 삭제하시겠습니까?`,
        confirmButtonText: "확인",
        showCancelButton: true,
        cancelButtonText: "취소",
        }).then((result) => {
            if (result.isConfirmed) {
                emit('transactionDeleted', id);
            }
    });
}

// 입금 / 출금 조건별 리스트
const filterTransactionData = (condition) => {
    conditnListTF.value = condition === '' ? false : true;

    conditnList.value = props.transactions.filter((transaction) => {
        if(condition === '+') {
            return transaction.amount > 0;
        } else {
            return transaction.amount < 0;
        }
    });
}
</script>