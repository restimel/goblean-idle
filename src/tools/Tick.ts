import { Action, Store, TickInfo } from '@/Types';

export function convertToTicks(duration: number, tickInfo: TickInfo): bigint {
    return BigInt(duration) / tickInfo.tickDuration;
}

export function convertToDuration(ticks: bigint, tickInfo: TickInfo): number {
    return Number(ticks * tickInfo.tickDuration);
}

/**
 * @returns [nbTick, duration]
 */
export function computeTick(tickInfo: TickInfo): bigint {
    const now = Date.now();
    if (tickInfo.nextActionDate < tickInfo.lastActionDate) {
        tickInfo.nextActionDate = Infinity;
    }
    const targetDate = Math.min(tickInfo.nextActionDate, now);
    const nbTick = convertToTicks(targetDate - tickInfo.lastActionDate, tickInfo);

    return nbTick;
};

function doActions(tickInfo: TickInfo): boolean {
    /* Compute nb Tick to do */
    const nbTick = computeTick(tickInfo);
    if (nbTick === 0n) {
        /* This break the doActions recursive loop */
        return false;
    }
    tickInfo.lastActionDate += convertToDuration(nbTick, tickInfo);

    const remove: Set<bigint> = new Set();
    const add: Action[] = [];

    /* Apply all actions */
    for (let action of tickInfo.actions) {
        const { start, stop } = action.action(nbTick, tickInfo.lastActionDate);
        stop.forEach((id) => remove.add(id));
        add.push(...start);
    }

    /* Apply change in action list */
    removeActions(remove, tickInfo);
    addActions(add, tickInfo);

    /* Compute the next same actions period */
    const nextDate = tickInfo.actions.reduce((date, action) => {
        const endAt = action.endAt;
        if (endAt < nextDate && endAt > tickInfo.lastActionDate) {
            return endAt;
        }
        return date;
    }, Infinity);
    tickInfo.nextActionDate = nextDate;

    /* repeat to apply next available ticks */
    return true;
}

export function runActions(store: Store) {
    const tickInfo = store.tickInfo;

    while(doActions(tickInfo)) {
        /* just wait that doActions return false */
    }
}

export function addActions(actions: Action[], tickInfo: TickInfo) {
    tickInfo.actions.push(...actions);
}

export function removeActions(actionsId: Set<bigint>, tickInfo: TickInfo) {
    tickInfo.actions = tickInfo.actions.filter((action) => actionsId.has(action.id));
}
