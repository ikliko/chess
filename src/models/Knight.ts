import { Figure } from "./Figure";
import { BoardItem } from "./BoardItem";
import { BoardCoords } from "../interfaces/BoardCoords";

export class Knight extends Figure {
    getAvailablePositions(boardItems: BoardItem[][]): BoardCoords[] {
        const positions: BoardCoords[] = [];

        // up left
        const upLeftPos: BoardCoords = {
            col: this.boardCoords.col - 1,
            row: this.boardCoords.row - 2,
        };

        if (
            this.isInsideBoard(upLeftPos) &&
            (Knight.isEmptyField(boardItems, upLeftPos) || this.isAttack(upLeftPos, boardItems))
        ) {
            positions.push(upLeftPos);
        }

        // up right
        const upRightPos: BoardCoords = {
            col: this.boardCoords.col + 1,
            row: this.boardCoords.row - 2,
        };

        if (
            this.isInsideBoard(upRightPos) &&
            (Knight.isEmptyField(boardItems, upRightPos) || this.isAttack(upRightPos, boardItems))
        ) {
            positions.push(upRightPos);
        }

        // left up
        const leftUpPos: BoardCoords = {
            col: this.boardCoords.col - 2,
            row: this.boardCoords.row - 1,
        };

        if (
            this.isInsideBoard(leftUpPos) &&
            (Knight.isEmptyField(boardItems, leftUpPos) || this.isAttack(leftUpPos, boardItems))
        ) {
            positions.push(leftUpPos);
        }

        // right up
        const rightUpPos: BoardCoords = {
            col: this.boardCoords.col + 2,
            row: this.boardCoords.row - 1,
        };

        if (
            this.isInsideBoard(rightUpPos) &&
            (Knight.isEmptyField(boardItems, rightUpPos) || this.isAttack(rightUpPos, boardItems))
        ) {
            positions.push(rightUpPos);
        }

        // down left
        const downLeftPos: BoardCoords = {
            col: this.boardCoords.col - 1,
            row: this.boardCoords.row + 2,
        };

        if (
            this.isInsideBoard(downLeftPos) &&
            (Knight.isEmptyField(boardItems, downLeftPos) || this.isAttack(downLeftPos, boardItems))
        ) {
            positions.push(downLeftPos);
        }

        // down right
        const downRightPos: BoardCoords = {
            col: this.boardCoords.col + 1,
            row: this.boardCoords.row + 2,
        };

        if (
            this.isInsideBoard(downRightPos) &&
            (Knight.isEmptyField(boardItems, downRightPos) || this.isAttack(downRightPos, boardItems))
        ) {
            positions.push(downRightPos);
        }

        // left down
        const leftDownPos: BoardCoords = {
            col: this.boardCoords.col - 2,
            row: this.boardCoords.row + 1,
        };

        if (
            this.isInsideBoard(leftDownPos) &&
            (Knight.isEmptyField(boardItems, leftDownPos) || this.isAttack(leftDownPos, boardItems))
        ) {
            positions.push(leftDownPos);
        }

        // right down
        const rightDownPos: BoardCoords = {
            col: this.boardCoords.col + 2,
            row: this.boardCoords.row + 1,
        };

        if (
            this.isInsideBoard(rightDownPos) &&
            (Knight.isEmptyField(boardItems, rightDownPos) || this.isAttack(rightDownPos, boardItems))
        ) {
            positions.push(rightDownPos);
        }

        return positions;
    }
}
