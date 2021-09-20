<template>
    <div class="achievement">
        <Back />
        <h1 class="page-title">{{T('Achievement')}}</h1>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Back from '@/components/Back.vue';

export default defineComponent({
    name: 'Achievement',
    inject: ['T'],
    components: {
        Back,
    },
});
</script>

<style scoped>
</style>
