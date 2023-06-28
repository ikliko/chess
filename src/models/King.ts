import { Figure } from "./Figure";
import { BoardItem } from "./BoardItem";
import { BoardCoords } from "../interfaces/BoardCoords";

export class King extends Figure {
    check = false;

    getAvailablePositions(boardItems: BoardItem[][]): BoardCoords[] {
        const moves: BoardCoords[] = this.getAttackPositions(boardItems);

        this.checkPositions(boardItems, moves);

        const rooks = boardItems
            .flat()
            .filter(({ figure }) => figure && figure.color === this.color && figure.isInitialPosition());

        const right = moves.find(({ row, col }) => this.boardCoords.col + 1 === col && this.boardCoords.row === row);

        if (this.isInitialPosition() && right) {
            const rook = rooks.find(({ figure }) => figure && figure.boardCoords.col > this.boardCoords.col);

            if (rook && rook.figure && rook.figure.isInitialPosition()) {
                // check free to the rook
                let isCastleAvailable = true;
                for (let col = this.boardCoords.col + 1; col < rook.figure.boardCoords.col; col++) {
                    if (boardItems[this.boardCoords.row][col].figure) {
                        isCastleAvailable = false;
                        break;
                    }
                }

                if (isCastleAvailable) {
                    moves.push({
                        ...this.boardCoords,
                        col: this.boardCoords.col + 2,
                    });
                }
            }
        }

        const left = moves.find(({ row, col }) => this.boardCoords.col - 1 === col && this.boardCoords.row === row);

        if (this.isInitialPosition() && left) {
            const rook = rooks.find(({ figure }) => figure && figure.boardCoords.col < this.boardCoords.col);

            if (rook && rook.figure && rook.figure.isInitialPosition()) {
                // check free to the rook
                let isCastleAvailable = true;
                for (let col = this.boardCoords.col - 1; col > 0; col--) {
                    if (boardItems[this.boardCoords.row][col].figure) {
                        isCastleAvailable = false;
                        break;
                    }
                }

                if (isCastleAvailable) {
                    moves.push({
                        ...this.boardCoords,
                        col: this.boardCoords.col - 2,
                    });
                }
            }
        }

        return moves;
    }

    getAttackPositions(boardItems: BoardItem[][]): BoardCoords[] {
        return [
            ...this.getUpMoves(boardItems, 1),
            ...this.getDownMoves(boardItems, 1),
            ...this.getLeftMoves(boardItems, 1),
            ...this.getRightMoves(boardItems, 1),
            ...this.getUpLeftDiagonalMove(boardItems, 1),
            ...this.getUpRightDiagonalMove(boardItems, 1),
            ...this.getDownLeftDiagonalMove(boardItems, 1),
            ...this.getDownRightDiagonalMove(boardItems, 1),
        ];
    }

    checkPositions(boardItems: BoardItem[][], moves: BoardCoords[]) {
        const unavailableLocations: (BoardCoords | undefined)[] = boardItems
            .flat()
            .filter(({ figure }) => figure && figure.color !== this.color)
            .map((boardItem) => boardItem.figure?.getAttackPositions(boardItems))
            .filter((moves) => moves?.length)
            .flat();

        unavailableLocations.forEach((unavailableCoords) => {
            if (!unavailableCoords) {
                return;
            }

            const { col: uCol, row: uRow } = unavailableCoords;

            const idx = moves.findIndex(({ row, col }) => row === uRow && col === uCol);

            if (idx < 0) {
                return;
            }

            moves.splice(idx, 1);
        });
    }
}
