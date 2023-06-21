import { ChessFigure } from "../interfaces/ChessFigure";
import { Texture } from "pixi.js";
import { BoardCoordinates } from "../interfaces/BoardCoordinates";

export class Queen implements ChessFigure {
    black = {
        availableUnits: 1,
        isInitialPlace: (row: number, col: number) => row === 0 && col === 3,
        normal: Texture.from("b_queen_ns.png"),
        active: Texture.from("b_queen.png"),
    };

    white = {
        availableUnits: 1,
        isInitialPlace: (row: number, col: number) => row === 7 && col === 3,
        normal: Texture.from("w_queen_ns.png"),
        active: Texture.from("w_queen.png"),
    };

    getAvailablePlaces(row: number, col: number, boardItems: any[][]): BoardCoordinates[] {
        return [];
    }
}
