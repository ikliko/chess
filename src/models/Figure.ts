import { BoardCoords } from "../interfaces/BoardCoords";
import { Coords } from "../interfaces/Coords";
import { FigureColor } from "../enums/FigureColor";
import { ChessEntity } from "./ChessEntity";
import { EntityTexture } from "../resources/EntityTexture";
import { BoardItem } from "./BoardItem";

export abstract class Figure extends ChessEntity {
    color: FigureColor;
    isPlayed = false;

    constructor(color: FigureColor, textures: EntityTexture, size: number, coords: Coords, boardCoords: BoardCoords) {
        super(textures, size, coords, boardCoords);

        this.color = color;
    }

    protected static isEmptyField(boardItems: BoardItem[][], fieldCoords: BoardCoords): boolean {
        try {
            return !boardItems[fieldCoords.row][fieldCoords.col].currentFigure;
        } catch (e) {}

        return false;
    }

    public abstract getAvailablePositions(boardItems: BoardItem[][]): BoardCoords[];

    public abstract getAttackPositions(boardItems: BoardItem[][]): BoardCoords[];

    protected isInsideBoard({ col, row }: BoardCoords): boolean {
        return !(col < 0 || col > 7 || row < 0 || row > 7);
    }

    protected isAttack(defenderCoords: BoardCoords, boardItems: BoardItem[][]) {
        try {
            const { figure: attacker } = boardItems[this.boardCoords.row][this.boardCoords.col];
            const { figure: defender } = boardItems[defenderCoords.row][defenderCoords.col];

            if (!defender) {
                return false;
            }

            return attacker?.color !== defender.color;
        } catch (e) {}

        return false;
    }

    protected getUpMoves(boardItems: BoardItem[][], limit = 0): BoardCoords[] {
        const moves: BoardCoords[] = [];

        if (this.boardCoords.row === 0) {
            return moves;
        }

        for (let row = this.boardCoords.row - 1; row > -1; row--) {
            const coordsCheck = {
                ...this.boardCoords,
                row,
            };

            if (!Figure.isEmptyField(boardItems, coordsCheck) && !this.isAttack(coordsCheck, boardItems)) {
                break;
            }

            moves.push(coordsCheck);

            if (!Figure.isEmptyField(boardItems, coordsCheck) && this.isAttack(coordsCheck, boardItems)) {
                break;
            }

            if (limit && limit === moves.length) {
                return moves;
            }
        }

        return moves;
    }

    protected getDownMoves(boardItems: BoardItem[][], limit = 0): BoardCoords[] {
        const moves: BoardCoords[] = [];

        if (this.boardCoords.row === 7) {
            return moves;
        }

        for (let row = this.boardCoords.row + 1; row < 8; row++) {
            const coordsCheck = {
                ...this.boardCoords,
                row,
            };

            if (!Figure.isEmptyField(boardItems, coordsCheck) && !this.isAttack(coordsCheck, boardItems)) {
                break;
            }

            moves.push(coordsCheck);

            if (!Figure.isEmptyField(boardItems, coordsCheck) && this.isAttack(coordsCheck, boardItems)) {
                break;
            }

            if (limit && limit === moves.length) {
                return moves;
            }
        }

        return moves;
    }

    protected getRightMoves(boardItems: BoardItem[][], limit = 0): BoardCoords[] {
        const moves: BoardCoords[] = [];

        if (this.boardCoords.col === 0) {
            return moves;
        }

        for (let col = this.boardCoords.col - 1; col > -1; col--) {
            const coordsCheck = {
                ...this.boardCoords,
                col,
            };

            if (!Figure.isEmptyField(boardItems, coordsCheck) && !this.isAttack(coordsCheck, boardItems)) {
                break;
            }

            moves.push(coordsCheck);

            if (!Figure.isEmptyField(boardItems, coordsCheck) && this.isAttack(coordsCheck, boardItems)) {
                break;
            }

            if (limit && limit === moves.length) {
                return moves;
            }
        }

        return moves;
    }

    protected getLeftMoves(boardItems: BoardItem[][], limit = 0): BoardCoords[] {
        const moves: BoardCoords[] = [];

        if (this.boardCoords.col === 7) {
            return moves;
        }

        for (let col = this.boardCoords.col + 1; col < 8; col++) {
            const coordsCheck = {
                ...this.boardCoords,
                col,
            };

            if (!Figure.isEmptyField(boardItems, coordsCheck) && !this.isAttack(coordsCheck, boardItems)) {
                break;
            }

            moves.push(coordsCheck);

            if (!Figure.isEmptyField(boardItems, coordsCheck) && this.isAttack(coordsCheck, boardItems)) {
                break;
            }

            if (limit && limit === moves.length) {
                return moves;
            }
        }

        return moves;
    }

    protected getUpLeftDiagonalMove(boardItems: BoardItem[][], limit = 0): BoardCoords[] {
        if (this.boardCoords.row === 0 && this.boardCoords.col === 0) {
            return [];
        }

        const moves: BoardCoords[] = [];
        let col = this.boardCoords.col - 1;
        let row = this.boardCoords.row - 1;

        for (; row > -1 && col > -1; row--, col--) {
            if (!Figure.isEmptyField(boardItems, { row, col })) {
                break;
            }

            moves.push({ row, col });

            if (limit && limit === moves.length) {
                return moves;
            }
        }

        if (this.isAttack({ row, col }, boardItems)) {
            moves.push({ row, col });
        }

        return moves;
    }

    protected getUpRightDiagonalMove(boardItems: BoardItem[][], limit = 0): BoardCoords[] {
        if (this.boardCoords.row === 0 && this.boardCoords.col === 7) {
            return [];
        }

        const moves: BoardCoords[] = [];
        let col = this.boardCoords.col + 1;
        let row = this.boardCoords.row - 1;
        for (; row > -1 && col < 8; row--, col++) {
            if (!Figure.isEmptyField(boardItems, { row, col })) {
                break;
            }

            moves.push({ row, col });

            if (limit && limit === moves.length) {
                return moves;
            }
        }

        if (this.isAttack({ row, col }, boardItems)) {
            moves.push({ row, col });
        }

        return moves;
    }

    protected getDownLeftDiagonalMove(boardItems: BoardItem[][], limit = 0): BoardCoords[] {
        if (this.boardCoords.row === 7 && this.boardCoords.col === 0) {
            return [];
        }

        const moves: BoardCoords[] = [];
        let col = this.boardCoords.col - 1;
        let row = this.boardCoords.row + 1;

        for (; row < 8 && col > -1; row++, col--) {
            if (!Figure.isEmptyField(boardItems, { row, col })) {
                break;
            }

            moves.push({ row, col });

            if (limit && limit === moves.length) {
                return moves;
            }
        }

        if (this.isAttack({ row, col }, boardItems)) {
            moves.push({ row, col });
        }

        return moves;
    }

    protected getDownRightDiagonalMove(boardItems: BoardItem[][], limit = 0): BoardCoords[] {
        if (this.boardCoords.row === 7 && this.boardCoords.col === 0) {
            return [];
        }

        const moves: BoardCoords[] = [];
        let col = this.boardCoords.col + 1;
        let row = this.boardCoords.row + 1;
        for (; row < 8 && col < 8; row++, col++) {
            if (!Figure.isEmptyField(boardItems, { row, col })) {
                break;
            }

            moves.push({ row, col });

            if (limit && limit === moves.length) {
                return moves;
            }
        }

        if (this.isAttack({ row, col }, boardItems)) {
            moves.push({ row, col });
        }

        return moves;
    }
}
