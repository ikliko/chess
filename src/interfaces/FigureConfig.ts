import { Texture } from "pixi.js";

export interface FigureConfig {
    pointerDownHandler: () => void;
    texture: Texture;
    figSize: number;
    boardX: number;
    boardY: number;
    figPaddings: number;
    cellSize: number;
    col: number;
    row: number;
}
