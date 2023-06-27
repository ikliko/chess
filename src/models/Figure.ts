import { BoardCoords } from "../interfaces/BoardCoords";
import { Coords } from "../interfaces/Coords";
import { FigureColor } from "../enums/FigureColor";
import { ChessEntity } from "./ChessEntity";
import { EntityTexture } from "../resources/EntityTexture";
import { BoardItem } from "./BoardItem";

export abstract class Figure extends ChessEntity {
    color: FigureColor;

    constructor(color: FigureColor, textures: EntityTexture, size: number, coords: Coords, boardCoords: BoardCoords) {
        super(textures, size, coords, boardCoords);

        this.color = color;
    }

    protected isInsideBoard({ col, row }: BoardCoords) {
        return !(col < 0 || col > 7 || row < 0 || row > 7);
    }

    protected static isEmptyField(boardItems: BoardItem[][], fieldCoords: BoardCoords) {
        try {
            return !boardItems[fieldCoords.row][fieldCoords.col].currentFigure;
        } catch (e) {}

        return null;
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

    abstract getAvailablePositions(boardItems: BoardItem[][]): BoardCoords[];
}
