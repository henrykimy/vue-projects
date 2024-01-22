<template>
    <div class="inc-exp-container">
        <div>
            <h4>입금</h4>
            <p id="money-plus" class="money plus">+ {{ income.toLocaleString() }} ₩</p>
        </div>
        <div>
            <h4>출금</h4>
            <p id="money-minus" class="money minus"> {{ expenses.toLocaleString() }} ₩</p>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    income: {
        type: Number,
        required: true,
    },
    expenses: {
        type: Number,
        required: true
    }
})
</script>