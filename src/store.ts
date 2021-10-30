import { reactive, computed, ComputedRef } from 'vue';
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
import { sleep } from '@/utils';
import {
    runActions, startRepetitiveActions,
} from '@/tools/Tick';
import { restoreAction } from '@/tools/Actions';


export default function createStore(): Store {
    const settings: Settings = {
        saveDelay: 10000,
        delayCheckTick: 1000,
    };
    const resource: Resource  = {
        gold: 0n,
    };
    const tickInfo: TickInfo = {
        tickDuration: 200n,
        lastActionDate: Date.now(),
        nextActionDate: Infinity,
        lastActionTick: 0n,
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

        await sleep(5);
        store.isReady = true;
        runActions(store);
        saveStore(store);
        await sleep(10);
        startRepetitiveActions(store);
        saveInterval(store);
    });

    return store;
}

export function checkStoreValue(store: Store): Store {
    if (store.tickInfo.tickDuration < 1n) {
        store.tickInfo.tickDuration = 1n;
    }

    if (store.settings.saveDelay < 1000) {
        store.settings.saveDelay = 1000;
        saveInterval(store);
    }

    if (store.settings.delayCheckTick < 500) {
        store.settings.delayCheckTick = 500;
    }

    store.tickInfo.actions.forEach((action, idx, list) => {
        if (typeof action.action !== 'function') {
            list[idx] = restoreAction(store, action);
        }
    });

    return store;
}

export function saveInterval(store: Store): void {
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