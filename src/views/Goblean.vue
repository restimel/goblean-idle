<template>
    <div class="goblean">
        <Back />
        <h1 class="page-title">{{T('Add a new Goblean')}}</h1>

        <label>
            {{T('Enter the EAN code:')}}
            <input
                :placeholder="T('EAN code bar')"
                type="text"
                @input="(evt) => ean = evt.currentTarget.value"
            >
        </label>
        <div v-if="!!goblean" class="stats">
            <div class="charac">Speed</div><div class="value">{{goblean.speed}}</div>
            <div class="charac">Force</div><div class="value">{{goblean.force}}</div>
            <div class="charac">Stamina</div><div class="value">{{goblean.stamina}}</div>
            <div class="charac">Intelligence</div><div class="value">{{goblean.intelligence}}</div>
            <div class="charac">Craft</div><div class="value">{{goblean.craft}}</div>
            <div class="charac">Learning</div><div class="value">{{goblean.learning}}</div>
            <div class="charac">Social</div><div class="value">{{goblean.social}}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import Back from '@/components/Back.vue';
import { injectStrict } from '@/utils';
import { storeInject, TInject } from '@/symbols';
import { createGoblean } from '@/tools/Goblean';

export default defineComponent({
    name: 'Goblean',
    setup() {
        const store = injectStrict(storeInject);
        const T = injectStrict(TInject);

        const ean = ref('');

        const goblean = computed(() => {
            return createGoblean(ean.value, true);
        });

        return {
            ean,
            goblean,
            T,
        };
    },
    components: {
        Back,
    },
});
</script>

<style scoped>
.stats {
    margin-top: 2em;
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.stats .charac {
    text-align: end;
    padding: 5px;
    font-weight: bold;
}

.stats .value {
    text-align: start;
    padding: 5px;
    font-style: italic;
}
</style>
