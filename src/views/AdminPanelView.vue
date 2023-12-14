<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAxios } from '@/stores/axios';
import router from '@/router';

let login = ref("");
let password = ref("");
let roleName = ref("Employee");
let created = ref("");

function selectAccountType(role: string) {
    roleName.value = role;
}

async function create() {
    let userDto = {
        Name: login.value,
        Password: password.value,
        RoleName: roleName.value
    };

    await useAxios().post("users/create", userDto, { withCredentials: true }).then((response) => {
        created.value = response.status == 200 ? "success" : "error";

        setTimeout(() => created.value = "", 3500);
    }).catch((reason) => console.log(reason));
}

onMounted(() => {
  useAxios().get("auth/verify", { withCredentials: true }).then((response) => {
    if (response.status != 200) {
        router.push("/");
        return;
    }

    var roleName = response.data.role.name;
    if (roleName != "Admin") {
        router.push("/");

        return;
    }
  }).catch((reason) => {
    console.log(reason.message);

    router.push("/");
  });
});
</script>

<template>
<div class="p-0 d-flex flex-column justify-content-center align-items-center">
    <div class="alert alert-success" role="alert" v-if="created == 'success'">
        Пользователь {{ login }} успешно создан!
    </div>
    <div class="alert alert-danger" role="alert" v-if="created == 'error'">
        Не удалось создать нового пользователя
    </div>
    <span class="fs-4 mb-4">Создать нового пользователя</span>
    <div class="inputs content-fluid d-flex flex-column justify-content-between gap-4">
        <div class="form-floating">
            <input v-model="login" type="text" class="form-control" id="floatingLogin" placeholder="Имя пользователя" />
            <label for="floatingLogin">Имя пользователя</label>
        </div>
        <div class="form-floating">
            <input v-model="password" type="text" class="form-control" placeholder="Пароль" />
            <label for="floatingPassword">Пароль</label>
        </div>
    </div>
    <div class="btn-group mt-4 mb-4">
        <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            Тип аккаунта
        </button>
        <ul class="dropdown-menu">
            <li class="dropdown-item" :class="{ active: roleName == 'Employee' }" @click="selectAccountType('Employee')"><span class="fs-6" style="user-select: none;">Сотрудник</span></li>
            <li class="dropdown-item" :class="{ active: roleName == 'Admin' }" @click="selectAccountType('Admin')"><span class="fs-6" style="user-select: none;">Администратор</span></li>
        </ul>
    </div>
    <button class="btn btn-primary" @click="create()">Создать</button>
</div>
</template>

<style lang="scss" scoped>
.inputs {
    min-width: 170px;
    width: 20%;
    height: 140px;
}

.btn-group {
    width: 20% !important;
}

.dropdown-menu {
    width: 100% !important;
}
</style>