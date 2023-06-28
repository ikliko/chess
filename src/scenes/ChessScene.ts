import { Application, Container } from "pixi.js";
import { config } from "../config";
import { BoardItem } from "../models/BoardItem";
import { FigureColor } from "../enums/FigureColor";
import { Scene } from "./Scene";
import { rotateContainer } from "../helpers/rotateContainer";
import { FigureActions } from "../enums/FigureActions";
import { SoundsManager } from "../managers/SoundsManager";
import { BoardManager } from "../managers/BoardManager";
import { FigureTypes } from "../enums/FigureTypes";
import { FieldColor } from "../enums/FieldColor";
import { BoardCoords } from "../interfaces/BoardCoords";

export class ChessScene extends Scene {
    protected boardItems: any = [];
    protected players: FigureColor[] = [FigureColor.white, FigureColor.black];
    protected moveFigure: BoardItem | null = null;
    protected isRunning = true;
    protected isStarted = false;
    protected soundsManager: SoundsManager;
    protected boardManager: BoardManager;
    protected rotates: number = 0;

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

    onHold() {
        this.isStarted = false;

        const spinning = () => {
            this.rotate();
            this.rotates++;

            setTimeout(() => {
                if (this.isStarted && this.rotates % 2 === 0) {
                    return;
                }

                spinning();
            }, config.rotates.board.duration * 1.1);
        };

        spinning();
    }

    start() {
        this.isStarted = true;
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

        window.addEventListener("castle", (event) => {
            const boardItem: BoardItem = (<any>event).detail;

            if (!boardItem.figure) {
                return;
            }

            this.checkRightCastle(boardItem.figure.boardCoords);
            this.checkLeftCastle(boardItem.figure.boardCoords);

            this.clearBoard();
            this.rotate();
        });
        window.addEventListener("figureClick", () => this.clearBoard());
        window.addEventListener("clearBoard", () => this.clearBoard());
    }

    private getBoard() {
        if (!this.scene) {
            return;
        }

        let row = 0;
        let col = 0;

        const boardItems = [
            [
                this.boardManager.makeBoardItem(this.scene, FieldColor.white, FigureColor.black, FigureTypes.rook, {
                    row,
                    col: col++,
                }),

                this.boardManager.makeBoardItem(this.scene, FieldColor.black, FigureColor.black, FigureTypes.knight, {
                    row,
                    col: col++,
                }),

                this.boardManager.makeBoardItem(this.scene, FieldColor.white, FigureColor.black, FigureTypes.bishop, {
                    row,
                    col: col++,
                }),

                this.boardManager.makeBoardItem(this.scene, FieldColor.black, FigureColor.black, FigureTypes.queen, {
                    row,
                    col: col++,
                }),

                this.boardManager.makeBoardItem(this.scene, FieldColor.white, FigureColor.black, FigureTypes.king, {
                    row,
                    col: col++,
                }),

                this.boardManager.makeBoardItem(this.scene, FieldColor.black, FigureColor.black, FigureTypes.bishop, {
                    row,
                    col: col++,
                }),

                this.boardManager.makeBoardItem(this.scene, FieldColor.white, FigureColor.black, FigureTypes.knight, {
                    row,
                    col: col++,
                }),

                this.boardManager.makeBoardItem(this.scene, FieldColor.black, FigureColor.black, FigureTypes.rook, {
                    row,
                    col: col++,
                }),
            ],
        ];

        col = 0;
        row++;
        boardItems.push([
            this.boardManager.makeBoardItem(this.scene, FieldColor.black, FigureColor.black, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.white, FigureColor.black, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.black, FigureColor.black, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.white, FigureColor.black, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.black, FigureColor.black, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.white, FigureColor.black, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.black, FigureColor.black, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.white, FigureColor.black, FigureTypes.pawn, {
                row,
                col: col++,
            }),
        ]);

        const colors = [FieldColor.white, FieldColor.black];
        for (let i = 0; i < 4; i++) {
            col = 0;
            row++;
            boardItems.push([
                this.boardManager.makeBoardItem(this.scene, colors[0], null, null, { row, col: col++ }),
                this.boardManager.makeBoardItem(this.scene, colors[1], null, null, { row, col: col++ }),
                this.boardManager.makeBoardItem(this.scene, colors[0], null, null, { row, col: col++ }),
                this.boardManager.makeBoardItem(this.scene, colors[1], null, null, { row, col: col++ }),
                this.boardManager.makeBoardItem(this.scene, colors[0], null, null, { row, col: col++ }),
                this.boardManager.makeBoardItem(this.scene, colors[1], null, null, { row, col: col++ }),
                this.boardManager.makeBoardItem(this.scene, colors[0], null, null, { row, col: col++ }),
                this.boardManager.makeBoardItem(this.scene, colors[1], null, null, { row, col: col++ }),
            ]);

            colors.reverse();
        }

        col = 0;
        row++;
        boardItems.push([
            this.boardManager.makeBoardItem(this.scene, FieldColor.white, FigureColor.white, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.black, FigureColor.white, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.white, FigureColor.white, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.black, FigureColor.white, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.white, FigureColor.white, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.black, FigureColor.white, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.white, FigureColor.white, FigureTypes.pawn, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.black, FigureColor.white, FigureTypes.pawn, {
                row,
                col: col++,
            }),
        ]);

        col = 0;
        row++;
        boardItems.push([
            this.boardManager.makeBoardItem(this.scene, FieldColor.black, FigureColor.white, FigureTypes.rook, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.white, FigureColor.white, FigureTypes.knight, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.black, FigureColor.white, FigureTypes.bishop, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.white, FigureColor.white, FigureTypes.queen, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.black, FigureColor.white, FigureTypes.king, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.white, FigureColor.white, FigureTypes.bishop, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.black, FigureColor.white, FigureTypes.knight, {
                row,
                col: col++,
            }),

            this.boardManager.makeBoardItem(this.scene, FieldColor.white, FigureColor.white, FigureTypes.rook, {
                row,
                col: col++,
            }),
        ]);

        this.boardItems = boardItems;

        return boardItems;
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

    private checkRightCastle(boardCoords: BoardCoords) {
        if (boardCoords.col === 6) {
            this.moveFigure = this.boardItems[boardCoords.row][7];
            if (!this.moveFigure) {
                return;
            }

            this.moveFigure.moveTo(this.boardItems[boardCoords.row][5]);
        }
    }

    private checkLeftCastle(boardCoords: BoardCoords) {
        if (boardCoords.col === 2) {
            this.moveFigure = this.boardItems[boardCoords.row][0];
            if (!this.moveFigure) {
                return;
            }

            this.moveFigure.moveTo(this.boardItems[boardCoords.row][3]);
        }
    }
}
