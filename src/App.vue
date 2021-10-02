<template>
    <router-view/>
    <Notification />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import i18n from '@/i18n';
import buildStore from '@/store';
import { storeInject, TInject, i18nInject } from '@/symbols';
import Notification from '@/components/Notification.vue';
import { getFullList } from '@/tools/Achievements';

export default defineComponent({
    name: 'App',
    provide() {
        const store = buildStore();
        getFullList(store, i18n._);
        return {
            [TInject as unknown as string]: i18n._,
            T: i18n._, /* in order to support inject: ['T'] */
            [i18nInject as unknown as string]: i18n,
            i18n: i18n, /* in order to support inject: ['i18n'] */
            [storeInject as unknown as string]: store,
            store: store, /* in order to support inject: ['i18n'] */
        };
    },
    components: {
        Notification,
    },
});
</script>
<style>
:root {
    --brand-primary: #42b983;
    --brand-secondary: #f1b255;;
    --main-background: #EEFFEE;
    --text-color: #2c3e50;
    --notification-bg: #f2fdfcd9;
    --notification-color: #009bb3;
    --item-bg: #f0f0f0;
    --item-color: var(--text-color);
}

html,body, #app {
    position: fixed;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    top: 0;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: var(--text-color);
    background-color: var(--main-background);
    height: 100%;
    width: 100%;
}

.goblean-title {
    color: var(--brand-primary);
    text-shadow: 3px 2px 5px var(--brand-secondary);
}

.page-title {
    color: var(--brand-primary);
}

</style>
