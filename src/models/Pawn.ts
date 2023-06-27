import { BoardCoords } from "../interfaces/BoardCoords";
import { BoardItem } from "./BoardItem";
import { Figure } from "./Figure";
import { FigureColor } from "../enums/FigureColor";

export class Pawn extends Figure {
    getAvailablePositions(boardItems: BoardItem[][]): BoardCoords[] {
        const direction = this.color === FigureColor.white ? -1 : 1;

        const possibleMoves: BoardCoords[] = [];

        // regular move
        const regularMovePos = {
            ...this.boardCoords,
            row: this.boardCoords.row + direction,
        };

        if (Pawn.isEmptyField(boardItems, regularMovePos)) {
            possibleMoves.push(regularMovePos);
        }

        // // initial move
        const initialMovePos = {
            ...this.boardCoords,
            row: this.boardCoords.row + direction * 2,
        };

        if (
            Pawn.isEmptyField(boardItems, regularMovePos) &&
            Pawn.isEmptyField(boardItems, initialMovePos) &&
            this.isInitialPosition()
        ) {
            possibleMoves.push(initialMovePos);
        }

        // left attack
        const leftAttackPos = {
            row: regularMovePos.row,
            col: this.boardCoords.col - 1,
        };

        if (this.isAttack(leftAttackPos, boardItems)) {
            possibleMoves.push(leftAttackPos);
        }

        // right attack
        const rightAttackPos = {
            row: regularMovePos.row,
            col: this.boardCoords.col + 1,
        };

        if (this.isAttack(rightAttackPos, boardItems)) {
            possibleMoves.push(rightAttackPos);
        }

        return possibleMoves;
    }
}
