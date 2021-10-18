
export type SupportedLanguage = 'en';

export interface I18n {
    _: (str: string, ...args: any[]) => string;
    changeLocale: (locale: SupportedLanguage) => boolean;
    locale: string;
    projectName: string;
    projectSubName: string;
}

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
}

export interface Settings {
    saveDelay: number;
}

export type Achievement = Record<string, boolean>;

export interface TickInfo {
    tickDuration: bigint;
    lastActionDate: number;
    nextActionDate: number;
    actions: Action[];
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
