import { Application, Container } from "pixi.js";
import { config } from "../config";
import { BoardItem } from "../models/BoardItem";
import { FigureColor } from "../enums/FigureColor";
import { Scene } from "./Scene";
import { EntityTexture } from "../resources/EntityTexture";
import { rotateContainer } from "../helpers/rotateContainer";
import { FigureActions } from "../enums/FigureActions";
import { SoundsManager } from "../managers/SoundsManager";
import { BoardManager } from "../managers/BoardManager";
import { FigureTypes } from "../enums/FigureTypes";

export class ChessScene extends Scene {
    protected boardItems: any = [];
    protected players: FigureColor[] = [FigureColor.white, FigureColor.black];
    protected moveFigure: BoardItem | null = null;
    protected isRunning = true;
    protected soundsManager: SoundsManager;
    protected boardManager: BoardManager;

    constructor(application: Application) {
        super(application);

        this.soundsManager = new SoundsManager();
        this.boardManager = new BoardManager(application);
        this.initListeners();
    }

    protected clearBoard() {
        this.moveFigure = null;
        this.boardItems.flat().forEach((item: BoardItem) => item.deactivate());
    }

    render(): void {
        this.application.stage.addChild(this.getScene());
    }

    protected loadScene(): void {
        const sceneContainer = new Container();

        sceneContainer.position.x = this.application.view.width / 2;
        sceneContainer.position.y = this.application.view.height / 2;
        sceneContainer.pivot.set(this.application.view.width / 2, this.application.view.height / 2);
        sceneContainer.sortableChildren = true;

        const placeholder = this.boardManager.drawPlaceholder();
        if (placeholder) {
            sceneContainer.addChild(placeholder);
        }
        this.scene = sceneContainer;

        this.getBoard();
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
        window.addEventListener("clearBoard", () => this.clearBoard());
    }

    private getBoard() {
        if (!this.scene) {
            return;
        }

        const boardTextureOrder: EntityTexture[] = [
            new EntityTexture(config.theme.fields.dark.active, config.theme.fields.dark.inactive),
            new EntityTexture(config.theme.fields.light.active, config.theme.fields.light.inactive),
        ];

        let row = 0;
        let col = 0;

        const boardItems = [
            [
                this.boardManager.makeBoardItem(this.scene, boardTextureOrder[0], null, null, { row, col: col++ }),

                this.boardManager.makeBoardItem(
                    this.scene,
                    boardTextureOrder[1],
                    FigureColor.black,
                    FigureTypes.knight,
                    { row, col: col++ },
                ),
                this.boardManager.makeBoardItem(
                    this.scene,
                    boardTextureOrder[0],
                    FigureColor.black,
                    FigureTypes.bishop,
                    { row, col: col++ },
                ),

                this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], null, null, { row, col: col++ }),
                this.boardManager.makeBoardItem(this.scene, boardTextureOrder[0], null, null, { row, col: col++ }),

                this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], null, null, { row, col: col++ }),

                this.boardManager.makeBoardItem(
                    this.scene,
                    boardTextureOrder[0],
                    FigureColor.black,
                    FigureTypes.knight,
                    { row, col: col++ },
                ),

                this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], null, null, { row, col: col++ }),
            ],
        ];

        col = 0;
        row++;
        boardTextureOrder.reverse();
        boardItems.push([
            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[0], FigureColor.black, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], FigureColor.black, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[0], FigureColor.black, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], FigureColor.black, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[0], FigureColor.black, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], FigureColor.black, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[0], FigureColor.black, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], FigureColor.black, FigureTypes.pawn, {
                row,
                col: col++,
            }),
        ]);

        for (let i = 0; i < 4; i++) {
            col = 0;
            row++;
            boardTextureOrder.reverse();
            boardItems.push([
                this.boardManager.makeBoardItem(this.scene, boardTextureOrder[0], null, null, { row, col: col++ }),

                this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], null, null, { row, col: col++ }),

                this.boardManager.makeBoardItem(this.scene, boardTextureOrder[0], null, null, { row, col: col++ }),

                this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], null, null, { row, col: col++ }),

                this.boardManager.makeBoardItem(this.scene, boardTextureOrder[0], null, null, { row, col: col++ }),

                this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], null, null, { row, col: col++ }),

                this.boardManager.makeBoardItem(this.scene, boardTextureOrder[0], null, null, { row, col: col++ }),

                this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], null, null, { row, col: col++ }),
            ]);
        }

        col = 0;
        row++;
        boardTextureOrder.reverse();
        boardItems.push([
            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[0], FigureColor.white, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], FigureColor.white, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[0], FigureColor.white, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], FigureColor.white, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[0], FigureColor.white, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], FigureColor.white, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[0], FigureColor.white, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], FigureColor.white, FigureTypes.pawn, {
                row,
                col: col++,
            }),
        ]);

        col = 0;
        row++;
        boardTextureOrder.reverse();
        boardItems.push([
            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[0], null, null, { row, col: col++ }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], FigureColor.white, FigureTypes.knight, {
                row,
                col: col++,
            }),
            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[0], FigureColor.white, FigureTypes.bishop, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], null, null, { row, col: col++ }),
            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[0], null, null, { row, col: col++ }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], null, null, { row, col: col++ }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[0], FigureColor.white, FigureTypes.knight, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, boardTextureOrder[1], null, null, { row, col: col++ }),
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
