<template>
  <Header />
  <div class="container">
    <Balance :total="total"/>
    <IncomeExpenses :income="income" :expenses="expenses"/>
    <TransactionList @transactionDeleted="handleTransactionDeleted" :transactions="transactions"/>
    <AddTransaction @transactionSubmitted="handleTransactionSubmitted" />
  </div>
</template>

<script setup>
/* ======== IMPORTS ======== */
import Header from './components/Header.vue';
import Balance from './components/Balance.vue';
import IncomeExpenses from './components/IncomeExpenses.vue';
import TransactionList from './components/TransactionList.vue';
import AddTransaction from './components/AddTransaction.vue';
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification';

/* ======== VARIABLES ======== */

// 알림 라이브러리
const toast = useToast();

// 입출금 내역
let transactions = ref([]);

onMounted(() => {
  if(localStorage.getItem('transactions')) {
    transactions.value = JSON.parse(localStorage.getItem('transactions'));
  }
})

// 잔액
const total = computed(() => {
  if(transactions.value.length > 0){
    return transactions.value.reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0);
  } else {
    return 0;
  }
});

// 입금 합계
const income = computed(() => {
  if(transactions.value.length > 0){
    return transactions.value
    .filter(transaction => transaction.amount > 0)
    .reduce((acc, transaction) => {
      return acc + transaction.amount
    }, 0);
  } else {
    return 0;
  }
});

// 출금 합계
const expenses = computed(() => {
  if(transactions.value.length > 0){
    return transactions.value
    .filter(transaction => transaction.amount < 0)
    .reduce((acc, transaction) => {
      return acc + transaction.amount
    }, 0);
  } else {
    return 0;
  }
});

/* ======== FUNCTIONS ======== */

// emit 호출시 이 컴포넌트에서 실행될 함수
const handleTransactionSubmitted = (transactionData) => {
  transactions.value.push({
    id: generateUniqueId(),
    text: transactionData.text,
    amount: transactionData.amount
  });

  // +/-
  const signText = transactionData.amount > 0 ? '입금' : '출금';
  saveTransactionsToLocalStorage();
  toast.success(`${signText}내역이 추가되었습니다.`);

};

// 입출금내역 array에 추가시 생성될 새로운 id
const generateUniqueId = () => {
  return Math.floor(Math.random() * 1000000);
};

// 선택된 입출금 내역 삭제
const handleTransactionDeleted = (id) => {
  transactions.value = transactions.value.filter((transaction) => 
    transaction.id !== id
  );

  saveTransactionsToLocalStorage();
  toast.success('내역이 삭제되었습니다.');
}

// localStorage에 저장하기
const saveTransactionsToLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions.value));
}

</script>