import { Container, Sprite } from "pixi.js";

export function rotateContainer(pixiElement: Container | Sprite, targetAngle: number, duration: number) {
    const startAngle = pixiElement.rotation;
    const startTime = Date.now();

    const animation = () => {
        const elapsed = Date.now() - startTime;

        if (elapsed >= duration) {
            pixiElement.rotation = targetAngle;
            return;
        }

        const t = elapsed / duration; // Interpolation value between 0 and 1
        // Update the container's rotation
        pixiElement.rotation = startAngle + t * (targetAngle - startAngle);

        requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
}
