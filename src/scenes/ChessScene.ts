import { Application, Container, Graphics } from "pixi.js";
import { config } from "../config";
import { BoardItem } from "../models/BoardItem";
import { Pawn } from "../models/Pawn";
import { FigureColor } from "../enums/FigureColor";
import { Field } from "../models/Field";
import { Scene } from "./Scene";
import { EntityTexture } from "../resources/EntityTexture";
import { PawnResource } from "../resources/PawnResource";
import { ChessBoardConfig } from "../interfaces/ChessBoardConfig";
import { rotateContainer } from "../helpers/rotateContainer";
import { SoundsManager } from "../entities/Figure";
import { FigureActions } from "../enums/FigureActions";
import { Knight } from "../models/Knight";
import { KnightResource } from "../resources/KnightResource";

export class ChessScene extends Scene {
    protected boardItems: any = [];
    protected players: FigureColor[] = [FigureColor.white, FigureColor.black];
    protected boardConfig: ChessBoardConfig | null = null;
    protected moveFigure: BoardItem | null = null;
    protected isRunning = true;
    protected soundsManager: SoundsManager;

    constructor(application: Application) {
        super(application);

        this.soundsManager = new SoundsManager();
        this.loadConfig();
        this.initListeners();
    }

    protected clearBoard() {
        this.moveFigure = null;
        this.boardItems.flat().forEach((item: BoardItem) => {
            item.deactivate();
        });
    }

    render(): void {
        this.application.stage.addChild(this.getScene());
    }

    protected getBoardPlaceholder(): Graphics {
        const board = new Graphics();
        board.beginFill(0xff0000);
        board.drawRect(
            // @ts-ignore
            this.boardConfig.boardX,
            // @ts-ignore
            this.boardConfig.boardY,
            // @ts-ignore
            this.boardConfig.fullBoardSize,
            // @ts-ignore
            this.boardConfig.fullBoardSize,
        );
        board.endFill();
        board.interactive = true;
        board.on("pointerdown", () => this.clearBoard());

        return board;
    }

