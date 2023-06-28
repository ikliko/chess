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

export class BoardManager {
    protected boardConfig: ChessBoardConfig | null = null;
    protected application: Application;
    protected boardTextures: any;

    constructor(application: Application) {
        this.application = application;

        this.loadConfig();
        this.boardTextures = {
            [FieldColor.black]: new EntityTexture(config.theme.fields.dark.active, config.theme.fields.dark.inactive),
            [FieldColor.white]: new EntityTexture(config.theme.fields.light.active, config.theme.fields.light.inactive),
        };
    }

    makeBoardItem(
        container: Container,
        fieldColor: FieldColor,
        figureColor: FigureColor | null,
        figureType: FigureTypes | null,
        boardCoords: BoardCoords,
    ) {
        if (!this.boardConfig) {
            return;
        }

        const { boardX, boardY, cellSize } = this.boardConfig;

        return new BoardItem(
            container,
            new Field(
                this.boardTextures[fieldColor],
                cellSize,
                {
                    x: boardX + cellSize * boardCoords.col,
                    y: boardY + cellSize * boardCoords.row,
                },
                boardCoords,
            ),
            this.getFigure(figureType, figureColor, boardCoords),
            boardCoords,
        );
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

    drawPlaceholder(): Graphics | null {
        if (!this.boardConfig) {
            return null;
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

    private getFigure(figureType: FigureTypes | null, color: FigureColor | null, boardCoords: BoardCoords) {
        if (!figureType || !color || !this.boardConfig) {
            return null;
        }

        const { boardX, boardY, figSize, cellSize, figPaddings } = this.boardConfig;

        if (figureType === FigureTypes.knight) {
            return new Knight(
                FigureColor[color],
                KnightResource[color],
                figSize,
                {
                    x: boardX + cellSize * boardCoords.col + figSize / 2 + figPaddings,
                    y: boardY + cellSize * boardCoords.row + figSize / 2 + figPaddings,
                },
                boardCoords,
            );
        }

        if (figureType === FigureTypes.pawn) {
            return new Pawn(
                FigureColor[color],
                PawnResource[color],
                figSize,
                {
                    x: boardX + cellSize * boardCoords.col + figSize / 2 + figPaddings,
                    y: boardY + cellSize * boardCoords.row + figSize / 2 + figPaddings,
                },
                boardCoords,
            );
        }

        if (figureType === FigureTypes.bishop) {
            return new Bishop(
                FigureColor[color],
                BishopResource[color],
                figSize,
                {
                    x: boardX + cellSize * boardCoords.col + figSize / 2 + figPaddings,
                    y: boardY + cellSize * boardCoords.row + figSize / 2 + figPaddings,
                },
                boardCoords,
            );
        }

        return null;
    }
}
