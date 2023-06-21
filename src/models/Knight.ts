import { ChessFigure } from "../interfaces/ChessFigure";
import { Texture } from "pixi.js";
import { BoardCoordinates } from "../interfaces/BoardCoordinates";
import { isInsideBorder } from "../helpers/isInsideBorder";

export class Knight implements ChessFigure {
    black = {
        availableUnits: 2,
        isInitialPlace: (row: number, col: number) => (row === 0 && col === 1) || (row === 0 && col === 6),
        normal: Texture.from("b_knight_ns.png"),
        active: Texture.from("b_knight.png"),
    };
    white = {
        availableUnits: 2,
        isInitialPlace: (row: number, col: number) => (row === 7 && col === 1) || (row === 7 && col === 6),
        normal: Texture.from("w_knight_ns.png"),
        active: Texture.from("w_knight.png"),
    };

    getAvailablePlaces(row: number, col: number, boardItems: any[][]): BoardCoordinates[] {
        const positions: BoardCoordinates[] = [];

        // up left
        const upLeftPos: BoardCoordinates = {
            col: col - 1,
            row: row - 2,
        };

        if (isInsideBorder(upLeftPos) && !boardItems[upLeftPos.row][upLeftPos.col].currentFigure) {
            positions.push(upLeftPos);
        }

        // up right
        const upRightPos: BoardCoordinates = {
            col: col + 1,
            row: row - 2,
        };

        if (isInsideBorder(upRightPos) && !boardItems[upRightPos.row][upRightPos.col].currentFigure) {
            positions.push(upRightPos);
        }

        // left up
        const leftUpPos: BoardCoordinates = {
            col: col - 2,
            row: row - 1,
        };

        if (isInsideBorder(leftUpPos) && !boardItems[leftUpPos.row][leftUpPos.col].currentFigure) {
            positions.push(leftUpPos);
        }

        // right up
        const rightUpPos: BoardCoordinates = {
            col: col + 2,
            row: row - 1,
        };

        if (isInsideBorder(rightUpPos) && !boardItems[rightUpPos.row][rightUpPos.col].currentFigure) {
            positions.push(rightUpPos);
        }

        // down left
        const downLeftPos: BoardCoordinates = {
            col: col - 1,
            row: row + 2,
        };

        if (isInsideBorder(downLeftPos) && !boardItems[downLeftPos.row][downLeftPos.col].currentFigure) {
            positions.push(downLeftPos);
        }

        // down right
        const downRightPos: BoardCoordinates = {
            col: col + 1,
            row: row + 2,
        };

        if (isInsideBorder(downRightPos) && !boardItems[downRightPos.row][downRightPos.col].currentFigure) {
            positions.push(downRightPos);
        }

        // left down
        const leftDownPos: BoardCoordinates = {
            col: col - 2,
            row: row + 1,
        };

        if (isInsideBorder(leftDownPos) && !boardItems[leftDownPos.row][leftDownPos.col].currentFigure) {
            positions.push(leftDownPos);
        }

        // right down
        const rightDownPos: BoardCoordinates = {
            col: col + 2,
            row: row + 1,
        };

        if (isInsideBorder(rightDownPos) && !boardItems[rightDownPos.row][rightDownPos.col].currentFigure) {
            positions.push(rightDownPos);
        }

        return positions;
    }
}
