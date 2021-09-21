
export interface Action {
    id: bigint;
    name: string;
    endAt: number;
    action: (nbTick: bigint, currentDate: number) => ActionModifier;
}

export interface ActionModifier {
    stop: bigint[];
    start: Action[];
}

/* {{{ Store */

    interface Resource {
        gold: bigint;
    }

    interface Achievement {
        start: boolean;
    }

    interface TickInfo {
        tickDuration: bigint;
        lastActionDate: number;
        nextActionDate: number;
        actions: Action[];
    }

    interface CreatingStore {
        resource: Resource;
        tickInfo: TickInfo;
        achievement?: Achievement;
    }

    export interface Store extends CreatingStore {
        achievement: Achievement;
    }

/* }}} */
