<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { RouterLink } from 'vue-router';
import router from '@/router';
import { useAxios } from '@/stores/axios';

function logged() {
    return useUserStore().authorize;
}

function username() {
    return useUserStore().username;
}

function normalizedRole() {
    return useUserStore().role.normalized;
}

function isAdmin() {
    return useUserStore().role.name == "Admin";
}

async function signOut() {
    await useAxios().post("auth/signOut", null, { withCredentials: true }).then((response) => {
        if (response.status != 200)
            return;

        location.reload();
    });
}
</script>

<template>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <RouterLink to="/" class="navbar-brand d-flex">
            <img src="../assets/logo.png" />
            <span>CLOUD-FILES</span>
        </RouterLink>
        <RouterLink to="/SignIn">
            <button class="btn btn-light" v-if="!logged()">Вход</button>
        </RouterLink>
        <div class="d-flex gap-3 align-items-center" v-if="logged()">
            <span v-if="logged()">{{ `${normalizedRole()} ${username()}` }}</span>
            <button class="btn btn-outline-dark" v-if="isAdmin()" @click="router.push('/AdminPanel')">Админ панель</button>
            <button class="btn btn-outline-dark" v-if="logged()" @click="signOut()">Выйти</button>
        </div>
    </div>
</nav>
</template>

<style scoped lang="scss">
.navbar-brand {
    gap: 10px;

    img {
        width: 35px;
        height: 35px;
    }
}
</style>