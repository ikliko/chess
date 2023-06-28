import { Figure } from "./Figure";
import { BoardItem } from "./BoardItem";
import { BoardCoords } from "../interfaces/BoardCoords";

export class King extends Figure {
    check = false;

    getAvailablePositions(boardItems: BoardItem[][], skipOppositeKingCheck = false): BoardCoords[] {
        const moves: BoardCoords[] = [
            ...this.getUpMoves(boardItems, 1),
            ...this.getDownMoves(boardItems, 1),
            ...this.getLeftMoves(boardItems, 1),
            ...this.getRightMoves(boardItems, 1),
            ...this.getUpLeftDiagonalMove(boardItems, 1),
            ...this.getUpRightDiagonalMove(boardItems, 1),
            ...this.getDownLeftDiagonalMove(boardItems, 1),
            ...this.getDownRightDiagonalMove(boardItems, 1),
        ];

        if (!skipOppositeKingCheck) {
            this.oppositeKingOverlapMoves(boardItems, moves);
        }

        // this.checkPositions(boardItems, moves);

        return moves;
    }

    private oppositeKingOverlapMoves(boardItems: BoardItem[][], moves: BoardCoords[]) {
        const oppositeKing: BoardItem | undefined = boardItems
            .flat()
            .find((item: BoardItem) => item.figure instanceof King && this !== item.figure);

        if (!oppositeKing || !oppositeKing.figure) {
            return;
        }

        const distance = {
            col: Math.abs(oppositeKing.figure.boardCoords.col - this.boardCoords.col),
            row: Math.abs(oppositeKing.figure.boardCoords.row - this.boardCoords.row),
        };

        if (distance.col > 2 || distance.row > 2) {
            return;
        }

        const oppositeMoves = (oppositeKing.figure as King).getAvailablePositions(boardItems, true);

        oppositeMoves.forEach(({ row: oppositeRow, col: oppositeCol }) => {
            const idx = moves.findIndex(({ row, col }) => row === oppositeRow && col === oppositeCol);

            if (idx < 0) {
                return;
            }

            moves.splice(idx, 1);
        });
    }

    checkPositions(boardItems: BoardItem[][], moves: BoardCoords[]) {
        const unavailableLocations: (BoardCoords | null)[] = boardItems
            .flat()
            .filter(({ figure }) => figure && figure.color !== this.color && !(figure instanceof King))
            .map((boardItem) => boardItem.figure && boardItem.figure.getAvailablePositions(boardItems))
            .filter((moves) => moves?.length)
            .flat();

        unavailableLocations.forEach((unavailableCoords) => {
            if (!unavailableCoords) {
                return;
            }

            const { col: uCol, row: uRow } = unavailableCoords;

            const idx = moves.findIndex(({ row, col }) => row === uRow && col === uCol);

            if (idx < 0) {
                return;
            }

            moves.splice(idx, 1);
        });
        console.log(unavailableLocations);
    }
}
