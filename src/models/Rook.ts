import { Figure } from "./Figure";
import { BoardItem } from "./BoardItem";
import { BoardCoords } from "../interfaces/BoardCoords";

export class Rook extends Figure {
    public getAvailablePositions(boardItems: BoardItem[][]): BoardCoords[] {
        return this.getAttackPositions(boardItems);
    }

    public getAttackPositions(boardItems: BoardItem[][]): BoardCoords[] {
        return [
            ...this.getUpMoves(boardItems),
            ...this.getDownMoves(boardItems),
            ...this.getRightMoves(boardItems),
            ...this.getLeftMoves(boardItems),
        ];
    }
}
