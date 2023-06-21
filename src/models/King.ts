import { ChessFigure } from "../interfaces/ChessFigure";
import { BoardCoordinates } from "../interfaces/BoardCoordinates";
import { Texture } from "pixi.js";

export class King implements ChessFigure {
    black = {
        availableUnits: 1,
        isInitialPlace: (row: number, col: number) => row === 0 && col === 4,
        normal: Texture.from("b_king_ns.png"),
        active: Texture.from("w_king.png"),
    };

    white = {
        availableUnits: 1,
        isInitialPlace: (row: number, col: number) => row === 7 && col === 4,
        normal: Texture.from("w_king_ns.png"),
        active: Texture.from("w_king.png"),
    };

    getAvailablePlaces(row: number, col: number, boardItems: any[][]): BoardCoordinates[] {
        return [];
    }
}
