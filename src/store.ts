import { reactive, computed, ComputedRef } from 'vue';
import {
    Store,
    Resource,
    TickInfo,
    CreatingStore,
    Achievement,
    States,
    Settings,
    DBStore,
} from '@/Types';
import { sleep } from '@/utils';
import {
    runActions, startRepetitiveActions,
} from '@/tools/Tick';
import { restoreAction } from '@/tools/Actions';

interface StoreArgument {
    loadStore?: () => Promise<DBStore | undefined>;
    saveStore?: (data: DBStore) => Promise<void>;
    isTest?: boolean;
}

export default function createStore({loadStore, saveStore, isTest}: StoreArgument = {}): Store {
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
        nextActionTick: 1_000_000_000n,
        lastActionTick: 0n,
        actions: [],
    };
    const states: States = {
        notificationDismiss: 0n,
        cookieAccepted: false,
    };


    const cStore: CreatingStore = reactive({
        userSession: 'TODO!!!',
        isReady: false,
        settings,
        resource,
        states,
        tickInfo,
        tools: {
            async saveStore() {
                if (store.isReady) {
                    checkStoreValue(store);
                    saveStore && saveStore(store);
                }
            },
            async loadStore(dbStore: Partial<DBStore> | undefined) {
                if (dbStore) {
                    dbStore.settings && Object.assign(store.settings, dbStore.settings);
                    dbStore.resource && Object.assign(store.resource, dbStore.resource);
                    dbStore.states && Object.assign(store.states, dbStore.states);
                    dbStore.tickInfo && Object.assign(store.tickInfo, dbStore.tickInfo);
                    if (dbStore.userSession) {
                        store.userSession = dbStore.userSession;
                    }
                }
                await storeReady();
            },
            saveInterval() {
                clearInterval(store.tools.saveTimer || 0);
                store.tools.saveTimer = setInterval(() => {
                    store.tools.saveStore();
                }, store.settings.saveDelay);
            },
        },
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

    const storeReady = async () => {
        checkStoreValue(store);

        await sleep(5);
        store.isReady = true;
        runActions(store);
        if (saveStore) {
            saveStore(store);
        }
        await sleep(10);
        if (!isTest) {
            startRepetitiveActions(store);
            store.tools.saveInterval();
        }
    };

    if (loadStore) {
        loadStore().then(store.tools.loadStore);
    } else {
        storeReady();
    }

    return store;
}

export function checkStoreValue(store: Store): Store {
    if (store.tickInfo.tickDuration < 1n) {
        store.tickInfo.tickDuration = 1n;
    }

    if (store.settings.saveDelay < 1000) {
        store.settings.saveDelay = 1000;
        store.tools.saveInterval();
    }

    if (store.settings.delayCheckTick < 1) {
        store.settings.delayCheckTick = 1;
    }

    store.tickInfo.actions.forEach((action, idx, list) => {
        if (typeof action.action !== 'function') {
            list[idx] = restoreAction(store, action);
        }
    });

    return store;
}
