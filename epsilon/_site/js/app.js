let winsize;
const overlay = document.querySelector('.overlay');
const burger = document.querySelector('.burger');
const navLinks = document.querySelectorAll('.nav-link');
const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
window.addEventListener('resize', calcWinsize);

class ShapeOverlays {
    constructor(elm) {
        this.elm = elm;
        this.path = elm.querySelectorAll('path');
        this.numPoints = 3;
        this.duration = 900;
        this.delayPointsArray = [];
        this.delayPointsMax = 300;
        this.delayPerPath = 250;
        this.timeStart = Date.now();
        this.isOpened = false;
        this.isAnimating = false;
    }
    toggle() {
        this.isAnimating = true;
        for (var i = 0; i < this.numPoints; i++) {
            this.delayPointsArray[i] = Math.random() * this.delayPointsMax;
        }
        if (this.isOpened === false) {
            this.open();
        } else {
            this.close();
        } 
    }
    open() {
        this.isOpened = true;
        this.elm.classList.add('is-opened');
        this.timeStart = Date.now();
        this.renderLoop();
    }
    close() {
        this.isOpened = false;
        this.elm.classList.remove('is-opened');
        this.timeStart = Date.now();
        this.renderLoop();
    }
    
    updatePath(time) {
        const points = [];
        function cubicInOut(t){
            return t < 0.5
                ? 4.0 * t * t * t
                : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
        }
        for (var i = 0; i < this.numPoints; i++) {
            points[i] = (1 - cubicInOut(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1))) * 100
        }
    
