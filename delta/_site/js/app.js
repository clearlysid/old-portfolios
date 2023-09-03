const burger = document.querySelector('.burger');
const navLinks = document.querySelectorAll('.nav-link');
const overlay = document.querySelector('.overlay');
const ring = document.createElement("div");
window.addEventListener('load', () => {document.body.classList.remove('fade')});

ring.id = "pointer-ring"
document.body.insertBefore(ring, document.body.children[0]);
window.addEventListener('touchstart', function() {ring.remove();}); 
let mouseX = -100
let mouseY = -100
let ringX = -100
let ringY = -100
let isHover = false
let mouseDown = false

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
        for (var i = 0; i < this.numPoints; i++) {
            points[i] = (1 - ease.cubicInOut(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1))) * 100
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

const ease = {
    exponentialIn: (t) => {
    return t == 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0));
    },
    exponentialOut: (t) => {
    return t == 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t);
    },
    exponentialInOut: (t) => {
    return t == 0.0 || t == 1.0
        ? t
        : t < 0.5
        ? +0.5 * Math.pow(2.0, (20.0 * t) - 10.0)
        : -0.5 * Math.pow(2.0, 10.0 - (t * 20.0)) + 1.0;
    },
    sineOut: (t) => {
    const HALF_PI = 1.5707963267948966;
    return Math.sin(t * HALF_PI);
    },
    circularInOut: (t) => {
    return t < 0.5
        ? 0.5 * (1.0 - Math.sqrt(1.0 - 4.0 * t * t))
        : 0.5 * (Math.sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);
    },
    cubicIn: (t) => {
    return t * t * t;
    },
    cubicOut: (t) => {
    const f = t - 1.0;
    return f * f * f + 1.0;
    },
    cubicInOut: (t) => {
    return t < 0.5
        ? 4.0 * t * t * t
        : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    },
    quadraticOut: (t) => {
    return -t * (t - 2.0);
    },
    quarticOut: (t) => {
    return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
    },
}

const init_pointer = (options) => {
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
        ring.style.transform = `translate(${ringX - (mouseDown ? 17 : 21)}px, ${ringY - (mouseDown ? 17 : 21)}px)`
        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}

const pageTransitions = [
    { // from project to home
        from: '/projects/*',
        to: '/index.html',
        in: function(next) {
            imagesLoaded( '#swup', { background: true }, function(){      
                fluidOverlay.toggle();
                window.scrollTo(0, 0);
                setTimeout( next, 1200);
            });
        },
        out: (next) => {
            fluidOverlay.toggle();
            setTimeout( next, 1200);
        }
    },
    { // from home to project
        from: '/',
        to: '/projects/*',
        in: function(next) {
            var loading = anime({
                targets: '.loader',
                opacity: 1,
                duration: 1000,
                delay: 1000
            });
            loading.restart();
            imagesLoaded( '#swup', { background: true }, function(){    
                loading.pause();
                anime({
                    targets: '.loader',
                    opacity: 0,
                    duration: 200
                });
                window.scrollTo(0, 0);
                setTimeout( () => {
                    fluidOverlay.toggle();
                    next();
                }, 1200);
            });

        },
        out: (next) => {
            anime.set('.loader', {opacity: 0})
            fluidOverlay.toggle();
            setTimeout( next, 1200);
        }
    }
];

