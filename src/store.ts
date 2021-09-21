import { reactive, computed } from 'vue';
import {Store, Resource, TickInfo, CreatingStore, Achievement } from '@/Types';


export default function createStore(): Store {
    const resource: Resource  = {
        gold: 0n,
    };
    const tickInfo: TickInfo = {
        tickDuration: 1000n,
        lastActionDate: 0,
        nextActionDate: Infinity,
        actions: [],
    };

    const store: CreatingStore = reactive({
        resource,
        tickInfo,
    });

    const achievement: Achievement = {
        start: computed(() => store.resource.gold > 0 ) as unknown as boolean,
    };

    store.achievement = achievement;

    return store as Store;
}
