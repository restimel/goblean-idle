import { Notification, Store } from '@/Types';


const notificationList: Notification[] = [];
let indexNotification = 0;

export function notification(store: Store) {
    const notification = notificationList[indexNotification];

    if (notification) {
        store.tools.notification = notification;
        return true;
    }
    return false;
}

export function notificationDismiss(store: Store) {
    store.tools.notification = undefined;
    indexNotification++;
    if (indexNotification > notificationList.length) {
        indexNotification = notificationList.length;
    }
    setTimeout(notification, 500, store);
}

export async function notificationStack(store: Store, messages: Notification[]) {
    notificationList.push(...messages);
    notification(store);
}
