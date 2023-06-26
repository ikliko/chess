import { EntityTexture } from "./Figure";
import { Container, Sprite } from "pixi.js";
import { Coords } from "../interfaces/Coords";
import { BoardCoords } from "../interfaces/BoardCoords";

class ChessEntity {
    texture: EntityTexture;
    size: number;
    coords: Coords;

    constructor(texture: EntityTexture, size: number, coords: Coords) {
        this.texture = texture;
        this.size = size;
        this.coords = coords;
    }
}

export class Field extends ChessEntity {}

export enum FigureColor {
    white = "white",
    black = "black",
}

export class Figure extends ChessEntity {
    color: FigureColor;

    constructor(texture: EntityTexture, size: number, coords: Coords, color: FigureColor) {
        super(texture, size, coords);
        this.color = color;
    }
}

export class BoardItem {
    field: Field;
    figure: Figure;
    // @ts-ignore
    currentFigure: Sprite;
    protected container: Container;
    protected boardCoords: BoardCoords;

    constructor(container: Container, field: Field, figure: Figure, boardCoords: BoardCoords) {
        this.container = container;
        this.field = field;
        this.figure = figure;
        this.boardCoords = boardCoords;

        this.initialize();
    }

    protected initialize() {
        this.renderField();
        this.renderFigure();
    }

    private renderField() {
        const boardPath = new Sprite(this.field.texture.inactive);
        boardPath.width = this.field.size;
        boardPath.height = this.field.size;
        boardPath.x = this.field.coords.x;
        boardPath.y = this.field.coords.y;

        this.container.addChild(boardPath);
    }

    private renderFigure() {
        if (!this.figure) {
            return;
        }

        const figure = new Sprite(this.figure.texture.inactive);
        figure.anchor.set(0.5, 0.5);
        figure.width = this.figure.size;
        figure.height = this.figure.size;
        figure.x = this.figure.coords.x;
        figure.y = this.figure.coords.y;
        figure.zIndex = 50;
        figure.interactive = true;
        figure.buttonMode = true;

        this.currentFigure = figure;

        this.container.addChild(figure);
    }
}

