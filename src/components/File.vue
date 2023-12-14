<script setup lang="ts">
import { useAxios } from '@/stores/axios';
import FileDownload from 'js-file-download';
import { ref } from 'vue';

const props = defineProps({
    id: Number,
    name: String,
    extension: String,
    size: String,
    loadFiles: Function
});

let deleting = ref(false);

async function deleteFile() {
    deleting.value = true;

    await useAxios().delete(`files/delete/${props.id}`, { withCredentials: true });
    if (props.loadFiles)
        props.loadFiles();

    deleting.value = false;
}

async function download() {
    await useAxios().get(`files/get/${props.id}`, { withCredentials: true, responseType: "blob" }).then((response) => {
        FileDownload(response.data, `${props.name}.${props.extension}`);
    });
}
</script>

<template>
<div class="file d-flex flex-column justify-content-between align-items-center" style="border-radius: 15px;" v-if="!deleting">
    <img class="doc mt-3" src="@/assets/doc.png" @click="download()"/>
    <span class="name">{{ name }}</span>
    <div class="d-flex gap-3 mb-3">
        <span>{{ size }}</span>
        <span> | </span>
        <img src="@/assets/delete.png" class="delete" @click="deleteFile()"/>
    </div>
</div>
<span v-else>Удаление..</span>
</template>

<style scoped lang="scss">
.file {
    width: 200px;
    height: 200px;
    background-color: #F8F9FA;

    .doc {
        width: 50px;
        height: 50px;
        cursor: pointer;
    }
}

.delete {
    width: 25px;
    height: 25px;
    cursor: pointer;
}

.name {
    width: 100%;
    overflow-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-align: center;
    padding-left: 20px;
    padding-right: 20px;
}
</style>