    protected loadScene(): void {
        const sceneContainer = new Container();

        sceneContainer.position.x = this.application.view.width / 2;
        sceneContainer.position.y = this.application.view.height / 2;
        sceneContainer.pivot.set(this.application.view.width / 2, this.application.view.height / 2);
        sceneContainer.sortableChildren = true;
        sceneContainer.addChild(this.getBoardPlaceholder());
        this.scene = sceneContainer;

        this.getBoard();
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

    private initListeners() {
        window.addEventListener("prepareMove", ({ detail: boardItem }: any) => {
            if (boardItem.figure.color !== this.getCurrentPlayer()) {
                return;
            }

            this.clearBoard();

            boardItem.figure
                .getAvailablePositions(this.boardItems)
                .forEach(({ row, col }: { row: number; col: number }) => {
                    this.boardItems[row][col].activateField();
                });

            boardItem.activateFigure();
            this.moveFigure = boardItem;
        });

        window.addEventListener("moveTo", ({ detail: boardItem }: any) => {
            if (!this.moveFigure || !this.moveFigure.figure) {
                return;
            }

            const action = boardItem.figure ? FigureActions.capture : FigureActions.move;

            this.soundsManager.playFigureSound(this.moveFigure.figure, action);
            this.moveFigure.moveTo(boardItem);
            this.clearBoard();
            this.rotate();
            this.switchPlayer();
        });

        window.addEventListener("figureClick", () => this.clearBoard());
    }

    private getBoard() {
        const boardTextureOrder: EntityTexture[] = [
            new EntityTexture(config.theme.fields.dark.active, config.theme.fields.dark.inactive),
            new EntityTexture(config.theme.fields.light.active, config.theme.fields.light.inactive),
        ];

        // @ts-ignore
        const { boardX, boardY, cellSize } = this.boardConfig;
        const figSize = cellSize * 0.7;
        const figPadding = cellSize - figSize;

        const boardItems = [];
        let row = 0;
        let col = 0;
        boardItems.push([
            new BoardItem(
                // @ts-ignore
                this.scene,
                new Field(
                    boardTextureOrder[0],
                    cellSize,
                    {
                        x: boardX + cellSize * 0,
                        y: boardY + cellSize * 0,
                    },
                    { row, col: col++ },
                ),
                null,
                { row: 0, col: 0 },
            ),
            new BoardItem(
                // @ts-ignore
                this.scene,
                new Field(
                    boardTextureOrder[1],
                    cellSize,
                    {
                        x: boardX + cellSize * 1,
                        y: boardY + cellSize * 0,
                    },
                    { row, col: col },
                ),
                new Knight(
                    FigureColor.black,
                    KnightResource.black,
                    figSize,
                    {
                        x: boardX + cellSize * 1 + figSize / 2 + figPadding / 2,
                        y: boardY + cellSize * 0 + figSize / 2 + figPadding / 2,
                    },
                    { row, col: col++ },
                ),
                { row: 0, col: 1 },
            ),
            new BoardItem(
                // @ts-ignore
                this.scene,
                new Field(
                    boardTextureOrder[0],
                    cellSize,
                    {
                        x: boardX + cellSize * 2,
                        y: boardY + cellSize * 0,
                    },
                    { row, col: col++ },
                ),
                null,
                { row: 0, col: 2 },
            ),
            new BoardItem(
                // @ts-ignore
                this.scene,
                new Field(
                    boardTextureOrder[1],
                    cellSize,
                    {
                        x: boardX + cellSize * 3,
                        y: boardY + cellSize * 0,
                    },
                    { row, col: col++ },
                ),
                null,
                { row: 0, col: 3 },
            ),
            new BoardItem(
                // @ts-ignore
                this.scene,
                new Field(
                    boardTextureOrder[0],
                    cellSize,
                    {
                        x: boardX + cellSize * 4,
                        y: boardY + cellSize * 0,
                    },
                    { row, col: col++ },
                ),
                null,
                { row: 0, col: 4 },
            ),
            new BoardItem(
                // @ts-ignore
                this.scene,
                new Field(
                    boardTextureOrder[1],
                    cellSize,
                    {
                        x: boardX + cellSize * 5,
                        y: boardY + cellSize * 0,
                    },
                    { row, col: col++ },
                ),
                null,
                { row: 0, col: 5 },
            ),
            new BoardItem(
                // @ts-ignore
                this.scene,
                new Field(
                    boardTextureOrder[0],
                    cellSize,
                    {
                        x: boardX + cellSize * 6,
                        y: boardY + cellSize * 0,
                    },
                    { row, col: col },
                ),
                new Knight(
                    FigureColor.black,
                    KnightResource.black,
                    figSize,
                    {
                        x: boardX + cellSize * 6 + figSize / 2 + figPadding / 2,
                        y: boardY + cellSize * 0 + figSize / 2 + figPadding / 2,
                    },
                    { row, col: col++ },
                ),
                { row: 0, col: 6 },
            ),
            new BoardItem(
                // @ts-ignore
                this.scene,
                new Field(
                    boardTextureOrder[1],
                    cellSize,
                    {
                        x: boardX + cellSize * 7,
                        y: boardY + cellSize * 0,
                    },
                    { row, col: col++ },
                ),
                null,
                { row: 0, col: 7 },
            ),
        ]);

        boardTextureOrder.reverse();
        for (let rowI = 1; rowI < 2; rowI++) {
            const boardItemsRow = [];

            for (let colI = 0; colI < 8; colI++) {
                const boardPathTexture = boardTextureOrder[colI % 2];
                const coords = {
                    x: boardX + cellSize * colI,
                    y: boardY + cellSize * rowI,
                };

                const field = new Field(boardPathTexture, cellSize, coords, {
                    row: rowI,
                    col: colI,
                });

                const boardCoords = {
                    row: rowI,
                    col: colI,
                };
                const figCoords = {
                    x: coords.x + figSize / 2 + figPadding / 2,
                    y: coords.y + figSize / 2 + figPadding / 2,
                };
                const pawn = new Pawn(FigureColor.black, PawnResource.black, figSize, figCoords, boardCoords);

                // @ts-ignore
                const boardItem = new BoardItem(this.scene, field, pawn, boardCoords);

                boardItemsRow.push(boardItem);
            }

            boardItems.push(boardItemsRow);
            boardTextureOrder.reverse();
        }

        for (let rowI = 2; rowI < 6; rowI++) {
            const boardItemsRow = [];

            for (let colI = 0; colI < 8; colI++) {
                const boardPathTexture = boardTextureOrder[colI % 2];
                const coords = {
                    x: boardX + cellSize * colI,
                    y: boardY + cellSize * rowI,
                };
                const boardCoords = {
                    row: rowI,
                    col: colI,
                };

                const field = new Field(boardPathTexture, cellSize, coords, boardCoords);
                // @ts-ignore
                const boardItem = new BoardItem(this.scene, field, null, boardCoords);

                boardItemsRow.push(boardItem);
            }

            boardItems.push(boardItemsRow);
            boardTextureOrder.reverse();
        }

        for (let rowI = 6; rowI < 7; rowI++) {
            const boardItemRow = [];
            for (let colI = 0; colI < 8; colI++) {
                const boardPathTexture = boardTextureOrder[colI % 2];
                const coords = {
                    x: boardX + cellSize * colI,
                    y: boardY + cellSize * rowI,
                };
                const boardCoords = {
                    row: rowI,
                    col: colI,
                };

                const field = new Field(boardPathTexture, cellSize, coords, boardCoords);
                const figSize = cellSize * 0.7;
                const figPadding = cellSize - figSize;
                const figCoords = {
                    x: coords.x + figSize / 2 + figPadding / 2,
                    y: coords.y + figSize / 2 + figPadding / 2,
                };

                const pawn = new Pawn(FigureColor.white, PawnResource.white, figSize, figCoords, boardCoords);
                // @ts-ignore
                const boardItem = new BoardItem(this.scene, field, pawn, {
                    row: rowI,
                    col: colI,
                });

                boardItemRow.push(boardItem);
            }

            boardItems.push(boardItemRow);
            boardTextureOrder.reverse();
        }

        row = 7;
        col = 0;

        boardItems.push([
            new BoardItem(
                // @ts-ignore
                this.scene,
                new Field(
                    boardTextureOrder[0],
                    cellSize,
                    {
                        x: boardX + cellSize * 0,
                        y: boardY + cellSize * 7,
                    },
                    { row, col: col++ },
                ),
                null,
                { row: 7, col: 0 },
            ),
            new BoardItem(
                // @ts-ignore
                this.scene,
                new Field(
                    boardTextureOrder[1],
                    cellSize,
                    {
                        x: boardX + cellSize * 1,
                        y: boardY + cellSize * 7,
                    },
                    { row, col: col },
                ),
                new Knight(
                    FigureColor.white,
                    KnightResource.white,
                    figSize,
                    {
                        x: boardX + cellSize * 1 + figSize / 2 + figPadding / 2,
                        y: boardY + cellSize * 7 + figSize / 2 + figPadding / 2,
                    },
                    { row, col: col++ },
                ),
                { row: 7, col: 1 },
            ),
            new BoardItem(
                // @ts-ignore
                this.scene,
                new Field(
                    boardTextureOrder[0],
                    cellSize,
                    {
                        x: boardX + cellSize * 2,
                        y: boardY + cellSize * 7,
                    },
                    { row, col: col++ },
                ),
                null,
                { row: 7, col: 2 },
            ),
            new BoardItem(
                // @ts-ignore
                this.scene,
                new Field(
                    boardTextureOrder[1],
                    cellSize,
                    {
                        x: boardX + cellSize * 3,
                        y: boardY + cellSize * 7,
                    },
                    { row, col: col++ },
                ),
                null,
                { row: 7, col: 3 },
            ),
            new BoardItem(
                // @ts-ignore
                this.scene,
                new Field(
                    boardTextureOrder[0],
                    cellSize,
                    {
                        x: boardX + cellSize * 4,
                        y: boardY + cellSize * 7,
                    },
                    { row, col: col++ },
                ),
                null,
                { row: 7, col: 4 },
            ),
            new BoardItem(
                // @ts-ignore
                this.scene,
                new Field(
                    boardTextureOrder[1],
                    cellSize,
                    {
                        x: boardX + cellSize * 5,
                        y: boardY + cellSize * 7,
                    },
                    { row, col: col++ },
                ),
                null,
                { row: 7, col: 5 },
            ),
            new BoardItem(
                // @ts-ignore
                this.scene,
                new Field(
                    boardTextureOrder[0],
                    cellSize,
                    {
                        x: boardX + cellSize * 6,
                        y: boardY + cellSize * 7,
                    },
                    { row, col: col },
                ),
                new Knight(
                    FigureColor.white,
                    KnightResource.white,
                    figSize,
                    {
                        x: boardX + cellSize * 6 + figSize / 2 + figPadding / 2,
                        y: boardY + cellSize * 7 + figSize / 2 + figPadding / 2,
                    },
                    { row, col: col++ },
                ),
                { row: 7, col: 6 },
            ),
            new BoardItem(
                // @ts-ignore
                this.scene,
                new Field(
                    boardTextureOrder[1],
                    cellSize,
                    {
                        x: boardX + cellSize * 7,
                        y: boardY + cellSize * 7,
                    },
                    { row, col: col++ },
                ),
                null,
                { row: 7, col: 7 },
            ),
        ]);

        this.boardItems = boardItems;
    }

    private getCurrentPlayer() {
        if (!this.isRunning) {
            return null;
        }

        return this.players[0];
    }

    private rotate() {
        if (!this.scene) {
            return;
        }

        const { duration, direction } = config.rotates.board;
        const targetRotation = this.scene.rotation + Math.PI * direction;
        this.isRunning = false;
        rotateContainer(this.scene, targetRotation, duration);
        setTimeout(() => (this.isRunning = true), duration);

        this.boardItems.flat().forEach((boardItem: BoardItem) => boardItem.rotate());
    }

    private switchPlayer() {
        this.players.reverse();
    }
}
