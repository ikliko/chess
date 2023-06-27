import { FigureResource } from "./FigureResource";
import { FigureTypes } from "../enums/FigureTypes";

export class PawnResource extends FigureResource {
    protected static figure: FigureTypes = FigureTypes.pawn;

    // getAvailablePlaces(row: number, col: number, boardItems: BoardItem[][]): BoardCoordinates[] {
    //     const attacker = boardItems[row][col];
    //     // if (!attacker?.figureTexturesObject) {
    //     //     return [];
    //     // }
    //     //
    //     // const direction = attacker.figureTexturesObject.color === FigureColor.white ? -1 : 1;
    //     const possibleMoves: BoardCoordinates[] = [];
    //     //
    //     // // regular move
    //     // const regularMovePos = {
    //     //     row: row + direction,
    //     //     col,
    //     // };
    //     //
    //     // if (Pawn.isEmptyField(boardItems, regularMovePos)) {
    //     //     possibleMoves.push(regularMovePos);
    //     // }
    //     //
    //     // // initial move
    //     // const initialMovePos = {
    //     //     row: row + direction * 2,
    //     //     col,
    //     // };
    //     // const initialPlaceCheck = boardItems[row][col]?.figureTexturesObject?.figureTextures?.isInitialPlace;
    //     // if (!initialPlaceCheck) {
    //     //     return [];
    //     // }
    //     //
    //     // if (
    //     //     Pawn.isEmptyField(boardItems, regularMovePos) &&
    //     //     Pawn.isEmptyField(boardItems, initialMovePos) &&
    //     //     initialPlaceCheck(row, col)
    //     // ) {
    //     //     possibleMoves.push(initialMovePos);
    //     // }
    //     //
    //     // // left attack
    //     // const leftAttackPos = {
    //     //     row: regularMovePos.row,
    //     //     col: col - 1,
    //     // };
    //     //
    //     // if (Pawn.isAttack({ row, col }, boardItems, leftAttackPos)) {
    //     //     possibleMoves.push(leftAttackPos);
    //     // }
    //     //
    //     // // right attack
    //     // const rightAttackPos = {
    //     //     row: regularMovePos.row,
    //     //     col: col + 1,
    //     // };
    //     //
    //     // if (Pawn.isAttack({ row, col }, boardItems, rightAttackPos)) {
    //     //     possibleMoves.push(rightAttackPos);
    //     // }
    //
    //     return possibleMoves;
    // }
}
