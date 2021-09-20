<template>
    <div class="about">
        <Back />
        <h1 class="page-title">{{T('About %s', i18n.projectName)}}</h1>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Back from '@/components/Back.vue';

export default defineComponent({
    name: 'About',
    inject: ['T', 'i18n'],
    components: {
        Back,
    },
});
</script>

<style scoped>
</style>
