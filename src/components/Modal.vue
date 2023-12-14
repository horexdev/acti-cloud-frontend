<script setup lang="ts">
import { useAxios } from '@/stores/axios';

const props = defineProps({
    title: String,
    main: String,
    leftBtn: String,
    rightBtn: String,
    deleteAll: Boolean,
    loadFiles: Function
});

async function deleteAll() {
    await useAxios().delete("files/deleteAll", { withCredentials: true }).then((response) => {
        if (response.status == 200)
            if (props.loadFiles)
                props.loadFiles();
    });
}
</script>

<template>
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">{{ title }}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        {{ main }}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ leftBtn }}</button>
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="deleteAll()">{{ rightBtn }}</button>
      </div>
    </div>
  </div>
</div>
</template>