import { inject, InjectionKey } from 'vue';
import { Notification, Store } from '@/Types';
import { notificationStack } from '@/tools/Notifications';

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

export async function notification(store: Store, messages: Notification | Notification[]) {
    const notifications = Array.isArray(messages) ? messages : [messages];
    notificationStack(store, notifications);
}

export { notificationDismiss } from '@/tools/Notifications';
