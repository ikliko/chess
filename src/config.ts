import { brownGreyTheme } from "./themes/default";

export const config = {
    theme: brownGreyTheme,
    rotates: {
        board: {
            duration: 1500,
            direction: -1, // 1 - left | -1 - right
        },
        figures: {
            duration: 1500,
            direction: 5, // 1 - left | -1 - right for interesting effects you can place any odd number
        },
    },
};