        let str = '';
        str += (this.isOpened) ? `M 0 0 V ${points[0]}` : `M 0 ${points[0]}`;
        for (var i = 0; i < this.numPoints - 1; i++) {
            const p = (i + 1) / (this.numPoints - 1) * 100;
            const cp = p - (1 / (this.numPoints - 1) * 100) / 2;
            str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `;
        }
        str += (this.isOpened) ? `V 100 H 0` : `V 0 H 0`;
        return str;
    }
    render() {
        if (this.isOpened) {
            for (var i = 0; i < this.path.length; i++) {
            this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * i)));
            }
        } else {
            for (var i = 0; i < this.path.length; i++) {
            this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * (this.path.length - i - 1))));
            }
        }
    }
    renderLoop() {
        this.render();
        if (Date.now() - this.timeStart < this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPointsMax) {
            requestAnimationFrame(() => {
            this.renderLoop();
            });
        }
        else {
            this.isAnimating = false;
        }
    }
}
function initPointer(){
    const ring = document.createElement("div");
    ring.id = "pointer-ring"
    document.body.insertBefore(ring, document.body.children[0]);
    window.addEventListener('touchstart', function() {ring.remove();}); 
    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let isHover = false
    let mouseDown = false
    window.onmousemove = (mouse) => {
        mouseX = mouse.clientX
        mouseY = mouse.clientY
    }
    window.onmousedown = (mouse) => {
        mouseDown = true
    }
    window.onmouseup = (mouse) => {
        mouseDown = false
    }
    const trace = (a, b, n) => {
        return (1 - n) * a + n * b;
    }
    window["trace"] = trace
    const render = () => {
        ringX = trace(ringX, mouseX, 0.2)
        ringY = trace(ringY, mouseY, 0.2)
        if (mouseDown) { ring.style.padding = 22 + "px"} else { ring.style.padding = 24 + "px" }
        ring.style.transform = `translate(${ringX - (mouseDown ? 17 : 19)}px, ${ringY - (mouseDown ? 17 : 19)}px)`
        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}
function colourHeaderByBG() {
    const projectHeaderBG = document.getElementsByTagName('header')[0];
    const projectHeader = document.querySelector('.project-header');
    const backButton = document.querySelector('.back-button');
    if (projectHeader != null) {
        let headBg = window.getComputedStyle(projectHeaderBG).backgroundColor;
        let sep = headBg.indexOf(",") > -1 ? "," : " ";
        headBg = headBg.substr(4).split(")")[0].split(sep);
    
        for (let R in headBg) {
            let r = headBg[R];
            if (r.indexOf("%") > -1)
            headBg[R] = Math.round(r.substr(0,r.length - 1) / 100 * 255);
        }
    
        let r = headBg[0],
            g = headBg[1],
            b = headBg[2],
            l = (Math.min(r,g,b) + Math.max(r,g,b)) / 2;
    
        if (l < 128) {
            backButton.classList.add('dark');
            burger.classList.add('dark');
            projectHeader.style.color = "white";
            window.addEventListener('scroll', () => {
                if (window.scrollY > projectHeaderBG.offsetHeight - 50) {
                    backButton.classList.remove('dark');
                    burger.classList.remove('dark');
                } else if (window.scrollY < projectHeaderBG.offsetHeight){
                    backButton.classList.add('dark');
                    burger.classList.add('dark');
                }
            })    
            }
    } else {
        burger.classList.remove('dark');
    }
}
function burgerMenu(){
    burger.addEventListener('click', () => {
        if (fluidOverlay.isAnimating) {return false;}
        fluidOverlay.toggle();
        if (fluidOverlay.isOpened === true) {
            // setTimeout( () => {burger.classList.remove('dark')}, 900);
            burger.classList.add('is-active');
            for (var i = 0; i < navLinks.length; i++) {
                navLinks[i].classList.add('is-opened');
                navLinks[i].addEventListener('click', () => {
                    fluidOverlay.toggle();
                    burger.classList.remove('is-active');
                    for (var x = 0; x < navLinks.length; x++) {
                        navLinks[x].classList.remove('is-opened');
                    }
                    setTimeout( () => {colourHeaderByBG()}, 600);
                })
            }
        } else {
            setTimeout( () => {colourHeaderByBG()}, 600);
            burger.classList.remove('is-active');
            for (var i = 0; i < navLinks.length; i++) {
                navLinks[i].classList.remove('is-opened');
            }
        }
    });
}
function delay(n){
    n = n || 2000;
    return new Promise(done => {
        setTimeout(() => {
            done();
        }, n);
    });
}
function homePreload(){
    if (document.getElementById('home') == null){ return }
    let homeFadeIn = anime.timeline();
        homeFadeIn.add({
            targets: '#home > *',
            opacity: [0, 1],
            translateX: [-100, 0],
            duration: 500,
            easing: "easeInOutQuad",
            delay: anime.stagger(50)
        }, 500)
        .add({
            targets: '.project-item',
            opacity: [0, 1],
            translateY: [100, 0],
            rotate: [10, 0],
            duration: 600,
            easing: "easeInOutQuad",
            delay: anime.stagger(100),
        }, 700);
}
function lazyLoad(){
    'use strict';
    const objects = document.querySelectorAll("[data-lazy]");
    console.log(objects);
    Array.from(objects).map((item) => {
        // Start loading image
        const img = new Image();
        img.src = item.dataset.lazy;
        // Once image is loaded replace the src of the HTML element
        img.onload = () => {
        item.src = item.dataset.lazy;
        };
    });
}
const MathUtils = {
    lineEq: (y2, y1, x2, x1, currentVal) => {
        // y = mx + b 
        var m = (y2 - y1) / (x2 - x1), b = y1 - m * x1;
        return m * currentVal + b;
    },
    lerp: (a, b, n) => (1 - n) * a + n * b,
    getRandomFloat: (min, max) => (Math.random() * (max - min) + min).toFixed(2)
};
class SliderItem {
    constructor(el) {
        this.DOM = {el: el};
        this.DOM.image = this.DOM.el.querySelector('.project-image');
        this.DOM.title = this.DOM.el.querySelector('.project-link');
    }
}
class DraggableSlider {
    constructor(el) {
        this.DOM = {el: el};
        this.DOM.strip = this.DOM.el.querySelector('.project-list');
        this.items = [];
        [...this.DOM.strip.querySelectorAll('.project-item')].forEach(item => this.items.push(new SliderItem(item)));
        this.DOM.draggable = this.DOM.el.querySelector('.draggable'); // draggable container
        this.draggableWidth = this.DOM.draggable.offsetWidth; // width of draggable & strip container
        this.maxDrag = this.draggableWidth < winsize.width ? 0 : this.draggableWidth - winsize.width; // amount that we can drag
        this.dragPosition = 0; // The current amount (in pixels) that was dragged
        this.draggie = new Draggabilly(this.DOM.draggable, { axis: 'x' }); // Initialize the Draggabilly
        this.init();
        this.initEvents();
        
    }
    init() {
        this.renderedStyles = {
            position: {previous: 0, current: this.dragPosition},
            scale: {previous: 1, current: 1},
            imgScale: {previous: 1, current: 1},
            opacity: {previous: 1, current: 1},
        };

        this.render = () => {
            this.renderId = undefined;
            for (const key in this.renderedStyles ) {
                this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, 0.1);
            }
            anime.set(this.DOM.strip, {translateX: this.renderedStyles.position.previous});
            for (const item of this.items) {
                // anime.set(item.DOM.el, {scale: this.renderedStyles.scale.previous, opacity: this.renderedStyles.opacity.previous});
                anime.set(item.DOM.el, {scale: this.renderedStyles.scale.previous});
                anime.set(item.DOM.image, {scale: this.renderedStyles.imgScale.previous});
            }
            if ( !this.renderId ) {this.renderId = requestAnimationFrame(() => this.render());}
        };
        this.renderId = requestAnimationFrame(() => this.render());
    }

    initEvents() {
        window.addEventListener('resize', () => {
            this.maxDrag = this.draggableWidth < winsize.width ? 0 : this.draggableWidth - winsize.width;
            if ( Math.abs(this.dragPosition) + winsize.width > this.draggableWidth ) {
                const diff = Math.abs(this.dragPosition) + winsize.width - this.draggableWidth;
                this.dragPosition = this.dragPosition+diff;
                this.draggie.setPosition(this.dragPosition, this.draggie.position.y);
            }
        });

        this.onDragStart = () => {
            this.renderedStyles.scale.current = 0.9;
            this.renderedStyles.imgScale.current = 1.2;
            this.renderedStyles.opacity.current = 0.8;
            // cursor effects on dragstart, scale up, show arrows, etc
        };

        this.onDragMove = (event, pointer, moveVector) => {
            if ( this.draggie.position.x >= 0 ) {
                this.dragPosition = MathUtils.lineEq(0.5*winsize.width,0, winsize.width, 0, this.draggie.position.x);
            } else if ( this.draggie.position.x < -1*this.maxDrag ) {
                this.dragPosition = MathUtils.lineEq(0.5*winsize.width,0, this.maxDrag+winsize.width, this.maxDrag, this.draggie.position.x);
            } else { this.dragPosition = this.draggie.position.x; }
            this.renderedStyles.position.current = this.dragPosition;

            if (this.draggie.position.x <= -100){
                document.getElementById('home').classList.add('hide');

            }
            if (this.draggie.position.x > -100){
                document.getElementById('home').classList.remove('hide');
            }
            this.draggie.direction = moveVector.x;
            // mousepos = getMousePos(event);
        };

        this.onDragEnd = () => {
            // reset if out of bounds
            if ( this.draggie.position.x > 0 ) {
                this.dragPosition = 0;
                this.draggie.setPosition(this.dragPosition, this.draggie.position.y);
            }
            else if ( this.draggie.position.x < -1*this.maxDrag ) {
                this.dragPosition = -1*this.maxDrag;
                this.draggie.setPosition(this.dragPosition, this.draggie.position.y);
            }
            // snap to beginning, hide home
            if (this.draggie.position.x <= -100 && this.draggie.position.x > -600 && this.draggie.direction < 0 && window.innerWidth > 800){
                this.dragPosition = -600;
                this.draggie.setPosition(this.dragPosition, this.draggie.position.y);
            } 
            else if (this.draggie.position.x <= -100 && this.draggie.position.x > -600 && this.draggie.direction > 0 && window.innerWidth > 800){
                this.dragPosition = 0;
                this.draggie.setPosition(this.dragPosition);
                document.getElementById('home').classList.remove('hide');
            }

            this.renderedStyles.position.current = this.dragPosition;
            this.renderedStyles.scale.current = 1;
            this.renderedStyles.imgScale.current = 1;
            this.renderedStyles.opacity.current = 1;
            
            // cursor effects on dragend, like scale, hide arrows, etc
        };

        this.draggie.on('pointerDown', this.onDragStart);
        this.draggie.on('dragMove', this.onDragMove);
        this.draggie.on('pointerUp', this.onDragEnd);
    }
}
class Zooom {
    constructor(options) {
      this.element = options.element;
      this.padding = options.padding || 80;
      this.wrap = 'zooom-wrap';
      this.img = 'zooom-img';
      this.overlay = 'zooom-overlay';
  
      if (typeof options.overlay === 'undefined') {
        this.color = '#fff';
        this.opacity = '1';
      } else {
        const { color, opacity } = options.overlay;
        this.color = color;
        this.opacity = opacity;
      }
  
      this.addEventImage();
    }
  
    addEventImage() {
      const imageList = document.querySelectorAll(this.element);
      imageList.forEach(image => {
        image.addEventListener('click', e => {
          e.stopPropagation();
          this.imageZooom = e.currentTarget;
          // init zooom image
          this.zooomInit();
        });
      });
    }
  
    createWrapper() {
      this.wrapper = document.createElement('div');
      this.wrapper.classList.add(this.wrap);
  
      this.wrapImage(this.imageZooom, this.wrapper);
  
      this.imageZooom.classList.add(this.img);
      this.overlayAdd();
    }
  
    removeWrapper() {
      const wrapZooom = document.querySelector(`.${this.wrap}`);
      const transition = this.transitionEvent();
  
      if (wrapZooom) {
        const image = document.querySelector(`.${this.img}`);
        image.removeAttribute('style');
        wrapZooom.removeAttribute('style');
        wrapZooom.addEventListener(transition, e => {
          const parent = e.currentTarget.parentNode;
          if (parent) {
            parent.replaceChild(image, e.currentTarget);
          }
          image.classList.remove(this.img);
          this.overlayRemove();
        });
      }
    }
  
    zooomInit() {
      const wrapZooom = document.querySelector(`.${this.wrap}`);
      if (wrapZooom === null) {
        this.createWrapper();
        this.imageTranslate(this.imageProperty());
        this.imageScale(this.imageProperty());
      } else {
        this.removeWrapper();
      }
  
      window.addEventListener('scroll', () => {
        this.removeWrapper();
        window.removeEventListener('scroll', this.removeWrapper, true);
      });
  
      document.body.addEventListener('click', () => {
        this.removeWrapper();
      });
    }
  
    overlayAdd() {
      const overlay = document.createElement('div');
      overlay.id = this.overlay;
      overlay.setAttribute(
        'style',
        `background-color: ${this.color}; opacity: ${this.opacity}`
      );
      document.body.appendChild(overlay);
    }
  
    overlayRemove() {
      const overlay = document.getElementById(this.overlay);
      if (overlay) {
        overlay.parentNode.removeChild(overlay);
      }
    }
  
    // https://stackoverflow.com/questions/2794148/css3-transition-events
    transitionEvent() {
      const el = document.createElement('fakeelement');
  
      const transitions = {
        WebkitTransition: 'webkitTransitionEnd', // Saf 6, Android Browser
        MozTransition: 'transitionend', // only for FF < 15
        transition: 'transitionend', // IE10, Opera, Chrome, FF 15+, Saf 7+
      };
  
      for (const t in transitions) {
        if (el.style[t] !== undefined) {
          return transitions[t];
        }
      }
    }
  
    wrapImage(el, wrapper) {
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    }
  
    imageProperty() {
      const propImage = {
        targetWidth: this.imageZooom.clientWidth,
        targetHeight: this.imageZooom.clientHeight,
        imageWidth: this.imageZooom.naturalWidth,
        imageHeight: this.imageZooom.naturalHeight,
      };
      return propImage;
    }
  
    imageScale({ imageWidth, imageHeight, targetWidth }) {
      const maxScale = imageWidth / targetWidth;
  
      const viewportHeight = window.innerHeight - this.padding;
      const viewportWidth = document.documentElement.clientWidth - this.padding;
  
      const imageApectRatio = imageWidth / imageHeight;
      const vieportAspectRatio = viewportWidth / viewportHeight;
  
      let imageScale = 1;
  
      if (imageWidth < viewportWidth && imageHeight < viewportHeight) {
        imageScale = maxScale;
      } else if (imageApectRatio < vieportAspectRatio) {
        imageScale = (viewportHeight / imageHeight) * maxScale;
      } else {
        imageScale = (viewportWidth / imageWidth) * maxScale;
      }
  
      if (imageScale <= 1) {
        imageScale = 1;
      }
  
      this.imageZooom.setAttribute(
        'style',
        `transform: scale(${imageScale}) translateZ(0);`
      );
    }
  
    imageTranslate({ targetWidth, targetHeight }) {
      const rect = this.imageZooom.getBoundingClientRect();
  
      const viewportY = window.innerHeight / 2;
      const viewportX = document.documentElement.clientWidth / 2;
  
      const imageCenterY = rect.top + targetHeight / 2;
      const imageCenterX = rect.left + targetWidth / 2;
  
      const translateY = viewportY - imageCenterY;
      const translateX = viewportX - imageCenterX;
  
      this.wrapper.setAttribute(
        'style',
        `transform: translate(${translateX}px, ${translateY}px) translateZ(0px);`
      );
    }
}
function initZooom () {
    new Zooom({
      element: 'figure',
      padding: 80,
      overlay: {
        color: '#000',
        opacity: '.5',
        },
    });
}

// These scripts only need to be executed once in the site lifecycle
initPointer();
calcWinsize();
homePreload();
const fluidOverlay = new ShapeOverlays(overlay);

barba.init({
    transitions: [{
        leave(data) {
            anime({
                targets: data.current.container,
                opacity: [1, 0],
                duration: 300,
                easing: 'easeOutQuad',
            });
            setTimeout(this.async(), 300);
        },
        enter(data){
            window.scrollTo(0, 0);
            anime({
                targets: data.next.container,
                opacity: [0, 1],
                duration: 300,
                delay: 500,
                easing: 'easeOutQuad',
            });
        },
        after(){
            onPageLoad();
        }
    },
    {
        name: "to-home",
        to: { namespace: "default"},
        leave(data) {
            anime({
                targets: data.current.container,
                opacity: [1, 0],
                duration: 300,
                easing: 'easeOutQuad',
            });
            setTimeout(this.async(), 300);
        },
        beforeEnter(){
            anime.set('.project-item', {
                opacity: 0,
                translateY: 100,
                rotate: 45,
            });
        },
        enter(data){
            window.scrollTo(0, 0);
            let homeFadeIn = anime.timeline();
            homeFadeIn.add({
                targets: '#home > *',
                opacity: [0, 1],
                translateX: [-100, 0],
                duration: 500,
                easing: "easeInOutQuad",
                delay: anime.stagger(50)
            }, 500)
            .add({
                targets: '.project-item',
                opacity: [0, 1],
                translateY: [100, 0],
                rotate: [10, 0],
                duration: 600,
                easing: "easeInOutQuad",
                delay: anime.stagger(100),
            }, 700);   
        },
        after(){
            onPageLoad();
        }
    }
    ]
});

// These functions will need to be run at each pageload!
function onPageLoad() {
    burgerMenu();
    colourHeaderByBG();
    lazyLoad();
    initZooom();
    if (document.querySelector('.portfolio')){new DraggableSlider(document.querySelector('.portfolio'));}
}

onPageLoad();








