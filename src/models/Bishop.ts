import { ChessFigure } from "../interfaces/ChessFigure";
import { Texture } from "pixi.js";
import { BoardCoordinates } from "../interfaces/BoardCoordinates";

export class Bishop implements ChessFigure {
    black = {
        availableUnits: 1,
        isInitialPlace: (row: number, col: number) => row === 0 && (col === 2 || col === 5),
        normal: Texture.from("b_bishop_ns.png"),
        active: Texture.from("b_bishop.png"),
    };

    white = {
        availableUnits: 0,
        isInitialPlace: (row: number, col: number) => row === 7 && (col === 2 || col === 5),
        normal: Texture.from("w_bishop_ns.png"),
        active: Texture.from("w_bishop.png"),
    };

    getAvailablePlaces(row: number, col: number, boardItems: any[][]) {
        const possibleMoves: BoardCoordinates[] = [];

        // left up
        if (row > 0 && col > 0) {
            let c = col - 1;
            for (let r = row - 1; r > -1 && c > -1; r--, c--) {
                if (boardItems[r][c].figure) {
                    break;
                }

                possibleMoves.push({ row: r, col: c });
            }
        }

        // // right up
        if (row > 0 && col < 7) {
            let c = col + 1;
            for (let r = row - 1; r > -1 && c < 8; r--, c++) {
                if (boardItems[r][c].figure) {
                    break;
                }

                possibleMoves.push({ row: r, col: c });
            }
        }
        // // left down
        // // right down

        return possibleMoves;
    }
}
