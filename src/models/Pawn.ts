import { BoardCoords } from "../interfaces/BoardCoords";
import { BoardItem } from "./BoardItem";
import { Figure } from "./Figure";
import { FigureColor } from "../enums/FigureColor";

export class Pawn extends Figure {
    getAvailablePositions(boardItems: BoardItem[][]): BoardCoords[] {
        const direction = this.color === FigureColor.white ? -1 : 1;

        const possibleMoves: BoardCoords[] = [];

        const regularMovePos = {
            ...this.boardCoords,
            row: this.boardCoords.row + direction,
        };

        if (Pawn.isEmptyField(boardItems, regularMovePos)) {
            possibleMoves.push(regularMovePos);
        }

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

        possibleMoves.push(
            ...this.getAttackPositions(boardItems)
                .map(({ row, col }) => ({ coords: { row, col }, item: boardItems[row][col] }))
                .filter(({ coords, item }) => item?.figure && item.figure.color !== this.color)
                .map(({ coords }) => coords),
        );

        return possibleMoves;
    }

    getAttackPositions(boardItems: BoardItem[][]): BoardCoords[] {
        const direction = this.color === FigureColor.white ? -1 : 1;

        return [
            {
                row: this.boardCoords.row + direction,
                col: this.boardCoords.col - 1,
            },

            {
                row: this.boardCoords.row + direction,
                col: this.boardCoords.col + 1,
            },
        ];
    }
}