function projectHoverFX() {
    const lineEq = (y2, y1, x2, x1, currentVal) => {
        // y = mx + b 
        var m = (y2 - y1) / (x2 - x1), b = y1 - m * x1;
        return m * currentVal + b;
    };

    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const getRandomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

    const setRange = (obj) => {
        for(let k in obj) {
            if( obj[k] == undefined ) {
                obj[k] = [0,0];
            }
            else if( typeof obj[k] === 'number' ) {
                obj[k] = [-1*obj[k],obj[k]];
            }
        }
    };

    const getMousePos = (e) => {
        let posx = 0;
        let posy = 0;
        if (!e) e = window.event;
        if (e.pageX || e.pageY) 	{
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY) 	{
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return { x : posx, y : posy }
    };
    
    class Item {
        constructor(el, options) {
            this.DOM = {el: el};
            this.options = {   
                image: {
                    translation : {x: -10, y: -10, z: 0},
                    rotation : {x: 0, y: 0, z: 0},
                    reverseAnimation : {
                        duration : 1200,
                        easing : 'easeOutElastic',
                        elasticity : 600
                    }
                },
                title: {
                    translation : {x: 20, y: 10, z: 0},
                    reverseAnimation : {
                        duration : 1000,
                        easing : 'easeOutExpo',
                        elasticity : 600
                    }
                },
                container: {
                    translation : {x: 30, y: 20, z: 0},
                    rotation : {x: 0, y: 0, z: -2},
                    reverseAnimation : {
                        duration: 2,
                        easing: 'easeOutElastic'
                    }
                }, 
            };

            Object.assign(this.options, options);
            
            this.DOM.animatable = {};
            this.DOM.animatable.image = this.DOM.el.querySelector('.project-item-img');
            this.DOM.animatable.title = this.DOM.el.querySelector('.project-item-title');
            this.DOM.animatable.container = this.DOM.el.querySelector('.project-item-bg');
            
            this.initEvents();
        }
        
        initEvents() { 
            let enter = false;
            this.mouseenterFn = () => {
                if ( enter ) {enter = false;};
                clearTimeout(this.mousetime);
                this.mousetime = setTimeout(() => enter = true, 40);
            };
            this.mousemoveFn = ev => requestAnimationFrame(() => {
                if ( !enter ) return;
                this.tilt(ev);
            });
            this.mouseleaveFn = (ev) => requestAnimationFrame(() => {
                if ( !enter || !allowTilt ) return;
                enter = false;
                clearTimeout(this.mousetime);

                for (let key in this.DOM.animatable ) {
                    if( this.DOM.animatable[key] == undefined || this.options[key] == undefined ) {continue;}
                    anime({
                        targets: this.DOM.animatable[key],
                        duration: this.options[key].reverseAnimation != undefined ? this.options[key].reverseAnimation.duration || 0 : 1.5,
                        easing: this.options.reverseAnimation != undefined ? this.options.movement[key].reverseAnimation.easing || 'easeOutBack' : 'easeOutBack',
                        elasticity: this.options.reverseAnimation != undefined ? this.options.reverseAnimation.elasticity || null : null,
                        scaleX: 1,
                        scaleY: 1,
                        scaleZ: 1,
                        translateX: 0,
                        translateY: 0,
                        translateZ: 0,
                        rotateX: 0,
                        rotateY: 0,
                        rotateZ: 0
                    });                    
                }
            });
            this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
            this.DOM.el.addEventListener('mousemove', this.mousemoveFn);
            this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
        }
        
        tilt(ev) {
            if ( !allowTilt ) return;
            const mousepos = getMousePos(ev);
            // Document scrolls.
            const docScrolls = {
                left : document.body.scrollLeft + document.documentElement.scrollLeft, 
                top : document.body.scrollTop + document.documentElement.scrollTop
            };
            const bounds = this.DOM.el.getBoundingClientRect();
            // Mouse position relative to the main element (this.DOM.el).
            const relmousepos = { 
                x : mousepos.x - bounds.left - docScrolls.left, 
                y : mousepos.y - bounds.top - docScrolls.top 
            };
            
            // Movement settings for the animatable elements.
            for (let key in this.DOM.animatable) {
                if ( this.DOM.animatable[key] == undefined || this.options[key] == undefined ) {
                    continue;
                }
                
                let t = this.options[key] != undefined ? this.options[key].translation || {x:0,y:0,z:0} : {x:0,y:0,z:0},
                    r = this.options[key] != undefined ? this.options[key].rotation || {x:0,y:0,z:0} : {x:0,y:0,z:0};

                setRange(t);
                setRange(r);
                
                const transforms = {
                    translation : {
                        x: (t.x[1]-t.x[0])/bounds.width*relmousepos.x + t.x[0],
                        y: (t.y[1]-t.y[0])/bounds.height*relmousepos.y + t.y[0],
                        z: (t.z[1]-t.z[0])/bounds.height*relmousepos.y + t.z[0],
                    },
                    rotation : {
                        x: (r.x[1]-r.x[0])/bounds.height*relmousepos.y + r.x[0],
                        y: (r.y[1]-r.y[0])/bounds.width*relmousepos.x + r.y[0],
                        z: (r.z[1]-r.z[0])/bounds.width*relmousepos.x + r.z[0]
                    }
                };

                this.DOM.animatable[key].style.WebkitTransform = this.DOM.animatable[key].style.transform = 'translateX(' + transforms.translation.x + 'px) translateY(' + transforms.translation.y + 'px) translateZ(' + transforms.translation.z + 'px) rotateX(' + transforms.rotation.x + 'deg) rotateY(' + transforms.rotation.y + 'deg) rotateZ(' + transforms.rotation.z + 'deg)';
            }
        }
    }
    
    class Grid {
        constructor(el) {
            this.DOM = {el: el};
            this.items = [];
            Array.from(this.DOM.el.querySelectorAll('a.project-item')).forEach((item) => {
                const itemObj = new Item(item);
                this.items.push(itemObj);
            });
        }
    }
    let allowTilt = true;
    new Grid(document.querySelector('.project-list'));
}

function colourHeaderByBG() {
    const projectHeader = document.querySelector('.project-header');
    const backButton = document.querySelector('.back-button');
    if (projectHeader != null) {
        let headBg = window.getComputedStyle(projectHeader).backgroundColor;
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
            backButton.classList.add('light');
            burger.classList.add('light');
            projectHeader.style.color = "white";
            window.addEventListener('scroll', () => {
                if (window.scrollY > projectHeader.offsetHeight - 50) {
                    backButton.classList.remove('light');
                    burger.classList.remove('light');
                } else if (window.scrollY < projectHeader.offsetHeight){
                    backButton.classList.add('light');
                    burger.classList.add('light');
                }
            })    
            } else if (l > 128){
                projectHeader.style.color = "black";
                backButton.classList.remove('light');
                burger.classList.remove('light');
            }
    } else {
        burger.classList.remove('light');
    }
}

