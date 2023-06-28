import { Coords } from "../interfaces/Coords";
import { BoardCoords } from "../interfaces/BoardCoords";
import { EntityTexture } from "../resources/EntityTexture";

export class ChessEntity {
    textures: EntityTexture;
    size: number;
    coords: Coords;
    initialCoords: Coords;
    boardCoords: BoardCoords;

    constructor(textures: EntityTexture, size: number, coords: Coords, boardCoords: BoardCoords) {
        this.textures = textures;
        this.size = size;
        this.coords = coords;
        this.initialCoords = coords;
        this.boardCoords = boardCoords;
    }

    public isInitialPosition() {
        if (this.coords.x !== this.initialCoords.x) {
            return false;
        }

        return this.coords.y === this.initialCoords.y;
    }
}
