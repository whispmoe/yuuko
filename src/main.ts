const SPEED = 3;

let collisions = 0;
let direction = Math.random() * 2 * Math.PI;
let lastTime = 0;

const screen = {
    width: window.innerWidth,
    height: innerHeight,
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

const sadness = {
    timeout: -1,
    ref: document.getElementById("sadness") as HTMLImageElement,
};

const counter = document.getElementById("counter") as HTMLSpanElement;
if (!sadness.ref) throw new Error("sadness is not defined");
if (!yuuko.ref) throw new Error("yuuko is not defined");
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
            sadness.ref.style.opacity = "1";
            if (sadness.timeout !== -1) clearTimeout(sadness.timeout);
            sadness.timeout = setTimeout(() => {
                const fadeOut = () => {
                    let opacity = parseFloat(sadness.ref.style.opacity);
                    if (opacity > 0) {
                        opacity -= 0.01;
                        sadness.ref.style.opacity = opacity.toString();
                        requestAnimationFrame(fadeOut);
                    }
                };

                fadeOut();
            }, 500);
        });

        // pick new direction and ensure it does not collide
        do direction = Math.random() * 2 * Math.PI;
        while (
            (yuuko.pos.x <= 0 && Math.cos(direction) < 0) ||
            (yuuko.pos.y <= 0 && Math.sin(direction) < 0) ||
            (yuuko.pos.x + yuuko.ref.offsetWidth >= screen.width &&
                Math.cos(direction) > 0) ||
            (yuuko.pos.y + yuuko.ref.offsetHeight >= screen.height &&
                Math.sin(direction) > 0)
        );

        // reposition yuuko if out of bounds
        if (yuuko.pos.x < 0) yuuko.pos.x = 0;
        if (yuuko.pos.y < 0) yuuko.pos.y = 0;
        if (yuuko.pos.x + yuuko.ref.offsetWidth > screen.width)
            yuuko.pos.x = screen.width - yuuko.ref.offsetWidth;
        if (yuuko.pos.y + yuuko.ref.offsetHeight > screen.height)
            yuuko.pos.y = screen.height - yuuko.ref.offsetHeight;
    }

    yuuko.pos.x += SPEED * 100 * Math.cos(direction) * delta;
    yuuko.pos.y += SPEED * 100 * Math.sin(direction) * delta;
    yuuko.ref.style.left = `${yuuko.pos.x}px`;
    yuuko.ref.style.top = `${yuuko.pos.y}px`;
    requestAnimationFrame(update);
};