//---------------------------------------------------------------

init_pointer({})
const swup = new Swup({plugins: [new SwupJsPlugin(pageTransitions), new SwupPreloadPlugin()]});
const fluidOverlay = new ShapeOverlays(overlay);

swup.on('contentReplaced', onPageLoad);
swup.on('transitionStart', () => {burger.style.zIndex = "1";});
swup.on('transitionEnd', () => {burger.style.zIndex = "4";});

lax.addPreset("addDepth", function() {
    return { "data-lax-scale": "(vh) 1.07, -elh 0.95" }
});

function onPageLoad() {
    if(window.innerWidth >= 800){ if (document.querySelector('.project-list')) {projectHoverFX();}}

    if(window.innerWidth <= 800){
        if (document.querySelector('.glide')) {
            new Glide('.glide', {
                type: 'carousel',
                startAt: 0,
                perView: 1.3,
                focusAt: 'center',
                autoplay: 8000,
                animationTimingFunc: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                animationDuration: 600
            }).mount();
        }
    }
    
    burger.addEventListener('click', () => {
        if (fluidOverlay.isAnimating) {return false;}
        fluidOverlay.toggle();
        if (fluidOverlay.isOpened === true) {
            setTimeout( () => {burger.classList.remove('light')}, 900);
            burger.classList.add('is-active');
            for (var i = 0; i < navLinks.length; i++) {
                navLinks[i].classList.add('is-opened');
            }
        } else {
            setTimeout( () => {colourHeaderByBG()}, 600);
            burger.classList.remove('is-active');
            for (var i = 0; i < navLinks.length; i++) {
                navLinks[i].classList.remove('is-opened');
            }
        }
    })

    lax.setup({
        breakpoints: { small: 0, large: 800 }
    })
    const updateLax = () => {
        lax.update(window.scrollY);
        window.requestAnimationFrame(updateLax);
    }
    window.requestAnimationFrame(updateLax);

    colourHeaderByBG();
}

onPageLoad();
  




