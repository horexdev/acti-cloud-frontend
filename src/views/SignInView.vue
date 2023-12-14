<script setup lang="ts">
import router from '@/router';
import { useAxios } from '@/stores/axios';
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';

let login = ref("");
let password = ref("");

async function signIn() {
    let signInDto = {
        Name: login.value,
        Password: password.value
    };

    if (signInDto.Name == "")
        return;

    await useAxios().post("auth/signIn", signInDto, { withCredentials: true }).then((response) => {
        useUserStore().authorize = response.status == 200;

        if (response.status == 200) {
            let data = response.data;

            useUserStore().role = data.role;
            useUserStore().username = data.username;
        }

        router.push("/");
    }).catch((reason) => {
        console.log(reason.message);
    });
}

onMounted(() => {
    setTimeout(() => {
        if (useUserStore().authorize)
            router.push("/");
    }, 50);
});
</script>

<template>
<div class="auth d-flex flex-column p-0 justify-content-center align-items-center">
    <span class="fs-4 mb-4">Авторизация</span>
    <div class="inputs content-fluid d-flex flex-column justify-content-between mb-4">
        <div class="form-floating">
            <input v-model="login" type="text" class="form-control" id="floatingLogin" placeholder="Имя пользователя" />
            <label for="floatingLogin">Имя пользователя</label>
        </div>
        <div class="form-floating">
            <input v-model="password" type="password" class="form-control" placeholder="Пароль" />
            <label for="floatingPassword">Пароль</label>
        </div>
    </div>
    <button class="btn btn-primary btn-lg" @click="signIn()">Войти</button>
</div>
</template>

<style scoped lang="scss">
.inputs {
    min-width: 170px;
    width: 20%;
    height: 140px;
}
</style>
