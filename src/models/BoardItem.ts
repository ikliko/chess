import { Container, Sprite } from "pixi.js";
import { BoardCoords } from "../interfaces/BoardCoords";
import { Figure } from "./Figure";
import { Field } from "./Field";
import { rotateContainer } from "../helpers/rotateContainer";
import { config } from "../config";
import { King } from "./King";

export class BoardItem {
    field: Field;
    figure: Figure | null;
    currentFigure: Sprite | null = null;
    currentFieldState: Sprite | null = null;
    protected isActive = false;
    protected container: Container;
    protected boardCoords: BoardCoords;

    constructor(container: Container, field: Field, figure: Figure | null, boardCoords: BoardCoords) {
        this.container = container;
        this.field = field;
        this.figure = figure;
        this.boardCoords = boardCoords;

        this.initialize();
    }

    public activateField(): void {
        if (this.isActive || !this.currentFieldState) {
            return;
        }

        this.currentFieldState.texture = this.field.textures.active;
        this.currentFieldState.interactive = true;
        this.currentFieldState.buttonMode = true;
        this.isActive = true;
    }

    public deactivate(): void {
        this.deactivateField();
        this.deactivateFigure();
    }

    public rotate(): void {
        if (!this.currentFigure) {
            return;
        }

        const { duration, direction } = config.rotates.figures;
        const targetRotation = this.currentFigure.rotation + Math.PI * direction;

        rotateContainer(this.currentFigure, targetRotation, duration);
    }

    public moveToDispatcher(): void {
        if (!this.isActive) {
            return;
        }

        window.dispatchEvent(
            new CustomEvent("moveTo", {
                detail: this,
            }),
        );
    }

    public moveTo(boardItem: BoardItem): void {
        if (!this.currentFigure || !this.currentFieldState) {
            return;
        }

        boardItem.currentFigure?.destroy();
        boardItem.currentFigure = null;
        boardItem.figure = null;
        boardItem.figure = this.figure;
        boardItem.currentFigure = this.currentFigure;
        boardItem.renderFigure();
        boardItem.moveFigure();
        boardItem.currentFigure.rotation = this.currentFigure.rotation;
        this.figure = null;
        this.currentFigure?.destroy();
        this.currentFigure = null;
        this.currentFieldState.interactive = false;
        this.currentFieldState.buttonMode = false;

        if (!boardItem.figure) {
            return;
        }

        boardItem.figure.isPlayed = true;

        const colDiff = Math.abs(this.boardCoords.col - boardItem.figure.boardCoords.col);

        if (boardItem.figure instanceof King && colDiff > 1) {
            window.dispatchEvent(
                new CustomEvent("castle", {
                    detail: boardItem,
                }),
            );
        }
    }

    public activateFigure(): void {
        if (!this.currentFigure || !this.figure) {
            return;
        }

        this.currentFigure.texture = this.figure.textures.active;
    }

    protected initialize(): void {
        this.renderField();
        this.renderFigure();
    }

    private renderField(): void {
        const field = new Sprite(this.field.textures.inactive);
        field.width = this.field.size;
        field.height = this.field.size;
        field.x = this.field.coords.x;
        field.y = this.field.coords.y;
        field.on("pointerdown", () => this.moveToDispatcher());
        this.currentFieldState = field;
        this.container.addChild(field);
    }

    private renderFigure(): void {
        if (!this.figure || !this.currentFieldState) {
            return;
        }

        const figure = new Sprite(this.figure.textures.inactive);
        figure.anchor.set(0.5, 0.5);
        figure.width = this.figure.size;
        figure.height = this.figure.size;
        figure.x = this.figure.coords.x;
        figure.y = this.figure.coords.y;
        figure.zIndex = 50;
        figure.interactive = true;
        figure.buttonMode = true;

        figure.on("pointerdown", () => this.prepareMove());
        this.currentFieldState.on("pointerdown", () => this.prepareMove());
        this.currentFieldState.buttonMode = true;
        this.currentFieldState.interactive = true;
        this.currentFigure = figure;

        this.container.addChild(figure);
    }

    private prepareMove(): void {
        if (this.isActive) {
            this.moveToDispatcher();

            return;
        }
        window.dispatchEvent(new CustomEvent("figureClick"));

        window.dispatchEvent(
            new CustomEvent("prepareMove", {
                detail: this,
            }),
        );
    }

    private deactivateField(): void {
        if (!this.isActive || !this.currentFieldState) {
            return;
        }

        this.currentFieldState.texture = this.field.textures.inactive;
        this.currentFieldState.interactive = false;
        this.currentFieldState.buttonMode = false;
        this.isActive = false;
    }

    private deactivateFigure(): void {
        if (!this.currentFigure || !this.figure) {
            return;
        }

        this.currentFigure.texture = this.figure.textures.inactive;
    }

    private moveFigure(): void {
        if (!this.currentFigure || !this.figure || !this.currentFieldState) {
            return;
        }

        const figPadding = this.currentFieldState.width - this.currentFigure.width;
        const sizeWithPadding = this.currentFigure.width / 2 + figPadding / 2;
        this.currentFigure.x = this.currentFieldState.x + sizeWithPadding;
        this.currentFigure.y = this.currentFieldState.y + sizeWithPadding;
        this.figure.boardCoords = this.boardCoords;
        this.figure.coords = this.field.coords;
    }
}
