import { Application, Container, Graphics, Texture } from "pixi.js";
import { getFigures } from "../helpers/getFiguresObject";
import { ChessBoardConfig } from "../interfaces/ChessBoardConfig";
import { BoardCoordinates } from "../interfaces/BoardCoordinates";
import { BoardFigures } from "../interfaces/BoardFigures";
import { BoardItem, Figure, FigureColor } from "../entities/BoardItem";

const boardItems: any[][] = [];
let figures: BoardFigures | {} = {};
let chessBoardConfig: ChessBoardConfig | null = null;
let moveFigure: any | null = null;
const players = [FigureColor.white, FigureColor.black];

function getCurrentPlayer() {
    return players[0];
}

function switchPlayer() {
    players.reverse();
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

function getFigure(row: number, col: number): Figure | null {
    let figure = null;

    for (const figureKey in figures) {
        const fig = (figures as any)[figureKey];
        if (fig.white.availableUnits && fig.white.isInitialPlace(row, col)) {
            figure = {
                color: FigureColor.white,
                availableMoves: fig.getAvailablePlaces,
                figureTextures: fig.white,
            } as Figure;
            fig.white.availableUnits--;
        } else if (fig.black.availableUnits && fig.black.isInitialPlace(row, col)) {
            figure = {
                color: FigureColor.black,
                availableMoves: fig.getAvailablePlaces,
                figureTextures: fig.black,
            } as Figure;
            fig.black.availableUnits--;
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
    board.on("pointerdown", () => clearBoard());

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
    const { boardX, boardY, cellSize } = chessBoardConfig;
    for (let rowI = 0; rowI < 8; rowI++) {
        const boardRow: BoardItem[] = [];
        for (let colI = 0; colI < 8; colI++) {
            const boardPathTexture = boardTextureOrder[colI % 2];
            const figureTexture = getFigure(rowI, colI);

            const boardItem = new BoardItem(
                gameplay,
                figureTexture,
                boardPathTexture,
                cellSize,
                {
                    col: colI,
                    row: rowI,
                },
                {
                    x: boardX + cellSize * colI,
                    y: boardY + cellSize * rowI,
                },
            );

            boardRow.push(boardItem);
        }

        boardItems.push(boardRow);
        boardTextureOrder.reverse();
    }
}

export default function getGameplayScene(app: Application) {
    const gameplay = new Container();
    gameplay.position.x = app.view.width / 2;
    gameplay.position.y = app.view.height / 2;
    gameplay.pivot.set(app.view.width / 2, app.view.height / 2);

    figures = getFigures();

    setChessBoardConfig(app);

    let board = getBoard();

    if (board) {
        gameplay.addChild(board);
    }

    window.addEventListener("prepareFigureToMove", (event) => {
        const moving = (event as any).detail;

        if (moving.figureTexturesObject.color !== getCurrentPlayer()) {
            return;
        }

        clearBoard();

        moveFigure = moving;
        moveFigure.activateFigure();

        const availablePlaces = moveFigure.availableMoves(boardItems);
        availablePlaces.forEach(({ row, col }: BoardCoordinates) => {
            boardItems[row][col].activateField();
        });
    });

    function rotateBoard() {
        gameplay.rotation += Math.PI * 2 * 0.5;
        boardItems.forEach((row) => row.forEach((item) => item.rotate()));
    }

    window.addEventListener("moveFigureHere", (event) => {
        const moveTo = (event as any).detail;

        if (!moveFigure) {
            return;
        }

        moveFigure.moveTo(moveTo);
        clearBoard();
        switchPlayer();

        rotateBoard();
    });

    gameplay.sortableChildren = true;
    renderBoardPath(gameplay);

    return gameplay;
}
