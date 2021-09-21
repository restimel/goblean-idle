
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
