
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

export type AchievementGrade = 'bronze' | 'silver' | 'gold';

export interface AchievementItem {
    title: string; /* displayed below the image */
    label: string; /* Text about the achievement */
    hint: string; /* Text about how to achieve the condition (hidden if secret) */
    secret?: boolean; /* Hide information until condition meet */
    condition: () => boolean;
    path: string; /* svg path to display image */
    grade: AchievementGrade;
}

/* {{{ Store */

export interface Resource {
    gold: bigint;
}

export type Achievement = Record<string, boolean>;

export interface TickInfo {
    tickDuration: bigint;
    lastActionDate: number;
    nextActionDate: number;
    actions: Action[];
}

export interface CreatingStore {
    resource: Resource;
    tickInfo: TickInfo;
    achievement?: Achievement;
}

export interface Store extends CreatingStore {
    achievement: Achievement;
}

/* }}} */
