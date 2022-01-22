

export interface ICell {
    value?: number;
    status: CellStatus;
}

export enum CellStatus { none, changed, fibonacci }