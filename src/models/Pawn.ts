import { ChessFigure } from "../interfaces/ChessFigure";
import { Texture } from "pixi.js";
import { BoardCoordinates } from "../interfaces/BoardCoordinates";

export class Pawn implements ChessFigure {
    black = {
        availableUnits: 8,
        isInitialPlace: (row: number, col: number) => row === 1,
        normal: Texture.from("b_pawn_ns.png"),
        active: Texture.from("b_pawn.png"),
    };
    white = {
        availableUnits: 8,
        isInitialPlace: (row: number, col: number) => row === 6,
        normal: Texture.from("w_pawn_ns.png"),
        active: Texture.from("w_pawn.png"),
    };

    getAvailablePlaces(row: number, col: number, boardItems: any[][]): BoardCoordinates[] {
        return [];
    }
}
