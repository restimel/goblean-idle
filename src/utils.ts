import { inject, InjectionKey } from 'vue';
import { Store } from '@/Types';
import { storeInject } from './symbols';

export function injectStrict<T>(key: InjectionKey<T>, fallback?: T): T {
    const resolved = inject(key, fallback);
    if (!resolved) {
        throw new Error(`Could not resolve ${key.description}`);
    }
    return resolved;
}

export function sleep(delay: number) {
    return new Promise((success) => {
        setTimeout(success, delay);
    });
}

export async function notification(store: Store, title: string, message?: string, delay = 10000) {
    if (store.tools.notification) {
        notificationClear(store);
        await sleep(0);
    }

    store.tools.notification = {
        title,
        message,
        delay,
    };
}

export function notificationClear(store: Store) {
    store.tools.notification = undefined;
}

interface NotificationArg {
    title: string;
    message?: string;
    delay?: number;
}

export async function notificationStack(store: Store, messages: NotificationArg[]) {
    for (const message of messages) {
        await notification(store, message.title, message.message, message.delay);
        await sleep(3000);
    }
}
