<template>
    <h4>잔액</h4>
    <h1 id="balance">{{ total.toLocaleString() }} ₩</h1>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    total: {
        type: Number,
        required: true,
    }
})
</script>