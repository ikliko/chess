import { ChessFigure } from "../interfaces/ChessFigure";
import { Texture } from "pixi.js";
import { BoardCoordinates } from "../interfaces/BoardCoordinates";
import { isInsideBorder } from "../helpers/isInsideBorder";
import { BoardItem } from "../entities/BoardItem";
import { Howl } from "howler";

const move = new Howl({
    src: ["../assets/chess/audio/move/pawn.mp3"],
});

export class Knight extends ChessFigure {
    soundSources = {
        move: move,
        capture: move,
    };

    playMoveAudio(): void {
        this.soundSources.move.play();
    }

    playCaptureAudio(): void {
        this.soundSources.capture.play();
    }

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

    getAvailablePlaces(row: number, col: number, boardItems: BoardItem[][]): BoardCoordinates[] {
        const positions: BoardCoordinates[] = [];
        const attackerCoords: BoardCoordinates = {
            row,
            col,
        };

        // up left
        const upLeftPos: BoardCoordinates = {
            col: col - 1,
            row: row - 2,
        };

        if (
            isInsideBorder(upLeftPos) &&
            (Knight.isEmptyField(boardItems, upLeftPos) || Knight.isAttack(attackerCoords, boardItems, upLeftPos))
        ) {
            positions.push(upLeftPos);
        }

        // up right
        const upRightPos: BoardCoordinates = {
            col: col + 1,
            row: row - 2,
        };

        if (
            isInsideBorder(upRightPos) &&
            (Knight.isEmptyField(boardItems, upRightPos) || Knight.isAttack(attackerCoords, boardItems, upRightPos))
        ) {
            positions.push(upRightPos);
        }

        // left up
        const leftUpPos: BoardCoordinates = {
            col: col - 2,
            row: row - 1,
        };

        if (
            isInsideBorder(leftUpPos) &&
            (Knight.isEmptyField(boardItems, leftUpPos) || Knight.isAttack(attackerCoords, boardItems, leftUpPos))
        ) {
            positions.push(leftUpPos);
        }

        // right up
        const rightUpPos: BoardCoordinates = {
            col: col + 2,
            row: row - 1,
        };

        if (
            isInsideBorder(rightUpPos) &&
            (Knight.isEmptyField(boardItems, rightUpPos) || Knight.isAttack(attackerCoords, boardItems, rightUpPos))
        ) {
            positions.push(rightUpPos);
        }

        // down left
        const downLeftPos: BoardCoordinates = {
            col: col - 1,
            row: row + 2,
        };

        if (
            isInsideBorder(downLeftPos) &&
            (Knight.isEmptyField(boardItems, downLeftPos) || Knight.isAttack(attackerCoords, boardItems, downLeftPos))
        ) {
            positions.push(downLeftPos);
        }

        // down right
        const downRightPos: BoardCoordinates = {
            col: col + 1,
            row: row + 2,
        };

        if (
            isInsideBorder(downRightPos) &&
            (Knight.isEmptyField(boardItems, downRightPos) || Knight.isAttack(attackerCoords, boardItems, downRightPos))
        ) {
            positions.push(downRightPos);
        }

        // left down
        const leftDownPos: BoardCoordinates = {
            col: col - 2,
            row: row + 1,
        };

        if (
            isInsideBorder(leftDownPos) &&
            (Knight.isEmptyField(boardItems, leftDownPos) || Knight.isAttack(attackerCoords, boardItems, leftDownPos))
        ) {
            positions.push(leftDownPos);
        }

        // right down
        const rightDownPos: BoardCoordinates = {
            col: col + 2,
            row: row + 1,
        };

        if (
            isInsideBorder(rightDownPos) &&
            (Knight.isEmptyField(boardItems, rightDownPos) || Knight.isAttack(attackerCoords, boardItems, rightDownPos))
        ) {
            positions.push(rightDownPos);
        }

        return positions;
    }
}
