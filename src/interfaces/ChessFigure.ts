import { BoardCoordinates } from "./BoardCoordinates";
import { ChessFigureSide } from "./ChessFigureSide";
import { BoardItem } from "../entities/BoardItem";
import { Howl } from "howler";

export abstract class ChessFigure {
    abstract black: ChessFigureSide;
    abstract white: ChessFigureSide;
    abstract soundSources: {
        move: Howl;
        capture: Howl;
    };

    abstract playMoveAudio(): void;

    abstract playCaptureAudio(): void;

    abstract getAvailablePlaces(row: number, col: number, boardItems: BoardItem[][]): BoardCoordinates[];

    protected static isEmptyField(boardItems: BoardItem[][], fieldCoords: BoardCoordinates) {
        try {
            return !boardItems[fieldCoords.row][fieldCoords.col].currentFigure;
        } catch (e) {}

        return null;
    }

    protected static isAttack(
        attackerCoords: BoardCoordinates,
        boardItems: BoardItem[][],
        defenderCoords: BoardCoordinates,
    ) {
        try {
            const { figureTexturesObject: attacker } = boardItems[attackerCoords.row][attackerCoords.col];
            const { figureTexturesObject: defender } = boardItems[defenderCoords.row][defenderCoords.col];

            if (!defender) {
                return false;
            }

            return attacker?.color !== defender.color;
        } catch (e) {}

        return false;
    }
}
