import { reactive, computed, ComputedRef, watch } from 'vue';
import {
    Store,
    Resource,
    TickInfo,
    CreatingStore,
    Achievement,
    States,
    Settings,
} from '@/Types';
import {
    loadStore,
    saveStore as saveStoreDB,
} from '@/tools/DB';
import { sleep } from './utils';


export default function createStore(): Store {
    const settings: Settings = {
        saveDelay: 10000,
    };
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


    const cStore: CreatingStore = reactive({
        userSession: 'TODO...',
        isReady: false,
        settings,
        resource,
        states,
        tickInfo,
        tools: {},
    });

    const achievement: Record<string, ComputedRef<boolean>> = {
        gold1: computed(() => cStore.resource.gold > 0 ),
        dismiss10: computed(() => cStore.states.notificationDismiss >= 10),
        dismiss50: computed(() => cStore.states.notificationDismiss >= 50),
        dismiss100: computed(() => cStore.states.notificationDismiss >= 100),
        dismiss1000: computed(() => cStore.states.notificationDismiss >= 1000),
        allTrophies: computed(() => {
            let nb = 0;
            const achievements = Object.values((cStore as Store).achievement);
            for (const value of achievements) {
                nb += +value;
            }
            return nb >= achievements.length - 1;
        }),
        secretCookie: computed(() => cStore.states.cookieAccepted ),
    };

    cStore.achievement = achievement as unknown as Achievement;
    const store = cStore as Store;

    loadStore().then(async (dbStore) => {
        if (dbStore) {
            Object.assign(store.settings, dbStore.settings);
            Object.assign(store.resource, dbStore.resource);
            Object.assign(store.states, dbStore.states);
            Object.assign(store.tickInfo, dbStore.tickInfo);
            store.userSession = dbStore.userSession;
        }
        checkStoreValue(store);

        await sleep(10);
        store.isReady = true;
        saveInterval(store);
    });

    return store;
}

export function checkStoreValue(store: Store) {
    if (store.settings.saveDelay < 1000) {
        store.settings.saveDelay = 1000;
        saveInterval(store);
    }

    return store;
}

export function saveInterval(store: Store) {
    clearInterval(store.tools.saveTimer || 0);
    store.tools.saveTimer = setInterval(() => {
        saveStore(store);
    }, store.settings.saveDelay);
}

export function saveStore(store: Store): void {
    if (store.isReady) {
        checkStoreValue(store);
        saveStoreDB(store);
    }
}