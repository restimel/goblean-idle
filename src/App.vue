<template>
    <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import i18n from '@/i18n';
import buildStore from '@/store';

export default defineComponent({
    name: 'App',
    provide() {
        return {
            T: i18n._,
            i18n: i18n,
            store: buildStore(),
        };
    },
});
</script>


<style>
:root {
    --brand-primary: #42b983;
    --brand-secondary: #f1b255;;
    --main-background: #EEFFEE;
    --text-color: #2c3e50;
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