// import {Application, Container, Sprite, Texture} from "pixi.js";
// import {rotateContainer} from "../helpers/rotateContainer";
//
// export enum FigureColor {
//     black = "black",
//     white = "white",
// }
//
// export interface Figure {
//     color: FigureColor;
//     availableMoves: (row: number, col: number, boardItems: any[][]) => BoardCoordinates[];
//     figureTextures: ChessFigureSide;
//
//     playMoveAudio(): void;
//
//     playCaptureAudio(): void;
// }
//
// export class BoardItem {
//     currentFigure: any;
//     currentBoardPath: any;
//     size: number;
//     figSize: number;
//     figPadding: number;
//     coords: any;
//     container: Container;
//     boardCoords: { row: number; col: number };
//     figureTexturesObject: Figure | null;
//     boardPathTexturesObject: {
//         key: string;
//         active: Texture;
//         normal: Texture;
//     };
//     isActive = false;
//     isUnderAttack = false;
//
//     constructor(
//         container: Container,
//         figureTexturesObject: Figure | null,
//         boardPath: {
//             key: string;
//             active: Texture;
//             normal: Texture;
//         },
//         initialSize: number,
//         boardCoords: BoardCoordinates,
//         initialCoords: { x: number; y: number },
//     ) {
//         this.container = container;
//         this.boardPathTexturesObject = boardPath;
//         this.figureTexturesObject = figureTexturesObject;
//         this.size = initialSize;
//         this.coords = initialCoords;
//         this.figSize = this.size * 0.7;
//         this.boardCoords = boardCoords;
//         this.figPadding = this.size - this.figSize;
//
//         this.render();
//     }
//
//     render() {
//         this.renderBoardPath();
//         this.renderFigure();
//     }
//
//     availableMoves(boardItems: BoardItem[][]): BoardCoordinates[] {
//         if (!this.figureTexturesObject) {
//             return [];
//         }
//
//         return this.figureTexturesObject.availableMoves(this.boardCoords.row, this.boardCoords.col, boardItems);
//     }
//
//     moveTo(boardItem: BoardItem) {
//         if (boardItem === this) {
//             return;
//         }
//
//         if (boardItem.currentFigure) {
//             boardItem.currentFigure.interactive = false;
//             boardItem.currentFigure.buttonMode = false;
//             boardItem.currentFigure.destroy();
//             boardItem.isUnderAttack = false;
//             this.figureTexturesObject?.playCaptureAudio();
//         } else {
//             this.figureTexturesObject?.playMoveAudio();
//         }
//
//         boardItem.currentFigure = this.currentFigure;
//         boardItem.figureTexturesObject = this.figureTexturesObject;
//         this.currentFigure.interactive = false;
//         this.currentFigure.buttonMode = false;
//         boardItem.renderFigure();
//         boardItem.currentFigure.rotation = this.currentFigure.rotation;
//         this.currentFigure.destroy();
//         this.currentFigure = null;
//         this.figureTexturesObject = null;
//         this.currentBoardPath.buttonMode = false;
//     }
//
//     rotate(app: Application) {
//         let currentRotation = this.currentFigure.rotation;
//         const targetRotation = currentRotation + Math.PI; // Rotate up to 180 degrees (π radians)
//         const duration = 2000; // Animation duration in milliseconds
//
//         rotateContainer(app, this.currentFigure, targetRotation, duration);
//     }
//
//     moveFigure() {
//         if (!this.currentFigure) {
//             return;
//         }
//
//         this.currentFigure.x = this.coords.x + this.currentFigure.width / 2 + this.figPadding / 2;
//         this.currentFigure.y = this.coords.y + this.currentFigure.height / 2 + this.figPadding / 2;
//     }
//
//     deactivate() {
//         if (this.currentFigure) {
//             this.currentFigure.texture = this.figureTexturesObject?.figureTextures.normal;
//         }
//
//         this.currentBoardPath.texture = this.boardPathTexturesObject.normal;
//         this.currentBoardPath.interactive = false;
//         this.currentBoardPath.buttonMode = false;
//         this.isActive = false;
//     }
//
//     activateFigure() {
//         if (!this.currentFigure) {
//             return;
//         }
//
//         this.currentFigure.texture = this.figureTexturesObject?.figureTextures.active;
//     }
//
//     activateField() {
//         this.currentBoardPath.texture = this.boardPathTexturesObject.active;
//         this.currentBoardPath.interactive = true;
//         this.currentBoardPath.buttonMode = true;
//         this.isActive = true;
//
//         if (this.currentFigure) {
//             this.isUnderAttack = true;
//         }
//     }
//
//     private renderBoardPath() {
//         const boardPath = new Sprite(this.boardPathTexturesObject.normal);
//         boardPath.width = this.size;
//         boardPath.height = this.size;
//         boardPath.x = this.coords.x;
//         boardPath.y = this.coords.y;
//
//         boardPath.on("pointerdown", () => {
//             if (!this.isActive) {
//                 if (this.currentFigure) {
//                     this.prepareFigureToMove();
//                 }
//
//                 return;
//             }
//
//             this.moveFigureHere();
//         });
//
//         this.currentBoardPath = boardPath;
//         this.container.addChild(boardPath);
//     }
//
//     private renderFigure() {
//         if (!this.figureTexturesObject) {
//             return;
//         }
//
//         const figure = new Sprite(this.figureTexturesObject.figureTextures.normal);
//         figure.anchor.set(0.5, 0.5);
//         figure.width = this.figSize;
//         figure.height = this.figSize;
//         figure.interactive = true;
//         figure.buttonMode = true;
//         figure.zIndex = 50;
//
//         figure.on("pointerdown", () => {
//             if (this.isUnderAttack) {
//                 this.moveFigureHere();
//                 return;
//             }
//
//             this.prepareFigureToMove();
//         });
//
//         this.currentFigure = figure;
//
//         this.container.addChild(figure);
//         this.moveFigure();
//     }
//
//     private prepareFigureToMove() {
//         window.dispatchEvent(
//             new CustomEvent("prepareFigureToMove", {
//                 detail: this,
//             }),
//         );
//     }
//
//     private moveFigureHere() {
//         window.dispatchEvent(
//             new CustomEvent("moveFigureHere", {
//                 detail: this,
//             }),
//         );
//     }
// }
