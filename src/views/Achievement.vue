<template>
    <div class="achievement">
        <Back />
        <h1 class="page-title">Achievement</h1>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Back from '@/components/Back.vue';

export default defineComponent({
    name: 'Achievement',
    components: {
        Back,
    },
});
</script>

<style scoped>
</style>
