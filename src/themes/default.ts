export const brownGreyTheme = {
    spritesheet: "./assets/chess/spritesheet.json",

    fields: {
        dark: {
            active: "square_brown_dark.png",
            inactive: "square_brown_light.png",
        },
        light: {
            active: "square_gray_dark.png",
            inactive: "square_gray_light.png",
        },
    },

    defaultSounds: {
        move: "../assets/chess/audio/move/pawn.mp3",
        capture: "../assets/chess/audio/capture/pawn.mp3",
        castle: "../assets/chess/audio/castle.mp3",
        check: "../assets/chess/audio/notify.mp3",
        mate: "../assets/chess/audio/notify.mp3",
    },

    figures: {
        knight: {
            textures: {
                white: {
                    inactive: "w_knight_ns.png",
                    active: "w_knight.png",
                },
                black: {
                    inactive: "b_knight_ns.png",
                    active: "b_knight.png",
                },
            },
        },
        pawn: {
            sounds: {
                move: "../assets/chess/audio/move/pawn.mp3",
                capture: "../assets/chess/audio/capture/pawn.mp3",
            },

            textures: {
                white: {
                    inactive: "w_pawn_ns.png",
                    active: "w_pawn.png",
                },
                black: {
                    active: "b_pawn.png",
                    inactive: "b_pawn_ns.png",
                },
            },
        },
        rook: {
            textures: {
                white: {
                    active: "w_rook.png",
                    inactive: "w_rook_ns.png",
                },
                black: {
                    active: "b_rook.png",
                    inactive: "b_rook_ns.png",
                },
            },
        },
        queen: {
            textures: {
                white: {
                    active: "w_queen.png",
                    inactive: "w_queen_ns.png",
                },
                black: {
                    active: "b_queen.png",
                    inactive: "b_queen_ns.png",
                },
            },
        },
        king: {
            textures: {
                white: {
                    active: "w_king.png",
                    inactive: "w_king_ns.png",
                },
                black: {
                    active: "b_king.png",
                    inactive: "b_king_ns.png",
                },
            },
        },
        bishop: {
            sounds: {
                move: "../assets/chess/audio/move/bishop.mp3",
            },

            textures: {
                white: {
                    active: "w_bishop.png",
                    inactive: "w_bishop_ns.png",
                },
                black: {
                    active: "b_bishop.png",
                    inactive: "b_bishop_ns.png",
                },
            },
        },
    },
};
