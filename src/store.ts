import { reactive, computed, ComputedRef } from 'vue';
import {
    Store,
    Resource,
    TickInfo,
    CreatingStore,
    Achievement,
    States,
} from '@/Types';


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
    const states: States = {
        notificationDismiss: 0n,
        cookieAccepted: false,
    };

    const store: CreatingStore = reactive({
        resource,
        states,
        tickInfo,
        tools: {},
    });

    const achievement: Record<string, ComputedRef<boolean>> = {
        gold1: computed(() => store.resource.gold > 0 ),
        dismiss10: computed(() => store.states.notificationDismiss >= 10),
        dismiss50: computed(() => store.states.notificationDismiss >= 50),
        dismiss100: computed(() => store.states.notificationDismiss >= 100),
        dismiss1000: computed(() => store.states.notificationDismiss >= 1000),
        allTrophies: computed(() => {
            let nb = 0;
            const achievements = Object.values((store as Store).achievement);
            for (const value of achievements) {
                nb += +value;
            }
            return nb >= achievements.length - 1;
        }),
        secretCookie: computed(() => store.states.cookieAccepted ),
    };

    store.achievement = achievement as unknown as Achievement;

    return store as Store;
}
