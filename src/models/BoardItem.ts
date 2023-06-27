import { Container, Sprite } from "pixi.js";
import { BoardCoords } from "../interfaces/BoardCoords";
import { Figure } from "./Figure";
import { Field } from "./Field";
import { rotateContainer } from "../helpers/rotateContainer";

export class BoardItem {
    field: Field;
    figure: Figure | null;
    // @ts-ignore
    currentFigure: Sprite | null;
    // @ts-ignore
    currentFieldState: Sprite;
    protected isActive = false;
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

    public activateField() {
        if (this.isActive) {
            return;
        }

        this.currentFieldState.texture = this.field.textures.active;
        this.currentFieldState.interactive = true;
        this.currentFieldState.buttonMode = true;
        this.isActive = true;
    }

    private renderField() {
        const field = new Sprite(this.field.textures.inactive);
        field.width = this.field.size;
        field.height = this.field.size;
        field.x = this.field.coords.x;
        field.y = this.field.coords.y;
        field.on("pointerdown", () => this.moveToDispatcher());

        this.currentFieldState = field;

        this.container.addChild(field);
    }

    private renderFigure() {
        if (!this.figure) {
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

    deactivate() {
        this.deactivateField();
        this.deactivateFigure();
    }

    private prepareMove() {
        window.dispatchEvent(new CustomEvent("figureClick"));
        if (this.isActive) {
            this.moveToDispatcher();

            return;
        }

        window.dispatchEvent(
            new CustomEvent("prepareMove", {
                detail: this,
            }),
        );
    }

    activateFigure() {
        if (!this.currentFigure || !this.figure) {
            return;
        }

        this.currentFigure.texture = this.figure.textures.active;
    }

    private deactivateField() {
        if (!this.isActive) {
            return;
        }

        this.currentFieldState.texture = this.field.textures.inactive;
        this.currentFieldState.interactive = false;
        this.currentFieldState.buttonMode = false;
        this.isActive = false;
    }

    private deactivateFigure() {
        if (!this.currentFigure || !this.figure) {
            return;
        }

        this.currentFigure.texture = this.figure.textures.inactive;
    }

    moveToDispatcher() {
        if (!this.isActive) {
            return;
        }

        window.dispatchEvent(
            new CustomEvent("moveTo", {
                detail: this,
            }),
        );
    }

    moveTo(boardItem: BoardItem) {
        if (!this.currentFigure) {
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
    }

    private moveFigure() {
        if (!this.currentFigure || !this.figure) {
            return;
        }

        const figPadding = this.currentFieldState.width - this.currentFigure.width;
        const sizeWithPadding = this.currentFigure.width / 2 + figPadding / 2;
        this.currentFigure.x = this.currentFieldState.x + sizeWithPadding;
        this.currentFigure.y = this.currentFieldState.y + sizeWithPadding;
        this.figure.boardCoords = this.boardCoords;
        this.figure.coords = this.field.coords;
    }

    rotate() {
        if (!this.currentFigure) {
            return;
        }

        const targetRotation = this.currentFigure.rotation + Math.PI;

        rotateContainer(this.currentFigure, targetRotation, 2000);
    }
}
