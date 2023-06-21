import { ChessFigure } from "../interfaces/ChessFigure";
import { Texture } from "pixi.js";
import { BoardCoordinates } from "../interfaces/BoardCoordinates";

export class Rook implements ChessFigure {
    getAvailablePlaces(row: number, col: number, boardItems: any[][]): BoardCoordinates[] {
        return [];
    }
    black = {
        availableUnits: 2,
        isInitialPlace: (row: number, col: number) => (row === 0 && col === 0) || (row === 0 && col === 7),
        normal: Texture.from("b_rook_ns.png"),
        active: Texture.from("b_rook.png"),
    };
    white = {
        availableUnits: 2,
        isInitialPlace: (row: number, col: number) => (row === 7 && col === 0) || (row === 7 && col === 7),
        normal: Texture.from("w_rook_ns.png"),
        active: Texture.from("w_rook.png"),
    };
}
