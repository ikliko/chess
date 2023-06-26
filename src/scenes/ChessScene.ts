import { Application, Container, Graphics } from "pixi.js";
import { EntityTexture, Pawn } from "../entities/Figure";
import { config } from "../config";
import { BoardItem, Coords, Field, Figure, FigureColor } from "../entities/BoardItem";

abstract class Scene {
    protected application: Application;
    protected scene: Container | null = null;

    protected constructor(application: Application) {
        this.application = application;
    }

    abstract render(): void;

    protected getScene(): Container {
        if (!this.scene) {
            this.loadScene();
        }

        // @ts-ignore
        return this.scene;
    }

    protected abstract loadScene(): void;
}

interface ChessBoardConfig {
    fullBoardSize: number;
    cellSize: number;
    figSize: number;
    figPaddings: number;
    boardX: number;
    boardY: number;
}

export class ChessScene extends Scene {
    protected boardItems: any = [];
    protected boardConfig: ChessBoardConfig | null = null;
    protected boardFigures: any[] = [];

    constructor(application: Application) {
        super(application);

        this.loadConfig();
        this.initListeners();
        this.initBoardFigures();
    }

    render(): void {
        // @ts-ignore
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

    private initListeners() {}

    private getBoard() {
        const boardTextureOrder: EntityTexture[] = [
            new EntityTexture(config.theme.fields.dark.active, config.theme.fields.dark.inactive),

            new EntityTexture(config.theme.fields.light.active, config.theme.fields.light.inactive),
        ];

        // @ts-ignore
        const { boardX, boardY, cellSize } = this.boardConfig;
        for (let rowI = 0; rowI < 8; rowI++) {
            for (let colI = 0; colI < 8; colI++) {
                const boardPathTexture = boardTextureOrder[colI % 2];
                const coords = {
                    x: boardX + cellSize * colI,
                    y: boardY + cellSize * rowI,
                };

                const field = new Field(boardPathTexture, cellSize, coords);

                const figure = this.getFigure(rowI, colI, coords);

                // @ts-ignore
                const boardItem = new BoardItem(this.scene, field, figure, {
                    row: rowI,
                    col: colI,
                });
            }

            boardTextureOrder.reverse();
        }
    }

    private getFigure(rowI: number, colI: number, coords: Coords) {
        for (let i = 0; i < this.boardFigures.length; i++) {
            const boardFigure = this.boardFigures[i];

            const entries = Object.entries(boardFigure);

            for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
                const entry: any = entries[entryIndex];
                const entryIdx: any = entry[0];
                const entryData: any = entry[1];

                if (!entryData.initialPosition(rowI, colI)) {
                    continue;
                }

                // @ts-ignore
                const { cellSize } = this.boardConfig;

                const figSize = cellSize * 0.7;
                const figPadding = cellSize - figSize;
                const figCoords = {
                    x: coords.x + figSize / 2 + figPadding / 2,
                    y: coords.y + figSize / 2 + figPadding / 2,
                };

                const figure = new Figure(entryData.textures, figSize, figCoords, entryIdx);

                entryData.count--;

                if (entryData.count < 1) {
                    delete boardFigure[entryIdx];
                }

                return figure;
            }
        }

        return null;
    }

    private initBoardFigures() {
        const pawn = new Pawn();

        this.boardFigures = [
            {
                [FigureColor.white]: {
                    count: 8,
                    textures: pawn.white,
                    initialPosition: (row: number, col: number) => row === 6,
                    getAvailablePlaces: pawn.getAvailablePlaces,
                },

                [FigureColor.black]: {
                    count: 8,
                    textures: pawn.black,
                    initialPosition: (row: number, col: number) => row === 1,
                    getAvailablePlaces: pawn.getAvailablePlaces,
                },
            },
        ];
    }
}

export default ChessScene;
