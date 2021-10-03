<template>
    <teleport to="#app">
        <transition name="bounce" appear>
            <div v-if="!!title"
                class="notification"
                :class="type"
                @click="dismiss"
            >
                <header>{{title}}</header>
                <p>{{message}}</p>
            </div>
        </transition>
    </teleport>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';
import { injectStrict, notificationDismiss } from '@/utils';
import { storeInject } from '@/symbols';
import { Notification } from '@/Types';

export default defineComponent({
    name: 'Notification',
    setup() {
        const store= injectStrict(storeInject);
        const notificationStore = computed(() => store.tools.notification);
        const message = computed(() => notificationStore.value && notificationStore.value.message || '');
        const title = computed(() => notificationStore.value && notificationStore.value.title);
        const type = computed(() => notificationStore.value && notificationStore.value.type || 'info');
        const close = () => {
            clearTimeout(delayTimer);
            notificationDismiss(store);
        }
        const dismiss = () => {
            close();
            store.states.notificationDismiss++;
        };
        let delayTimer = 0;

        watch([notificationStore], () => {
            clearTimeout(delayTimer);
            const value= notificationStore.value;
            if (!value) {
                return;
            }
            const delay = (value as Notification).delay || 10000;
            delayTimer = setTimeout(close, delay);
        });

        return {
            message,
            title,
            type,
            dismiss,
        };
    },
});
</script>

<style scoped>
.notification {
    position: fixed;
    background-color: var(--notification-bg);
    color: var(--notification-color);
    cursor: pointer;
    padding: 0.5em;
    padding-top: 1em;
    border-radius: 2em;
    bottom: 1em;
    left: 50%;
    --transformation: translate(-50%, 10px);
    transform: var(--transformation);
    max-width: 50%;
    border: 5px solid #ffffffee;
    box-shadow: 0 -3px 25px 5px var(--notification-bg);
    z-index: 1000;
}
.notification.info {
    --notification-bg: var(--notification-bg-info);
    --notification-color: var(--notification-color-info);
}
.notification.succes {
    --notification-bg: var(--notification-bg-succes);
    --notification-color: var(--notification-color-succes);
}
.notification.warning {
    --notification-bg: var(--notification-bg-warning);
    --notification-color: var(--notification-color-warning);
}
.notification.error {
    --notification-bg: var(--notification-bg-error);
    --notification-color: var(--notification-color-error);
}

.notification header {
    font-weight: bold;
}

.notification p {
    font-style: italic;
    max-width: 600px;;
}

.bounce-enter-active {
    animation: bounce-in 1s;
}
.bounce-leave-active {
    animation: bounce-out 0.4s;
}
@keyframes bounce-in {
    0% {
        transform: var(--transformation) scale(0);
    }
    40% {
        transform: var(--transformation) scale(1.2);
    }
    100% {
        transform: var(--transformation) scale(1);
    }
}
@keyframes bounce-out {
    0% {
        transform: var(--transformation) scale(1);
    }
    100% {
        transform: var(--transformation) scale(0);
    }
}

</style>
