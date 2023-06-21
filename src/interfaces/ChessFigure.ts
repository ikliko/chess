import { BoardCoordinates } from "./BoardCoordinates";
import { ChessFigureSide } from "./ChessFigureSide";

export interface ChessFigure {
    getAvailablePlaces: (row: number, col: number, boardItems: any[][]) => BoardCoordinates[];
    black: ChessFigureSide;
    white: ChessFigureSide;
}
