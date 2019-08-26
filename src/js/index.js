import 'normalize.css';
import '../sass/style.scss';
import { tns } from '../../node_modules/tiny-slider/src/tiny-slider';

document.addEventListener('DOMContentLoaded', () => {
    const speedOfSlide = 600;
    const animationDuration = 500;
    const secondAnimationEnd = animationDuration + animationDuration * 0.8;
    const slideChanged = secondAnimationEnd + speedOfSlide;

    const slider = tns({
        container: '.slider',
        items: 3,
        speed: speedOfSlide,
        nav: false,
        autoplay: false,
        controls: false
    });

    let canSlide = true;

    function animateSlides(direction) {
        if (!canSlide) {
            return;
        }
        const leftSlideClass = `slider__slide_animate-left-${direction}`;
        const rightSlideClass = `slider__slide_animate-right-${direction}`;
        const currentSliderInfo = slider.getInfo();
        let leftSlideIndex;
        let rightSlideIndex;
        if (direction === 'next') {
            leftSlideIndex = currentSliderInfo.index;
            rightSlideIndex = currentSliderInfo.index + 3;
        } else {
            leftSlideIndex = currentSliderInfo.index - 1;
            rightSlideIndex = currentSliderInfo.index + 2;
        }
        const leftSlide = currentSliderInfo.slideItems[leftSlideIndex];
        const rightSlide = currentSliderInfo.slideItems[rightSlideIndex];
        rightSlide.classList.toggle(rightSlideClass);
        leftSlide.classList.toggle(leftSlideClass);
        canSlide = false;

        setTimeout(() => {
            rightSlide.classList.toggle(rightSlideClass);
            leftSlide.classList.toggle(leftSlideClass);
            slider.goTo(direction);
        }, secondAnimationEnd);

        setTimeout(() => {
            canSlide = true;
            // 100ms for DOM load
        }, slideChanged + 100);
    }

    const leftArrow = document.querySelector('.slider__left-arrow');
    const rightArrow = document.querySelector('.slider__right-arrow');

    leftArrow.addEventListener('click', () => {
        animateSlides('next');
    });

    rightArrow.addEventListener('click', () => {
        animateSlides('prev');
    });
});
