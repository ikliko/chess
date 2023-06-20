import { Sprite, Texture } from "pixi.js";

interface BoardCoordinates {
    row: number;
    col: number;
}

interface ChessFigureSide {
    availableUnits: number;
    isInitialPlace: (row: number, col: number) => boolean;
    normal: Texture;
    active: Texture;
}

interface ChessFigure {
    getAvailablePlaces?: (row: number, col: number) => BoardCoordinates[];
    black: ChessFigureSide;
    white: ChessFigureSide;
}

interface BoardFigures {
    knight: ChessFigure;
    pawn: ChessFigure;
    rook: ChessFigure;
    queen: ChessFigure;
    king: ChessFigure;
    bishop: ChessFigure;
}

export function makeFigure({
    texture,
    figSize,
    boardX,
    boardY,
    figPaddings,
    cellSize,
    col,
    row,
}: {
    texture: Texture;
    figSize: number;
    boardX: number;
    boardY: number;
    figPaddings: number;
    cellSize: number;
    col: number;
    row: number;
}) {
    // console.log(texture);
    const figure = new Sprite(texture);
    figure.width = figSize;
    figure.height = figSize;
    figure.x = boardX + figPaddings + cellSize * col;
    figure.y = boardY + figPaddings + cellSize * row;
    // figure.on("pointerdown", function () {
    //     // TODO: mark available places to move
    //     // const availablePlaces = fig.getAvailablePlaces(rowI, colI);
    //     // availablePlaces.forEach(({row, col}) => {
    //     //     boardItems[row][col].field.texture = boardItems[row][col].texture.dark;
    //     //     boardItems[row][col].field.interactive = true;
    //     //     boardItems[row][col].field.buttonMode = true;
    //     // });
    // });
    // figure.on("mouseover", function () {
    // });
    // figure.on("mouseout", function () {
    // });
    // figure.interactive = true;
    // figure.buttonMode = true;

    return figure;
}

export function getFigures(): BoardFigures {
    return {
        knight: {
            black: {
                availableUnits: 2,
                isInitialPlace: (row: number, col: number) => (row === 0 && col === 1) || (row === 0 && col === 6),
                normal: Texture.from("b_knight_ns.png"),
                active: Texture.from("b_knight.png"),
            },
            white: {
                availableUnits: 2,
                isInitialPlace: (row: number, col: number) => (row === 7 && col === 1) || (row === 7 && col === 6),
                normal: Texture.from("w_knight_ns.png"),
                active: Texture.from("w_knight.png"),
            },
        },
        pawn: {
            black: {
                availableUnits: 8,
                isInitialPlace: (row: number, col: number) => row === 1,
                normal: Texture.from("b_pawn_ns.png"),
                active: Texture.from("b_pawn.png"),
            },
            white: {
                availableUnits: 8,
                isInitialPlace: (row: number, col: number) => row === 6,
                normal: Texture.from("w_pawn_ns.png"),
                active: Texture.from("w_pawn.png"),
            },
        },
        rook: {
            black: {
                availableUnits: 2,
                isInitialPlace: (row: number, col: number) => (row === 0 && col === 0) || (row === 0 && col === 7),
                normal: Texture.from("b_rook_ns.png"),
                active: Texture.from("b_rook.png"),
            },
            white: {
                availableUnits: 2,
                isInitialPlace: (row: number, col: number) => (row === 7 && col === 0) || (row === 7 && col === 7),
                normal: Texture.from("w_rook_ns.png"),
                active: Texture.from("w_rook.png"),
            },
        },
        queen: {
            black: {
                availableUnits: 1,
                isInitialPlace: (row: number, col: number) => row === 0 && col === 3,
                normal: Texture.from("b_queen_ns.png"),
                active: Texture.from("b_queen.png"),
            },
            white: {
                availableUnits: 1,
                isInitialPlace: (row: number, col: number) => row === 7 && col === 3,
                normal: Texture.from("w_queen_ns.png"),
                active: Texture.from("w_queen.png"),
            },
        },
        king: {
            black: {
                availableUnits: 1,
                isInitialPlace: (row: number, col: number) => row === 0 && col === 4,
                normal: Texture.from("b_king_ns.png"),
                active: Texture.from("w_king.png"),
            },
            white: {
                availableUnits: 1,
                isInitialPlace: (row: number, col: number) => row === 7 && col === 4,
                normal: Texture.from("w_king_ns.png"),
                active: Texture.from("w_king.png"),
            },
        },
        bishop: {
            getAvailablePlaces(row: number, col: number) {
                const possibleMoves: BoardCoordinates[] = [];

                // left up
                if (row > 0 && col > 0) {
                    let c = col - 1;
                    for (let r = row - 1; r > -1 && c > -1; r--, c--) {
                        possibleMoves.push({ row: r, col: c });
                    }
                }
                // right up
                if (row > 0 && col < 7) {
                    let c = col + 1;
                    for (let r = row - 1; r > -1 && c < 8; r--, c++) {
                        possibleMoves.push({ row: r, col: c });
                    }
                }
                // left down
                // right down

                return possibleMoves;
            },
            black: {
                availableUnits: 2,
                isInitialPlace: (row: number, col: number) => row === 0 && (col === 2 || col === 5),
                normal: Texture.from("b_bishop_ns.png"),
                active: Texture.from("b_bishop.png"),
            },
            white: {
                availableUnits: 2,
                isInitialPlace: (row: number, col: number) => row === 7 && (col === 2 || col === 5),
                normal: Texture.from("w_bishop_ns.png"),
                active: Texture.from("w_bishop.png"),
            },
        },
    };
}
