import { Application, Container, Graphics, Sprite, Texture } from "pixi.js";
import { getFigures } from "../helpers/getFiguresObject";
import { ChessBoardConfig } from "../interfaces/ChessBoardConfig";
import { BoardCoordinates } from "../interfaces/BoardCoordinates";
import { BoardFigures } from "../interfaces/BoardFigures";
import { ChessFigure } from "../interfaces/ChessFigure";
import { ChessFigureSide } from "../interfaces/ChessFigureSide";

const boardItems: any[][] = [];
let figures: BoardFigures | {} = {};
let chessBoardConfig: ChessBoardConfig | null = null;
let moveFigure: any | null = null;

class BoardItem {
    currentFigure: any;
    currentBoardPath: any;
    size: number;
    figSize: number;
    figPadding: number;
    coords: any;
    container: Container;
    figureTexturesObject: Figure | null;
    boardPathTexturesObject: {
        key: string;
        active: Texture;
        normal: Texture;
    };

    constructor(
        container: Container,
        figureTexturesObject: Figure | null,
        boardPath: {
            key: string;
            active: Texture;
            normal: Texture;
        },
        initialSize: number,
        initialCoords: { x: number; y: number },
    ) {
        this.container = container;
        this.boardPathTexturesObject = boardPath;
        this.figureTexturesObject = figureTexturesObject;
        this.size = initialSize;
        this.coords = initialCoords;
        this.figSize = this.size * 0.7;
        this.figPadding = this.size - this.figSize;
    }

    render() {
        this.renderBoardPath();
        this.renderFigure();
    }

    moveTo(boardItem: BoardItem) {
        boardItem.currentFigure = this.currentFigure;
        boardItem.figureTexturesObject = this.figureTexturesObject;
        this.currentFigure = null;
        this.figureTexturesObject = null;
        boardItem.moveFigure();
    }

    moveFigure() {
        if (!this.currentFigure) {
            return;
        }

        this.currentFigure.x = this.coords.x + this.figPadding / 2;
        this.currentFigure.y = this.coords.y + this.figPadding / 2;
    }

    activate() {}

    deactivate() {
        if (this.currentFigure) {
            this.currentFigure.texture = this.figureTexturesObject?.figureTextures.normal;
        }

        this.currentBoardPath.texture = this.boardPathTexturesObject.normal;
        this.currentBoardPath.interactive = false;
        this.currentBoardPath.buttonMode = false;
    }

    activateFigure() {
        if (!this.currentFigure) {
            return;
        }

        this.currentFigure.texture = this.figureTexturesObject?.figureTextures.active;
    }

    activateField() {
        this.currentBoardPath.texture = this.boardPathTexturesObject.active;
        this.currentBoardPath.interactive = true;
        this.currentBoardPath.buttonMode = true;
    }

    private renderBoardPath() {
        const boardPath = new Sprite(this.boardPathTexturesObject.normal);
        boardPath.width = this.size;
        boardPath.height = this.size;
        boardPath.x = this.coords.x;
        boardPath.y = this.coords.y;
        this.currentBoardPath = boardPath;

        this.container.addChild(boardPath);
    }

    private renderFigure() {
        if (!this.figureTexturesObject) {
            return;
        }

        const figure = new Sprite(this.figureTexturesObject.figureTextures.normal);

        figure.width = this.figSize;
        figure.height = this.figSize;

        figure.interactive = true;
        figure.buttonMode = true;
        figure.zIndex = 50;

        this.currentFigure = figure;

        this.container.addChild(figure);
        this.moveFigure();
    }
}

function setChessBoardConfig(app: Application): void {
    if (chessBoardConfig) {
        return;
    }

    const fullBoardSize = Math.max(Math.round(app.view.width / 3), 400);
    const cellSize = Math.round(fullBoardSize / 8);
    const figSize = Math.floor(cellSize * 0.7);
    const figPaddings = Math.floor((cellSize - figSize) / 2);
    const boardX = app.view.width / 2 - fullBoardSize / 2;
    const boardY = app.view.height / 2 - fullBoardSize / 2;

    chessBoardConfig = {
        fullBoardSize,
        cellSize,
        figSize,
        figPaddings,
        boardX,
        boardY,
    };
}

