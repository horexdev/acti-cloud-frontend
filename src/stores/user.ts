import { ref}  from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
    let authorize = ref(false);
    let role = ref({ name: "", normalized: "" });
    let username = ref("");

    return { authorize, role, username }
})
