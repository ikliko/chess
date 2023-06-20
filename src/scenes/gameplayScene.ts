import { Application, Container, Graphics, Sprite, Texture } from "pixi.js";
import { getFigures, makeFigure } from "../helpers/getFiguresObject";

const boardItems: any[][] = [];
let figures = {};

function getFigure(
    row: number,
    col: number,
    figSize: number,
    boardX: number,
    boardY: number,
    figPaddings: number,
    cellSize: number,
) {
    let figure = null;

    for (const figureKey in figures) {
        const fig = (figures as any)[figureKey];
        if (fig.white.availableUnits && fig.white.isInitialPlace(row, col)) {
            figure = makeFigure({
                texture: fig.white.normal,
                figSize,
                boardX,
                boardY,
                col,
                row,
                figPaddings,
                cellSize,
            });
            fig.white.availableUnits--;
        } else if (fig.black.availableUnits && fig.black.isInitialPlace(row, col)) {
            figure = makeFigure({
                texture: fig.black.normal,
                figSize,
                boardX,
                boardY,
                col,
                row,
                figPaddings,
                cellSize,
            });
            fig.black.availableUnits--;
        }
    }

    return figure;
}

export default function getGameplayScene(app: Application) {
    const gameplay = new Container();

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

    figures = getFigures();

    const fullBoardSize = Math.max(Math.round(app.view.width / 3), 400);
    const cellSize = Math.round(fullBoardSize / 8);
    const figSize = Math.round(cellSize * 0.7);
    const figPaddings = Math.round((cellSize - figSize) / 2);
    const boardX = app.view.width / 2 - fullBoardSize / 2;
    const boardY = app.view.height / 2 - fullBoardSize / 2;

    const board = new Graphics();
    board.beginFill(0xff0000);
    board.drawRect(boardX, boardY, fullBoardSize, fullBoardSize);
    board.endFill();

    gameplay.addChild(board);

    for (let rowI = 0; rowI < 8; rowI++) {
        const boardRow: {
            figure: any;
            texture: any;
            field: any;
        }[] = [];
        for (let colI = 0; colI < 8; colI++) {
            const texture = boardTextureOrder[colI % 2];
            const boardPath = new Sprite(texture.normal);
            boardPath.width = cellSize;
            boardPath.height = cellSize;
            boardPath.x = boardX + cellSize * colI;
            boardPath.y = boardY + cellSize * rowI;

            let figure = getFigure(rowI, colI, figSize, boardX, boardY, figPaddings, cellSize);

            boardRow.push({
                figure,
                texture,
                field: boardPath,
            });

            gameplay.addChild(boardPath);
            if (figure) {
                gameplay.addChild(figure);
            }
        }

        boardItems.push(boardRow);
        boardTextureOrder.reverse();
    }

    return gameplay;
}
