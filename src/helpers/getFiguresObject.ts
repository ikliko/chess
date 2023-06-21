import { Sprite } from "pixi.js";
import { BoardFigures } from "../interfaces/BoardFigures";
import { FigureConfig } from "../interfaces/FigureConfig";
import { Knight } from "../models/Knight";
import { Pawn } from "../models/Pawn";
import { Rook } from "../models/Rook";
import { Queen } from "../models/Queen";
import { King } from "../models/King";
import { Bishop } from "../models/Bishop";

export function getFigures(): BoardFigures {
    return {
        knight: new Knight(),
        pawn: new Pawn(),
        // rook: new Rook(),
        // queen: new Queen(),
        // king: new King(),
        // bishop: new Bishop(),
    };
}
