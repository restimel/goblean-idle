
export type SupportedLanguage = 'en';

export interface I18n {
    _: (str: string, ...args: any[]) => string;
    changeLocale: (locale: SupportedLanguage) => boolean;
    locale: string;
    projectName: string;
    projectSubName: string;
}

export interface DBAction<T = Record<string, number | bigint>> {
    id: bigint;
    name: string;
    endAt: bigint;
    states: T;
}

export interface Action<T = Record<string, number | bigint>> extends DBAction<T> {
    action: (nbTick: bigint, currentTick: bigint, action: Action) => ActionModifier;
}

export interface ActionModifier {
    stop: bigint[];
    start: Action[];
}

export type AchievementGrade = 'jade' | 'bronze' | 'silver' | 'gold' | 'diamond';

export interface AchievementItem {
    title: string; /* displayed below the image */
    label: string; /* Text about the achievement */
    hint: string; /* Text about how to achieve the condition (hidden if secret) */
    secret?: boolean; /* Hide information until condition meet */
    secretTitle?: string; /* Display this title until it has been unlocked */
    condition: () => boolean;
    hide?: () => boolean; /* If the function return true, the achievement is not shown (except it has already been unlocked) */
    path: string; /* svg path to display image */
    grade: AchievementGrade;
}

export interface Notification {
    title: string;
    message?: string;
    delay?: number;
    type?: 'success' | 'warning' | 'error' | 'info';
}

/* {{{ Store */

export interface Resource {
    gold: bigint;
}

export interface States {
    notificationDismiss: bigint;
    cookieAccepted: boolean;
}

export interface Tools {
    notification?: Notification;
    saveTimer?: number;
    loadStore: (dbStore: Partial<DBStore> | undefined) => Promise<void>;
    saveStore: () => Promise<void>;
    saveInterval: () => void;
}

export interface Settings {
    saveDelay: number; /* ms */
    delayCheckTick: number /* ms */
}

export type Achievement = Record<string, boolean>;

export interface TickInfo {
    tickDuration: bigint; /* duration between 2 ticks in ms */
    lastActionDate: number; /* last date where actions were done */
    nextActionTick: bigint; /* next tick where actions are expected to be done (there should be no change before) */
    lastActionTick: bigint; /* tick timestamp when last actions were done */
    actions: Action[]; /* list of all current actions */
}

export interface DBStore {
    userSession: string;
    settings: Settings;
    resource: Resource;
    states: States;
    tickInfo: TickInfo;
}

export interface CreatingStore extends DBStore {
    achievement?: Achievement;
    tools: Tools;
    isReady: boolean;
}

export interface Store extends CreatingStore {
    achievement: Achievement;
}

/* }}} */
