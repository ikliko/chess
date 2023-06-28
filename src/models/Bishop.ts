import { Figure } from "./Figure";
import { BoardItem } from "./BoardItem";
import { BoardCoords } from "../interfaces/BoardCoords";

export class Bishop extends Figure {
    public getAvailablePositions(boardItems: BoardItem[][]): BoardCoords[] {
        return this.getAttackPositions(boardItems);
    }

    public getAttackPositions(boardItems: BoardItem[][]): BoardCoords[] {
        return [
            ...this.getUpLeftDiagonalMove(boardItems),
            ...this.getUpRightDiagonalMove(boardItems),
            ...this.getDownLeftDiagonalMove(boardItems),
            ...this.getDownRightDiagonalMove(boardItems),
        ];
    }
}
