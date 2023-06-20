import { AnimatedSprite, Application, Container, Graphics, Loader, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { getSpine } from "./spine-example";
import "./style.css";

declare const VERSION: string;

const gameWidth = 800;
const gameHeight = 600;

console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

const app = new Application({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
});

const boardItems: any[][] = [];

function makeFigure({
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

function getGameplayScene() {
    const birdFromSprite = getBird();
    birdFromSprite.anchor.set(0.5, 0.5);
    birdFromSprite.position.set(app.view.width / 2, 530);

    const spineExample = getSpine();
    spineExample.position.y = 580;

    const gameplay = new Container();
    gameplay.addChild(birdFromSprite);
    gameplay.addChild(spineExample);
    gameplay.interactive = true;

    const board = new Graphics();
    const fullBoardSize = Math.max(Math.round(app.view.width / 3), 400);
    const cellSize = Math.round(fullBoardSize / 8);
    const figSize = Math.round(cellSize * 0.7);
    const figPaddings = Math.round((cellSize - figSize) / 2);
    const boardX = app.view.width / 2 - fullBoardSize / 2;
    const boardY = app.view.height / 2 - fullBoardSize / 2;
    board.beginFill(0xff0000);
    board.drawRect(boardX, boardY, fullBoardSize, fullBoardSize);
    board.interactive = true;

    gameplay.addChild(board);

    const textureOrder = [
        {
            key: "gray",
            dark: Texture.from("square_gray_dark.png"),
            light: Texture.from("square_gray_light.png"),
        },
        {
            key: "brown",
            dark: Texture.from("square_brown_dark.png"),
            light: Texture.from("square_brown_light.png"),
        },
    ];
    const figures = {
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
                const possibleMoves = [];

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

    for (let rowI = 0; rowI < 8; rowI++) {
        const boardRow: {
            figure: any;
            texture: any;
            field: any;
        }[] = [];
        for (let colI = 0; colI < 8; colI++) {
            const texture = textureOrder[colI % 2];
            const boardPath = new Sprite(texture.light);
            boardPath.width = cellSize;
            boardPath.height = cellSize;
            boardPath.x = boardX + cellSize * colI;
            boardPath.y = boardY + cellSize * rowI;
            // for later when we activate movements
            boardPath.on("pointerdown", function () {});
            boardPath.on("mouseover", function () {});
            boardPath.on("mouseout", function () {});
            boardPath.interactive = false;
            boardPath.buttonMode = false;

            let figure = null;

            for (const figureKey in figures) {
                const fig = (figures as any)[figureKey];
                if (fig.white.availableUnits && fig.white.isInitialPlace(rowI, colI)) {
                    figure = makeFigure({
                        texture: fig.white.normal,
                        figSize,
                        boardX,
                        boardY,
                        col: colI,
                        row: rowI,
                        figPaddings,
                        cellSize,
                    });
                    fig.white.availableUnits--;
                } else if (fig.black.availableUnits && fig.black.isInitialPlace(rowI, colI)) {
                    figure = makeFigure({
                        texture: fig.black.normal,
                        figSize,
                        boardX,
                        boardY,
                        col: colI,
                        row: rowI,
                        figPaddings,
                        cellSize,
                    });
                    fig.black.availableUnits--;
                }
            }

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
        textureOrder.reverse();
    }

    return gameplay;
}

window.onload = async (): Promise<void> => {
    await loadGameAssets();

    document.body.appendChild(app.view);

    resizeCanvas();

    const gameplay = getGameplayScene();

    app.stage.addChild(gameplay);

    const menu = new Container();

    const redRect = new Graphics();
    redRect.beginFill(0xcccccc, 0.7).drawRect(0, 0, app.view.width, app.view.height).endFill();

    menu.addChild(redRect);

    const playBtn = new Text("Play");
    playBtn.anchor.set(0.5, 0.5);
    playBtn.x = app.view.width / 2;
    playBtn.y = app.view.height / 2;
    playBtn.style = new TextStyle({
        fill: 0xfcfcfc,
        fontSize: 70,
        fontFamily: "Arial",
        fontWeight: "bold",
        // stroke: 0xff0000,
        // strokeThickness: 2,
        dropShadow: true,
        dropShadowAlpha: 1,
        dropShadowAngle: 0.1,
        dropShadowBlur: 0.6,
        dropShadowColor: 0x000000,
        dropShadowDistance: 3,
    });
    playBtn.on("pointerdown", function () {
        menu.visible = false;
    });
    playBtn.on("mouseover", function () {
        playBtn.style.dropShadowAngle = 10;
    });
    playBtn.on("mouseout", function () {
        playBtn.style.dropShadowAngle = 0.1;
    });
    playBtn.interactive = true;
    playBtn.buttonMode = true;
    menu.addChild(playBtn);

    // app.stage.addChild(menu);
};

async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = Loader.shared;

        loader.add("rabbit", "./assets/simpleSpriteSheet.json");
        loader.add("pixie", "./assets/spine-assets/pixie.json");
        loader.add("chess", "./assets/chess/spritesheet.json");

        loader.onComplete.once(() => res());
        loader.onError.once(() => rej());

        loader.load();
    });
}

function resizeCanvas(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.stage.width = window.innerWidth;
        app.stage.height = window.innerHeight;
    };

    resize();

    window.addEventListener("resize", resize);
}

let birdClicked = false;

function getBird(): AnimatedSprite {
    const bird = new AnimatedSprite([
        // Texture.from("birdUp.png"),
        Texture.from("birdMiddle.png"),
        // Texture.from("birdDown.png"),
    ]);

    bird.interactive = true;
    bird.buttonMode = true;
    bird.on("pointerdown", function () {
        if (birdClicked) {
            bird.texture = Texture.from("birdMiddle.png");
            birdClicked = false;
            return;
        }
        bird.texture = Texture.from("b_bishop_ns.png");
        birdClicked = true;
    });
    // bird.loop = true;
    // bird.animationSpeed = 0.1;
    // bird.play();
    bird.scale.set(3);

    return bird;
}
