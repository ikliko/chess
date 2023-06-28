import { Figure } from "./Figure";
import { BoardItem } from "./BoardItem";
import { BoardCoords } from "../interfaces/BoardCoords";

export class Bishop extends Figure {
    getAvailablePositions(boardItems: BoardItem[][]): BoardCoords[] {
        const possibleMoves: BoardCoords[] = [];

        // left up
        if (this.boardCoords.row > 0 && this.boardCoords.col > 0) {
            let col = this.boardCoords.col - 1;
            for (let row = this.boardCoords.row - 1; row > -1 && col > -1; row--, col--) {
                if (boardItems[row][col].figure) {
                    break;
                }

                possibleMoves.push({ row, col });
            }
        }

        // // right up
        if (this.boardCoords.row > 0 && this.boardCoords.col < 7) {
            let col = this.boardCoords.col + 1;
            for (let row = this.boardCoords.row - 1; row > -1 && col < 8; row--, col++) {
                if (boardItems[row][col].figure) {
                    break;
                }

                possibleMoves.push({ row, col });
            }
        }
        // left down
        if (this.boardCoords.row < 8 && this.boardCoords.col > 0) {
            let col = this.boardCoords.col - 1;

            for (let row = this.boardCoords.row + 1; row < 8 && col > -1; row++, col--) {
                if (boardItems[row][col].figure) {
                    break;
                }

                possibleMoves.push({ row, col });
            }
        }

        // right down
        if (this.boardCoords.row < 8 && this.boardCoords.col > 0) {
            let col = this.boardCoords.col + 1;

            for (let row = this.boardCoords.row + 1; row < 8 && col < 8; row++, col++) {
                if (boardItems[row][col].figure) {
                    break;
                }

                possibleMoves.push({ row, col });
            }
        }

        return possibleMoves;
    }
}
