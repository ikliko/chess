import { FigureResource } from "./FigureResource";
import { FigureTypes } from "../enums/FigureTypes";

export class KnightResource extends FigureResource {
    protected static figure: FigureTypes = FigureTypes.knight;
}
