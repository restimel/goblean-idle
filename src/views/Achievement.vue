<template>
    <div class="achievement">
        <Back />
        <h1 class="page-title">{{T('Achievement')}}</h1>
        <AchievementItemVue
            v-for="item in list"
            :key="item.title"
            :item="item"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AchievementItem } from '@/Types';
import Back from '@/components/Back.vue';
import AchievementItemVue from '@/components/AchievementItem.vue';

export default defineComponent({
    name: 'Achievement',
    inject: ['T', 'store'],
    data() {
        return {
            list: [{
                title: this.T('First coin'),
                label: this.T('You are not rich yet. But you are on the way.'),
                hint: this.T('Get your 1st gold'),
                condition: () => (this as any).store.achievement.gold1,
                path: '',
                grade: 'bronze',
            }] as AchievementItem[],
        };
    },
    components: {
        Back,
        AchievementItemVue,
    },
});
</script>

<style scoped>
</style>