function pointerDownFigureHandler(fig: ChessFigure, row: number, col: number) {
    const availablePlaces = fig.getAvailablePlaces(row, col, boardItems);
    availablePlaces.forEach(({ row, col }: BoardCoordinates) => {
        boardItems[row][col].setActive();
    });
}

interface Figure {
    availableMoves: (row: number, col: number, boardItems: any[][]) => BoardCoordinates[];
    figureTextures: ChessFigureSide;
}

function getFigure(row: number, col: number): Figure | null {
    let figure = null;

    for (const figureKey in figures) {
        const fig = (figures as any)[figureKey];
        if (fig.white.availableUnits && fig.white.isInitialPlace(row, col)) {
            // figure = {
            //     availableMoves: fig.getAvailablePlaces,
            //     figureTextures: fig.white
            // };
            // fig.white.availableUnits--;
        } else if (fig.black.availableUnits && fig.black.isInitialPlace(row, col)) {
            figure = {
                availableMoves: fig.getAvailablePlaces,
                figureTextures: fig.black,
            };
            fig.black.availableUnits--;
            console.log(fig.black);
        }
    }

    return figure;
}

export function clearBoard() {
    moveFigure = null;
    boardItems.forEach((rowItems) =>
        rowItems.forEach((item) => {
            item.deactivate();
        }),
    );
}

function getBoard(): Graphics | undefined {
    if (!chessBoardConfig) {
        return;
    }

    const board = new Graphics();
    board.beginFill(0xff0000);
    board.drawRect(
        chessBoardConfig.boardX,
        chessBoardConfig.boardY,
        chessBoardConfig.fullBoardSize,
        chessBoardConfig.fullBoardSize,
    );
    board.endFill();
    board.interactive = true;
    board.on("pointerdown", clearBoard);

    return board;
}

function renderBoardPath(gameplay: Container) {
    if (!chessBoardConfig) {
        return;
    }

    const boardTextureOrder: any[] = [
        {
            key: "gray",
            active: Texture.from("square_gray_dark.png"),
            normal: Texture.from("square_gray_light.png"),
        },
        {
            key: "brown",
            active: Texture.from("square_brown_dark.png"),
            normal: Texture.from("square_brown_light.png"),
        },
    ];
    const { boardX, boardY, cellSize, figSize, figPaddings } = chessBoardConfig;
    for (let rowI = 0; rowI < 8; rowI++) {
        const boardRow: BoardItem[] = [];
        for (let colI = 0; colI < 8; colI++) {
            const boardPathTexture = boardTextureOrder[colI % 2];
            const figureTexture = getFigure(rowI, colI);

            const boardItem = new BoardItem(gameplay, figureTexture, boardPathTexture, cellSize, {
                x: boardX + cellSize * colI,
                y: boardY + cellSize * rowI,
            });
            boardItem.render();

            if (boardItem.currentFigure) {
                // click figure
                boardItem.currentFigure.on("pointerdown", function () {
                    console.log(11111, boardItem.currentFigure);
                    clearBoard();

                    const availablePos = boardItem.figureTexturesObject?.availableMoves(rowI, colI, boardItems);
                    boardItem.activateFigure();

                    availablePos?.forEach(({ row, col }) => {
                        boardItems[row][col].activateField();
                    });
                    moveFigure = boardItem;
                });
            }

            // active board field clicked
            boardItem.currentBoardPath.on("pointerdown", function () {
                moveFigure.moveTo(boardItem);
                moveFigure = null;
                clearBoard();
            });

            boardRow.push(boardItem);
        }

        boardItems.push(boardRow);
        boardTextureOrder.reverse();
    }
}

export default function getGameplayScene(app: Application) {
    const gameplay = new Container();

    figures = getFigures();

    setChessBoardConfig(app);

    let board = getBoard();

    if (board) {
        gameplay.addChild(board);
    }

    gameplay.sortableChildren = true;
    renderBoardPath(gameplay);

    return gameplay;
}
