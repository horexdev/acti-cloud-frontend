<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import { onMounted } from 'vue';
import { useAxios } from './stores/axios';
import { useUserStore } from './stores/user';

onMounted(() => {
  useAxios().get("auth/verify", { withCredentials: true }).then((response) => {
    useUserStore().authorize = response.status == 200;

    if (response.status == 200) {
      let data = response.data;

      useUserStore().role = data.role;
      useUserStore().username = data.username;
    }
  }).catch((reason) => {
    console.log(reason.message);
  });
});
</script>

<template>
<div class="main d-flex flex-column p-0">
  <NavBar />
  <RouterView class="flex-fill align-self-center w-100" />
</div>
</template>

<style scoped lang="scss">
.main {
  height: 100vh;
}
</style>
