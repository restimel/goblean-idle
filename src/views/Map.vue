<template>
    <div class="map">
        gold: {{gold}}
        <Back />
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import Back from '@/components/Back.vue';
import { injectStrict } from '@/utils';
import { storeInject } from '@/symbols';
import { addActions } from '@/tools/Tick';
import { createAction } from '@/tools/Actions';

export default defineComponent({
    name: 'Map',
    setup() {
        const store = injectStrict(storeInject);

        addActions([createAction(
            'mine-gold',
            store,
            store.tickInfo.lastActionTick,
        )], store.tickInfo);

        return {
            gold: computed(() => store.resource.gold),
        };
    },
    components: {
        Back,
    },
});
</script>

<style scoped>
</style>
