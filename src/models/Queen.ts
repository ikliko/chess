import { Figure } from "./Figure";
import { BoardItem } from "./BoardItem";
import { BoardCoords } from "../interfaces/BoardCoords";

export class Queen extends Figure {
    public getAvailablePositions(boardItems: BoardItem[][]): BoardCoords[] {
        return this.getAttackPositions(boardItems);
    }

    public getAttackPositions(boardItems: BoardItem[][]): BoardCoords[] {
        return [
            ...this.getUpMoves(boardItems),
            ...this.getDownMoves(boardItems),
            ...this.getRightMoves(boardItems),
            ...this.getLeftMoves(boardItems),

            ...this.getUpLeftDiagonalMove(boardItems),
            ...this.getUpRightDiagonalMove(boardItems),
            ...this.getDownLeftDiagonalMove(boardItems),
            ...this.getDownRightDiagonalMove(boardItems),
        ];
    }
}
