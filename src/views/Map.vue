<template>
    <div class="map">
        <Back />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Back from '@/components/Back.vue';

export default defineComponent({
    name: 'Map',
    components: {
        Back,
    },
});
</script>

<style scoped>
</style>
