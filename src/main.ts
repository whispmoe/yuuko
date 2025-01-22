let collisions = 0;
let lastTime = 0;

const screen = {
    width: window.innerWidth,
    height: innerHeight,
};

const speed = {
    x: 2,
    y: 2,
};

window.addEventListener("resize", () => {
    screen.width = window.innerWidth;
    screen.height = window.innerHeight;
});

const yuuko = {
    ref: document.getElementById("yuuko") as HTMLImageElement,
    pos: {
        x: 0,
        y: 0,
    },
};

const sadness = document.getElementById("sadness") as HTMLImageElement;

const counter = document.getElementById("counter") as HTMLSpanElement;
if (!yuuko.ref) throw new Error("yuuko is not defined");
if (!sadness) throw new Error("sadness is not defined");
if (!counter) throw new Error("counter is not defined");

document.addEventListener("DOMContentLoaded", () => {
    // set initial pos
    yuuko.pos.x = screen.height / 2 + yuuko.ref.offsetWidth;
    yuuko.pos.y = screen.height / 2 + yuuko.ref.offsetHeight;
    yuuko.ref.style.display = "block";
    requestAnimationFrame(update);
});

const update = (time: number) => {
    const delta = (time - lastTime) / 1000;
    lastTime = time;

    if (
        // check for collisions
        yuuko.pos.x <= 0 ||
        yuuko.pos.y <= 0 ||
        yuuko.pos.x + yuuko.ref.offsetWidth >= screen.width ||
        yuuko.pos.y + yuuko.ref.offsetHeight >= screen.height
    ) {
        collisions++;
        counter.innerText = collisions.toString();
        const boom = new Audio("boom.mp3");
        boom.play().then(() => {
            sadness.style.opacity = "1";
            const fadeOut = () => {
                let opacity = parseFloat(sadness.style.opacity);
                if (opacity > 0) {
                    opacity -= 0.01;
                    sadness.style.opacity = opacity.toString();
                    requestAnimationFrame(fadeOut);
                }
            };

            fadeOut();
        });

        // reverse speed in colliding axis
        if (
            yuuko.pos.x <= 0 ||
            yuuko.pos.x + yuuko.ref.offsetWidth >= screen.width
        )
            speed.x = -speed.x;

        if (
            yuuko.pos.y <= 0 ||
            yuuko.pos.y + yuuko.ref.offsetHeight >= screen.height
        )
            speed.y = -speed.y;

        // reposition yuuko if out of bounds
        if (yuuko.pos.x < 0) yuuko.pos.x = 0;
        if (yuuko.pos.y < 0) yuuko.pos.y = 0;
        if (yuuko.pos.x + yuuko.ref.offsetWidth > screen.width)
            yuuko.pos.x = screen.width - yuuko.ref.offsetWidth;
        if (yuuko.pos.y + yuuko.ref.offsetHeight > screen.height)
            yuuko.pos.y = screen.height - yuuko.ref.offsetHeight;
    }

    yuuko.pos.x += speed.x * 100 * delta;
    yuuko.pos.y += speed.y * 100 * delta;
    yuuko.ref.style.left = `${yuuko.pos.x}px`;
    yuuko.ref.style.top = `${yuuko.pos.y}px`;
    requestAnimationFrame(update);
};
