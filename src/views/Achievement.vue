<template>
    <div class="achievement">
        <Back />
        <h1 class="page-title">{{T('Achievements')}}</h1>
        <div class="unlocked">
            {{nbUnlocked}} / {{list.length}}
        </div>
        <div class="achievement-gallery">
            <AchievementItemVue
                v-for="item in list"
                :key="item.title"
                :item="item"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { injectStrict } from '@/utils';
import { getFullList } from '@/tools/Achievements';
import { storeInject, TInject } from '@/symbols';
import Back from '@/components/Back.vue';
import AchievementItemVue from '@/components/AchievementItem.vue';

export default defineComponent({
    name: 'Achievement',
    setup() {
        const T = injectStrict(TInject);
        const store = injectStrict(storeInject);

        const fullList = getFullList(store, T);
        const list = computed(() => fullList.filter(
            (achievement) => achievement.condition() || !achievement.hide || !achievement.hide()
        ));

        const nbUnlocked = computed<number>(() => {
            return list.value.reduce((nb, item) => nb + +item.condition(), 0);
        });

        return {
            T,
            list,
            nbUnlocked,
        };
    },

    components: {
        Back,
        AchievementItemVue,
    },
});
</script>

<style scoped>
.achievement-gallery {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    gap: 10px;
    flex-wrap: wrap;
}
</style>
