import { FigureResource } from "./FigureResource";
import { FigureTypes } from "../enums/FigureTypes";

export class QueenResource extends FigureResource {
    protected static figure: FigureTypes = FigureTypes.queen;
}
