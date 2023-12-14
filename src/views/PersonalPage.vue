<script setup lang="ts">
import File from '@/components/File.vue';
import Modal from '@/components/Modal.vue';
import { useAxios } from '@/stores/axios';
import { computed } from '@vue/reactivity';
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';

interface File {
    id: number;
    name: string;
    extension: string;
    size: number;
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

let loading = ref(false);
let loadMb = ref(0);
let needMb = ref(0);

let userFiles: Ref<Array<File>> = ref([]);

const files = computed(() => {
    return userFiles.value;
});
const filesLength = computed(() => {
    return userFiles.value.length;
});

let size = 0;

let maxSize = 1024;
let width = ref(0);

const loaderWidth = computed(() => {
    return `${width.value}%`;
});

const loaderColor = computed(() => {
    let color = "";
    if (width.value <= 20)
        color = "#33FF33";
    else if (width.value > 20 && width.value <= 40)
        color = "#99FF33";
    else if (width.value > 40 && width.value <= 60)
        color = "#FFFF33";
    else if (width.value > 60 && width.value <= 80)
        color = "#FF9933";
    else if (width.value > 80 && width.value <= 100)
        color = "#FF3333";

    return `${color}`;
});

async function filesSelected(e: Event) {
    let files = (e as HTMLInputEvent).target.files;
    if (!files || !files.length) 
        return;

    let bytes = 0;
    for (let index = 0; index < files.length; index++)
        bytes += files[index].size;
        
    let allSize = size + bytes;
    let mb = getMegabytes(allSize)
    if (mb > maxSize) {
        alert("Вы превысели максимальный размер облака");

        (e as HTMLInputEvent).target.value = '';

        return;
    }

    loading.value = true;

    let formData: FormData = new FormData();
    for (let index = 0; index < files.length; index++)
        formData.append("files", files[index]);

    await useAxios().post("files/add", formData, 
    { 
        withCredentials: true, onUploadProgress: progressEvent => {
            if (needMb.value != progressEvent.total && progressEvent.total)
                needMb.value = getMegabytes(progressEvent.total);

            let newMb = getMegabytes(progressEvent.loaded);
            loadMb.value = newMb;
        } 
    }).then((response) => {
        if (response.status == 200)
            (e as HTMLInputEvent).target.value = '';
    });

    loadFiles();

    loading.value = false;
}

async function loadFiles() {
    await useAxios().get("files/getList", { withCredentials: true }).then((response) => {
        userFiles.value = response.data

        size = 0;

        userFiles.value.forEach(file => {
            size += file.size
        });

        width.value = 0;

        width.value = (getMegabytes(size) / maxSize) * 100
    });
}

function formatBytes(bytes: number, decimals: number = 1) {
    if (!+bytes) 
        return '0 Б';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Б', 'Кб', 'Мб', 'Гб'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function getMegabytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
        return 0;
    } else {
        var k = 1024;
        var dm = decimals < 0 ? 0 : decimals;
        return parseFloat((bytes / Math.pow(k, 2)).toFixed(dm));
    }
}

onMounted(async () => {
    loadFiles();
});
</script>

<template>
<div class="container p-0" v-if="!loading">
    <div class="info d-flex gap-5 justify-content-center" style="margin-top: 25px">
        <span class="info-files-count">Всего файлов: {{ filesLength }}</span>
        <div class="d-flex gap-3 align-items-center">
            <span class="info-files-size">Размер вашего облака:</span>
            <div class="d-flex align-items-center size border rounded">
                <div class="size-bg rounded" :style="{ width: loaderWidth, background: loaderColor}">
                    {{ formatBytes(size) }}
                </div>
            </div>
        </div>
        <input type="file" id="file-upload" multiple="true" @change="filesSelected($event)"/>
        <button class="btn btn-outline-success p-0" style="width: 145px; height: 38px;">
            <label for="file-upload" style="width: 100%; height: 38px; cursor: pointer; line-height: 35px;">Загрузить файлы..</label>
        </button>
        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">Удалить все</button>
    </div>
    <div class="d-flex gap-5 flex-wrap w-100 justify-content-center mb-4" style="margin-top: 25px">
        <File :key="index" v-for="(file, index) in files" :name="file.name" :extension="file.extension" :size="formatBytes(file.size)" :id="file.id" :loadFiles="loadFiles" />
    </div>
    <Modal 
        :title="'Предупреждение'" :main="'Вы уверены что хотите все удалить?'" :leftBtn="'Отменить'" :rightBtn="'Удалить'" :loadFiles="loadFiles"
        style="margin-top: 300px"
    />
</div>
<h1 v-else>Загрузка {{ loadMb }}/{{ needMb }} Мб</h1>
</template>

<style scoped lang="scss">
.info {
    font-size: 26px;
}

.size {
    width: 150px;
    height: 29px;

    &-bg {
        height: 25px;

        font-size: 17px;
        text-align: center;
        white-space: nowrap;
    }
}

#file-upload {
    opacity: 0;
    position: absolute;
    z-index: -1;
}
</style>