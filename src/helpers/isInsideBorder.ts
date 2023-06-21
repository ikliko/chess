import { BoardCoordinates } from "../interfaces/BoardCoordinates";

export function isInsideBorder({ col, row }: BoardCoordinates) {
    return !(col < 0 || col > 7 || row < 0 || row > 7);
}
