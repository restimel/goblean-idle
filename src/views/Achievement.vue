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
import { defineComponent, reactive, computed } from 'vue';
import { injectStrict } from '@/utils';
import { AchievementItem } from '@/Types';
import { storeInject, TInject } from '@/symbols';
import Back from '@/components/Back.vue';
import AchievementItemVue from '@/components/AchievementItem.vue';

export default defineComponent({
    name: 'Achievement',
    setup() {
        const T = injectStrict(TInject);
        const store = injectStrict(storeInject);

        const list = reactive([{
            title: T('First coin'),
            label: T('You are not rich yet. But you are on the way.'),
            hint: T('Get your 1st gold'),
            condition: () => store.achievement.gold1,
            path: '',
            grade: 'bronze',
        }, {
            title: T('All trophies'),
            label: T('Outstanding! You are a Goblean ruler!'),
            hint: T('Get all trophies'),
            condition: () => store.achievement.allTrophies,
            path: '',
            grade: 'diamond',
        }] as AchievementItem[]);

        const nbUnlocked = computed<number>(() => {
            return list.reduce((nb, item) => nb + +item.condition(), 0);
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
