import { BoardItem } from "../models/BoardItem";
import { Field } from "../models/Field";
import { ChessBoardConfig } from "../interfaces/ChessBoardConfig";
import { Application, Container, Graphics } from "pixi.js";
import { EntityTexture } from "../resources/EntityTexture";
import { config } from "../config";
import { BoardCoords } from "../interfaces/BoardCoords";
import { FigureTypes } from "../enums/FigureTypes";
import { Knight } from "../models/Knight";
import { FigureColor } from "../enums/FigureColor";
import { KnightResource } from "../resources/KnightResource";
import { Pawn } from "../models/Pawn";
import { PawnResource } from "../resources/PawnResource";
import { FieldColor } from "../enums/FieldColor";
import { Bishop } from "../models/Bishop";
import { BishopResource } from "../resources/BishopResource";
import { Rook } from "../models/Rook";
import { RookResource } from "../resources/RookResource";
import { Coords } from "../interfaces/Coords";
import { Figure } from "../models/Figure";
import { Queen } from "../models/Queen";
import { QueenResource } from "../resources/QueenResource";
import { King } from "../models/King";
import { KingResource } from "../resources/KingResource";

type BoardTextures = {
    [key in FieldColor]: EntityTexture;
};

export class BoardManager {
    protected boardConfig: ChessBoardConfig | null = null;
    protected application: Application;
    protected boardTextures: BoardTextures;

    constructor(application: Application) {
        this.application = application;

        this.loadConfig();
        this.boardTextures = {
            [FieldColor.black]: new EntityTexture(config.theme.fields.dark.active, config.theme.fields.dark.inactive),
            [FieldColor.white]: new EntityTexture(config.theme.fields.light.active, config.theme.fields.light.inactive),
        };
    }

    public makeBoardItem(
        container: Container,
        fieldColor: FieldColor,
        figureColor: FigureColor | null,
        figureType: FigureTypes | null,
        boardCoords: BoardCoords,
    ): BoardItem {
        if (!this.boardConfig) {
            throw new Error("no config");
        }

        const { boardX, boardY, cellSize } = this.boardConfig;
        const fieldCoords = {
            x: boardX + cellSize * boardCoords.col,
            y: boardY + cellSize * boardCoords.row,
        };
        const field = this.makeField(fieldColor, fieldCoords, boardCoords);
        const figure = this.makeFigure(figureType, figureColor, boardCoords);

        return new BoardItem(container, field, figure, boardCoords);
    }

    public drawPlaceholder(): Graphics {
        if (!this.boardConfig) {
            throw new Error("Config is not defined");
        }

        const { boardX, boardY, fullBoardSize } = this.boardConfig;

        const board = new Graphics();
        board.beginFill(0xff0000);
        board.drawRect(boardX, boardY, fullBoardSize, fullBoardSize);
        board.endFill();
        board.interactive = true;
        board.on("pointerdown", () => window.dispatchEvent(new CustomEvent("clearBoard")));

        return board;
    }

    private loadConfig(): void {
        const fullBoardSize = Math.max(Math.round(this.application.view.width / 2), 400);
        const cellSize = Math.round(fullBoardSize / 8);
        const figSize = Math.floor(cellSize * 0.7);
        const figPaddings = Math.floor((cellSize - figSize) / 2);
        const boardX = this.application.view.width / 2 - fullBoardSize / 2;
        const boardY = this.application.view.height / 2 - fullBoardSize / 2;

        this.boardConfig = {
            fullBoardSize,
            cellSize,
            figSize,
            figPaddings,
            boardX,
            boardY,
        };
    }

    private makeFigure(
        figureType: FigureTypes | null,
        color: FigureColor | null,
        boardCoords: BoardCoords,
    ): Figure | null {
        if (!figureType || !color || !this.boardConfig) {
            return null;
        }

        const { boardX, boardY, figSize, cellSize, figPaddings } = this.boardConfig;
        const coords = {
            x: boardX + cellSize * boardCoords.col + figSize / 2 + figPaddings,
            y: boardY + cellSize * boardCoords.row + figSize / 2 + figPaddings,
        };
        const figuresMapper: { [key in FigureTypes]: () => Figure } = {
            [FigureTypes.knight]: (): Figure => new Knight(color, KnightResource[color], figSize, coords, boardCoords),
            [FigureTypes.pawn]: (): Figure => new Pawn(color, PawnResource[color], figSize, coords, boardCoords),
            [FigureTypes.bishop]: (): Figure => new Bishop(color, BishopResource[color], figSize, coords, boardCoords),
            [FigureTypes.rook]: (): Figure => new Rook(color, RookResource[color], figSize, coords, boardCoords),
            [FigureTypes.queen]: (): Figure => new Queen(color, QueenResource[color], figSize, coords, boardCoords),
            [FigureTypes.king]: (): Figure => new King(color, KingResource[color], figSize, coords, boardCoords),
        } as const;

        try {
            return figuresMapper[figureType]();
        } catch (e) {}

        return null;
    }

    private makeField(color: FieldColor, coords: Coords, boardCoords: BoardCoords): Field {
        if (!this.boardConfig) {
            throw new Error("Config is not defined");
        }

        const { cellSize } = this.boardConfig;

        return new Field(this.boardTextures[color], cellSize, coords, boardCoords);
    }
}
