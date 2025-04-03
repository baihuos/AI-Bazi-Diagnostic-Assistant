// main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { useMemberStore } from './stores/modules/member';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

// 确保在初始化 Pinia 后才使用 store
const memberStore = useMemberStore();
console.log(memberStore.profile);
app.mount('#app');