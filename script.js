function page4Animation() {
    var elementContainer = document.querySelector(".container");
    var fixed = document.querySelector(".fixed-image");
    elementContainer.addEventListener("mouseenter", function () {
        fixed.style.display = "block";
    });
    elementContainer.addEventListener("mouseleave", function () {
        fixed.style.display = "none";
    });

    var elements = document.querySelectorAll(".elem");
    elements.forEach(function (e) {
        e.addEventListener("mouseenter", function () {
            var image = e.getAttribute("data-image");
            fixed.style.backgroundImage = `url(${image})`;
        });
    });
}

function swiperAnimation() {
    new Swiper(".mySwiper", {
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 100,
    });
}

new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
});

swiperAnimation();
page4Animation();
