import { reactive, computed, ComputedRef } from 'vue';
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

    const achievement: Record<string, ComputedRef<boolean>> = {
        gold1: computed(() => store.resource.gold > 0 ),
        allTrophies: computed(() => {
            let nb = 0;
            const achievements = Object.values((store as Store).achievement);
            for (const value of achievements) {
                nb += +value;
            }
            return nb >= achievements.length - 1;
        }),
    };

    store.achievement = achievement as unknown as Achievement;

    return store as Store;
}
