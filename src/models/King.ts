import { Figure } from "./Figure";
import { BoardItem } from "./BoardItem";
import { BoardCoords } from "../interfaces/BoardCoords";

export class King extends Figure {
    check = false;

    getAvailablePositions(boardItems: BoardItem[][]): BoardCoords[] {
        const moves: BoardCoords[] = this.getAttackPositions(boardItems);

        this.checkPositions(boardItems, moves);

        return moves;
    }

    getAttackPositions(boardItems: BoardItem[][]): BoardCoords[] {
        return [
            ...this.getUpMoves(boardItems, 1),
            ...this.getDownMoves(boardItems, 1),
            ...this.getLeftMoves(boardItems, 1),
            ...this.getRightMoves(boardItems, 1),
            ...this.getUpLeftDiagonalMove(boardItems, 1),
            ...this.getUpRightDiagonalMove(boardItems, 1),
            ...this.getDownLeftDiagonalMove(boardItems, 1),
            ...this.getDownRightDiagonalMove(boardItems, 1),
        ];
    }

    checkPositions(boardItems: BoardItem[][], moves: BoardCoords[]) {
        const unavailableLocations: (BoardCoords | undefined)[] = boardItems
            .flat()
            .filter(({ figure }) => figure && figure.color !== this.color)
            .map((boardItem) => boardItem.figure?.getAttackPositions(boardItems))
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
    }
}
