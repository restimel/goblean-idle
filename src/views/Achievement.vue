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
            title: T('Annoying'),
            label: T('This was only some useless texts'),
            hint: T('Close 10 notifications'),
            condition: () => store.achievement.dismiss10,
            path: '',
            grade: 'bronze',
        }, {
            title: T('Disturbing'),
            label: T('Why is there so much text to read?'),
            hint: T('Close 50 notifications'),
            condition: () => store.achievement.dismiss50,
            path: '',
            grade: 'silver',
        }, {
            title: T('Exasperating'),
            label: T('I am wondering why someone written these texts.'),
            hint: T('Close 100 notifications'),
            condition: () => store.achievement.dismiss100,
            path: '',
            grade: 'gold',
        }, {
            title: T('Rebarbative'),
            label: T('Have you been notified that...? Ok you don\'t care!'),
            hint: T('Close 1000 notifications'),
            condition: () => store.achievement.dismiss1000,
            path: '',
            grade: 'diamond',
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
