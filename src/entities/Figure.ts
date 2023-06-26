import { Texture } from "pixi.js";
import { config } from "../config";
import { Howl } from "howler";
import { BoardItem, FigureColor } from "./BoardItem";

export class EntityTexture {
    active: Texture;
    inactive: Texture;

    constructor(active: string, inactive: string) {
        this.active = Texture.from(active);
        this.inactive = Texture.from(inactive);
    }
}

class BoardCoordinates {
    row: number;
    col: number;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }
}

abstract class FigureResource {
    // @ts-ignore
    white: EntityTexture;

    // @ts-ignore
    black: EntityTexture;

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
            const { figure: attacker } = boardItems[attackerCoords.row][attackerCoords.col];
            const { figure: defender } = boardItems[defenderCoords.row][defenderCoords.col];

            if (!defender) {
                return false;
            }

            return attacker?.color !== defender.color;
        } catch (e) {}

        return false;
    }
}

export class Pawn extends FigureResource {
    constructor() {
        super();

        const { textures } = config.theme.figures.pawn;

        this.white = new EntityTexture(textures.white.active, textures.white.inactive);

        this.black = new EntityTexture(textures.black.active, textures.black.inactive);
    }

    getAvailablePlaces(row: number, col: number, boardItems: BoardItem[][]): BoardCoordinates[] {
        const attacker = boardItems[row][col];
        if (!attacker?.figureTexturesObject) {
            return [];
        }

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

        if (
            Pawn.isEmptyField(boardItems, regularMovePos) &&
            Pawn.isEmptyField(boardItems, initialMovePos) &&
            initialPlaceCheck(row, col)
        ) {
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

enum FigureTypes {
    pawn = "pawn",
}

enum FigureActions {
    move = "move",
    capture = "capture",
    castle = "castle",
}

class SoundsManager {
    private static sounds: any = {};

    static playFigureSound(type: FigureTypes, action: FigureActions) {
        if (this.sounds[type][action] === undefined) {
            this.sounds[type][action] = this.getSound(type, action);
        }

        if (this.sounds[type][action]) {
            this.sounds[type][action].play();
        }
    }

    private static getSound(type: FigureTypes, action: FigureActions): Howl | null {
        const figureConfig: any = config.theme.figures[type];

        const soundResourcePath = figureConfig?.sounds[action];

        if (soundResourcePath) {
            return new Howl({
                src: [soundResourcePath],
            });
        }

        const defaultSoundPath = config.theme.defaultSounds[action];

        if (!defaultSoundPath) {
            return null;
        }

        return new Howl({
            src: [config.theme.defaultSounds[action]],
        });
    }
}
