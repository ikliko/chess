import { Texture } from "pixi.js";

export interface ChessFigureSide {
    availableUnits: number;
    isInitialPlace: (row: number, col: number) => boolean;
    normal: Texture;
    active: Texture;
}
