<template>
    <n-config-provider id="app-provider" :theme-overrides="themeOverrides">
        <router-view/>
        <Notification />
    </n-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NConfigProvider, darkTheme, useThemeVars, GlobalThemeOverrides } from 'naive-ui';
import i18n from '@/i18n';
import buildStore from '@/store';
import { storeInject, TInject, i18nInject } from '@/symbols';
import Notification from '@/components/Notification.vue';
import { getFullList } from '@/tools/Achievements';
import {
    loadStore,
    saveStore,
} from '@/tools/DB';

export default defineComponent({
    name: 'App',
    provide() {
        const store = buildStore({loadStore, saveStore});
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
    data() {
        console.log(darkTheme, useThemeVars().value);
        const commonLightTheme = useThemeVars().value;
        const brandPrimary = '#42b983';
        const themeOverrides: GlobalThemeOverrides = Object.assign({}, {
            common: {
                ...commonLightTheme,
                primaryColor: brandPrimary,
            },
            // Button: {
            //     textColor: '#FF0000'
            // },
            // Select: {
                // peers: {
                //     InternalSelection: {
                //        textColor: '#FF0000'
                //     }
                // }
        }) as GlobalThemeOverrides;

        return {
            themeOverrides,
            brandPrimary,
        };
    },
    components: {
        Notification,
        NConfigProvider,
    },
});
</script>
<style>
:root, #app-provider {
    --brand-primary: v-bind('themeOverrides.common.primaryColor');
    --brand-secondary: #f1b255;;
    --main-background: #EEFFEE;
    --text-color: #2c3e50;
    --item-bg: #f0f0f0;
    --item-color: var(--text-color);

    /* --notification-bg-error: #ffacacd9;
    --notification-bg-warning: #ffbb77d9;
    --notification-bg-success: #d7ffd7d9;
    --notification-bg-info: #f2fdfcd9; */
    /* --notification-bg: var(--notification-bg-info); /* will be override */
    /* --notification-color-error: #009bb3;
    --notification-color-warning: #009bb3;
    --notification-color-success: #009bb3;
    --notification-color-info: #009bb3; */
    /* --notification-color: var(--notification-color-info); /* will be override */
    --notification-box-shadow: v-bind('themeOverrides.common.boxShadow1');
}

html,body, #app, #app-provider {
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
}

#app-provider {
    color: var(--text-color);
    background-color: var(--main-background);
}

.goblean-title {
    color: var(--brand-primary);
    text-shadow: 3px 2px 5px var(--brand-secondary);
}

.page-title {
    color: var(--brand-primary);
}

</style>
