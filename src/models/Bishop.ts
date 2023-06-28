import { Figure } from "./Figure";
import { BoardItem } from "./BoardItem";
import { BoardCoords } from "../interfaces/BoardCoords";

export class Bishop extends Figure {
    getAvailablePositions(boardItems: BoardItem[][]): BoardCoords[] {
        return this.getAttackPositions(boardItems);
    }

    getAttackPositions(boardItems: BoardItem[][]): BoardCoords[] {
        return [
            ...this.getUpLeftDiagonalMove(boardItems),
            ...this.getUpRightDiagonalMove(boardItems),
            ...this.getDownLeftDiagonalMove(boardItems),
            ...this.getDownRightDiagonalMove(boardItems),
        ];
    }
}
