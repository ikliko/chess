import { Container, Sprite, Texture } from "pixi.js";
import { BoardCoordinates } from "../interfaces/BoardCoordinates";
import { ChessFigureSide } from "../interfaces/ChessFigureSide";
import useFakeTimers = jest.useFakeTimers;

export enum FigureColor {
    black = "black",
    white = "white",
}

export interface Figure {
    color: FigureColor;
    availableMoves: (row: number, col: number, boardItems: any[][]) => BoardCoordinates[];
    figureTextures: ChessFigureSide;
}

export class BoardItem {
    currentFigure: any;
    currentBoardPath: any;
    size: number;
    figSize: number;
    figPadding: number;
    coords: any;
    container: Container;
    boardCoords: { row: number; col: number };
    figureTexturesObject: Figure | null;
    boardPathTexturesObject: {
        key: string;
        active: Texture;
        normal: Texture;
    };
    isActive = false;
    isUnderAttack = false;

    constructor(
        container: Container,
        figureTexturesObject: Figure | null,
        boardPath: {
            key: string;
            active: Texture;
            normal: Texture;
        },
        initialSize: number,
        boardCoords: { row: number; col: number },
        initialCoords: { x: number; y: number },
    ) {
        this.container = container;
        this.boardPathTexturesObject = boardPath;
        this.figureTexturesObject = figureTexturesObject;
        this.size = initialSize;
        this.coords = initialCoords;
        this.figSize = this.size * 0.7;
        this.boardCoords = boardCoords;
        this.figPadding = this.size - this.figSize;

        this.render();
    }

    render() {
        this.renderBoardPath();
        this.renderFigure();
    }

    availableMoves(boardItems: BoardItem[][]): BoardCoordinates[] {
        if (!this.figureTexturesObject) {
            return [];
        }

        return this.figureTexturesObject.availableMoves(this.boardCoords.row, this.boardCoords.col, boardItems);
    }

    moveTo(boardItem: BoardItem) {
        if (boardItem === this) {
            return;
        }

        if (boardItem.currentFigure) {
            boardItem.currentFigure.interactive = false;
            boardItem.currentFigure.buttonMode = false;
            boardItem.currentFigure.destroy();
            boardItem.isUnderAttack = false;
        }
        boardItem.currentFigure = this.currentFigure;
        boardItem.figureTexturesObject = this.figureTexturesObject;
        this.currentFigure.interactive = false;
        this.currentFigure.buttonMode = false;
        this.currentFigure.destroy();
        this.currentFigure = null;
        this.figureTexturesObject = null;
        this.currentBoardPath.buttonMode = false;
        boardItem.render();
        this.render();
    }

    moveFigure() {
        if (!this.currentFigure) {
            return;
        }

        this.currentFigure.x = this.coords.x + this.figPadding / 2;
        this.currentFigure.y = this.coords.y + this.figPadding / 2;
    }

    deactivate() {
        if (this.currentFigure) {
            this.currentFigure.texture = this.figureTexturesObject?.figureTextures.normal;
        }

        this.currentBoardPath.texture = this.boardPathTexturesObject.normal;
        this.currentBoardPath.interactive = false;
        this.currentBoardPath.buttonMode = false;
        this.isActive = false;
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
        this.isActive = true;

        if (this.currentFigure) {
            this.isUnderAttack = true;
        }
    }

    private renderBoardPath() {
        const boardPath = new Sprite(this.boardPathTexturesObject.normal);
        boardPath.width = this.size;
        boardPath.height = this.size;
        boardPath.x = this.coords.x;
        boardPath.y = this.coords.y;

        boardPath.on("pointerdown", () => {
            if (!this.isActive) {
                if (this.currentFigure) {
                    this.prepareFigureToMove();
                }

                return;
            }

            this.moveFigureHere();
        });

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

        figure.on("pointerdown", () => {
            if (this.isUnderAttack) {
                this.moveFigureHere();
                return;
            }

            this.prepareFigureToMove();
        });

        this.currentFigure = figure;

        this.container.addChild(figure);
        this.moveFigure();
    }

    private prepareFigureToMove() {
        console.log("prepareFigureToMove");
        window.dispatchEvent(
            new CustomEvent("prepareFigureToMove", {
                detail: this,
            }),
        );
    }

    private moveFigureHere() {
        console.log("moveFigureHere");
        window.dispatchEvent(
            new CustomEvent("moveFigureHere", {
                detail: this,
            }),
        );
    }
}
