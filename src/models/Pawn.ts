import { ChessFigure } from "../interfaces/ChessFigure";
import { Texture } from "pixi.js";
import { BoardCoordinates } from "../interfaces/BoardCoordinates";
import { FigureColor } from "../entities/BoardItem";

export class Pawn extends ChessFigure {
    black = {
        availableUnits: 8,
        isInitialPlace: (row: number, col: number) => row === 1,
        normal: Texture.from("b_pawn_ns.png"),
        active: Texture.from("b_pawn.png"),
    };
    white = {
        availableUnits: 8,
        isInitialPlace: (row: number, col: number) => row === 6,
        normal: Texture.from("w_pawn_ns.png"),
        active: Texture.from("w_pawn.png"),
    };

    getAvailablePlaces(row: number, col: number, boardItems: any[][]): BoardCoordinates[] {
        const attacker = boardItems[row][col];
        const direction = attacker.figureTexturesObject.color === FigureColor.white ? -1 : 1;
        const possibleMoves: BoardCoordinates[] = [];

        // regular move
        const regularMovePos = {
            row: row + direction,
            col,
        };

        if (Pawn.isEmptyField(boardItems, regularMovePos)) {
            possibleMoves.push(regularMovePos);
        }

        // initial move
        const initialMovePos = {
            row: row + direction * 2,
            col,
        };
        const initialPlaceCheck = boardItems[row][col]?.figureTexturesObject?.figureTextures?.isInitialPlace;
        if (!initialPlaceCheck) {
            return [];
        }

        if (Pawn.isEmptyField(boardItems, initialMovePos) && initialPlaceCheck(row, col)) {
            possibleMoves.push(initialMovePos);
        }

        // left attack
        const leftAttackPos = {
            row: regularMovePos.row,
            col: col - 1,
        };

        if (Pawn.isAttack({ row, col }, boardItems, leftAttackPos)) {
            possibleMoves.push(leftAttackPos);
        }

        // right attack
        const rightAttackPos = {
            row: regularMovePos.row,
            col: col + 1,
        };

        if (Pawn.isAttack({ row, col }, boardItems, rightAttackPos)) {
            possibleMoves.push(rightAttackPos);
        }

        return possibleMoves;
    }
}
