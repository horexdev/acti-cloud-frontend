<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import PersonalPage from '@/views/PersonalPage.vue';

const userStore = useUserStore();
</script>

<template>
    <h1 style="padding-top: 50px; padding-left: 50px;" v-if="!userStore.authorize">Добро пожаловать в облако CLOUD-FILES!</h1>
    <PersonalPage v-else/>
</template>
