/*! For license information please see chunk.380.80eff0a2421d6b968f1b.js.LICENSE.txt */
(globalThis.webpackChunk_ember_auto_import_=globalThis.webpackChunk_ember_auto_import_||[]).push([[380],{866:(e,t)=>{"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t.DDBaseImplement=void 0,t.DDBaseImplement=class{constructor(){this._eventRegister={}}get disabled(){return this._disabled}on(e,t){this._eventRegister[e]=t}off(e){delete this._eventRegister[e]}enable(){this._disabled=!1}disable(){this._disabled=!0}destroy(){delete this._eventRegister}triggerEvent(e,t){if(!this.disabled&&this._eventRegister&&this._eventRegister[e])return this._eventRegister[e](t)}}},743:(e,t,i)=>{"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t.DDDraggable=void 0
const s=i(340),n=i(263),o=i(866),r=i(187)
class l extends o.DDBaseImplement{constructor(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}
super(),this.el=e,this.option=t
let i=t.handle.substring(1)
this.dragEl=e.classList.contains(i)?e:e.querySelector(t.handle)||e,this._mouseDown=this._mouseDown.bind(this),this._mouseMove=this._mouseMove.bind(this),this._mouseUp=this._mouseUp.bind(this),this.enable()}on(e,t){super.on(e,t)}off(e){super.off(e)}enable(){!1!==this.disabled&&(super.enable(),this.dragEl.addEventListener("mousedown",this._mouseDown),r.isTouch&&(this.dragEl.addEventListener("touchstart",r.touchstart),this.dragEl.addEventListener("pointerdown",r.pointerdown)),this.el.classList.remove("ui-draggable-disabled"),this.el.classList.add("ui-draggable"))}disable(){let e=arguments.length>0&&void 0!==arguments[0]&&arguments[0]
!0!==this.disabled&&(super.disable(),this.dragEl.removeEventListener("mousedown",this._mouseDown),r.isTouch&&(this.dragEl.removeEventListener("touchstart",r.touchstart),this.dragEl.removeEventListener("pointerdown",r.pointerdown)),this.el.classList.remove("ui-draggable"),e||this.el.classList.add("ui-draggable-disabled"))}destroy(){this.dragTimeout&&window.clearTimeout(this.dragTimeout),delete this.dragTimeout,this.dragging&&this._mouseUp(this.mouseDownEvent),this.disable(!0),delete this.el,delete this.helper,delete this.option,super.destroy()}updateOption(e){return Object.keys(e).forEach((t=>this.option[t]=e[t])),this}_mouseDown(e){if(s.DDManager.mouseHandled)return
if(0!==e.button)return!0
const t=e.target.nodeName.toLowerCase()
return["input","textarea","button","select","option"].find((e=>e===t))||e.target.closest('[contenteditable="true"]')||(this.mouseDownEvent=e,delete this.dragging,delete s.DDManager.dragElement,delete s.DDManager.dropElement,document.addEventListener("mousemove",this._mouseMove,!0),document.addEventListener("mouseup",this._mouseUp,!0),r.isTouch&&(this.dragEl.addEventListener("touchmove",r.touchmove),this.dragEl.addEventListener("touchend",r.touchend)),e.preventDefault(),document.activeElement&&document.activeElement.blur(),s.DDManager.mouseHandled=!0),!0}_callDrag(e){if(!this.dragging)return
const t=n.Utils.initEvent(e,{target:this.el,type:"drag"})
this.option.drag&&this.option.drag(t,this.ui()),this.triggerEvent("drag",t)}_mouseMove(e){var t
let i=this.mouseDownEvent
if(this.dragging)if(this._dragFollow(e),s.DDManager.pauseDrag){const t=Number.isInteger(s.DDManager.pauseDrag)?s.DDManager.pauseDrag:100
this.dragTimeout&&window.clearTimeout(this.dragTimeout),this.dragTimeout=window.setTimeout((()=>this._callDrag(e)),t)}else this._callDrag(e)
else if(Math.abs(e.x-i.x)+Math.abs(e.y-i.y)>3){this.dragging=!0,s.DDManager.dragElement=this
let i=null===(t=this.el.gridstackNode)||void 0===t?void 0:t.grid
i?s.DDManager.dropElement=i.el.ddElement.ddDroppable:delete s.DDManager.dropElement,this.helper=this._createHelper(e),this._setupHelperContainmentStyle(),this.dragOffset=this._getDragOffset(e,this.el,this.helperContainment)
const o=n.Utils.initEvent(e,{target:this.el,type:"dragstart"})
this._setupHelperStyle(e),this.option.start&&this.option.start(o,this.ui()),this.triggerEvent("dragstart",o)}return e.preventDefault(),!0}_mouseUp(e){var t
if(document.removeEventListener("mousemove",this._mouseMove,!0),document.removeEventListener("mouseup",this._mouseUp,!0),r.isTouch&&(this.dragEl.removeEventListener("touchmove",r.touchmove,!0),this.dragEl.removeEventListener("touchend",r.touchend,!0)),this.dragging){delete this.dragging,(null===(t=s.DDManager.dropElement)||void 0===t?void 0:t.el)===this.el.parentElement&&delete s.DDManager.dropElement,this.helperContainment.style.position=this.parentOriginStylePosition||null,this.helper===this.el?this._removeHelperStyle():this.helper.remove()
const i=n.Utils.initEvent(e,{target:this.el,type:"dragstop"})
this.option.stop&&this.option.stop(i),this.triggerEvent("dragstop",i),s.DDManager.dropElement&&s.DDManager.dropElement.drop(e)}delete this.helper,delete this.mouseDownEvent,delete s.DDManager.dragElement,delete s.DDManager.dropElement,delete s.DDManager.mouseHandled,e.preventDefault()}_createHelper(e){let t=this.el
return"function"==typeof this.option.helper?t=this.option.helper(e):"clone"===this.option.helper&&(t=n.Utils.cloneNode(this.el)),document.body.contains(t)||n.Utils.appendTo(t,"parent"===this.option.appendTo?this.el.parentNode:this.option.appendTo),t===this.el&&(this.dragElementOriginStyle=l.originStyleProp.map((e=>this.el.style[e]))),t}_setupHelperStyle(e){this.helper.classList.add("ui-draggable-dragging")
const t=this.helper.style
return t.pointerEvents="none",t["min-width"]=0,t.width=this.dragOffset.width+"px",t.height=this.dragOffset.height+"px",t.willChange="left, top",t.position="fixed",this._dragFollow(e),t.transition="none",setTimeout((()=>{this.helper&&(t.transition=null)}),0),this}_removeHelperStyle(){var e
this.helper.classList.remove("ui-draggable-dragging")
let t=null===(e=this.helper)||void 0===e?void 0:e.gridstackNode
if(!(null==t?void 0:t._isAboutToRemove)&&this.dragElementOriginStyle){let e=this.helper,t=this.dragElementOriginStyle.transition||null
e.style.transition=this.dragElementOriginStyle.transition="none",l.originStyleProp.forEach((t=>e.style[t]=this.dragElementOriginStyle[t]||null)),setTimeout((()=>e.style.transition=t),50)}return delete this.dragElementOriginStyle,this}_dragFollow(e){const t=this.helper.style,i=this.dragOffset
t.left=e.clientX+i.offsetLeft-0+"px",t.top=e.clientY+i.offsetTop-0+"px"}_setupHelperContainmentStyle(){return this.helperContainment=this.helper.parentElement,"fixed"!==this.helper.style.position&&(this.parentOriginStylePosition=this.helperContainment.style.position,window.getComputedStyle(this.helperContainment).position.match(/static/)&&(this.helperContainment.style.position="relative")),this}_getDragOffset(e,t,i){let s=0,o=0
if(i){const e=document.createElement("div")
n.Utils.addElStyles(e,{opacity:"0",position:"fixed",top:"0px",left:"0px",width:"1px",height:"1px",zIndex:"-999999"}),i.appendChild(e)
const t=e.getBoundingClientRect()
i.removeChild(e),s=t.left,o=t.top}const r=t.getBoundingClientRect()
return{left:r.left,top:r.top,offsetLeft:-e.clientX+r.left-s,offsetTop:-e.clientY+r.top-o,width:r.width,height:r.height}}ui(){const e=this.el.parentElement.getBoundingClientRect(),t=this.helper.getBoundingClientRect()
return{position:{top:t.top-e.top,left:t.left-e.left}}}}t.DDDraggable=l,l.originStyleProp=["transition","pointerEvents","position","left","top","minWidth","willChange"]},499:(e,t,i)=>{"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t.DDDroppable=void 0
const s=i(340),n=i(866),o=i(263),r=i(187)
class l extends n.DDBaseImplement{constructor(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}
super(),this.el=e,this.option=t,this._mouseEnter=this._mouseEnter.bind(this),this._mouseLeave=this._mouseLeave.bind(this),this.enable(),this._setupAccept()}on(e,t){super.on(e,t)}off(e){super.off(e)}enable(){!1!==this.disabled&&(super.enable(),this.el.classList.add("ui-droppable"),this.el.classList.remove("ui-droppable-disabled"),this.el.addEventListener("mouseenter",this._mouseEnter),this.el.addEventListener("mouseleave",this._mouseLeave),r.isTouch&&(this.el.addEventListener("pointerenter",r.pointerenter),this.el.addEventListener("pointerleave",r.pointerleave)))}disable(){let e=arguments.length>0&&void 0!==arguments[0]&&arguments[0]
!0!==this.disabled&&(super.disable(),this.el.classList.remove("ui-droppable"),e||this.el.classList.add("ui-droppable-disabled"),this.el.removeEventListener("mouseenter",this._mouseEnter),this.el.removeEventListener("mouseleave",this._mouseLeave),r.isTouch&&(this.el.removeEventListener("pointerenter",r.pointerenter),this.el.removeEventListener("pointerleave",r.pointerleave)))}destroy(){this.disable(!0),this.el.classList.remove("ui-droppable"),this.el.classList.remove("ui-droppable-disabled"),super.destroy()}updateOption(e){return Object.keys(e).forEach((t=>this.option[t]=e[t])),this._setupAccept(),this}_mouseEnter(e){if(!s.DDManager.dragElement)return
if(!this._canDrop(s.DDManager.dragElement.el))return
e.preventDefault(),e.stopPropagation(),s.DDManager.dropElement&&s.DDManager.dropElement!==this&&s.DDManager.dropElement._mouseLeave(e),s.DDManager.dropElement=this
const t=o.Utils.initEvent(e,{target:this.el,type:"dropover"})
this.option.over&&this.option.over(t,this._ui(s.DDManager.dragElement)),this.triggerEvent("dropover",t),this.el.classList.add("ui-droppable-over")}_mouseLeave(e){var t
if(!s.DDManager.dragElement||s.DDManager.dropElement!==this)return
e.preventDefault(),e.stopPropagation()
const i=o.Utils.initEvent(e,{target:this.el,type:"dropout"})
if(this.option.out&&this.option.out(i,this._ui(s.DDManager.dragElement)),this.triggerEvent("dropout",i),s.DDManager.dropElement===this){let i
delete s.DDManager.dropElement
let n=this.el.parentElement
for(;!i&&n;)i=null===(t=n.ddElement)||void 0===t?void 0:t.ddDroppable,n=n.parentElement
i&&i._mouseEnter(e)}}drop(e){e.preventDefault()
const t=o.Utils.initEvent(e,{target:this.el,type:"drop"})
this.option.drop&&this.option.drop(t,this._ui(s.DDManager.dragElement)),this.triggerEvent("drop",t)}_canDrop(e){return e&&(!this.accept||this.accept(e))}_setupAccept(){return this.option.accept?("string"==typeof this.option.accept?this.accept=e=>e.matches(this.option.accept):this.accept=this.option.accept,this):this}_ui(e){return Object.assign({draggable:e.el},e.ui())}}t.DDDroppable=l},784:(e,t,i)=>{"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t.DDElement=void 0
const s=i(682),n=i(743),o=i(499)
class r{constructor(e){this.el=e}static init(e){return e.ddElement||(e.ddElement=new r(e)),e.ddElement}on(e,t){return this.ddDraggable&&["drag","dragstart","dragstop"].indexOf(e)>-1?this.ddDraggable.on(e,t):this.ddDroppable&&["drop","dropover","dropout"].indexOf(e)>-1?this.ddDroppable.on(e,t):this.ddResizable&&["resizestart","resize","resizestop"].indexOf(e)>-1&&this.ddResizable.on(e,t),this}off(e){return this.ddDraggable&&["drag","dragstart","dragstop"].indexOf(e)>-1?this.ddDraggable.off(e):this.ddDroppable&&["drop","dropover","dropout"].indexOf(e)>-1?this.ddDroppable.off(e):this.ddResizable&&["resizestart","resize","resizestop"].indexOf(e)>-1&&this.ddResizable.off(e),this}setupDraggable(e){return this.ddDraggable?this.ddDraggable.updateOption(e):this.ddDraggable=new n.DDDraggable(this.el,e),this}cleanDraggable(){return this.ddDraggable&&(this.ddDraggable.destroy(),delete this.ddDraggable),this}setupResizable(e){return this.ddResizable?this.ddResizable.updateOption(e):this.ddResizable=new s.DDResizable(this.el,e),this}cleanResizable(){return this.ddResizable&&(this.ddResizable.destroy(),delete this.ddResizable),this}setupDroppable(e){return this.ddDroppable?this.ddDroppable.updateOption(e):this.ddDroppable=new o.DDDroppable(this.el,e),this}cleanDroppable(){return this.ddDroppable&&(this.ddDroppable.destroy(),delete this.ddDroppable),this}}t.DDElement=r},266:(e,t,i)=>{"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t.DDGridStack=void 0
const s=i(263),n=i(340),o=i(784)
t.DDGridStack=class{resizable(e,t,i,s){return this._getDDElements(e).forEach((e=>{if("disable"===t||"enable"===t)e.ddResizable&&e.ddResizable[t]()
else if("destroy"===t)e.ddResizable&&e.cleanResizable()
else if("option"===t)e.setupResizable({[i]:s})
else{const i=e.el.gridstackNode.grid
let s=e.el.getAttribute("gs-resize-handles")?e.el.getAttribute("gs-resize-handles"):i.opts.resizable.handles,n=!i.opts.alwaysShowResizeHandle
e.setupResizable(Object.assign(Object.assign(Object.assign({},i.opts.resizable),{handles:s,autoHide:n}),{start:t.start,stop:t.stop,resize:t.resize}))}})),this}draggable(e,t,i,s){return this._getDDElements(e).forEach((e=>{if("disable"===t||"enable"===t)e.ddDraggable&&e.ddDraggable[t]()
else if("destroy"===t)e.ddDraggable&&e.cleanDraggable()
else if("option"===t)e.setupDraggable({[i]:s})
else{const i=e.el.gridstackNode.grid
e.setupDraggable(Object.assign(Object.assign({},i.opts.draggable),{start:t.start,stop:t.stop,drag:t.drag}))}})),this}dragIn(e,t){return this._getDDElements(e).forEach((e=>e.setupDraggable(t))),this}droppable(e,t,i,s){return"function"!=typeof t.accept||t._accept||(t._accept=t.accept,t.accept=e=>t._accept(e)),this._getDDElements(e).forEach((e=>{"disable"===t||"enable"===t?e.ddDroppable&&e.ddDroppable[t]():"destroy"===t?e.ddDroppable&&e.cleanDroppable():"option"===t?e.setupDroppable({[i]:s}):e.setupDroppable(t)})),this}isDroppable(e){return!(!(e&&e.ddElement&&e.ddElement.ddDroppable)||e.ddElement.ddDroppable.disabled)}isDraggable(e){return!(!(e&&e.ddElement&&e.ddElement.ddDraggable)||e.ddElement.ddDraggable.disabled)}isResizable(e){return!(!(e&&e.ddElement&&e.ddElement.ddResizable)||e.ddElement.ddResizable.disabled)}on(e,t,i){return this._getDDElements(e).forEach((e=>e.on(t,(e=>{i(e,n.DDManager.dragElement?n.DDManager.dragElement.el:e.target,n.DDManager.dragElement?n.DDManager.dragElement.helper:null)})))),this}off(e,t){return this._getDDElements(e).forEach((e=>e.off(t))),this}_getDDElements(e){let t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=s.Utils.getElements(e)
if(!i.length)return[]
let n=i.map((e=>e.ddElement||(t?o.DDElement.init(e):null)))
return t||n.filter((e=>e)),n}}},340:(e,t)=>{"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t.DDManager=void 0,t.DDManager=class{}},665:(e,t,i)=>{"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t.DDResizableHandle=void 0
const s=i(187)
class n{constructor(e,t,i){this.moving=!1,this.host=e,this.dir=t,this.option=i,this._mouseDown=this._mouseDown.bind(this),this._mouseMove=this._mouseMove.bind(this),this._mouseUp=this._mouseUp.bind(this),this._init()}_init(){const e=document.createElement("div")
return e.classList.add("ui-resizable-handle"),e.classList.add(`${n.prefix}${this.dir}`),e.style.zIndex="100",e.style.userSelect="none",this.el=e,this.host.appendChild(this.el),this.el.addEventListener("mousedown",this._mouseDown),s.isTouch&&(this.el.addEventListener("touchstart",s.touchstart),this.el.addEventListener("pointerdown",s.pointerdown)),this}destroy(){return this.moving&&this._mouseUp(this.mouseDownEvent),this.el.removeEventListener("mousedown",this._mouseDown),s.isTouch&&(this.el.removeEventListener("touchstart",s.touchstart),this.el.removeEventListener("pointerdown",s.pointerdown)),this.host.removeChild(this.el),delete this.el,delete this.host,this}_mouseDown(e){this.mouseDownEvent=e,document.addEventListener("mousemove",this._mouseMove,!0),document.addEventListener("mouseup",this._mouseUp,!0),s.isTouch&&(this.el.addEventListener("touchmove",s.touchmove),this.el.addEventListener("touchend",s.touchend)),e.stopPropagation(),e.preventDefault()}_mouseMove(e){let t=this.mouseDownEvent
this.moving?this._triggerEvent("move",e):Math.abs(e.x-t.x)+Math.abs(e.y-t.y)>2&&(this.moving=!0,this._triggerEvent("start",this.mouseDownEvent),this._triggerEvent("move",e)),e.stopPropagation(),e.preventDefault()}_mouseUp(e){this.moving&&this._triggerEvent("stop",e),document.removeEventListener("mousemove",this._mouseMove,!0),document.removeEventListener("mouseup",this._mouseUp,!0),s.isTouch&&(this.el.removeEventListener("touchmove",s.touchmove),this.el.removeEventListener("touchend",s.touchend)),delete this.moving,delete this.mouseDownEvent,e.stopPropagation(),e.preventDefault()}_triggerEvent(e,t){return this.option[e]&&this.option[e](t),this}}t.DDResizableHandle=n,n.prefix="ui-resizable-"},682:(e,t,i)=>{"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t.DDResizable=void 0
const s=i(665),n=i(866),o=i(263),r=i(340)
class l extends n.DDBaseImplement{constructor(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}
super(),this._ui=()=>{const e=this.el.parentElement.getBoundingClientRect(),t={width:this.originalRect.width,height:this.originalRect.height+this.scrolled,left:this.originalRect.left,top:this.originalRect.top-this.scrolled},i=this.temporalRect||t
return{position:{left:i.left-e.left,top:i.top-e.top},size:{width:i.width,height:i.height}}},this.el=e,this.option=t,this._mouseOver=this._mouseOver.bind(this),this._mouseOut=this._mouseOut.bind(this),this.enable(),this._setupAutoHide(this.option.autoHide),this._setupHandlers()}on(e,t){super.on(e,t)}off(e){super.off(e)}enable(){super.enable(),this.el.classList.add("ui-resizable"),this.el.classList.remove("ui-resizable-disabled"),this._setupAutoHide(this.option.autoHide)}disable(){super.disable(),this.el.classList.add("ui-resizable-disabled"),this.el.classList.remove("ui-resizable"),this._setupAutoHide(!1)}destroy(){this._removeHandlers(),this._setupAutoHide(!1),this.el.classList.remove("ui-resizable"),delete this.el,super.destroy()}updateOption(e){let t=e.handles&&e.handles!==this.option.handles,i=e.autoHide&&e.autoHide!==this.option.autoHide
return Object.keys(e).forEach((t=>this.option[t]=e[t])),t&&(this._removeHandlers(),this._setupHandlers()),i&&this._setupAutoHide(this.option.autoHide),this}_setupAutoHide(e){return e?(this.el.classList.add("ui-resizable-autohide"),this.el.addEventListener("mouseover",this._mouseOver),this.el.addEventListener("mouseout",this._mouseOut)):(this.el.classList.remove("ui-resizable-autohide"),this.el.removeEventListener("mouseover",this._mouseOver),this.el.removeEventListener("mouseout",this._mouseOut),r.DDManager.overResizeElement===this&&delete r.DDManager.overResizeElement),this}_mouseOver(e){r.DDManager.overResizeElement||r.DDManager.dragElement||(r.DDManager.overResizeElement=this,this.el.classList.remove("ui-resizable-autohide"))}_mouseOut(e){r.DDManager.overResizeElement===this&&(delete r.DDManager.overResizeElement,this.el.classList.add("ui-resizable-autohide"))}_setupHandlers(){let e=this.option.handles||"e,s,se"
return"all"===e&&(e="n,e,s,w,se,sw,ne,nw"),this.handlers=e.split(",").map((e=>e.trim())).map((e=>new s.DDResizableHandle(this.el,e,{start:e=>{this._resizeStart(e)},stop:e=>{this._resizeStop(e)},move:t=>{this._resizing(t,e)}}))),this}_resizeStart(e){this.originalRect=this.el.getBoundingClientRect(),this.scrollEl=o.Utils.getScrollElement(this.el),this.scrollY=this.scrollEl.scrollTop,this.scrolled=0,this.startEvent=e,this._setupHelper(),this._applyChange()
const t=o.Utils.initEvent(e,{type:"resizestart",target:this.el})
return this.option.start&&this.option.start(t,this._ui()),this.el.classList.add("ui-resizable-resizing"),this.triggerEvent("resizestart",t),this}_resizing(e,t){this.scrolled=this.scrollEl.scrollTop-this.scrollY,this.temporalRect=this._getChange(e,t),this._applyChange()
const i=o.Utils.initEvent(e,{type:"resize",target:this.el})
return this.option.resize&&this.option.resize(i,this._ui()),this.triggerEvent("resize",i),this}_resizeStop(e){const t=o.Utils.initEvent(e,{type:"resizestop",target:this.el})
return this.option.stop&&this.option.stop(t),this.el.classList.remove("ui-resizable-resizing"),this.triggerEvent("resizestop",t),this._cleanHelper(),delete this.startEvent,delete this.originalRect,delete this.temporalRect,delete this.scrollY,delete this.scrolled,this}_setupHelper(){return this.elOriginStyleVal=l._originStyleProp.map((e=>this.el.style[e])),this.parentOriginStylePosition=this.el.parentElement.style.position,window.getComputedStyle(this.el.parentElement).position.match(/static/)&&(this.el.parentElement.style.position="relative"),this.el.style.position="absolute",this.el.style.opacity="0.8",this}_cleanHelper(){return l._originStyleProp.forEach(((e,t)=>{this.el.style[e]=this.elOriginStyleVal[t]||null})),this.el.parentElement.style.position=this.parentOriginStylePosition||null,this}_getChange(e,t){const i=this.startEvent,s={width:this.originalRect.width,height:this.originalRect.height+this.scrolled,left:this.originalRect.left,top:this.originalRect.top-this.scrolled},n=e.clientX-i.clientX,o=e.clientY-i.clientY
t.indexOf("e")>-1?s.width+=n:t.indexOf("w")>-1&&(s.width-=n,s.left+=n),t.indexOf("s")>-1?s.height+=o:t.indexOf("n")>-1&&(s.height-=o,s.top+=o)
const r=this._constrainSize(s.width,s.height)
return Math.round(s.width)!==Math.round(r.width)&&(t.indexOf("w")>-1&&(s.left+=s.width-r.width),s.width=r.width),Math.round(s.height)!==Math.round(r.height)&&(t.indexOf("n")>-1&&(s.top+=s.height-r.height),s.height=r.height),s}_constrainSize(e,t){const i=this.option.maxWidth||Number.MAX_SAFE_INTEGER,s=this.option.minWidth||e,n=this.option.maxHeight||Number.MAX_SAFE_INTEGER,o=this.option.minHeight||t
return{width:Math.min(i,Math.max(s,e)),height:Math.min(n,Math.max(o,t))}}_applyChange(){let e={left:0,top:0,width:0,height:0}
if("absolute"===this.el.style.position){const t=this.el.parentElement,{left:i,top:s}=t.getBoundingClientRect()
e={left:i,top:s,width:0,height:0}}return this.temporalRect?(Object.keys(this.temporalRect).forEach((t=>{const i=this.temporalRect[t]
this.el.style[t]=i-e[t]+"px"})),this):this}_removeHandlers(){return this.handlers.forEach((e=>e.destroy())),delete this.handlers,this}}t.DDResizable=l,l._originStyleProp=["width","height","position","left","top","opacity","zIndex"]},187:(e,t,i)=>{"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t.pointerleave=t.pointerenter=t.pointerdown=t.touchend=t.touchmove=t.touchstart=t.isTouch=void 0
const s=i(340)
t.isTouch="undefined"!=typeof window&&"undefined"!=typeof document&&("ontouchstart"in document||"ontouchstart"in window||window.DocumentTouch&&document instanceof window.DocumentTouch||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0)
class n{}function o(e,t){if(e.touches.length>1)return
e.cancelable&&e.preventDefault()
const i=e.changedTouches[0],s=document.createEvent("MouseEvents")
s.initMouseEvent(t,!0,!0,window,1,i.screenX,i.screenY,i.clientX,i.clientY,!1,!1,!1,!1,0,null),e.target.dispatchEvent(s)}function r(e,t){e.cancelable&&e.preventDefault()
const i=document.createEvent("MouseEvents")
i.initMouseEvent(t,!0,!0,window,1,e.screenX,e.screenY,e.clientX,e.clientY,!1,!1,!1,!1,0,null),e.target.dispatchEvent(i)}t.touchstart=function(e){n.touchHandled||(n.touchHandled=!0,o(e,"mousedown"))},t.touchmove=function(e){n.touchHandled&&o(e,"mousemove")},t.touchend=function(e){if(!n.touchHandled)return
n.pointerLeaveTimeout&&(window.clearTimeout(n.pointerLeaveTimeout),delete n.pointerLeaveTimeout)
const t=!!s.DDManager.dragElement
o(e,"mouseup"),t||o(e,"click"),n.touchHandled=!1},t.pointerdown=function(e){e.target.releasePointerCapture(e.pointerId)},t.pointerenter=function(e){s.DDManager.dragElement&&r(e,"mouseenter")},t.pointerleave=function(e){s.DDManager.dragElement&&(n.pointerLeaveTimeout=window.setTimeout((()=>{delete n.pointerLeaveTimeout,r(e,"mouseleave")}),10))}},469:(e,t,i)=>{"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t.GridStackEngine=void 0
const s=i(263)
class n{constructor(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}
this.addedNodes=[],this.removedNodes=[],this.column=e.column||12,this.maxRow=e.maxRow,this._float=e.float,this.nodes=e.nodes||[],this.onChange=e.onChange}batchUpdate(){let e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0]
return!!this.batchMode===e||(this.batchMode=e,e?(this._prevFloat=this._float,this._float=!0,this.saveInitial()):(this._float=this._prevFloat,delete this._prevFloat,this._packNodes()._notify())),this}_useEntireRowArea(e,t){return!this.float&&!this._hasLocked&&(!e._moving||e._skipDown||t.y<=e.y)}_fixCollisions(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e,i=arguments.length>2?arguments[2]:void 0,n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{}
if(this.sortNodes(-1),i=i||this.collide(e,t),!i)return!1
if(e._moving&&!n.nested&&!this.float&&this.swap(e,i))return!0
let o=t
this._useEntireRowArea(e,t)&&(o={x:0,w:this.column,y:t.y,h:t.h},i=this.collide(e,o,n.skip))
let r=!1,l={nested:!0,pack:!1}
for(;i=i||this.collide(e,o,n.skip);){let o
if(i.locked||e._moving&&!e._skipDown&&t.y>e.y&&!this.float&&(!this.collide(i,Object.assign(Object.assign({},i),{y:e.y}),e)||!this.collide(i,Object.assign(Object.assign({},i),{y:t.y-i.h}),e))?(e._skipDown=e._skipDown||t.y>e.y,o=this.moveNode(e,Object.assign(Object.assign(Object.assign({},t),{y:i.y+i.h}),l)),i.locked&&o?s.Utils.copyPos(t,e):!i.locked&&o&&n.pack&&(this._packNodes(),t.y=i.y+i.h,s.Utils.copyPos(e,t)),r=r||o):o=this.moveNode(i,Object.assign(Object.assign(Object.assign({},i),{y:t.y+t.h,skip:e}),l)),!o)return r
i=void 0}return r}collide(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e,i=arguments.length>2?arguments[2]:void 0
return this.nodes.find((n=>n!==e&&n!==i&&s.Utils.isIntercepted(n,t)))}collideAll(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e,i=arguments.length>2?arguments[2]:void 0
return this.nodes.filter((n=>n!==e&&n!==i&&s.Utils.isIntercepted(n,t)))}directionCollideCoverage(e,t,i){if(!t.rect||!e._rect)return
let s,n=e._rect,o=Object.assign({},t.rect)
return o.y>n.y?(o.h+=o.y-n.y,o.y=n.y):o.h+=n.y-o.y,o.x>n.x?(o.w+=o.x-n.x,o.x=n.x):o.w+=n.x-o.x,i.forEach((e=>{if(e.locked||!e._rect)return
let t=e._rect,i=Number.MAX_VALUE,r=Number.MAX_VALUE,l=.5
n.y<t.y?i=(o.y+o.h-t.y)/t.h:n.y+n.h>t.y+t.h&&(i=(t.y+t.h-o.y)/t.h),n.x<t.x?r=(o.x+o.w-t.x)/t.w:n.x+n.w>t.x+t.w&&(r=(t.x+t.w-o.x)/t.w)
let a=Math.min(r,i)
a>l&&(l=a,s=e)})),t.collide=s,s}cacheRects(e,t,i,s,n,o){return this.nodes.forEach((r=>r._rect={y:r.y*t+i,x:r.x*e+o,w:r.w*e-o-s,h:r.h*t-i-n})),this}swap(e,t){if(!t||t.locked||!e||e.locked)return!1
function i(){let i=t.x,s=t.y
return t.x=e.x,t.y=e.y,e.h!=t.h?(e.x=i,e.y=t.y+t.h):e.w!=t.w?(e.x=t.x+t.w,e.y=s):(e.x=i,e.y=s),e._dirty=t._dirty=!0,!0}let n
if(e.w===t.w&&e.h===t.h&&(e.x===t.x||e.y===t.y)&&(n=s.Utils.isTouching(e,t)))return i()
if(!1!==n){if(e.w===t.w&&e.x===t.x&&(n||(n=s.Utils.isTouching(e,t)))){if(t.y<e.y){let i=e
e=t,t=i}return i()}if(!1!==n){if(e.h===t.h&&e.y===t.y&&(n||(n=s.Utils.isTouching(e,t)))){if(t.x<e.x){let i=e
e=t,t=i}return i()}return!1}}}isAreaEmpty(e,t,i,s){let n={x:e||0,y:t||0,w:i||1,h:s||1}
return!this.collide(n)}compact(){if(0===this.nodes.length)return this
this.batchUpdate().sortNodes()
let e=this.nodes
return this.nodes=[],e.forEach((e=>{e.locked||(e.autoPosition=!0),this.addNode(e,!1),e._dirty=!0})),this.batchUpdate(!1)}set float(e){this._float!==e&&(this._float=e||!1,e||this._packNodes()._notify())}get float(){return this._float||!1}sortNodes(e){return this.nodes=s.Utils.sort(this.nodes,e,this.column),this}_packNodes(){return this.batchMode||(this.sortNodes(),this.float?this.nodes.forEach((e=>{if(e._updating||void 0===e._orig||e.y===e._orig.y)return
let t=e.y
for(;t>e._orig.y;)--t,this.collide(e,{x:e.x,y:t,w:e.w,h:e.h})||(e._dirty=!0,e.y=t)})):this.nodes.forEach(((e,t)=>{if(!e.locked)for(;e.y>0;){let i=0===t?0:e.y-1
if(0!==t&&this.collide(e,{x:e.x,y:i,w:e.w,h:e.h}))break
e._dirty=e.y!==i,e.y=i}}))),this}prepareNode(e,t){(e=e||{})._id=e._id||n._idSeq++,void 0!==e.x&&void 0!==e.y&&null!==e.x&&null!==e.y||(e.autoPosition=!0)
let i={x:0,y:0,w:1,h:1}
return s.Utils.defaults(e,i),e.autoPosition||delete e.autoPosition,e.noResize||delete e.noResize,e.noMove||delete e.noMove,"string"==typeof e.x&&(e.x=Number(e.x)),"string"==typeof e.y&&(e.y=Number(e.y)),"string"==typeof e.w&&(e.w=Number(e.w)),"string"==typeof e.h&&(e.h=Number(e.h)),isNaN(e.x)&&(e.x=i.x,e.autoPosition=!0),isNaN(e.y)&&(e.y=i.y,e.autoPosition=!0),isNaN(e.w)&&(e.w=i.w),isNaN(e.h)&&(e.h=i.h),this.nodeBoundFix(e,t)}nodeBoundFix(e,t){let i=e._orig||s.Utils.copyPos({},e)
if(e.maxW&&(e.w=Math.min(e.w,e.maxW)),e.maxH&&(e.h=Math.min(e.h,e.maxH)),e.minW&&e.minW<=this.column&&(e.w=Math.max(e.w,e.minW)),e.minH&&(e.h=Math.max(e.h,e.minH)),(1===this.column||e.x+e.w>this.column)&&this.column<12&&!this._inColumnResize&&!e.autoPosition&&e._id&&-1===this.findCacheLayout(e,12)){let t=Object.assign({},e)
t.x=Math.min(11,t.x),t.w=Math.min(12,t.w),this.cacheOneLayout(t,12)}return e.w>this.column?e.w=this.column:e.w<1&&(e.w=1),this.maxRow&&e.h>this.maxRow?e.h=this.maxRow:e.h<1&&(e.h=1),e.x<0&&(e.x=0),e.y<0&&(e.y=0),e.x+e.w>this.column&&(t?e.w=this.column-e.x:e.x=this.column-e.w),this.maxRow&&e.y+e.h>this.maxRow&&(t?e.h=this.maxRow-e.y:e.y=this.maxRow-e.h),s.Utils.samePos(e,i)||(e._dirty=!0),e}getDirtyNodes(e){return e?this.nodes.filter((e=>e._dirty&&!s.Utils.samePos(e,e._orig))):this.nodes.filter((e=>e._dirty))}_notify(e){if(this.batchMode||!this.onChange)return this
let t=(e||[]).concat(this.getDirtyNodes())
return this.onChange(t),this}cleanNodes(){return this.batchMode||this.nodes.forEach((e=>{delete e._dirty,delete e._lastTried})),this}saveInitial(){return this.nodes.forEach((e=>{e._orig=s.Utils.copyPos({},e),delete e._dirty})),this._hasLocked=this.nodes.some((e=>e.locked)),this}restoreInitial(){return this.nodes.forEach((e=>{s.Utils.samePos(e,e._orig)||(s.Utils.copyPos(e,e._orig),e._dirty=!0)})),this._notify(),this}findEmptyPosition(e){this.sortNodes()
let t=!1
for(let i=0;!t;++i){let n=i%this.column,o=Math.floor(i/this.column)
if(n+e.w>this.column)continue
let r={x:n,y:o,w:e.w,h:e.h}
this.nodes.find((e=>s.Utils.isIntercepted(r,e)))||(e.x=n,e.y=o,t=!0)}return t}addNode(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1]
return this.nodes.find((t=>t._id===e._id))||(delete(e=this._inColumnResize?this.nodeBoundFix(e):this.prepareNode(e))._temporaryRemoved,delete e._removeDOM,e.autoPosition&&this.findEmptyPosition(e)&&delete e.autoPosition,this.nodes.push(e),t&&this.addedNodes.push(e),this._fixCollisions(e),this.batchMode||this._packNodes()._notify(),e)}removeNode(e){let t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=arguments.length>2&&void 0!==arguments[2]&&arguments[2]
return this.nodes.find((t=>t===e))?(i&&this.removedNodes.push(e),t&&(e._removeDOM=!0),this.nodes=this.nodes.filter((t=>t!==e)),this._packNodes()._notify([e])):this}removeAll(){let e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0]
return delete this._layouts,0===this.nodes.length?this:(e&&this.nodes.forEach((e=>e._removeDOM=!0)),this.removedNodes=this.nodes,this.nodes=[],this._notify(this.removedNodes))}moveNodeCheck(e,t){if(!this.changedPosConstrain(e,t))return!1
if(t.pack=!0,!this.maxRow)return this.moveNode(e,t)
let i,o=new n({column:this.column,float:this.float,nodes:this.nodes.map((t=>t===e?(i=Object.assign({},t),i):Object.assign({},t)))})
if(!i)return!1
let r=o.moveNode(i,t)&&o.getRow()<=this.maxRow
if(!r&&!t.resizing&&t.collide){let i=t.collide.el.gridstackNode
if(this.swap(e,i))return this._notify(),!0}return!!r&&(o.nodes.filter((e=>e._dirty)).forEach((e=>{let t=this.nodes.find((t=>t._id===e._id))
t&&(s.Utils.copyPos(t,e),t._dirty=!0)})),this._notify(),!0)}willItFit(e){if(delete e._willFitPos,!this.maxRow)return!0
let t=new n({column:this.column,float:this.float,nodes:this.nodes.map((e=>Object.assign({},e)))}),i=Object.assign({},e)
return this.cleanupNode(i),delete i.el,delete i._id,delete i.content,delete i.grid,t.addNode(i),t.getRow()<=this.maxRow&&(e._willFitPos=s.Utils.copyPos({},i),!0)}changedPosConstrain(e,t){return t.w=t.w||e.w,t.h=t.h||e.h,e.x!==t.x||e.y!==t.y||(e.maxW&&(t.w=Math.min(t.w,e.maxW)),e.maxH&&(t.h=Math.min(t.h,e.maxH)),e.minW&&(t.w=Math.max(t.w,e.minW)),e.minH&&(t.h=Math.max(t.h,e.minH)),e.w!==t.w||e.h!==t.h)}moveNode(e,t){var i,n
if(!e||!t)return!1
let o
void 0===t.pack&&(o=t.pack=!0),"number"!=typeof t.x&&(t.x=e.x),"number"!=typeof t.y&&(t.y=e.y),"number"!=typeof t.w&&(t.w=e.w),"number"!=typeof t.h&&(t.h=e.h)
let r=e.w!==t.w||e.h!==t.h,l=s.Utils.copyPos({},e,!0)
if(s.Utils.copyPos(l,t),l=this.nodeBoundFix(l,r),s.Utils.copyPos(t,l),s.Utils.samePos(e,t))return!1
let a=s.Utils.copyPos({},e),d=this.collideAll(e,l,t.skip),h=!0
if(d.length){let r=e._moving&&!t.nested,a=r?this.directionCollideCoverage(e,t,d):d[0]
if(r&&a&&(null===(n=null===(i=e.grid)||void 0===i?void 0:i.opts)||void 0===n?void 0:n.subGridDynamic)&&!e.grid._isTemp){let i=s.Utils.areaIntercept(t.rect,a._rect),n=s.Utils.area(t.rect),o=s.Utils.area(a._rect)
i/(n<o?n:o)>.8&&(a.grid.makeSubGrid(a.el,void 0,e),a=void 0)}a?h=!this._fixCollisions(e,l,a,t):(h=!1,o&&delete t.pack)}return h&&(e._dirty=!0,s.Utils.copyPos(e,l)),t.pack&&this._packNodes()._notify(),!s.Utils.samePos(e,a)}getRow(){return this.nodes.reduce(((e,t)=>Math.max(e,t.y+t.h)),0)}beginUpdate(e){return e._updating||(e._updating=!0,delete e._skipDown,this.batchMode||this.saveInitial()),this}endUpdate(){let e=this.nodes.find((e=>e._updating))
return e&&(delete e._updating,delete e._skipDown),this}save(){let e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0]
var t
let i=null===(t=this._layouts)||void 0===t?void 0:t.length,n=i&&this.column!==i-1?this._layouts[i-1]:null,o=[]
return this.sortNodes(),this.nodes.forEach((t=>{let i=null==n?void 0:n.find((e=>e._id===t._id)),r=Object.assign({},t)
i&&(r.x=i.x,r.y=i.y,r.w=i.w),s.Utils.removeInternalForSave(r,!e),o.push(r)})),o}layoutsNodesChange(e){return!this._layouts||this._inColumnResize||this._layouts.forEach(((t,i)=>{if(!t||i===this.column)return this
if(i<this.column)this._layouts[i]=void 0
else{let s=i/this.column
e.forEach((e=>{if(!e._orig)return
let i=t.find((t=>t._id===e._id))
i&&(e.y!==e._orig.y&&(i.y+=e.y-e._orig.y),e.x!==e._orig.x&&(i.x=Math.round(e.x*s)),e.w!==e._orig.w&&(i.w=Math.round(e.w*s)))}))}})),this}updateNodeWidths(e,t,i){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"moveScale"
var o
if(!this.nodes.length||!t||e===t)return this
this.cacheLayout(this.nodes,e),this.batchUpdate()
let r=[],l=!1
if(1===t&&(null==i?void 0:i.length)){l=!0
let e=0
i.forEach((t=>{t.x=0,t.w=1,t.y=Math.max(t.y,e),e=t.y+t.h})),r=i,i=[]}else i=s.Utils.sort(this.nodes,-1,e)
let a=[]
if(t>e){a=this._layouts[t]||[]
let s=this._layouts.length-1
!a.length&&e!==s&&(null===(o=this._layouts[s])||void 0===o?void 0:o.length)&&(e=s,this._layouts[s].forEach((e=>{let t=i.find((t=>t._id===e._id))
t&&(t.x=e.x,t.y=e.y,t.w=e.w)})))}if(a.forEach((e=>{let t=i.findIndex((t=>t._id===e._id));-1!==t&&(i[t].x=e.x,i[t].y=e.y,i[t].w=e.w,r.push(i[t]),i.splice(t,1))})),i.length)if("function"==typeof n)n(t,e,r,i)
else if(!l){let s=t/e,o="move"===n||"moveScale"===n,l="scale"===n||"moveScale"===n
i.forEach((i=>{i.x=1===t?0:o?Math.round(i.x*s):Math.min(i.x,t-1),i.w=1===t||1===e?1:l?Math.round(i.w*s)||1:Math.min(i.w,t),r.push(i)})),i=[]}return l||(r=s.Utils.sort(r,-1,t)),this._inColumnResize=!0,this.nodes=[],r.forEach((e=>{this.addNode(e,!1),delete e._orig})),this.batchUpdate(!1),delete this._inColumnResize,this}cacheLayout(e,t){let i=arguments.length>2&&void 0!==arguments[2]&&arguments[2],s=[]
return e.forEach(((e,t)=>{e._id=e._id||n._idSeq++,s[t]={x:e.x,y:e.y,w:e.w,_id:e._id}})),this._layouts=i?[]:this._layouts||[],this._layouts[t]=s,this}cacheOneLayout(e,t){e._id=e._id||n._idSeq++
let i={x:e.x,y:e.y,w:e.w,_id:e._id}
this._layouts=this._layouts||[],this._layouts[t]=this._layouts[t]||[]
let s=this.findCacheLayout(e,t)
return-1===s?this._layouts[t].push(i):this._layouts[t][s]=i,this}findCacheLayout(e,t){var i,s,n
return null!==(n=null===(s=null===(i=this._layouts)||void 0===i?void 0:i[t])||void 0===s?void 0:s.findIndex((t=>t._id===e._id)))&&void 0!==n?n:-1}cleanupNode(e){for(let t in e)"_"===t[0]&&"_id"!==t&&delete e[t]
return this}}t.GridStackEngine=n,n._idSeq=1},626:function(e,t,i){"use strict"
var s=this&&this.__createBinding||(Object.create?function(e,t,i,s){void 0===s&&(s=i),Object.defineProperty(e,s,{enumerable:!0,get:function(){return t[i]}})}:function(e,t,i,s){void 0===s&&(s=i),e[s]=t[i]}),n=this&&this.__exportStar||function(e,t){for(var i in e)"default"===i||t.hasOwnProperty(i)||s(t,e,i)}
Object.defineProperty(t,"__esModule",{value:!0}),t.GridStack=void 0
const o=i(469),r=i(263),l=i(664),a=i(266),d=i(187),h=i(340),c=new a.DDGridStack
n(i(664),t),n(i(263),t),n(i(469),t),n(i(266),t)
class g{constructor(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}
var i,s
this._gsEventHandler={},this._extraDragRow=0,this.el=e,t=t||{},e.classList.contains("grid-stack")||this.el.classList.add("grid-stack"),t.row&&(t.minRow=t.maxRow=t.row,delete t.row)
let n=r.Utils.toNumber(e.getAttribute("gs-row"))
"auto"===t.column&&delete t.column
let a=t
void 0!==a.minWidth&&(t.oneColumnSize=t.oneColumnSize||a.minWidth,delete a.minWidth),void 0!==t.alwaysShowResizeHandle&&(t._alwaysShowResizeHandle=t.alwaysShowResizeHandle)
let c=Object.assign(Object.assign({},r.Utils.cloneDeep(l.gridDefaults)),{column:r.Utils.toNumber(e.getAttribute("gs-column"))||l.gridDefaults.column,minRow:n||r.Utils.toNumber(e.getAttribute("gs-min-row"))||l.gridDefaults.minRow,maxRow:n||r.Utils.toNumber(e.getAttribute("gs-max-row"))||l.gridDefaults.maxRow,staticGrid:r.Utils.toBool(e.getAttribute("gs-static"))||l.gridDefaults.staticGrid,draggable:{handle:(t.handleClass?"."+t.handleClass:t.handle?t.handle:"")||l.gridDefaults.draggable.handle},removableOptions:{accept:t.itemClass?"."+t.itemClass:l.gridDefaults.removableOptions.accept}})
e.getAttribute("gs-animate")&&(c.animate=r.Utils.toBool(e.getAttribute("gs-animate"))),this.opts=r.Utils.defaults(t,c),t=null,this._initMargin(),1!==this.opts.column&&!this.opts.disableOneColumnMode&&this._widthOrContainer()<=this.opts.oneColumnSize&&(this._prevColumn=this.getColumn(),this.opts.column=1),"auto"===this.opts.rtl&&(this.opts.rtl="rtl"===e.style.direction),this.opts.rtl&&this.el.classList.add("grid-stack-rtl")
let u=null===(i=r.Utils.closestUpByClass(this.el,l.gridDefaults.itemClass))||void 0===i?void 0:i.gridstackNode
u&&(u.subGrid=this,this.parentGridItem=u,this.el.classList.add("grid-stack-nested"),u.el.classList.add("grid-stack-sub-grid")),this._isAutoCellHeight="auto"===this.opts.cellHeight,this._isAutoCellHeight||"initial"===this.opts.cellHeight?this.cellHeight(void 0,!1):("number"==typeof this.opts.cellHeight&&this.opts.cellHeightUnit&&this.opts.cellHeightUnit!==l.gridDefaults.cellHeightUnit&&(this.opts.cellHeight=this.opts.cellHeight+this.opts.cellHeightUnit,delete this.opts.cellHeightUnit),this.cellHeight(this.opts.cellHeight,!1)),"mobile"===this.opts.alwaysShowResizeHandle&&(this.opts.alwaysShowResizeHandle=d.isTouch),this._styleSheetClass="grid-stack-instance-"+o.GridStackEngine._idSeq++,this.el.classList.add(this._styleSheetClass),this._setStaticClass()
let p=this.opts.engineClass||g.engineClass||o.GridStackEngine
if(this.engine=new p({column:this.getColumn(),float:this.opts.float,maxRow:this.opts.maxRow,onChange:e=>{let t=0
this.engine.nodes.forEach((e=>{t=Math.max(t,e.y+e.h)})),e.forEach((e=>{let t=e.el
t&&(e._removeDOM?(t&&t.remove(),delete e._removeDOM):this._writePosAttr(t,e))})),this._updateStyles(!1,t)}}),this.opts.auto){this.batchUpdate()
let e=[],t=this.getColumn()
1===t&&this._prevColumn&&(t=this._prevColumn),this.getGridItems().forEach((i=>{let s=parseInt(i.getAttribute("gs-x")),n=parseInt(i.getAttribute("gs-y"))
e.push({el:i,i:(Number.isNaN(s)?1e3:s)+(Number.isNaN(n)?1e3:n)*t})})),e.sort(((e,t)=>t.i-e.i)).forEach((e=>this._prepareElement(e.el))),this.batchUpdate(!1)}if(this.opts.children){let e=this.opts.children
delete this.opts.children,e.length&&this.load(e)}this.setAnimation(this.opts.animate),this._updateStyles(),12!=this.opts.column&&this.el.classList.add("grid-stack-"+this.opts.column),this.opts.dragIn&&g.setupDragIn(this.opts.dragIn,this.opts.dragInOptions),delete this.opts.dragIn,delete this.opts.dragInOptions,this.opts.subGridDynamic&&!h.DDManager.pauseDrag&&(h.DDManager.pauseDrag=!0),void 0!==(null===(s=this.opts.draggable)||void 0===s?void 0:s.pause)&&(h.DDManager.pauseDrag=this.opts.draggable.pause),this._setupRemoveDrop(),this._setupAcceptWidget(),this._updateWindowResizeEvent()}static init(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:".grid-stack",i=g.getGridElement(t)
return i?(i.gridstack||(i.gridstack=new g(i,r.Utils.cloneDeep(e))),i.gridstack):("string"==typeof t?console.error('GridStack.initAll() no grid was found with selector "'+t+'" - element missing or wrong selector ?\nNote: ".grid-stack" is required for proper CSS styling and drag/drop, and is the default selector.'):console.error("GridStack.init() no grid element was passed."),null)}static initAll(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:".grid-stack",i=[]
return g.getGridElements(t).forEach((t=>{t.gridstack||(t.gridstack=new g(t,r.Utils.cloneDeep(e)),delete e.dragIn,delete e.dragInOptions),i.push(t.gridstack)})),0===i.length&&console.error('GridStack.initAll() no grid was found with selector "'+t+'" - element missing or wrong selector ?\nNote: ".grid-stack" is required for proper CSS styling and drag/drop, and is the default selector.'),i}static addGrid(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}
if(!e)return null
let i=e
if(!e.classList.contains("grid-stack")){let s=document.implementation.createHTMLDocument("")
s.body.innerHTML=`<div class="grid-stack ${t.class||""}"></div>`,i=s.body.children[0],e.appendChild(i)}return g.init(t,i)}static registerEngine(e){g.engineClass=e}get placeholder(){if(!this._placeholder){let e=document.createElement("div")
e.className="placeholder-content",this.opts.placeholderText&&(e.innerHTML=this.opts.placeholderText),this._placeholder=document.createElement("div"),this._placeholder.classList.add(this.opts.placeholderClass,l.gridDefaults.itemClass,this.opts.itemClass),this.placeholder.appendChild(e)}return this._placeholder}addWidget(e,t){let i,s
if("string"==typeof e){let t=document.implementation.createHTMLDocument("")
t.body.innerHTML=e,i=t.body.children[0]}else if(0===arguments.length||1===arguments.length&&(void 0!==(n=e).x||void 0!==n.y||void 0!==n.w||void 0!==n.h||void 0!==n.content))if(s=t=e,null==s?void 0:s.el)i=s.el
else if(this.opts.addRemoveCB)i=this.opts.addRemoveCB(this,t,!0)
else{let e=(null==t?void 0:t.content)||"",s=document.implementation.createHTMLDocument("")
s.body.innerHTML=`<div class="grid-stack-item ${this.opts.itemClass||""}"><div class="grid-stack-item-content">${e}</div></div>`,i=s.body.children[0]}else i=e
var n
if(!i)return
let o=this._readAttr(i)
return t=r.Utils.cloneDeep(t)||{},r.Utils.defaults(t,o),s=this.engine.prepareNode(t),this._writeAttr(i,t),this._insertNotAppend?this.el.prepend(i):this.el.appendChild(i),this._prepareElement(i,!0,t),this._updateContainerHeight(),s.subGrid&&this.makeSubGrid(s.el,void 0,void 0,!1),this._prevColumn&&1===this.opts.column&&(this._ignoreLayoutsNodeChange=!0),this._triggerAddEvent(),this._triggerChangeEvent(),delete this._ignoreLayoutsNodeChange,i}makeSubGrid(e,t,i){let s=!(arguments.length>3&&void 0!==arguments[3])||arguments[3]
var n,o,l
let a,d=e.gridstackNode
if(d||(d=this.makeWidget(e).gridstackNode),null===(n=d.subGrid)||void 0===n?void 0:n.el)return d.subGrid
let h,c=this
for(;c&&!a;)a=null===(o=c.opts)||void 0===o?void 0:o.subGrid,c=null===(l=c.parentGridItem)||void 0===l?void 0:l.grid
t=r.Utils.cloneDeep(Object.assign(Object.assign(Object.assign({},a||{}),{children:void 0}),t||d.subGrid)),d.subGrid=t,"auto"===t.column&&(h=!0,t.column=Math.max(d.w||1,(null==i?void 0:i.w)||1),t.disableOneColumnMode=!0)
let u,p,m=d.el.querySelector(".grid-stack-item-content")
if(s){this._removeDD(d.el)
let e=document.implementation.createHTMLDocument("")
e.body.innerHTML='<div class="grid-stack-item"></div>',u=e.body.children[0],u.appendChild(m),p=Object.assign(Object.assign({},d),{x:0,y:0}),r.Utils.removeInternalForSave(p),delete p.subGrid,d.content&&(p.content=d.content,delete d.content),e.body.innerHTML='<div class="grid-stack-item-content"></div>',m=e.body.children[0],d.el.appendChild(m),this._prepareDragDropByNode(d)}if(i){let e=h?t.column:d.w,s=d.h+i.h,n=d.el.style
n.transition="none",this.update(d.el,{w:e,h:s}),setTimeout((()=>n.transition=null))}let f=d.subGrid=g.addGrid(m,t)
return(null==i?void 0:i._moving)&&(f._isTemp=!0),h&&(f._autoColumn=!0),s&&f.addWidget(u,p),i&&(i._moving?window.setTimeout((()=>r.Utils.simulateMouseEvent(i._event,"mouseenter",f.el)),0):f.addWidget(d.el,d)),f}removeAsSubGrid(e){var t
let i=null===(t=this.parentGridItem)||void 0===t?void 0:t.grid
i&&(i.batchUpdate(),i.removeWidget(this.parentGridItem.el,!0,!0),this.engine.nodes.forEach((e=>{e.x+=this.parentGridItem.x,e.y+=this.parentGridItem.y,i.addWidget(e.el,e)})),i.batchUpdate(!1),delete this.parentGridItem,e&&window.setTimeout((()=>r.Utils.simulateMouseEvent(e._event,"mouseenter",i.el)),0))}save(){let e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=this.engine.save(e)
if(i.forEach((i=>{var s
if(e&&i.el&&!i.subGrid){let e=i.el.querySelector(".grid-stack-item-content")
i.content=e?e.innerHTML:void 0,i.content||delete i.content}else if(e||delete i.content,null===(s=i.subGrid)||void 0===s?void 0:s.el){const s=i.subGrid.save(e,t)
i.subGrid=t?s:{children:s}}delete i.el})),t){let e=r.Utils.cloneDeep(this.opts)
e.marginBottom===e.marginTop&&e.marginRight===e.marginLeft&&e.marginTop===e.marginRight&&(e.margin=e.marginTop,delete e.marginTop,delete e.marginRight,delete e.marginBottom,delete e.marginLeft),e.rtl===("rtl"===this.el.style.direction)&&(e.rtl="auto"),this._isAutoCellHeight&&(e.cellHeight="auto"),this._autoColumn&&(e.column="auto",delete e.disableOneColumnMode)
const t=e._alwaysShowResizeHandle
return delete e._alwaysShowResizeHandle,void 0!==t?e.alwaysShowResizeHandle=t:delete e.alwaysShowResizeHandle,r.Utils.removeInternalAndSame(e,l.gridDefaults),e.children=i,e}return i}load(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.opts.addRemoveCB||!0,i=g.Utils.sort([...e],-1,this._prevColumn||this.getColumn())
this._insertNotAppend=!0,this._prevColumn&&this._prevColumn!==this.opts.column&&i.some((e=>e.x+e.w>this.opts.column))&&(this._ignoreLayoutsNodeChange=!0,this.engine.cacheLayout(i,this._prevColumn,!0))
const s=this.opts.addRemoveCB
"function"==typeof t&&(this.opts.addRemoveCB=t)
let n=[]
return this.batchUpdate(),t&&[...this.engine.nodes].forEach((e=>{i.find((t=>e.id===t.id))||(this.opts.addRemoveCB&&this.opts.addRemoveCB(this,e,!1),n.push(e),this.removeWidget(e.el,!0,!1))})),i.forEach((e=>{let i=e.id||0===e.id?this.engine.nodes.find((t=>t.id===e.id)):void 0
if(i){if(this.update(i.el,e),e.subGrid&&e.subGrid.children){let t=i.el.querySelector(".grid-stack")
t&&t.gridstack&&(t.gridstack.load(e.subGrid.children),this._insertNotAppend=!0)}}else t&&this.addWidget(e)})),this.engine.removedNodes=n,this.batchUpdate(!1),delete this._ignoreLayoutsNodeChange,delete this._insertNotAppend,s?this.opts.addRemoveCB=s:delete this.opts.addRemoveCB,this}batchUpdate(){let e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0]
return this.engine.batchUpdate(e),e||(this._triggerRemoveEvent(),this._triggerAddEvent(),this._triggerChangeEvent()),this}getCellHeight(){let e=arguments.length>0&&void 0!==arguments[0]&&arguments[0]
if(this.opts.cellHeight&&"auto"!==this.opts.cellHeight&&(!e||!this.opts.cellHeightUnit||"px"===this.opts.cellHeightUnit))return this.opts.cellHeight
let t=this.el.querySelector("."+this.opts.itemClass)
if(t){let e=r.Utils.toNumber(t.getAttribute("gs-h"))
return Math.round(t.offsetHeight/e)}let i=parseInt(this.el.getAttribute("gs-current-row"))
return i?Math.round(this.el.getBoundingClientRect().height/i):this.opts.cellHeight}cellHeight(e){let t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1]
if(t&&void 0!==e&&this._isAutoCellHeight!==("auto"===e)&&(this._isAutoCellHeight="auto"===e,this._updateWindowResizeEvent()),"initial"!==e&&"auto"!==e||(e=void 0),void 0===e){let t=-this.opts.marginRight-this.opts.marginLeft+this.opts.marginTop+this.opts.marginBottom
e=this.cellWidth()+t}let i=r.Utils.parseHeight(e)
return this.opts.cellHeightUnit===i.unit&&this.opts.cellHeight===i.h||(this.opts.cellHeightUnit=i.unit,this.opts.cellHeight=i.h,t&&this._updateStyles(!0)),this}cellWidth(){return this._widthOrContainer()/this.getColumn()}_widthOrContainer(){return this.el.clientWidth||this.el.parentElement.clientWidth||window.innerWidth}compact(){return this.engine.compact(),this._triggerChangeEvent(),this}column(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"moveScale"
if(e<1||this.opts.column===e)return this
let i,s=this.getColumn()
return 1===e?this._prevColumn=s:delete this._prevColumn,this.el.classList.remove("grid-stack-"+s),this.el.classList.add("grid-stack-"+e),this.opts.column=this.engine.column=e,1===e&&this.opts.oneColumnModeDomSort&&(i=[],this.getGridItems().forEach((e=>{e.gridstackNode&&i.push(e.gridstackNode)})),i.length||(i=void 0)),this.engine.updateNodeWidths(s,e,i,t),this._isAutoCellHeight&&this.cellHeight(),this._ignoreLayoutsNodeChange=!0,this._triggerChangeEvent(),delete this._ignoreLayoutsNodeChange,this}getColumn(){return this.opts.column}getGridItems(){return Array.from(this.el.children).filter((e=>e.matches("."+this.opts.itemClass)&&!e.matches("."+this.opts.placeholderClass)))}destroy(){let e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0]
if(this.el)return this._updateWindowResizeEvent(!0),this.setStatic(!0,!1),this.setAnimation(!1),e?this.el.parentNode.removeChild(this.el):(this.removeAll(e),this.el.classList.remove(this._styleSheetClass)),this._removeStylesheet(),this.el.removeAttribute("gs-current-row"),delete this.parentGridItem,delete this.opts,delete this._placeholder,delete this.engine,delete this.el.gridstack,delete this.el,this}float(e){return this.opts.float!==e&&(this.opts.float=this.engine.float=e,this._triggerChangeEvent()),this}getFloat(){return this.engine.float}getCellFromPixel(e){let t,i=arguments.length>1&&void 0!==arguments[1]&&arguments[1],s=this.el.getBoundingClientRect()
t=i?{top:s.top+document.documentElement.scrollTop,left:s.left}:{top:this.el.offsetTop,left:this.el.offsetLeft}
let n=e.left-t.left,o=e.top-t.top,r=s.width/this.getColumn(),l=s.height/parseInt(this.el.getAttribute("gs-current-row"))
return{x:Math.floor(n/r),y:Math.floor(o/l)}}getRow(){return Math.max(this.engine.getRow(),this.opts.minRow)}isAreaEmpty(e,t,i,s){return this.engine.isAreaEmpty(e,t,i,s)}makeWidget(e){let t=g.getElement(e)
return this._prepareElement(t,!0),this._updateContainerHeight(),this._triggerAddEvent(),this._triggerChangeEvent(),t}on(e,t){if(-1!==e.indexOf(" "))return e.split(" ").forEach((e=>this.on(e,t))),this
if("change"===e||"added"===e||"removed"===e||"enable"===e||"disable"===e){let i="enable"===e||"disable"===e
this._gsEventHandler[e]=i?e=>t(e):e=>t(e,e.detail),this.el.addEventListener(e,this._gsEventHandler[e])}else"drag"===e||"dragstart"===e||"dragstop"===e||"resizestart"===e||"resize"===e||"resizestop"===e||"dropped"===e?this._gsEventHandler[e]=t:console.log("GridStack.on("+e+') event not supported, but you can still use $(".grid-stack").on(...) while jquery-ui is still used internally.')
return this}off(e){return-1!==e.indexOf(" ")?(e.split(" ").forEach((e=>this.off(e))),this):("change"!==e&&"added"!==e&&"removed"!==e&&"enable"!==e&&"disable"!==e||this._gsEventHandler[e]&&this.el.removeEventListener(e,this._gsEventHandler[e]),delete this._gsEventHandler[e],this)}removeWidget(e){let t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=!(arguments.length>2&&void 0!==arguments[2])||arguments[2]
return g.getElements(e).forEach((e=>{if(e.parentElement&&e.parentElement!==this.el)return
let s=e.gridstackNode
s||(s=this.engine.nodes.find((t=>e===t.el))),s&&(delete e.gridstackNode,this._removeDD(e),this.engine.removeNode(s,t,i),t&&e.parentElement&&e.remove())})),i&&(this._triggerRemoveEvent(),this._triggerChangeEvent()),this}removeAll(){let e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0]
return this.engine.nodes.forEach((e=>{delete e.el.gridstackNode,this._removeDD(e.el)})),this.engine.removeAll(e),this._triggerRemoveEvent(),this}setAnimation(e){return e?this.el.classList.add("grid-stack-animate"):this.el.classList.remove("grid-stack-animate"),this}setStatic(e){let t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=!(arguments.length>2&&void 0!==arguments[2])||arguments[2]
return this.opts.staticGrid===e||(this.opts.staticGrid=e,this._setupRemoveDrop(),this._setupAcceptWidget(),this.engine.nodes.forEach((s=>{this._prepareDragDropByNode(s),s.subGrid&&i&&s.subGrid.setStatic(e,t,i)})),t&&this._setStaticClass()),this}update(e,t){if(arguments.length>2){console.warn("gridstack.ts: `update(el, x, y, w, h)` is deprecated. Use `update(el, {x, w, content, ...})`. It will be removed soon")
let i=arguments,s=1
return t={x:i[s++],y:i[s++],w:i[s++],h:i[s++]},this.update(e,t)}return g.getElements(e).forEach((e=>{if(!e||!e.gridstackNode)return
let i=e.gridstackNode,s=r.Utils.cloneDeep(t)
delete s.autoPosition
let n,o=["x","y","w","h"]
if(o.some((e=>void 0!==s[e]&&s[e]!==i[e]))&&(n={},o.forEach((e=>{n[e]=void 0!==s[e]?s[e]:i[e],delete s[e]}))),!n&&(s.minW||s.minH||s.maxW||s.maxH)&&(n={}),s.content){let t=e.querySelector(".grid-stack-item-content")
t&&t.innerHTML!==s.content&&(t.innerHTML=s.content),delete s.content}let l=!1,a=!1
for(const t in s)"_"!==t[0]&&i[t]!==s[t]&&(i[t]=s[t],l=!0,a=a||!this.opts.staticGrid&&("noResize"===t||"noMove"===t||"locked"===t))
n&&(this.engine.cleanNodes().beginUpdate(i).moveNode(i,n),this._updateContainerHeight(),this._triggerChangeEvent(),this.engine.endUpdate()),l&&this._writeAttr(e,i),a&&this._prepareDragDropByNode(i)})),this}margin(e){if(!("string"==typeof e&&e.split(" ").length>1)){let t=r.Utils.parseHeight(e)
if(this.opts.marginUnit===t.unit&&this.opts.margin===t.h)return}return this.opts.margin=e,this.opts.marginTop=this.opts.marginBottom=this.opts.marginLeft=this.opts.marginRight=void 0,this._initMargin(),this._updateStyles(!0),this}getMargin(){return this.opts.margin}willItFit(e){if(arguments.length>1){console.warn("gridstack.ts: `willItFit(x,y,w,h,autoPosition)` is deprecated. Use `willItFit({x, y,...})`. It will be removed soon")
let e=arguments,t=0,i={x:e[t++],y:e[t++],w:e[t++],h:e[t++],autoPosition:e[t++]}
return this.willItFit(i)}return this.engine.willItFit(e)}_triggerChangeEvent(){if(this.engine.batchMode)return this
let e=this.engine.getDirtyNodes(!0)
return e&&e.length&&(this._ignoreLayoutsNodeChange||this.engine.layoutsNodesChange(e),this._triggerEvent("change",e)),this.engine.saveInitial(),this}_triggerAddEvent(){return this.engine.batchMode||this.engine.addedNodes&&this.engine.addedNodes.length>0&&(this._ignoreLayoutsNodeChange||this.engine.layoutsNodesChange(this.engine.addedNodes),this.engine.addedNodes.forEach((e=>{delete e._dirty})),this._triggerEvent("added",this.engine.addedNodes),this.engine.addedNodes=[]),this}_triggerRemoveEvent(){return this.engine.batchMode||this.engine.removedNodes&&this.engine.removedNodes.length>0&&(this._triggerEvent("removed",this.engine.removedNodes),this.engine.removedNodes=[]),this}_triggerEvent(e,t){let i=t?new CustomEvent(e,{bubbles:!1,detail:t}):new Event(e)
return this.el.dispatchEvent(i),this}_removeStylesheet(){return this._styles&&(r.Utils.removeStylesheet(this._styleSheetClass),delete this._styles),this}_updateStyles(){let e=arguments.length>1?arguments[1]:void 0
if(arguments.length>0&&void 0!==arguments[0]&&arguments[0]&&this._removeStylesheet(),e||(e=this.getRow()),this._updateContainerHeight(),0===this.opts.cellHeight)return this
let t=this.opts.cellHeight,i=this.opts.cellHeightUnit,s=`.${this._styleSheetClass} > .${this.opts.itemClass}`
if(!this._styles){let e=this.opts.styleInHead?void 0:this.el.parentNode
if(this._styles=r.Utils.createStylesheet(this._styleSheetClass,e),!this._styles)return this
this._styles._max=0,r.Utils.addCSSRule(this._styles,s,`min-height: ${t}${i}`)
let n=this.opts.marginTop+this.opts.marginUnit,o=this.opts.marginBottom+this.opts.marginUnit,l=this.opts.marginRight+this.opts.marginUnit,a=this.opts.marginLeft+this.opts.marginUnit,d=`${s} > .grid-stack-item-content`,h=`.${this._styleSheetClass} > .grid-stack-placeholder > .placeholder-content`
r.Utils.addCSSRule(this._styles,d,`top: ${n}; right: ${l}; bottom: ${o}; left: ${a};`),r.Utils.addCSSRule(this._styles,h,`top: ${n}; right: ${l}; bottom: ${o}; left: ${a};`),r.Utils.addCSSRule(this._styles,`${s} > .ui-resizable-ne`,`right: ${l}`),r.Utils.addCSSRule(this._styles,`${s} > .ui-resizable-e`,`right: ${l}`),r.Utils.addCSSRule(this._styles,`${s} > .ui-resizable-se`,`right: ${l}; bottom: ${o}`),r.Utils.addCSSRule(this._styles,`${s} > .ui-resizable-nw`,`left: ${a}`),r.Utils.addCSSRule(this._styles,`${s} > .ui-resizable-w`,`left: ${a}`),r.Utils.addCSSRule(this._styles,`${s} > .ui-resizable-sw`,`left: ${a}; bottom: ${o}`)}if(e=e||this._styles._max,e>this._styles._max){let n=e=>t*e+i
for(let t=this._styles._max+1;t<=e;t++){let e=n(t)
r.Utils.addCSSRule(this._styles,`${s}[gs-y="${t-1}"]`,`top: ${n(t-1)}`),r.Utils.addCSSRule(this._styles,`${s}[gs-h="${t}"]`,`height: ${e}`),r.Utils.addCSSRule(this._styles,`${s}[gs-min-h="${t}"]`,`min-height: ${e}`),r.Utils.addCSSRule(this._styles,`${s}[gs-max-h="${t}"]`,`max-height: ${e}`)}this._styles._max=e}return this}_updateContainerHeight(){if(!this.engine||this.engine.batchMode)return this
let e=this.getRow()+this._extraDragRow
if(this.el.setAttribute("gs-current-row",String(e)),0===e)return this.el.style.removeProperty("min-height"),this
let t=this.opts.cellHeight,i=this.opts.cellHeightUnit
return t?(this.el.style.minHeight=e*t+i,this):this}_prepareElement(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=arguments.length>2?arguments[2]:void 0
e.classList.add(this.opts.itemClass),i=i||this._readAttr(e),e.gridstackNode=i,i.el=e,i.grid=this
let s=Object.assign({},i)
return i=this.engine.addNode(i,t),r.Utils.same(i,s)||this._writeAttr(e,i),this._prepareDragDropByNode(i),this}_writePosAttr(e,t){return void 0!==t.x&&null!==t.x&&e.setAttribute("gs-x",String(t.x)),void 0!==t.y&&null!==t.y&&e.setAttribute("gs-y",String(t.y)),t.w&&e.setAttribute("gs-w",String(t.w)),t.h&&e.setAttribute("gs-h",String(t.h)),this}_writeAttr(e,t){if(!t)return this
this._writePosAttr(e,t)
let i={autoPosition:"gs-auto-position",minW:"gs-min-w",minH:"gs-min-h",maxW:"gs-max-w",maxH:"gs-max-h",noResize:"gs-no-resize",noMove:"gs-no-move",locked:"gs-locked",id:"gs-id"}
for(const s in i)t[s]?e.setAttribute(i[s],String(t[s])):e.removeAttribute(i[s])
return this}_readAttr(e){let t={}
t.x=r.Utils.toNumber(e.getAttribute("gs-x")),t.y=r.Utils.toNumber(e.getAttribute("gs-y")),t.w=r.Utils.toNumber(e.getAttribute("gs-w")),t.h=r.Utils.toNumber(e.getAttribute("gs-h")),t.maxW=r.Utils.toNumber(e.getAttribute("gs-max-w")),t.minW=r.Utils.toNumber(e.getAttribute("gs-min-w")),t.maxH=r.Utils.toNumber(e.getAttribute("gs-max-h")),t.minH=r.Utils.toNumber(e.getAttribute("gs-min-h")),t.autoPosition=r.Utils.toBool(e.getAttribute("gs-auto-position")),t.noResize=r.Utils.toBool(e.getAttribute("gs-no-resize")),t.noMove=r.Utils.toBool(e.getAttribute("gs-no-move")),t.locked=r.Utils.toBool(e.getAttribute("gs-locked")),t.id=e.getAttribute("gs-id")
for(const i in t){if(!t.hasOwnProperty(i))return
t[i]||0===t[i]||delete t[i]}return t}_setStaticClass(){let e=["grid-stack-static"]
return this.opts.staticGrid?(this.el.classList.add(...e),this.el.setAttribute("gs-static","true")):(this.el.classList.remove(...e),this.el.removeAttribute("gs-static")),this}onParentResize(){if(!this.el||!this.el.clientWidth)return
let e=!1
if(this._autoColumn&&this.parentGridItem)this.opts.column!==this.parentGridItem.w&&(e=!0,this.column(this.parentGridItem.w,"none"))
else{let t=!this.opts.disableOneColumnMode&&this.el.clientWidth<=this.opts.oneColumnSize
1===this.opts.column!==t&&(e=!0,this.opts.animate&&this.setAnimation(!1),this.column(t?1:this._prevColumn),this.opts.animate&&this.setAnimation(!0))}return this._isAutoCellHeight&&(!e&&this.opts.cellHeightThrottle?(this._cellHeightThrottle||(this._cellHeightThrottle=r.Utils.throttle((()=>this.cellHeight()),this.opts.cellHeightThrottle)),this._cellHeightThrottle()):this.cellHeight()),this.engine.nodes.forEach((e=>{e.subGrid&&e.subGrid.onParentResize()})),this}_updateWindowResizeEvent(){let e=arguments.length>0&&void 0!==arguments[0]&&arguments[0]
const t=(this._isAutoCellHeight||!this.opts.disableOneColumnMode)&&!this.parentGridItem
return e||!t||this._windowResizeBind?!e&&t||!this._windowResizeBind||(window.removeEventListener("resize",this._windowResizeBind),delete this._windowResizeBind):(this._windowResizeBind=this.onParentResize.bind(this),window.addEventListener("resize",this._windowResizeBind)),this}static getElement(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:".grid-stack-item"
return r.Utils.getElement(e)}static getElements(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:".grid-stack-item"
return r.Utils.getElements(e)}static getGridElement(e){return g.getElement(e)}static getGridElements(e){return r.Utils.getElements(e)}_initMargin(){let e,t=0,i=[]
return"string"==typeof this.opts.margin&&(i=this.opts.margin.split(" ")),2===i.length?(this.opts.marginTop=this.opts.marginBottom=i[0],this.opts.marginLeft=this.opts.marginRight=i[1]):4===i.length?(this.opts.marginTop=i[0],this.opts.marginRight=i[1],this.opts.marginBottom=i[2],this.opts.marginLeft=i[3]):(e=r.Utils.parseHeight(this.opts.margin),this.opts.marginUnit=e.unit,t=this.opts.margin=e.h),void 0===this.opts.marginTop?this.opts.marginTop=t:(e=r.Utils.parseHeight(this.opts.marginTop),this.opts.marginTop=e.h,delete this.opts.margin),void 0===this.opts.marginBottom?this.opts.marginBottom=t:(e=r.Utils.parseHeight(this.opts.marginBottom),this.opts.marginBottom=e.h,delete this.opts.margin),void 0===this.opts.marginRight?this.opts.marginRight=t:(e=r.Utils.parseHeight(this.opts.marginRight),this.opts.marginRight=e.h,delete this.opts.margin),void 0===this.opts.marginLeft?this.opts.marginLeft=t:(e=r.Utils.parseHeight(this.opts.marginLeft),this.opts.marginLeft=e.h,delete this.opts.margin),this.opts.marginUnit=e.unit,this.opts.marginTop===this.opts.marginBottom&&this.opts.marginLeft===this.opts.marginRight&&this.opts.marginTop===this.opts.marginRight&&(this.opts.margin=this.opts.marginTop),this}static getDD(){return c}static setupDragIn(e,t){void 0!==(null==t?void 0:t.pause)&&(h.DDManager.pauseDrag=t.pause),"string"==typeof e&&(t=Object.assign(Object.assign({},l.dragInDefaultOptions),t||{}),r.Utils.getElements(e).forEach((e=>{c.isDraggable(e)||c.dragIn(e,t)})))}movable(e,t){return this.opts.staticGrid||g.getElements(e).forEach((e=>{let i=e.gridstackNode
i&&(t?delete i.noMove:i.noMove=!0,this._prepareDragDropByNode(i))})),this}resizable(e,t){return this.opts.staticGrid||g.getElements(e).forEach((e=>{let i=e.gridstackNode
i&&(t?delete i.noResize:i.noResize=!0,this._prepareDragDropByNode(i))})),this}disable(){let e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0]
if(!this.opts.staticGrid)return this.enableMove(!1,e),this.enableResize(!1,e),this._triggerEvent("disable"),this}enable(){let e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0]
if(!this.opts.staticGrid)return this.enableMove(!0,e),this.enableResize(!0,e),this._triggerEvent("enable"),this}enableMove(e){let t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1]
return this.opts.staticGrid||(this.opts.disableDrag=!e,this.engine.nodes.forEach((i=>{this.movable(i.el,e),i.subGrid&&t&&i.subGrid.enableMove(e,t)}))),this}enableResize(e){let t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1]
return this.opts.staticGrid||(this.opts.disableResize=!e,this.engine.nodes.forEach((i=>{this.resizable(i.el,e),i.subGrid&&t&&i.subGrid.enableResize(e,t)}))),this}_removeDD(e){return c.draggable(e,"destroy").resizable(e,"destroy"),e.gridstackNode&&delete e.gridstackNode._initDD,delete e.ddElement,this}_setupAcceptWidget(){if(this.opts.staticGrid||!this.opts.acceptWidgets&&!this.opts.removable)return c.droppable(this.el,"destroy"),this
let e,t,i=(i,s,n)=>{let o=s.gridstackNode
if(!o)return
n=n||s
let l=this.el.getBoundingClientRect(),{top:a,left:d}=n.getBoundingClientRect()
d-=l.left,a-=l.top
let h={position:{top:a,left:d}}
if(o._temporaryRemoved){if(o.x=Math.max(0,Math.round(d/t)),o.y=Math.max(0,Math.round(a/e)),delete o.autoPosition,this.engine.nodeBoundFix(o),!this.engine.willItFit(o)){if(o.autoPosition=!0,!this.engine.willItFit(o))return void c.off(s,"drag")
o._willFitPos&&(r.Utils.copyPos(o,o._willFitPos),delete o._willFitPos)}this._onStartMoving(n,i,h,o,t,e)}else this._dragOrResize(n,i,h,o,t,e)}
return c.droppable(this.el,{accept:e=>{let t=e.gridstackNode
if((null==t?void 0:t.grid)===this)return!0
if(!this.opts.acceptWidgets)return!1
let i=!0
if("function"==typeof this.opts.acceptWidgets)i=this.opts.acceptWidgets(e)
else{let t=!0===this.opts.acceptWidgets?".grid-stack-item":this.opts.acceptWidgets
i=e.matches(t)}if(i&&t&&this.opts.maxRow){let e={w:t.w,h:t.h,minW:t.minW,minH:t.minH}
i=this.engine.willItFit(e)}return i}}).on(this.el,"dropover",((s,n,o)=>{let r=n.gridstackNode
if((null==r?void 0:r.grid)===this&&!r._temporaryRemoved)return!1;(null==r?void 0:r.grid)&&r.grid!==this&&!r._temporaryRemoved&&r.grid._leave(n,o),t=this.cellWidth(),e=this.getCellHeight(!0),r||(r=this._readAttr(n)),r.grid||(r._isExternal=!0,n.gridstackNode=r),o=o||n
let l=r.w||Math.round(o.offsetWidth/t)||1,a=r.h||Math.round(o.offsetHeight/e)||1
return r.grid&&r.grid!==this?(n._gridstackNodeOrig||(n._gridstackNodeOrig=r),n.gridstackNode=r=Object.assign(Object.assign({},r),{w:l,h:a,grid:this}),this.engine.cleanupNode(r).nodeBoundFix(r),r._initDD=r._isExternal=r._temporaryRemoved=!0):(r.w=l,r.h=a,r._temporaryRemoved=!0),this._itemRemoving(r.el,!1),c.on(n,"drag",i),i(s,n,o),!1})).on(this.el,"dropout",((e,t,i)=>{let s=t.gridstackNode
return!!s&&(s.grid&&s.grid!==this||(this._leave(t,i),this._isTemp&&this.removeAsSubGrid(s)),!1)})).on(this.el,"drop",((e,t,i)=>{var s,n
let o=t.gridstackNode
if((null==o?void 0:o.grid)===this&&!o._isExternal)return!1
let a=!!this.placeholder.parentElement
this.placeholder.remove()
let d=t._gridstackNodeOrig
if(delete t._gridstackNodeOrig,a&&(null==d?void 0:d.grid)&&d.grid!==this){let e=d.grid
e.engine.removedNodes.push(d),e._triggerRemoveEvent()._triggerChangeEvent(),e.parentGridItem&&!e.engine.nodes.length&&e.opts.subGridDynamic&&e.removeAsSubGrid()}if(!o)return!1
if(a&&(this.engine.cleanupNode(o),o.grid=this),c.off(t,"drag"),i!==t?(i.remove(),t.gridstackNode=d,a&&(t=t.cloneNode(!0))):(t.remove(),this._removeDD(t)),!a)return!1
t.gridstackNode=o,o.el=t
let h=null===(n=null===(s=o.subGrid)||void 0===s?void 0:s.el)||void 0===n?void 0:n.gridstack
return r.Utils.copyPos(o,this._readAttr(this.placeholder)),r.Utils.removePositioningStyles(t),this._writeAttr(t,o),t.classList.add(l.gridDefaults.itemClass,this.opts.itemClass),this.el.appendChild(t),h&&(h.parentGridItem=o,h.opts.styleInHead||h._updateStyles(!0)),this._updateContainerHeight(),this.engine.addedNodes.push(o),this._triggerAddEvent(),this._triggerChangeEvent(),this.engine.endUpdate(),this._gsEventHandler.dropped&&this._gsEventHandler.dropped(Object.assign(Object.assign({},e),{type:"dropped"}),d&&d.grid?d:void 0,o),window.setTimeout((()=>{o.el&&o.el.parentElement?this._prepareDragDropByNode(o):this.engine.removeNode(o),delete o.grid._isTemp})),!1})),this}_itemRemoving(e,t){let i=e?e.gridstackNode:void 0
i&&i.grid&&(t?i._isAboutToRemove=!0:delete i._isAboutToRemove,t?e.classList.add("grid-stack-item-removing"):e.classList.remove("grid-stack-item-removing"))}_setupRemoveDrop(){if(!this.opts.staticGrid&&"string"==typeof this.opts.removable){let e=document.querySelector(this.opts.removable)
if(!e)return this
c.isDroppable(e)||c.droppable(e,this.opts.removableOptions).on(e,"dropover",((e,t)=>this._itemRemoving(t,!0))).on(e,"dropout",((e,t)=>this._itemRemoving(t,!1)))}return this}_prepareDragDropByNode(e){let t=e.el
const i=e.noMove||this.opts.disableDrag,s=e.noResize||this.opts.disableResize
if(this.opts.staticGrid||i&&s)return e._initDD&&(this._removeDD(t),delete e._initDD),t.classList.add("ui-draggable-disabled","ui-resizable-disabled"),this
if(!e._initDD){let i,s,n=(n,o)=>{this._gsEventHandler[n.type]&&this._gsEventHandler[n.type](n,n.target),i=this.cellWidth(),s=this.getCellHeight(!0),this._onStartMoving(t,n,o,e,i,s)},o=(n,o)=>{this._dragOrResize(t,n,o,e,i,s)},l=i=>{this.placeholder.remove(),delete e._moving,delete e._event,delete e._lastTried
let s=i.target
if(s.gridstackNode&&s.gridstackNode.grid===this){if(e.el=s,e._isAboutToRemove){let n=t.gridstackNode.grid
n._gsEventHandler[i.type]&&n._gsEventHandler[i.type](i,s),this._removeDD(t),n.engine.removedNodes.push(e),n._triggerRemoveEvent(),delete t.gridstackNode,delete e.el,t.remove()}else r.Utils.removePositioningStyles(s),e._temporaryRemoved?(r.Utils.copyPos(e,e._orig),this._writePosAttr(s,e),this.engine.addNode(e)):this._writePosAttr(s,e),this._gsEventHandler[i.type]&&this._gsEventHandler[i.type](i,s)
this._extraDragRow=0,this._updateContainerHeight(),this._triggerChangeEvent(),this.engine.endUpdate()}}
c.draggable(t,{start:n,stop:l,drag:o}).resizable(t,{start:n,stop:l,resize:o}),e._initDD=!0}return c.draggable(t,i?"disable":"enable").resizable(t,s?"disable":"enable"),this}_onStartMoving(e,t,i,s,n,o){this.engine.cleanNodes().beginUpdate(s),this._writePosAttr(this.placeholder,s),this.el.appendChild(this.placeholder),s.el=this.placeholder,s._lastUiPosition=i.position,s._prevYPix=i.position.top,s._moving="dragstart"===t.type,delete s._lastTried,"dropover"===t.type&&s._temporaryRemoved&&(this.engine.addNode(s),s._moving=!0),this.engine.cacheRects(n,o,this.opts.marginTop,this.opts.marginRight,this.opts.marginBottom,this.opts.marginLeft),"resizestart"===t.type&&(c.resizable(e,"option","minWidth",n*(s.minW||1)).resizable(e,"option","minHeight",o*(s.minH||1)),s.maxW&&c.resizable(e,"option","maxWidth",n*s.maxW),s.maxH&&c.resizable(e,"option","maxHeight",o*s.maxH))}_dragOrResize(e,t,i,s,n,o){let l,a=Object.assign({},s._orig),d=this.opts.marginLeft,h=this.opts.marginRight,c=this.opts.marginTop,g=this.opts.marginBottom,u=Math.round(.1*o),p=Math.round(.1*n)
if(d=Math.min(d,p),h=Math.min(h,p),c=Math.min(c,u),g=Math.min(g,u),"drag"===t.type){if(s._temporaryRemoved)return
let t=i.position.top-s._prevYPix
s._prevYPix=i.position.top,r.Utils.updateScrollPosition(e,i.position,t)
let l=i.position.left+(i.position.left>s._lastUiPosition.left?-h:d),u=i.position.top+(i.position.top>s._lastUiPosition.top?-g:c)
a.x=Math.round(l/n),a.y=Math.round(u/o)
let p=this._extraDragRow
if(this.engine.collide(s,a)){let e=this.getRow(),t=Math.max(0,a.y+s.h-e)
this.opts.maxRow&&e+t>this.opts.maxRow&&(t=Math.max(0,this.opts.maxRow-e)),this._extraDragRow=t}else this._extraDragRow=0
if(this._extraDragRow!==p&&this._updateContainerHeight(),s.x===a.x&&s.y===a.y)return}else if("resize"===t.type){if(a.x<0)return
if(r.Utils.updateScrollResize(t,e,o),a.w=Math.round((i.size.width-d)/n),a.h=Math.round((i.size.height-c)/o),s.w===a.w&&s.h===a.h)return
if(s._lastTried&&s._lastTried.w===a.w&&s._lastTried.h===a.h)return
let h=i.position.left+d,g=i.position.top+c
a.x=Math.round(h/n),a.y=Math.round(g/o),l=!0}s._event=t,s._lastTried=a
let m={x:i.position.left+d,y:i.position.top+c,w:(i.size?i.size.width:s.w*n)-d-h,h:(i.size?i.size.height:s.h*o)-c-g}
if(this.engine.moveNodeCheck(s,Object.assign(Object.assign({},a),{cellWidth:n,cellHeight:o,rect:m,resizing:l}))){s._lastUiPosition=i.position,this.engine.cacheRects(n,o,c,h,g,d),delete s._skipDown,l&&s.subGrid&&s.subGrid.onParentResize(),this._extraDragRow=0,this._updateContainerHeight()
let e=t.target
this._writePosAttr(e,s),this._gsEventHandler[t.type]&&this._gsEventHandler[t.type](t,e)}}_leave(e,t){let i=e.gridstackNode
i&&(c.off(e,"drag"),i._temporaryRemoved||(i._temporaryRemoved=!0,this.engine.removeNode(i),i.el=i._isExternal&&t?t:e,!0===this.opts.removable&&this._itemRemoving(e,!0),e._gridstackNodeOrig?(e.gridstackNode=e._gridstackNodeOrig,delete e._gridstackNodeOrig):i._isExternal&&(delete i.el,delete e.gridstackNode,this.engine.restoreInitial())))}commit(){return r.obsolete(this,this.batchUpdate(!1),"commit","batchUpdate","5.2"),this}}t.GridStack=g,g.Utils=r.Utils,g.Engine=o.GridStackEngine,g.GDRev="7.2.2"},664:(e,t)=>{"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t.dragInDefaultOptions=t.gridDefaults=void 0,t.gridDefaults={alwaysShowResizeHandle:"mobile",animate:!0,auto:!0,cellHeight:"auto",cellHeightThrottle:100,cellHeightUnit:"px",column:12,draggable:{handle:".grid-stack-item-content",appendTo:"body"},handle:".grid-stack-item-content",itemClass:"grid-stack-item",margin:10,marginUnit:"px",maxRow:0,minRow:0,oneColumnSize:768,placeholderClass:"grid-stack-placeholder",placeholderText:"",removableOptions:{accept:".grid-stack-item"},resizable:{handles:"se"},rtl:"auto"},t.dragInDefaultOptions={handle:".grid-stack-item-content",appendTo:"body"}},263:(e,t)=>{"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t.Utils=t.obsoleteAttr=t.obsoleteOptsDel=t.obsoleteOpts=t.obsolete=void 0,t.obsolete=function(e,t,i,s,n){let o=function(){console.warn("gridstack.js: Function `"+i+"` is deprecated in "+n+" and has been replaced with `"+s+"`. It will be **removed** in a future release")
for(var o=arguments.length,r=new Array(o),l=0;l<o;l++)r[l]=arguments[l]
return t.apply(e,r)}
return o.prototype=t.prototype,o},t.obsoleteOpts=function(e,t,i,s){void 0!==e[t]&&(e[i]=e[t],console.warn("gridstack.js: Option `"+t+"` is deprecated in "+s+" and has been replaced with `"+i+"`. It will be **removed** in a future release"))},t.obsoleteOptsDel=function(e,t,i,s){void 0!==e[t]&&console.warn("gridstack.js: Option `"+t+"` is deprecated in "+i+s)},t.obsoleteAttr=function(e,t,i,s){let n=e.getAttribute(t)
null!==n&&(e.setAttribute(i,n),console.warn("gridstack.js: attribute `"+t+"`="+n+" is deprecated on this object in "+s+" and has been replaced with `"+i+"`. It will be **removed** in a future release"))}
class i{static getElements(e){if("string"==typeof e){let t=document.querySelectorAll(e)
return t.length||"."===e[0]||"#"===e[0]||(t=document.querySelectorAll("."+e),t.length||(t=document.querySelectorAll("#"+e))),Array.from(t)}return[e]}static getElement(e){if("string"==typeof e){if(!e.length)return null
if("#"===e[0])return document.getElementById(e.substring(1))
if("."===e[0]||"["===e[0])return document.querySelector(e)
if(!isNaN(+e[0]))return document.getElementById(e)
let t=document.querySelector(e)
return t||(t=document.getElementById(e)),t||(t=document.querySelector("."+e)),t}return e}static isIntercepted(e,t){return!(e.y>=t.y+t.h||e.y+e.h<=t.y||e.x+e.w<=t.x||e.x>=t.x+t.w)}static isTouching(e,t){return i.isIntercepted(e,{x:t.x-.5,y:t.y-.5,w:t.w+1,h:t.h+1})}static areaIntercept(e,t){let i=e.x>t.x?e.x:t.x,s=e.x+e.w<t.x+t.w?e.x+e.w:t.x+t.w
if(s<=i)return 0
let n=e.y>t.y?e.y:t.y,o=e.y+e.h<t.y+t.h?e.y+e.h:t.y+t.h
return o<=n?0:(s-i)*(o-n)}static area(e){return e.w*e.h}static sort(e,t,i){return i=i||e.reduce(((e,t)=>Math.max(t.x+t.w,e)),0)||12,-1===t?e.sort(((e,t)=>t.x+t.y*i-(e.x+e.y*i))):e.sort(((e,t)=>e.x+e.y*i-(t.x+t.y*i)))}static createStylesheet(e,t){let i=document.createElement("style")
return i.setAttribute("type","text/css"),i.setAttribute("gs-style-id",e),i.styleSheet?i.styleSheet.cssText="":i.appendChild(document.createTextNode("")),t?t.insertBefore(i,t.firstChild):(t=document.getElementsByTagName("head")[0]).appendChild(i),i.sheet}static removeStylesheet(e){let t=document.querySelector("STYLE[gs-style-id="+e+"]")
t&&t.parentNode&&t.remove()}static addCSSRule(e,t,i){"function"==typeof e.addRule?e.addRule(t,i):"function"==typeof e.insertRule&&e.insertRule(`${t}{${i}}`)}static toBool(e){return"boolean"==typeof e?e:"string"==typeof e?!(""===(e=e.toLowerCase())||"no"===e||"false"===e||"0"===e):Boolean(e)}static toNumber(e){return null===e||0===e.length?void 0:Number(e)}static parseHeight(e){let t,i="px"
if("string"==typeof e){let s=e.match(/^(-[0-9]+\.[0-9]+|[0-9]*\.[0-9]+|-[0-9]+|[0-9]+)(px|em|rem|vh|vw|%)?$/)
if(!s)throw new Error("Invalid height")
i=s[2]||"px",t=parseFloat(s[1])}else t=e
return{h:t,unit:i}}static defaults(e){for(var t=arguments.length,i=new Array(t>1?t-1:0),s=1;s<t;s++)i[s-1]=arguments[s]
return i.forEach((t=>{for(const i in t){if(!t.hasOwnProperty(i))return
null===e[i]||void 0===e[i]?e[i]=t[i]:"object"==typeof t[i]&&"object"==typeof e[i]&&this.defaults(e[i],t[i])}})),e}static same(e,t){if("object"!=typeof e)return e==t
if(typeof e!=typeof t)return!1
if(Object.keys(e).length!==Object.keys(t).length)return!1
for(const i in e)if(e[i]!==t[i])return!1
return!0}static copyPos(e,t){let i=arguments.length>2&&void 0!==arguments[2]&&arguments[2]
return e.x=t.x,e.y=t.y,e.w=t.w,e.h=t.h,i&&(t.minW&&(e.minW=t.minW),t.minH&&(e.minH=t.minH),t.maxW&&(e.maxW=t.maxW),t.maxH&&(e.maxH=t.maxH)),e}static samePos(e,t){return e&&t&&e.x===t.x&&e.y===t.y&&e.w===t.w&&e.h===t.h}static removeInternalAndSame(e,t){if("object"==typeof e&&"object"==typeof t)for(let i in e){let s=e[i]
if("_"===i[0]||s===t[i])delete e[i]
else if(s&&"object"==typeof s&&void 0!==t[i]){for(let e in s)s[e]!==t[i][e]&&"_"!==e[0]||delete s[e]
Object.keys(s).length||delete e[i]}}}static removeInternalForSave(e){let t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1]
for(let i in e)"_"!==i[0]&&null!==e[i]&&void 0!==e[i]||delete e[i]
delete e.grid,t&&delete e.el,e.autoPosition||delete e.autoPosition,e.noResize||delete e.noResize,e.noMove||delete e.noMove,e.locked||delete e.locked,1!==e.w&&e.w!==e.minW||delete e.w,1!==e.h&&e.h!==e.minH||delete e.h}static closestUpByClass(e,t){for(;e;){if(e.classList.contains(t))return e
e=e.parentElement}return null}static throttle(e,t){let i=!1
return function(){for(var s=arguments.length,n=new Array(s),o=0;o<s;o++)n[o]=arguments[o]
i||(i=!0,setTimeout((()=>{e(...n),i=!1}),t))}}static removePositioningStyles(e){let t=e.style
t.position&&t.removeProperty("position"),t.left&&t.removeProperty("left"),t.top&&t.removeProperty("top"),t.width&&t.removeProperty("width"),t.height&&t.removeProperty("height")}static getScrollElement(e){if(!e)return document.scrollingElement||document.documentElement
const t=getComputedStyle(e)
return/(auto|scroll)/.test(t.overflow+t.overflowY)?e:this.getScrollElement(e.parentElement)}static updateScrollPosition(e,t,i){let s=e.getBoundingClientRect(),n=window.innerHeight||document.documentElement.clientHeight
if(s.top<0||s.bottom>n){let o=s.bottom-n,r=s.top,l=this.getScrollElement(e)
if(null!==l){let a=l.scrollTop
s.top<0&&i<0?e.offsetHeight>n?l.scrollTop+=i:l.scrollTop+=Math.abs(r)>Math.abs(i)?i:r:i>0&&(e.offsetHeight>n?l.scrollTop+=i:l.scrollTop+=o>i?i:o),t.top+=l.scrollTop-a}}}static updateScrollResize(e,t,i){const s=this.getScrollElement(t),n=s.clientHeight,o=s===this.getScrollElement()?0:s.getBoundingClientRect().top,r=e.clientY-o,l=r>n-i
r<i?s.scrollBy({behavior:"smooth",top:r-i}):l&&s.scrollBy({behavior:"smooth",top:i-(n-r)})}static clone(e){return null==e||"object"!=typeof e?e:e instanceof Array?[...e]:Object.assign({},e)}static cloneDeep(e){const t=["parentGrid","el","grid","subGrid","engine"],s=i.clone(e)
for(const n in s)s.hasOwnProperty(n)&&"object"==typeof s[n]&&"__"!==n.substring(0,2)&&!t.find((e=>e===n))&&(s[n]=i.cloneDeep(e[n]))
return s}static cloneNode(e){const t=e.cloneNode(!0)
return t.removeAttribute("id"),t}static appendTo(e,t){let i
i="string"==typeof t?document.querySelector(t):t,i&&i.appendChild(e)}static addElStyles(e,t){if(t instanceof Object)for(const i in t)t.hasOwnProperty(i)&&(Array.isArray(t[i])?t[i].forEach((t=>{e.style[i]=t})):e.style[i]=t[i])}static initEvent(e,t){const i={type:t.type},s={button:0,which:0,buttons:1,bubbles:!0,cancelable:!0,target:t.target?t.target:e.target}
return e.dataTransfer&&(i.dataTransfer=e.dataTransfer),["altKey","ctrlKey","metaKey","shiftKey"].forEach((t=>i[t]=e[t])),["pageX","pageY","clientX","clientY","screenX","screenY"].forEach((t=>i[t]=e[t])),Object.assign(Object.assign({},i),s)}static simulateMouseEvent(e,t,i){const s=document.createEvent("MouseEvents")
s.initMouseEvent(t,!0,!0,window,1,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,0,e.target),(i||e.target).dispatchEvent(s)}}t.Utils=i},428:(e,t,i)=>{"use strict"
var s=i(134)
function n(){}function o(){}o.resetWarningCache=n,e.exports=function(){function e(e,t,i,n,o,r){if(r!==s){var l=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types")
throw l.name="Invariant Violation",l}}function t(){return e}e.isRequired=e
var i={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:o,resetWarningCache:n}
return i.PropTypes=i,i}},526:(e,t,i)=>{e.exports=i(428)()},134:e=>{"use strict"
e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},404:e=>{var t={exports:{}}
function i(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw new Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw new Error("set is read-only")}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach((function(t){var s=e[t]
"object"!=typeof s||Object.isFrozen(s)||i(s)})),e}t.exports=i,t.exports.default=i
var s=t.exports
class n{constructor(e){void 0===e.data&&(e.data={}),this.data=e.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function o(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function r(e){const t=Object.create(null)
for(const o in e)t[o]=e[o]
for(var i=arguments.length,s=new Array(i>1?i-1:0),n=1;n<i;n++)s[n-1]=arguments[n]
return s.forEach((function(e){for(const i in e)t[i]=e[i]})),t}const l=e=>!!e.kind
class a{constructor(e,t){this.buffer="",this.classPrefix=t.classPrefix,e.walk(this)}addText(e){this.buffer+=o(e)}openNode(e){if(!l(e))return
let t=e.kind
t=e.sublanguage?`language-${t}`:((e,t)=>{let{prefix:i}=t
if(e.includes(".")){const t=e.split(".")
return[`${i}${t.shift()}`,...t.map(((e,t)=>`${e}${"_".repeat(t+1)}`))].join(" ")}return`${i}${e}`})(t,{prefix:this.classPrefix}),this.span(t)}closeNode(e){l(e)&&(this.buffer+="</span>")}value(){return this.buffer}span(e){this.buffer+=`<span class="${e}">`}}class d{constructor(){this.rootNode={children:[]},this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(e){this.top.children.push(e)}openNode(e){const t={kind:e,children:[]}
this.add(t),this.stack.push(t)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(e){return this.constructor._walk(e,this.rootNode)}static _walk(e,t){return"string"==typeof t?e.addText(t):t.children&&(e.openNode(t),t.children.forEach((t=>this._walk(e,t))),e.closeNode(t)),e}static _collapse(e){"string"!=typeof e&&e.children&&(e.children.every((e=>"string"==typeof e))?e.children=[e.children.join("")]:e.children.forEach((e=>{d._collapse(e)})))}}class h extends d{constructor(e){super(),this.options=e}addKeyword(e,t){""!==e&&(this.openNode(t),this.addText(e),this.closeNode())}addText(e){""!==e&&this.add(e)}addSublanguage(e,t){const i=e.root
i.kind=t,i.sublanguage=!0,this.add(i)}toHTML(){return new a(this,this.options).value()}finalize(){return!0}}function c(e){return e?"string"==typeof e?e:e.source:null}function g(e){return m("(?=",e,")")}function u(e){return m("(?:",e,")*")}function p(e){return m("(?:",e,")?")}function m(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i]
return t.map((e=>c(e))).join("")}function f(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i]
const s=function(e){const t=e[e.length-1]
return"object"==typeof t&&t.constructor===Object?(e.splice(e.length-1,1),t):{}}(t)
return"("+(s.capture?"":"?:")+t.map((e=>c(e))).join("|")+")"}function v(e){return new RegExp(e.toString()+"|").exec("").length-1}const b=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./
function _(e,t){let{joinWith:i}=t,s=0
return e.map((e=>{s+=1
const t=s
let i=c(e),n=""
for(;i.length>0;){const e=b.exec(i)
if(!e){n+=i
break}n+=i.substring(0,e.index),i=i.substring(e.index+e[0].length),"\\"===e[0][0]&&e[1]?n+="\\"+String(Number(e[1])+t):(n+=e[0],"("===e[0]&&s++)}return n})).map((e=>`(${e})`)).join(i)}const y="[a-zA-Z]\\w*",w="[a-zA-Z_]\\w*",E="\\b\\d+(\\.\\d+)?",x="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",D="\\b(0b[01]+)",R={begin:"\\\\[\\s\\S]",relevance:0},M={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[R]},N={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[R]},S=function(e,t){const i=r({scope:"comment",begin:e,end:t,contains:[]},arguments.length>2&&void 0!==arguments[2]?arguments[2]:{})
i.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0})
const s=f("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/)
return i.contains.push({begin:m(/[ ]+/,"(",s,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),i},k=S("//","$"),O=S("/\\*","\\*/"),C=S("#","$"),H={scope:"number",begin:E,relevance:0},U={scope:"number",begin:x,relevance:0},L={scope:"number",begin:D,relevance:0},A={begin:/(?=\/[^/\n]*\/)/,contains:[{scope:"regexp",begin:/\//,end:/\/[gimuy]*/,illegal:/\n/,contains:[R,{begin:/\[/,end:/\]/,relevance:0,contains:[R]}]}]},T={scope:"title",begin:y,relevance:0},z={scope:"title",begin:w,relevance:0},P={begin:"\\.\\s*"+w,relevance:0}
var I=Object.freeze({__proto__:null,MATCH_NOTHING_RE:/\b\B/,IDENT_RE:y,UNDERSCORE_IDENT_RE:w,NUMBER_RE:E,C_NUMBER_RE:x,BINARY_NUMBER_RE:D,RE_STARTERS_RE:"!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",SHEBANG:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}
const t=/^#![ ]*\//
return e.binary&&(e.begin=m(t,/.*\b/,e.binary,/\b.*/)),r({scope:"meta",begin:t,end:/$/,relevance:0,"on:begin":(e,t)=>{0!==e.index&&t.ignoreMatch()}},e)},BACKSLASH_ESCAPE:R,APOS_STRING_MODE:M,QUOTE_STRING_MODE:N,PHRASAL_WORDS_MODE:{begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},COMMENT:S,C_LINE_COMMENT_MODE:k,C_BLOCK_COMMENT_MODE:O,HASH_COMMENT_MODE:C,NUMBER_MODE:H,C_NUMBER_MODE:U,BINARY_NUMBER_MODE:L,REGEXP_MODE:A,TITLE_MODE:T,UNDERSCORE_TITLE_MODE:z,METHOD_GUARD:P,END_SAME_AS_BEGIN:function(e){return Object.assign(e,{"on:begin":(e,t)=>{t.data._beginMatch=e[1]},"on:end":(e,t)=>{t.data._beginMatch!==e[1]&&t.ignoreMatch()}})}})
function j(e,t){"."===e.input[e.index-1]&&t.ignoreMatch()}function B(e,t){void 0!==e.className&&(e.scope=e.className,delete e.className)}function G(e,t){t&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=j,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,void 0===e.relevance&&(e.relevance=0))}function W(e,t){Array.isArray(e.illegal)&&(e.illegal=f(...e.illegal))}function $(e,t){if(e.match){if(e.begin||e.end)throw new Error("begin & end are not supported with match")
e.begin=e.match,delete e.match}}function F(e,t){void 0===e.relevance&&(e.relevance=1)}const q=(e,t)=>{if(!e.beforeMatch)return
if(e.starts)throw new Error("beforeMatch cannot be used with starts")
const i=Object.assign({},e)
Object.keys(e).forEach((t=>{delete e[t]})),e.keywords=i.keywords,e.begin=m(i.beforeMatch,g(i.begin)),e.starts={relevance:0,contains:[Object.assign(i,{endsParent:!0})]},e.relevance=0,delete i.beforeMatch},X=["of","and","for","in","not","or","if","then","parent","list","value"],Y="keyword"
function K(e,t){let i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Y
const s=Object.create(null)
return"string"==typeof e?n(i,e.split(" ")):Array.isArray(e)?n(i,e):Object.keys(e).forEach((function(i){Object.assign(s,K(e[i],t,i))})),s
function n(e,i){t&&(i=i.map((e=>e.toLowerCase()))),i.forEach((function(t){const i=t.split("|")
s[i[0]]=[e,V(i[0],i[1])]}))}}function V(e,t){return t?Number(t):function(e){return X.includes(e.toLowerCase())}(e)?0:1}const Z={},J=e=>{console.error(e)},Q=function(e){for(var t=arguments.length,i=new Array(t>1?t-1:0),s=1;s<t;s++)i[s-1]=arguments[s]
console.log(`WARN: ${e}`,...i)},ee=(e,t)=>{Z[`${e}/${t}`]||(console.log(`Deprecated as of ${e}. ${t}`),Z[`${e}/${t}`]=!0)},te=new Error
function ie(e,t,i){let{key:s}=i,n=0
const o=e[s],r={},l={}
for(let a=1;a<=t.length;a++)l[a+n]=o[a],r[a+n]=!0,n+=v(t[a-1])
e[s]=l,e[s]._emit=r,e[s]._multi=!0}function se(e){!function(e){e.scope&&"object"==typeof e.scope&&null!==e.scope&&(e.beginScope=e.scope,delete e.scope)}(e),"string"==typeof e.beginScope&&(e.beginScope={_wrap:e.beginScope}),"string"==typeof e.endScope&&(e.endScope={_wrap:e.endScope}),function(e){if(Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw J("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),te
if("object"!=typeof e.beginScope||null===e.beginScope)throw J("beginScope must be object"),te
ie(e,e.begin,{key:"beginScope"}),e.begin=_(e.begin,{joinWith:""})}}(e),function(e){if(Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw J("skip, excludeEnd, returnEnd not compatible with endScope: {}"),te
if("object"!=typeof e.endScope||null===e.endScope)throw J("endScope must be object"),te
ie(e,e.end,{key:"endScope"}),e.end=_(e.end,{joinWith:""})}}(e)}function ne(e){function t(t,i){return new RegExp(c(t),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(i?"g":""))}class i{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(e,t){t.position=this.position++,this.matchIndexes[this.matchAt]=t,this.regexes.push([t,e]),this.matchAt+=v(e)+1}compile(){0===this.regexes.length&&(this.exec=()=>null)
const e=this.regexes.map((e=>e[1]))
this.matcherRe=t(_(e,{joinWith:"|"}),!0),this.lastIndex=0}exec(e){this.matcherRe.lastIndex=this.lastIndex
const t=this.matcherRe.exec(e)
if(!t)return null
const i=t.findIndex(((e,t)=>t>0&&void 0!==e)),s=this.matchIndexes[i]
return t.splice(0,i),Object.assign(t,s)}}class s{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(e){if(this.multiRegexes[e])return this.multiRegexes[e]
const t=new i
return this.rules.slice(e).forEach((e=>{let[i,s]=e
return t.addRule(i,s)})),t.compile(),this.multiRegexes[e]=t,t}resumingScanAtSamePosition(){return 0!==this.regexIndex}considerAll(){this.regexIndex=0}addRule(e,t){this.rules.push([e,t]),"begin"===t.type&&this.count++}exec(e){const t=this.getMatcher(this.regexIndex)
t.lastIndex=this.lastIndex
let i=t.exec(e)
if(this.resumingScanAtSamePosition())if(i&&i.index===this.lastIndex);else{const t=this.getMatcher(0)
t.lastIndex=this.lastIndex+1,i=t.exec(e)}return i&&(this.regexIndex+=i.position+1,this.regexIndex===this.count&&this.considerAll()),i}}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.")
return e.classNameAliases=r(e.classNameAliases||{}),function i(n,o){const l=n
if(n.isCompiled)return l;[B,$,se,q].forEach((e=>e(n,o))),e.compilerExtensions.forEach((e=>e(n,o))),n.__beforeBegin=null,[G,W,F].forEach((e=>e(n,o))),n.isCompiled=!0
let a=null
return"object"==typeof n.keywords&&n.keywords.$pattern&&(n.keywords=Object.assign({},n.keywords),a=n.keywords.$pattern,delete n.keywords.$pattern),a=a||/\w+/,n.keywords&&(n.keywords=K(n.keywords,e.case_insensitive)),l.keywordPatternRe=t(a,!0),o&&(n.begin||(n.begin=/\B|\b/),l.beginRe=t(l.begin),n.end||n.endsWithParent||(n.end=/\B|\b/),n.end&&(l.endRe=t(l.end)),l.terminatorEnd=c(l.end)||"",n.endsWithParent&&o.terminatorEnd&&(l.terminatorEnd+=(n.end?"|":"")+o.terminatorEnd)),n.illegal&&(l.illegalRe=t(n.illegal)),n.contains||(n.contains=[]),n.contains=[].concat(...n.contains.map((function(e){return function(e){return e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map((function(t){return r(e,{variants:null},t)}))),e.cachedVariants?e.cachedVariants:oe(e)?r(e,{starts:e.starts?r(e.starts):null}):Object.isFrozen(e)?r(e):e}("self"===e?n:e)}))),n.contains.forEach((function(e){i(e,l)})),n.starts&&i(n.starts,o),l.matcher=function(e){const t=new s
return e.contains.forEach((e=>t.addRule(e.begin,{rule:e,type:"begin"}))),e.terminatorEnd&&t.addRule(e.terminatorEnd,{type:"end"}),e.illegal&&t.addRule(e.illegal,{type:"illegal"}),t}(l),l}(e)}function oe(e){return!!e&&(e.endsWithParent||oe(e.starts))}class re extends Error{constructor(e,t){super(e),this.name="HTMLInjectionError",this.html=t}}const le=o,ae=r,de=Symbol("nomatch")
var he=function(e){const t=Object.create(null),i=Object.create(null),o=[]
let r=!0
const l="Could not find the language '{}', did you forget to load/include a language module?",a={disableAutodetect:!0,name:"Plain text",contains:[]}
let d={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:h}
function c(e){return d.noHighlightRe.test(e)}function v(e,t,i){let s="",n=""
"object"==typeof t?(s=e,i=t.ignoreIllegals,n=t.language):(ee("10.7.0","highlight(lang, code, ...args) has been deprecated."),ee("10.7.0","Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"),n=e,s=t),void 0===i&&(i=!0)
const o={code:s,language:n}
M("before:highlight",o)
const r=o.result?o.result:b(o.language,o.code,i)
return r.code=o.code,M("after:highlight",r),r}function b(e,i,s,o){const a=Object.create(null)
function h(){if(!D.keywords)return void M.addText(N)
let e=0
D.keywordPatternRe.lastIndex=0
let t=D.keywordPatternRe.exec(N),i=""
for(;t;){i+=N.substring(e,t.index)
const n=y.case_insensitive?t[0].toLowerCase():t[0],o=(s=n,D.keywords[s])
if(o){const[e,s]=o
if(M.addText(i),i="",a[n]=(a[n]||0)+1,a[n]<=7&&(S+=s),e.startsWith("_"))i+=t[0]
else{const i=y.classNameAliases[e]||e
M.addKeyword(t[0],i)}}else i+=t[0]
e=D.keywordPatternRe.lastIndex,t=D.keywordPatternRe.exec(N)}var s
i+=N.substr(e),M.addText(i)}function c(){null!=D.subLanguage?function(){if(""===N)return
let e=null
if("string"==typeof D.subLanguage){if(!t[D.subLanguage])return void M.addText(N)
e=b(D.subLanguage,N,!0,R[D.subLanguage]),R[D.subLanguage]=e._top}else e=_(N,D.subLanguage.length?D.subLanguage:null)
D.relevance>0&&(S+=e.relevance),M.addSublanguage(e._emitter,e.language)}():h(),N=""}function g(e,t){let i=1
for(;void 0!==t[i];){if(!e._emit[i]){i++
continue}const s=y.classNameAliases[e[i]]||e[i],n=t[i]
s?M.addKeyword(n,s):(N=n,h(),N=""),i++}}function u(e,t){return e.scope&&"string"==typeof e.scope&&M.openNode(y.classNameAliases[e.scope]||e.scope),e.beginScope&&(e.beginScope._wrap?(M.addKeyword(N,y.classNameAliases[e.beginScope._wrap]||e.beginScope._wrap),N=""):e.beginScope._multi&&(g(e.beginScope,t),N="")),D=Object.create(e,{parent:{value:D}}),D}function p(e,t,i){let s=function(e,t){const i=e&&e.exec(t)
return i&&0===i.index}(e.endRe,i)
if(s){if(e["on:end"]){const i=new n(e)
e["on:end"](t,i),i.isMatchIgnored&&(s=!1)}if(s){for(;e.endsParent&&e.parent;)e=e.parent
return e}}if(e.endsWithParent)return p(e.parent,t,i)}function m(e){return 0===D.matcher.regexIndex?(N+=e[0],1):(C=!0,0)}let f={}
function v(t,o){const l=o&&o[0]
if(N+=t,null==l)return c(),0
if("begin"===f.type&&"end"===o.type&&f.index===o.index&&""===l){if(N+=i.slice(o.index,o.index+1),!r){const t=new Error(`0 width match regex (${e})`)
throw t.languageName=e,t.badRule=f.rule,t}return 1}if(f=o,"begin"===o.type)return function(e){const t=e[0],i=e.rule,s=new n(i),o=[i.__beforeBegin,i["on:begin"]]
for(const n of o)if(n&&(n(e,s),s.isMatchIgnored))return m(t)
return i.skip?N+=t:(i.excludeBegin&&(N+=t),c(),i.returnBegin||i.excludeBegin||(N=t)),u(i,e),i.returnBegin?0:t.length}(o)
if("illegal"===o.type&&!s){const e=new Error('Illegal lexeme "'+l+'" for mode "'+(D.scope||"<unnamed>")+'"')
throw e.mode=D,e}if("end"===o.type){const e=function(e){const t=e[0],s=i.substr(e.index),n=p(D,e,s)
if(!n)return de
const o=D
D.endScope&&D.endScope._wrap?(c(),M.addKeyword(t,D.endScope._wrap)):D.endScope&&D.endScope._multi?(c(),g(D.endScope,e)):o.skip?N+=t:(o.returnEnd||o.excludeEnd||(N+=t),c(),o.excludeEnd&&(N=t))
do{D.scope&&M.closeNode(),D.skip||D.subLanguage||(S+=D.relevance),D=D.parent}while(D!==n.parent)
return n.starts&&u(n.starts,e),o.returnEnd?0:t.length}(o)
if(e!==de)return e}if("illegal"===o.type&&""===l)return 1
if(O>1e5&&O>3*o.index)throw new Error("potential infinite loop, way more iterations than matches")
return N+=l,l.length}const y=x(e)
if(!y)throw J(l.replace("{}",e)),new Error('Unknown language: "'+e+'"')
const w=ne(y)
let E="",D=o||w
const R={},M=new d.__emitter(d)
!function(){const e=[]
for(let t=D;t!==y;t=t.parent)t.scope&&e.unshift(t.scope)
e.forEach((e=>M.openNode(e)))}()
let N="",S=0,k=0,O=0,C=!1
try{for(D.matcher.considerAll();;){O++,C?C=!1:D.matcher.considerAll(),D.matcher.lastIndex=k
const e=D.matcher.exec(i)
if(!e)break
const t=v(i.substring(k,e.index),e)
k=e.index+t}return v(i.substr(k)),M.closeAllNodes(),M.finalize(),E=M.toHTML(),{language:e,value:E,relevance:S,illegal:!1,_emitter:M,_top:D}}catch(t){if(t.message&&t.message.includes("Illegal"))return{language:e,value:le(i),illegal:!0,relevance:0,_illegalBy:{message:t.message,index:k,context:i.slice(k-100,k+100),mode:t.mode,resultSoFar:E},_emitter:M}
if(r)return{language:e,value:le(i),illegal:!1,relevance:0,errorRaised:t,_emitter:M,_top:D}
throw t}}function _(e,i){i=i||d.languages||Object.keys(t)
const s=function(e){const t={value:le(e),illegal:!1,relevance:0,_top:a,_emitter:new d.__emitter(d)}
return t._emitter.addText(e),t}(e),n=i.filter(x).filter(R).map((t=>b(t,e,!1)))
n.unshift(s)
const o=n.sort(((e,t)=>{if(e.relevance!==t.relevance)return t.relevance-e.relevance
if(e.language&&t.language){if(x(e.language).supersetOf===t.language)return 1
if(x(t.language).supersetOf===e.language)return-1}return 0})),[r,l]=o,h=r
return h.secondBest=l,h}function y(e){let t=null
const s=function(e){let t=e.className+" "
t+=e.parentNode?e.parentNode.className:""
const i=d.languageDetectRe.exec(t)
if(i){const t=x(i[1])
return t||(Q(l.replace("{}",i[1])),Q("Falling back to no-highlight mode for this block.",e)),t?i[1]:"no-highlight"}return t.split(/\s+/).find((e=>c(e)||x(e)))}(e)
if(c(s))return
if(M("before:highlightElement",{el:e,language:s}),e.children.length>0&&(d.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/issues/2886"),console.warn(e)),d.throwUnescapedHTML))throw new re("One of your code blocks includes unescaped HTML.",e.innerHTML)
t=e
const n=t.textContent,o=s?v(n,{language:s,ignoreIllegals:!0}):_(n)
e.innerHTML=o.value,function(e,t,s){const n=t&&i[t]||s
e.classList.add("hljs"),e.classList.add(`language-${n}`)}(e,s,o.language),e.result={language:o.language,re:o.relevance,relevance:o.relevance},o.secondBest&&(e.secondBest={language:o.secondBest.language,relevance:o.secondBest.relevance}),M("after:highlightElement",{el:e,result:o,text:n})}let w=!1
function E(){"loading"!==document.readyState?document.querySelectorAll(d.cssSelector).forEach(y):w=!0}function x(e){return e=(e||"").toLowerCase(),t[e]||t[i[e]]}function D(e,t){let{languageName:s}=t
"string"==typeof e&&(e=[e]),e.forEach((e=>{i[e.toLowerCase()]=s}))}function R(e){const t=x(e)
return t&&!t.disableAutodetect}function M(e,t){const i=e
o.forEach((function(e){e[i]&&e[i](t)}))}"undefined"!=typeof window&&window.addEventListener&&window.addEventListener("DOMContentLoaded",(function(){w&&E()}),!1),Object.assign(e,{highlight:v,highlightAuto:_,highlightAll:E,highlightElement:y,highlightBlock:function(e){return ee("10.7.0","highlightBlock will be removed entirely in v12.0"),ee("10.7.0","Please use highlightElement now."),y(e)},configure:function(e){d=ae(d,e)},initHighlighting:()=>{E(),ee("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")},initHighlightingOnLoad:function(){E(),ee("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")},registerLanguage:function(i,s){let n=null
try{n=s(e)}catch(e){if(J("Language definition for '{}' could not be registered.".replace("{}",i)),!r)throw e
J(e),n=a}n.name||(n.name=i),t[i]=n,n.rawDefinition=s.bind(null,e),n.aliases&&D(n.aliases,{languageName:i})},unregisterLanguage:function(e){delete t[e]
for(const t of Object.keys(i))i[t]===e&&delete i[t]},listLanguages:function(){return Object.keys(t)},getLanguage:x,registerAliases:D,autoDetection:R,inherit:ae,addPlugin:function(e){!function(e){e["before:highlightBlock"]&&!e["before:highlightElement"]&&(e["before:highlightElement"]=t=>{e["before:highlightBlock"](Object.assign({block:t.el},t))}),e["after:highlightBlock"]&&!e["after:highlightElement"]&&(e["after:highlightElement"]=t=>{e["after:highlightBlock"](Object.assign({block:t.el},t))})}(e),o.push(e)}}),e.debugMode=function(){r=!1},e.safeMode=function(){r=!0},e.versionString="11.3.1",e.regex={concat:m,lookahead:g,either:f,optional:p,anyNumberOfTimes:u}
for(const n in I)"object"==typeof I[n]&&s(I[n])
return Object.assign(e,I),e}({})
e.exports=he,he.HighlightJS=he,he.default=he},370:e=>{e.exports=function(e){const t=e.regex,i={$pattern:/[\w.\/]+/,built_in:["action","bindattr","collection","component","concat","debugger","each","each-in","get","hash","if","in","input","link-to","loc","log","lookup","mut","outlet","partial","query-params","render","template","textarea","unbound","unless","view","with","yield"]},s=/\[\]|\[[^\]]+\]/,n=/[^\s!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~]+/,o=t.either(/""|"[^"]+"/,/''|'[^']+'/,s,n),r=t.concat(t.optional(/\.|\.\/|\//),o,t.anyNumberOfTimes(t.concat(/(\.|\/)/,o))),l=t.concat("(",s,"|",n,")(?==)"),a={begin:r},d=e.inherit(a,{keywords:{$pattern:/[\w.\/]+/,literal:["true","false","undefined","null"]}}),h={begin:/\(/,end:/\)/},c={className:"attr",begin:l,relevance:0,starts:{begin:/=/,end:/=/,starts:{contains:[e.NUMBER_MODE,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,d,h]}}},g={contains:[e.NUMBER_MODE,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,{begin:/as\s+\|/,keywords:{keyword:"as"},end:/\|/,contains:[{begin:/\w+/}]},c,d,h],returnEnd:!0},u=e.inherit(a,{className:"name",keywords:i,starts:e.inherit(g,{end:/\)/})})
h.contains=[u]
const p=e.inherit(a,{keywords:i,className:"name",starts:e.inherit(g,{end:/\}\}/})}),m=e.inherit(a,{keywords:i,className:"name"}),f=e.inherit(a,{className:"name",keywords:i,starts:e.inherit(g,{end:/\}\}/})})
return{name:"Handlebars",aliases:["hbs","html.hbs","html.handlebars","htmlbars"],case_insensitive:!0,subLanguage:"xml",contains:[{begin:/\\\{\{/,skip:!0},{begin:/\\\\(?=\{\{)/,skip:!0},e.COMMENT(/\{\{!--/,/--\}\}/),e.COMMENT(/\{\{!/,/\}\}/),{className:"template-tag",begin:/\{\{\{\{(?!\/)/,end:/\}\}\}\}/,contains:[p],starts:{end:/\{\{\{\{\//,returnEnd:!0,subLanguage:"xml"}},{className:"template-tag",begin:/\{\{\{\{\//,end:/\}\}\}\}/,contains:[m]},{className:"template-tag",begin:/\{\{#/,end:/\}\}/,contains:[p]},{className:"template-tag",begin:/\{\{(?=else\}\})/,end:/\}\}/,keywords:"else"},{className:"template-tag",begin:/\{\{(?=else if)/,end:/\}\}/,keywords:"else if"},{className:"template-tag",begin:/\{\{\//,end:/\}\}/,contains:[m]},{className:"template-variable",begin:/\{\{\{/,end:/\}\}\}/,contains:[f]},{className:"template-variable",begin:/\{\{/,end:/\}\}/,contains:[f]}]}}}}])
