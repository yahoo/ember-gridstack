/*! For license information please see chunk.629.11307c793cedc387f43a.js.LICENSE.txt */
(globalThis.webpackChunk_ember_auto_import_=globalThis.webpackChunk_ember_auto_import_||[]).push([[629],{853:(e,t,i)=>{"use strict"
i.r(t),i.d(t,{default:()=>l,modifier:()=>d})
var s=i(294),n=i(377),o=i(130)
function r(e,t,i){return(t=function(e){var t=function(e){if("object"!=typeof e||!e)return e
var t=e[Symbol.toPrimitive]
if(void 0!==t){var i=t.call(e,"string")
if("object"!=typeof i)return i
throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e)
return"symbol"==typeof t?t:t+""}(t))in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}class a{constructor(e){r(this,"capabilities",(0,n.capabilities)("3.22")),this.owner=e}createModifier(e,t){return{instance:new e(this.owner,t),element:null}}installModifier(e,t,i){const s=function(e,t){const i=e
return i.element=t,i}(e,t)
s.instance.modify(t,i.positional,i.named)}updateModifier(e,t){e.instance.modify(e.element,t.positional,t.named)}destroyModifier({instance:e}){(0,o.destroy)(e)}}class l{constructor(e,t){(0,s.setOwner)(this,e)}modify(e,t,i){}}(0,n.setModifierManager)((e=>new a(e)),l)
const h=new class{constructor(){r(this,"capabilities",(0,n.capabilities)("3.22"))}createModifier(e){return{element:null,instance:e}}installModifier(e,t,i){const s=function(e,t){const i=e
return i.element=t,i}(e,t),{positional:n,named:o}=i,r=e.instance(t,n,o)
"function"==typeof r&&(s.teardown=r)}updateModifier(e,t){"function"==typeof e.teardown&&e.teardown()
const i=e.instance(e.element,t.positional,t.named)
"function"==typeof i&&(e.teardown=i)}destroyModifier(e){"function"==typeof e.teardown&&e.teardown()}getDebugName(e){return e.instance.toString()}getDebugInstance(e){return e}}
function d(e,t){return e.toString=()=>t?.name||e.name,(0,n.setModifierManager)((()=>h),e)}},459:(e,t,i)=>{"use strict"
function s(e,t,i,s,n){const o=(...o)=>(console.warn("gridstack.js: Function `"+i+"` is deprecated in "+n+" and has been replaced with `"+s+"`. It will be **removed** in a future release"),t.apply(e,o))
return o.prototype=t.prototype,o}function n(e,t,i,s){void 0!==e[t]&&(e[i]=e[t],console.warn("gridstack.js: Option `"+t+"` is deprecated in "+s+" and has been replaced with `"+i+"`. It will be **removed** in a future release"))}function o(e,t,i,s){void 0!==e[t]&&console.warn("gridstack.js: Option `"+t+"` is deprecated in "+i+s)}function r(e,t,i,s){const n=e.getAttribute(t)
null!==n&&(e.setAttribute(i,n),console.warn("gridstack.js: attribute `"+t+"`="+n+" is deprecated on this object in "+s+" and has been replaced with `"+i+"`. It will be **removed** in a future release"))}i.r(t),i.d(t,{DDGridStack:()=>N,GridStack:()=>D,GridStackEngine:()=>l,Utils:()=>a,gridDefaults:()=>h,obsolete:()=>s,obsoleteAttr:()=>r,obsoleteOpts:()=>n,obsoleteOptsDel:()=>o})
class a{static getElements(e,t=document){if("string"==typeof e){const i="getElementById"in t?t:void 0
if(i&&!isNaN(+e[0])){const t=i.getElementById(e)
return t?[t]:[]}let s=t.querySelectorAll(e)
return s.length||"."===e[0]||"#"===e[0]||(s=t.querySelectorAll("."+e),s.length||(s=t.querySelectorAll("#"+e))),Array.from(s)}return[e]}static getElement(e,t=document){if("string"==typeof e){const i="getElementById"in t?t:void 0
if(!e.length)return null
if(i&&"#"===e[0])return i.getElementById(e.substring(1))
if("#"===e[0]||"."===e[0]||"["===e[0])return t.querySelector(e)
if(i&&!isNaN(+e[0]))return i.getElementById(e)
let s=t.querySelector(e)
return i&&!s&&(s=i.getElementById(e)),s||(s=t.querySelector("."+e)),s}return e}static lazyLoad(e){return e.lazyLoad||e.grid?.opts?.lazyLoad&&!1!==e.lazyLoad}static createDiv(e,t){const i=document.createElement("div")
return e.forEach((e=>{e&&i.classList.add(e)})),t?.appendChild(i),i}static shouldSizeToContent(e,t=!1){return e?.grid&&(t?!0===e.sizeToContent||!0===e.grid.opts.sizeToContent&&void 0===e.sizeToContent:!!e.sizeToContent||e.grid.opts.sizeToContent&&!1!==e.sizeToContent)}static isIntercepted(e,t){return!(e.y>=t.y+t.h||e.y+e.h<=t.y||e.x+e.w<=t.x||e.x>=t.x+t.w)}static isTouching(e,t){return a.isIntercepted(e,{x:t.x-.5,y:t.y-.5,w:t.w+1,h:t.h+1})}static areaIntercept(e,t){const i=e.x>t.x?e.x:t.x,s=e.x+e.w<t.x+t.w?e.x+e.w:t.x+t.w
if(s<=i)return 0
const n=e.y>t.y?e.y:t.y,o=e.y+e.h<t.y+t.h?e.y+e.h:t.y+t.h
return o<=n?0:(s-i)*(o-n)}static area(e){return e.w*e.h}static sort(e,t=1){const i=1e4
return e.sort(((e,s)=>{const n=t*((e.y??i)-(s.y??i))
return 0===n?t*((e.x??i)-(s.x??i)):n}))}static find(e,t){return t?e.find((e=>e.id===t)):void 0}static toBool(e){return"boolean"==typeof e?e:"string"==typeof e?!(""===(e=e.toLowerCase())||"no"===e||"false"===e||"0"===e):Boolean(e)}static toNumber(e){return null===e||0===e.length?void 0:Number(e)}static parseHeight(e){let t,i="px"
if("string"==typeof e)if("auto"===e||""===e)t=0
else{const s=e.match(/^(-[0-9]+\.[0-9]+|[0-9]*\.[0-9]+|-[0-9]+|[0-9]+)(px|em|rem|vh|vw|%|cm|mm)?$/)
if(!s)throw new Error(`Invalid height val = ${e}`)
i=s[2]||"px",t=parseFloat(s[1])}else t=e
return{h:t,unit:i}}static defaults(e,...t){return t.forEach((t=>{for(const i in t){if(!t.hasOwnProperty(i))return
null===e[i]||void 0===e[i]?e[i]=t[i]:"object"==typeof t[i]&&"object"==typeof e[i]&&this.defaults(e[i],t[i])}})),e}static same(e,t){if("object"!=typeof e)return e==t
if(typeof e!=typeof t)return!1
if(Object.keys(e).length!==Object.keys(t).length)return!1
for(const i in e)if(e[i]!==t[i])return!1
return!0}static copyPos(e,t,i=!1){return void 0!==t.x&&(e.x=t.x),void 0!==t.y&&(e.y=t.y),void 0!==t.w&&(e.w=t.w),void 0!==t.h&&(e.h=t.h),i&&(t.minW&&(e.minW=t.minW),t.minH&&(e.minH=t.minH),t.maxW&&(e.maxW=t.maxW),t.maxH&&(e.maxH=t.maxH)),e}static samePos(e,t){return e&&t&&e.x===t.x&&e.y===t.y&&(e.w||1)===(t.w||1)&&(e.h||1)===(t.h||1)}static sanitizeMinMax(e){e.minW||delete e.minW,e.minH||delete e.minH,e.maxW||delete e.maxW,e.maxH||delete e.maxH}static removeInternalAndSame(e,t){if("object"==typeof e&&"object"==typeof t)for(let i in e){const s=e[i],n=t[i]
"_"===i[0]||s===n?delete e[i]:s&&"object"==typeof s&&void 0!==n&&(a.removeInternalAndSame(s,n),Object.keys(s).length||delete e[i])}}static removeInternalForSave(e,t=!0){for(let i in e)"_"!==i[0]&&null!==e[i]&&void 0!==e[i]||delete e[i]
delete e.grid,t&&delete e.el,e.autoPosition||delete e.autoPosition,e.noResize||delete e.noResize,e.noMove||delete e.noMove,e.locked||delete e.locked,1!==e.w&&e.w!==e.minW||delete e.w,1!==e.h&&e.h!==e.minH||delete e.h}static throttle(e,t){let i=!1
return(...s)=>{i||(i=!0,setTimeout((()=>{e(...s),i=!1}),t))}}static removePositioningStyles(e){const t=e.style
t.position&&t.removeProperty("position"),t.left&&t.removeProperty("left"),t.top&&t.removeProperty("top"),t.width&&t.removeProperty("width"),t.height&&t.removeProperty("height")}static getScrollElement(e){if(!e)return document.scrollingElement||document.documentElement
const t=getComputedStyle(e)
return/(auto|scroll)/.test(t.overflow+t.overflowY)?e:this.getScrollElement(e.parentElement)}static updateScrollPosition(e,t,i){const s=e.getBoundingClientRect(),n=window.innerHeight||document.documentElement.clientHeight
if(s.top<0||s.bottom>n){const o=s.bottom-n,r=s.top,a=this.getScrollElement(e)
if(null!==a){const l=a.scrollTop
s.top<0&&i<0?e.offsetHeight>n?a.scrollTop+=i:a.scrollTop+=Math.abs(r)>Math.abs(i)?i:r:i>0&&(e.offsetHeight>n?a.scrollTop+=i:a.scrollTop+=o>i?i:o),t.top+=a.scrollTop-l}}}static updateScrollResize(e,t,i){const s=this.getScrollElement(t),n=s.clientHeight,o=s===this.getScrollElement()?0:s.getBoundingClientRect().top,r=e.clientY-o,a=r>n-i
r<i?s.scrollBy({behavior:"smooth",top:r-i}):a&&s.scrollBy({behavior:"smooth",top:i-(n-r)})}static clone(e){return null==e||"object"!=typeof e?e:e instanceof Array?[...e]:{...e}}static cloneDeep(e){const t=["parentGrid","el","grid","subGrid","engine"],i=a.clone(e)
for(const s in i)i.hasOwnProperty(s)&&"object"==typeof i[s]&&"__"!==s.substring(0,2)&&!t.find((e=>e===s))&&(i[s]=a.cloneDeep(e[s]))
return i}static cloneNode(e){const t=e.cloneNode(!0)
return t.removeAttribute("id"),t}static appendTo(e,t){let i
i="string"==typeof t?a.getElement(t):t,i&&i.appendChild(e)}static addElStyles(e,t){if(t instanceof Object)for(const i in t)t.hasOwnProperty(i)&&(Array.isArray(t[i])?t[i].forEach((t=>{e.style[i]=t})):e.style[i]=t[i])}static initEvent(e,t){const i={type:t.type},s={button:0,which:0,buttons:1,bubbles:!0,cancelable:!0,target:t.target?t.target:e.target}
return["altKey","ctrlKey","metaKey","shiftKey"].forEach((t=>i[t]=e[t])),["pageX","pageY","clientX","clientY","screenX","screenY"].forEach((t=>i[t]=e[t])),{...i,...s}}static simulateMouseEvent(e,t,i){const s=e,n=new MouseEvent(t,{bubbles:!0,composed:!0,cancelable:!0,view:window,detail:1,screenX:e.screenX,screenY:e.screenY,clientX:e.clientX,clientY:e.clientY,ctrlKey:s.ctrlKey??!1,altKey:s.altKey??!1,shiftKey:s.shiftKey??!1,metaKey:s.metaKey??!1,button:0,relatedTarget:e.target});(i||e.target).dispatchEvent(n)}static getValuesFromTransformedElement(e){const t=document.createElement("div")
a.addElStyles(t,{opacity:"0",position:"fixed",top:"0px",left:"0px",width:"1px",height:"1px",zIndex:"-999999"}),e.appendChild(t)
const i=t.getBoundingClientRect()
return e.removeChild(t),t.remove(),{xScale:1/i.width,yScale:1/i.height,xOffset:i.left,yOffset:i.top}}static swap(e,t,i){if(!e)return
const s=e[t]
e[t]=e[i],e[i]=s}static canBeRotated(e){return!(!e||e.w===e.h||e.locked||e.noResize||e.grid?.opts.disableResize||e.minW&&e.minW===e.maxW||e.minH&&e.minH===e.maxH)}}class l{constructor(e={}){this.addedNodes=[],this.removedNodes=[],this.defaultColumn=12,this.column=e.column||this.defaultColumn,this.column>this.defaultColumn&&(this.defaultColumn=this.column),this.maxRow=e.maxRow,this._float=e.float,this.nodes=e.nodes||[],this.onChange=e.onChange}batchUpdate(e=!0,t=!0){return!!this.batchMode===e||(this.batchMode=e,e?(this._prevFloat=this._float,this._float=!0,this.cleanNodes(),this.saveInitial()):(this._float=this._prevFloat,delete this._prevFloat,t&&this._packNodes(),this._notify())),this}_useEntireRowArea(e,t){return(!this.float||this.batchMode&&!this._prevFloat)&&!this._hasLocked&&(!e._moving||e._skipDown||t.y<=e.y)}_fixCollisions(e,t=e,i,s={}){if(this.sortNodes(-1),!(i=i||this.collide(e,t)))return!1
if(e._moving&&!s.nested&&!this.float&&this.swap(e,i))return!0
let n=t
!this._loading&&this._useEntireRowArea(e,t)&&(n={x:0,w:this.column,y:t.y,h:t.h},i=this.collide(e,n,s.skip))
let o=!1
const r={nested:!0,pack:!1}
let l=0
for(;i=i||this.collide(e,n,s.skip);){if(l++>2*this.nodes.length)throw new Error("Infinite collide check")
let n
if(i.locked||this._loading||e._moving&&!e._skipDown&&t.y>e.y&&!this.float&&(!this.collide(i,{...i,y:e.y},e)||!this.collide(i,{...i,y:t.y-i.h},e))){e._skipDown=e._skipDown||t.y>e.y
const l={...t,y:i.y+i.h,...r}
n=!(!this._loading||!a.samePos(e,l))||this.moveNode(e,l),(i.locked||this._loading)&&n?a.copyPos(t,e):!i.locked&&n&&s.pack&&(this._packNodes(),t.y=i.y+i.h,a.copyPos(e,t)),o=o||n}else n=this.moveNode(i,{...i,y:t.y+t.h,skip:e,...r})
if(!n)return o
i=void 0}return o}collide(e,t=e,i){const s=e._id,n=i?._id
return this.nodes.find((e=>e._id!==s&&e._id!==n&&a.isIntercepted(e,t)))}collideAll(e,t=e,i){const s=e._id,n=i?._id
return this.nodes.filter((e=>e._id!==s&&e._id!==n&&a.isIntercepted(e,t)))}directionCollideCoverage(e,t,i){if(!t.rect||!e._rect)return
const s=e._rect,n={...t.rect}
let o
n.y>s.y?(n.h+=n.y-s.y,n.y=s.y):n.h+=s.y-n.y,n.x>s.x?(n.w+=n.x-s.x,n.x=s.x):n.w+=s.x-n.x
let r=.5
for(let a of i){if(a.locked||!a._rect)break
const e=a._rect
let t=Number.MAX_VALUE,i=Number.MAX_VALUE
s.y<e.y?t=(n.y+n.h-e.y)/e.h:s.y+s.h>e.y+e.h&&(t=(e.y+e.h-n.y)/e.h),s.x<e.x?i=(n.x+n.w-e.x)/e.w:s.x+s.w>e.x+e.w&&(i=(e.x+e.w-n.x)/e.w)
const l=Math.min(i,t)
l>r&&(r=l,o=a)}return t.collide=o,o}cacheRects(e,t,i,s,n,o){return this.nodes.forEach((r=>r._rect={y:r.y*t+i,x:r.x*e+o,w:r.w*e-o-s,h:r.h*t-i-n})),this}swap(e,t){if(!t||t.locked||!e||e.locked)return!1
function i(){const i=t.x,s=t.y
return t.x=e.x,t.y=e.y,e.h!=t.h?(e.x=i,e.y=t.y+t.h):e.w!=t.w?(e.x=t.x+t.w,e.y=s):(e.x=i,e.y=s),e._dirty=t._dirty=!0,!0}let s
if(e.w===t.w&&e.h===t.h&&(e.x===t.x||e.y===t.y)&&(s=a.isTouching(e,t)))return i()
if(!1!==s){if(e.w===t.w&&e.x===t.x&&(s||(s=a.isTouching(e,t)))){if(t.y<e.y){const i=e
e=t,t=i}return i()}if(!1!==s){if(e.h===t.h&&e.y===t.y&&(s||(s=a.isTouching(e,t)))){if(t.x<e.x){const i=e
e=t,t=i}return i()}return!1}}}isAreaEmpty(e,t,i,s){const n={x:e||0,y:t||0,w:i||1,h:s||1}
return!this.collide(n)}compact(e="compact",t=!0){if(0===this.nodes.length)return this
t&&this.sortNodes()
const i=this.batchMode
i||this.batchUpdate()
const s=this._inColumnResize
s||(this._inColumnResize=!0)
const n=this.nodes
return this.nodes=[],n.forEach(((t,i,s)=>{let n
t.locked||(t.autoPosition=!0,"list"===e&&i&&(n=s[i-1])),this.addNode(t,!1,n)})),s||delete this._inColumnResize,i||this.batchUpdate(!1),this}set float(e){this._float!==e&&(this._float=e||!1,e||this._packNodes()._notify())}get float(){return this._float||!1}sortNodes(e=1){return this.nodes=a.sort(this.nodes,e),this}_packNodes(){return this.batchMode||(this.sortNodes(),this.float?this.nodes.forEach((e=>{if(e._updating||void 0===e._orig||e.y===e._orig.y)return
let t=e.y
for(;t>e._orig.y;)--t,this.collide(e,{x:e.x,y:t,w:e.w,h:e.h})||(e._dirty=!0,e.y=t)})):this.nodes.forEach(((e,t)=>{if(!e.locked)for(;e.y>0;){const i=0===t?0:e.y-1
if(0!==t&&this.collide(e,{x:e.x,y:i,w:e.w,h:e.h}))break
e._dirty=e.y!==i,e.y=i}}))),this}prepareNode(e,t){e._id=e._id??l._idSeq++
const i=e.id
if(i){let t=1
for(;this.nodes.find((t=>t.id===e.id&&t!==e));)e.id=i+"_"+t++}void 0!==e.x&&void 0!==e.y&&null!==e.x&&null!==e.y||(e.autoPosition=!0)
const s={x:0,y:0,w:1,h:1}
return a.defaults(e,s),e.autoPosition||delete e.autoPosition,e.noResize||delete e.noResize,e.noMove||delete e.noMove,a.sanitizeMinMax(e),"string"==typeof e.x&&(e.x=Number(e.x)),"string"==typeof e.y&&(e.y=Number(e.y)),"string"==typeof e.w&&(e.w=Number(e.w)),"string"==typeof e.h&&(e.h=Number(e.h)),isNaN(e.x)&&(e.x=s.x,e.autoPosition=!0),isNaN(e.y)&&(e.y=s.y,e.autoPosition=!0),isNaN(e.w)&&(e.w=s.w),isNaN(e.h)&&(e.h=s.h),this.nodeBoundFix(e,t),e}nodeBoundFix(e,t){const i=e._orig||a.copyPos({},e)
if(e.maxW&&(e.w=Math.min(e.w||1,e.maxW)),e.maxH&&(e.h=Math.min(e.h||1,e.maxH)),e.minW&&(e.w=Math.max(e.w||1,e.minW)),e.minH&&(e.h=Math.max(e.h||1,e.minH)),(e.x||0)+(e.w||1)>this.column&&this.column<this.defaultColumn&&!this._inColumnResize&&!this.skipCacheUpdate&&e._id&&-1===this.findCacheLayout(e,this.defaultColumn)){const t={...e}
t.autoPosition||void 0===t.x?(delete t.x,delete t.y):t.x=Math.min(this.defaultColumn-1,t.x),t.w=Math.min(this.defaultColumn,t.w||1),this.cacheOneLayout(t,this.defaultColumn)}return e.w>this.column?e.w=this.column:e.w<1&&(e.w=1),this.maxRow&&e.h>this.maxRow?e.h=this.maxRow:e.h<1&&(e.h=1),e.x<0&&(e.x=0),e.y<0&&(e.y=0),e.x+e.w>this.column&&(t?e.w=this.column-e.x:e.x=this.column-e.w),this.maxRow&&e.y+e.h>this.maxRow&&(t?e.h=this.maxRow-e.y:e.y=this.maxRow-e.h),a.samePos(e,i)||(e._dirty=!0),this}getDirtyNodes(e){return e?this.nodes.filter((e=>e._dirty&&!a.samePos(e,e._orig))):this.nodes.filter((e=>e._dirty))}_notify(e){if(this.batchMode||!this.onChange)return this
const t=(e||[]).concat(this.getDirtyNodes())
return this.onChange(t),this}cleanNodes(){return this.batchMode||this.nodes.forEach((e=>{delete e._dirty,delete e._lastTried})),this}saveInitial(){return this.nodes.forEach((e=>{e._orig=a.copyPos({},e),delete e._dirty})),this._hasLocked=this.nodes.some((e=>e.locked)),this}restoreInitial(){return this.nodes.forEach((e=>{e._orig&&!a.samePos(e,e._orig)&&(a.copyPos(e,e._orig),e._dirty=!0)})),this._notify(),this}findEmptyPosition(e,t=this.nodes,i=this.column,s){let n=!1
for(let o=s?s.y*i+(s.x+s.w):0;!n;++o){const s=o%i,r=Math.floor(o/i)
if(s+e.w>i)continue
const l={x:s,y:r,w:e.w,h:e.h}
t.find((e=>a.isIntercepted(l,e)))||(e.x===s&&e.y===r||(e._dirty=!0),e.x=s,e.y=r,delete e.autoPosition,n=!0)}return n}addNode(e,t=!1,i){const s=this.nodes.find((t=>t._id===e._id))
if(s)return s
let n
return this._inColumnResize?this.nodeBoundFix(e):this.prepareNode(e),delete e._temporaryRemoved,delete e._removeDOM,e.autoPosition&&this.findEmptyPosition(e,this.nodes,this.column,i)&&(delete e.autoPosition,n=!0),this.nodes.push(e),t&&this.addedNodes.push(e),n||this._fixCollisions(e),this.batchMode||this._packNodes()._notify(),e}removeNode(e,t=!0,i=!1){return this.nodes.find((t=>t._id===e._id))?(i&&this.removedNodes.push(e),t&&(e._removeDOM=!0),this.nodes=this.nodes.filter((t=>t._id!==e._id)),e._isAboutToRemove||this._packNodes(),this._notify([e]),this):this}removeAll(e=!0,t=!0){if(delete this._layouts,!this.nodes.length)return this
e&&this.nodes.forEach((e=>e._removeDOM=!0))
const i=this.nodes
return this.removedNodes=t?i:[],this.nodes=[],this._notify(i)}moveNodeCheck(e,t){if(!this.changedPosConstrain(e,t))return!1
if(t.pack=!0,!this.maxRow)return this.moveNode(e,t)
let i
const s=new l({column:this.column,float:this.float,nodes:this.nodes.map((t=>t._id===e._id?(i={...t},i):{...t}))})
if(!i)return!1
const n=s.moveNode(i,t)&&s.getRow()<=Math.max(this.getRow(),this.maxRow)
if(!n&&!t.resizing&&t.collide){const i=t.collide.el.gridstackNode
if(this.swap(e,i))return this._notify(),!0}return!!n&&(s.nodes.filter((e=>e._dirty)).forEach((e=>{const t=this.nodes.find((t=>t._id===e._id))
t&&(a.copyPos(t,e),t._dirty=!0)})),this._notify(),!0)}willItFit(e){if(delete e._willFitPos,!this.maxRow)return!0
const t=new l({column:this.column,float:this.float,nodes:this.nodes.map((e=>({...e})))}),i={...e}
return this.cleanupNode(i),delete i.el,delete i._id,delete i.content,delete i.grid,t.addNode(i),t.getRow()<=this.maxRow&&(e._willFitPos=a.copyPos({},i),!0)}changedPosConstrain(e,t){return t.w=t.w||e.w,t.h=t.h||e.h,e.x!==t.x||e.y!==t.y||(e.maxW&&(t.w=Math.min(t.w,e.maxW)),e.maxH&&(t.h=Math.min(t.h,e.maxH)),e.minW&&(t.w=Math.max(t.w,e.minW)),e.minH&&(t.h=Math.max(t.h,e.minH)),e.w!==t.w||e.h!==t.h)}moveNode(e,t){if(!e||!t)return!1
let i
void 0!==t.pack||this.batchMode||(i=t.pack=!0),"number"!=typeof t.x&&(t.x=e.x),"number"!=typeof t.y&&(t.y=e.y),"number"!=typeof t.w&&(t.w=e.w),"number"!=typeof t.h&&(t.h=e.h)
const s=e.w!==t.w||e.h!==t.h,n=a.copyPos({},e,!0)
if(a.copyPos(n,t),this.nodeBoundFix(n,s),a.copyPos(t,n),!t.forceCollide&&a.samePos(e,t))return!1
const o=a.copyPos({},e),r=this.collideAll(e,n,t.skip)
let l=!0
if(r.length){const s=e._moving&&!t.nested
let o=s?this.directionCollideCoverage(e,t,r):r[0]
if(s&&o&&e.grid?.opts?.subGridDynamic&&!e.grid._isTemp){const i=a.areaIntercept(t.rect,o._rect),s=a.area(t.rect),n=a.area(o._rect)
i/(s<n?s:n)>.8&&(o.grid.makeSubGrid(o.el,void 0,e),o=void 0)}o?l=!this._fixCollisions(e,n,o,t):(l=!1,i&&delete t.pack)}return l&&!a.samePos(e,n)&&(e._dirty=!0,a.copyPos(e,n)),t.pack&&this._packNodes()._notify(),!a.samePos(e,o)}getRow(){return this.nodes.reduce(((e,t)=>Math.max(e,t.y+t.h)),0)}beginUpdate(e){return e._updating||(e._updating=!0,delete e._skipDown,this.batchMode||this.saveInitial()),this}endUpdate(){const e=this.nodes.find((e=>e._updating))
return e&&(delete e._updating,delete e._skipDown),this}save(e=!0,t){const i=this._layouts?.length,s=i&&this.column!==i-1?this._layouts[i-1]:null,n=[]
return this.sortNodes(),this.nodes.forEach((i=>{const o=s?.find((e=>e._id===i._id)),r={...i,...o||{}}
a.removeInternalForSave(r,!e),t&&t(i,r),n.push(r)})),n}layoutsNodesChange(e){return!this._layouts||this._inColumnResize||this._layouts.forEach(((t,i)=>{if(!t||i===this.column)return this
if(i<this.column)this._layouts[i]=void 0
else{const s=i/this.column
e.forEach((e=>{if(!e._orig)return
const i=t.find((t=>t._id===e._id))
i&&(i.y>=0&&e.y!==e._orig.y&&(i.y+=e.y-e._orig.y),e.x!==e._orig.x&&(i.x=Math.round(e.x*s)),e.w!==e._orig.w&&(i.w=Math.round(e.w*s)))}))}})),this}columnChanged(e,t,i="moveScale"){if(!this.nodes.length||!t||e===t)return this
const s="compact"===i||"list"===i
s&&this.sortNodes(1),t<e&&this.cacheLayout(this.nodes,e),this.batchUpdate()
let n=[],o=s?this.nodes:a.sort(this.nodes,-1)
if(t>e&&this._layouts){const i=this._layouts[t]||[],r=this._layouts.length-1
!i.length&&e!==r&&this._layouts[r]?.length&&(e=r,this._layouts[r].forEach((e=>{const t=o.find((t=>t._id===e._id))
t&&(s||e.autoPosition||(t.x=e.x??t.x,t.y=e.y??t.y),t.w=e.w??t.w,null!=e.x&&void 0!==e.y||(t.autoPosition=!0))}))),i.forEach((e=>{const t=o.findIndex((t=>t._id===e._id))
if(-1!==t){const i=o[t]
if(s)return void(i.w=e.w);(e.autoPosition||isNaN(e.x)||isNaN(e.y))&&this.findEmptyPosition(e,n),e.autoPosition||(i.x=e.x??i.x,i.y=e.y??i.y,i.w=e.w??i.w,n.push(i)),o.splice(t,1)}}))}if(s)this.compact(i,!1)
else{if(o.length)if("function"==typeof i)i(t,e,n,o)
else{const r=s||"none"===i?1:t/e,a="move"===i||"moveScale"===i,l="scale"===i||"moveScale"===i
o.forEach((i=>{i.x=1===t?0:a?Math.round(i.x*r):Math.min(i.x,t-1),i.w=1===t||1===e?1:l?Math.round(i.w*r)||1:Math.min(i.w,t),n.push(i)})),o=[]}n=a.sort(n,-1),this._inColumnResize=!0,this.nodes=[],n.forEach((e=>{this.addNode(e,!1),delete e._orig}))}return this.nodes.forEach((e=>delete e._orig)),this.batchUpdate(!1,!s),delete this._inColumnResize,this}cacheLayout(e,t,i=!1){const s=[]
return e.forEach(((e,t)=>{if(void 0===e._id){const t=e.id?this.nodes.find((t=>t.id===e.id)):void 0
e._id=t?._id??l._idSeq++}s[t]={x:e.x,y:e.y,w:e.w,_id:e._id}})),this._layouts=i?[]:this._layouts||[],this._layouts[t]=s,this}cacheOneLayout(e,t){e._id=e._id??l._idSeq++
const i={x:e.x,y:e.y,w:e.w,_id:e._id};(e.autoPosition||void 0===e.x)&&(delete i.x,delete i.y,e.autoPosition&&(i.autoPosition=!0)),this._layouts=this._layouts||[],this._layouts[t]=this._layouts[t]||[]
const s=this.findCacheLayout(e,t)
return-1===s?this._layouts[t].push(i):this._layouts[t][s]=i,this}findCacheLayout(e,t){return this._layouts?.[t]?.findIndex((t=>t._id===e._id))??-1}removeNodeFromLayoutCache(e){if(this._layouts)for(let t=0;t<this._layouts.length;t++){const i=this.findCacheLayout(e,t);-1!==i&&this._layouts[t].splice(i,1)}}cleanupNode(e){for(const t in e)"_"===t[0]&&"_id"!==t&&delete e[t]
return this}}l._idSeq=0
const h={alwaysShowResizeHandle:"mobile",animate:!0,auto:!0,cellHeight:"auto",cellHeightThrottle:100,cellHeightUnit:"px",column:12,draggable:{handle:".grid-stack-item-content",appendTo:"body",scroll:!0},handle:".grid-stack-item-content",itemClass:"grid-stack-item",margin:10,marginUnit:"px",maxRow:0,minRow:0,placeholderClass:"grid-stack-placeholder",placeholderText:"",removableOptions:{accept:"grid-stack-item",decline:"grid-stack-non-removable"},resizable:{handles:"se"},rtl:"auto"}
class d{}const c="undefined"!=typeof window&&"undefined"!=typeof document&&("ontouchstart"in document||"ontouchstart"in window||window.DocumentTouch&&document instanceof window.DocumentTouch||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0)
class g{}function u(e,t){e.touches.length>1||(e.cancelable&&e.preventDefault(),a.simulateMouseEvent(e.changedTouches[0],t))}function p(e,t){e.cancelable&&e.preventDefault(),a.simulateMouseEvent(e,t)}function m(e){g.touchHandled||(g.touchHandled=!0,u(e,"mousedown"))}function f(e){g.touchHandled&&u(e,"mousemove")}function b(e){if(!g.touchHandled)return
g.pointerLeaveTimeout&&(window.clearTimeout(g.pointerLeaveTimeout),delete g.pointerLeaveTimeout)
const t=!!d.dragElement
u(e,"mouseup"),t||u(e,"click"),g.touchHandled=!1}function _(e){"mouse"!==e.pointerType&&e.target.releasePointerCapture(e.pointerId)}function y(e){d.dragElement&&"mouse"!==e.pointerType&&p(e,"mouseenter")}function v(e){d.dragElement&&"mouse"!==e.pointerType&&(g.pointerLeaveTimeout=window.setTimeout((()=>{delete g.pointerLeaveTimeout,p(e,"mouseleave")}),10))}class w{constructor(e,t,i){this.host=e,this.dir=t,this.option=i,this.moving=!1,this._mouseDown=this._mouseDown.bind(this),this._mouseMove=this._mouseMove.bind(this),this._mouseUp=this._mouseUp.bind(this),this._keyEvent=this._keyEvent.bind(this),this._init()}_init(){const e=this.el=document.createElement("div")
return e.classList.add("ui-resizable-handle"),e.classList.add(`${w.prefix}${this.dir}`),e.style.zIndex="100",e.style.userSelect="none",this.host.appendChild(this.el),this.el.addEventListener("mousedown",this._mouseDown),c&&(this.el.addEventListener("touchstart",m),this.el.addEventListener("pointerdown",_)),this}destroy(){return this.moving&&this._mouseUp(this.mouseDownEvent),this.el.removeEventListener("mousedown",this._mouseDown),c&&(this.el.removeEventListener("touchstart",m),this.el.removeEventListener("pointerdown",_)),this.host.removeChild(this.el),delete this.el,delete this.host,this}_mouseDown(e){this.mouseDownEvent=e,document.addEventListener("mousemove",this._mouseMove,{capture:!0,passive:!0}),document.addEventListener("mouseup",this._mouseUp,!0),c&&(this.el.addEventListener("touchmove",f),this.el.addEventListener("touchend",b)),e.stopPropagation(),e.preventDefault()}_mouseMove(e){const t=this.mouseDownEvent
this.moving?this._triggerEvent("move",e):Math.abs(e.x-t.x)+Math.abs(e.y-t.y)>2&&(this.moving=!0,this._triggerEvent("start",this.mouseDownEvent),this._triggerEvent("move",e),document.addEventListener("keydown",this._keyEvent)),e.stopPropagation()}_mouseUp(e){this.moving&&(this._triggerEvent("stop",e),document.removeEventListener("keydown",this._keyEvent)),document.removeEventListener("mousemove",this._mouseMove,!0),document.removeEventListener("mouseup",this._mouseUp,!0),c&&(this.el.removeEventListener("touchmove",f),this.el.removeEventListener("touchend",b)),delete this.moving,delete this.mouseDownEvent,e.stopPropagation(),e.preventDefault()}_keyEvent(e){"Escape"===e.key&&(this.host.gridstackNode?.grid?.engine.restoreInitial(),this._mouseUp(this.mouseDownEvent))}_triggerEvent(e,t){return this.option[e]&&this.option[e](t),this}}w.prefix="ui-resizable-"
class E{constructor(){this._eventRegister={}}get disabled(){return this._disabled}on(e,t){this._eventRegister[e]=t}off(e){delete this._eventRegister[e]}enable(){this._disabled=!1}disable(){this._disabled=!0}destroy(){delete this._eventRegister}triggerEvent(e,t){if(!this.disabled&&this._eventRegister&&this._eventRegister[e])return this._eventRegister[e](t)}}class x extends E{constructor(e,t={}){super(),this.el=e,this.option=t,this.rectScale={x:1,y:1},this._ui=()=>{const e=this.el.parentElement.getBoundingClientRect(),t={width:this.originalRect.width,height:this.originalRect.height+this.scrolled,left:this.originalRect.left,top:this.originalRect.top-this.scrolled},i=this.temporalRect||t
return{position:{left:(i.left-e.left)*this.rectScale.x,top:(i.top-e.top)*this.rectScale.y},size:{width:i.width*this.rectScale.x,height:i.height*this.rectScale.y}}},this._mouseOver=this._mouseOver.bind(this),this._mouseOut=this._mouseOut.bind(this),this.enable(),this._setupAutoHide(this.option.autoHide),this._setupHandlers()}on(e,t){super.on(e,t)}off(e){super.off(e)}enable(){super.enable(),this.el.classList.remove("ui-resizable-disabled"),this._setupAutoHide(this.option.autoHide)}disable(){super.disable(),this.el.classList.add("ui-resizable-disabled"),this._setupAutoHide(!1)}destroy(){this._removeHandlers(),this._setupAutoHide(!1),delete this.el,super.destroy()}updateOption(e){const t=e.handles&&e.handles!==this.option.handles,i=e.autoHide&&e.autoHide!==this.option.autoHide
return Object.keys(e).forEach((t=>this.option[t]=e[t])),t&&(this._removeHandlers(),this._setupHandlers()),i&&this._setupAutoHide(this.option.autoHide),this}_setupAutoHide(e){return e?(this.el.classList.add("ui-resizable-autohide"),this.el.addEventListener("mouseover",this._mouseOver),this.el.addEventListener("mouseout",this._mouseOut)):(this.el.classList.remove("ui-resizable-autohide"),this.el.removeEventListener("mouseover",this._mouseOver),this.el.removeEventListener("mouseout",this._mouseOut),d.overResizeElement===this&&delete d.overResizeElement),this}_mouseOver(e){d.overResizeElement||d.dragElement||(d.overResizeElement=this,this.el.classList.remove("ui-resizable-autohide"))}_mouseOut(e){d.overResizeElement===this&&(delete d.overResizeElement,this.el.classList.add("ui-resizable-autohide"))}_setupHandlers(){return this.handlers=this.option.handles.split(",").map((e=>e.trim())).map((e=>new w(this.el,e,{start:e=>{this._resizeStart(e)},stop:e=>{this._resizeStop(e)},move:t=>{this._resizing(t,e)}}))),this}_resizeStart(e){this.sizeToContent=a.shouldSizeToContent(this.el.gridstackNode,!0),this.originalRect=this.el.getBoundingClientRect(),this.scrollEl=a.getScrollElement(this.el),this.scrollY=this.scrollEl.scrollTop,this.scrolled=0,this.startEvent=e,this._setupHelper(),this._applyChange()
const t=a.initEvent(e,{type:"resizestart",target:this.el})
return this.option.start&&this.option.start(t,this._ui()),this.el.classList.add("ui-resizable-resizing"),this.triggerEvent("resizestart",t),this}_resizing(e,t){this.scrolled=this.scrollEl.scrollTop-this.scrollY,this.temporalRect=this._getChange(e,t),this._applyChange()
const i=a.initEvent(e,{type:"resize",target:this.el})
return this.option.resize&&this.option.resize(i,this._ui()),this.triggerEvent("resize",i),this}_resizeStop(e){const t=a.initEvent(e,{type:"resizestop",target:this.el})
return this._cleanHelper(),this.option.stop&&this.option.stop(t),this.el.classList.remove("ui-resizable-resizing"),this.triggerEvent("resizestop",t),delete this.startEvent,delete this.originalRect,delete this.temporalRect,delete this.scrollY,delete this.scrolled,this}_setupHelper(){this.elOriginStyleVal=x._originStyleProp.map((e=>this.el.style[e])),this.parentOriginStylePosition=this.el.parentElement.style.position
const e=this.el.parentElement,t=a.getValuesFromTransformedElement(e)
return this.rectScale={x:t.xScale,y:t.yScale},getComputedStyle(this.el.parentElement).position.match(/static/)&&(this.el.parentElement.style.position="relative"),this.el.style.position="absolute",this.el.style.opacity="0.8",this}_cleanHelper(){return x._originStyleProp.forEach(((e,t)=>{this.el.style[e]=this.elOriginStyleVal[t]||null})),this.el.parentElement.style.position=this.parentOriginStylePosition||null,this}_getChange(e,t){const i=this.startEvent,s={width:this.originalRect.width,height:this.originalRect.height+this.scrolled,left:this.originalRect.left,top:this.originalRect.top-this.scrolled},n=e.clientX-i.clientX,o=this.sizeToContent?0:e.clientY-i.clientY
let r,a
t.indexOf("e")>-1?s.width+=n:t.indexOf("w")>-1&&(s.width-=n,s.left+=n,r=!0),t.indexOf("s")>-1?s.height+=o:t.indexOf("n")>-1&&(s.height-=o,s.top+=o,a=!0)
const l=this._constrainSize(s.width,s.height,r,a)
return Math.round(s.width)!==Math.round(l.width)&&(t.indexOf("w")>-1&&(s.left+=s.width-l.width),s.width=l.width),Math.round(s.height)!==Math.round(l.height)&&(t.indexOf("n")>-1&&(s.top+=s.height-l.height),s.height=l.height),s}_constrainSize(e,t,i,s){const n=this.option,o=(i?n.maxWidthMoveLeft:n.maxWidth)||Number.MAX_SAFE_INTEGER,r=n.minWidth/this.rectScale.x||e,a=(s?n.maxHeightMoveUp:n.maxHeight)||Number.MAX_SAFE_INTEGER,l=n.minHeight/this.rectScale.y||t
return{width:Math.min(o,Math.max(r,e)),height:Math.min(a,Math.max(l,t))}}_applyChange(){let e={left:0,top:0,width:0,height:0}
if("absolute"===this.el.style.position){const t=this.el.parentElement,{left:i,top:s}=t.getBoundingClientRect()
e={left:i,top:s,width:0,height:0}}return this.temporalRect?(Object.keys(this.temporalRect).forEach((t=>{const i=this.temporalRect[t],s="width"===t||"left"===t?this.rectScale.x:"height"===t||"top"===t?this.rectScale.y:1
this.el.style[t]=(i-e[t])*s+"px"})),this):this}_removeHandlers(){return this.handlers.forEach((e=>e.destroy())),delete this.handlers,this}}x._originStyleProp=["width","height","position","left","top","opacity","zIndex"]
class R extends E{constructor(e,t={}){super(),this.el=e,this.option=t,this.dragTransform={xScale:1,yScale:1,xOffset:0,yOffset:0}
const i=t?.handle?.substring(1),s=e.gridstackNode
this.dragEls=!i||e.classList.contains(i)?[e]:s?.subGrid?[e.querySelector(t.handle)||e]:Array.from(e.querySelectorAll(t.handle)),0===this.dragEls.length&&(this.dragEls=[e]),this._mouseDown=this._mouseDown.bind(this),this._mouseMove=this._mouseMove.bind(this),this._mouseUp=this._mouseUp.bind(this),this._keyEvent=this._keyEvent.bind(this),this.enable()}on(e,t){super.on(e,t)}off(e){super.off(e)}enable(){!1!==this.disabled&&(super.enable(),this.dragEls.forEach((e=>{e.addEventListener("mousedown",this._mouseDown),c&&(e.addEventListener("touchstart",m),e.addEventListener("pointerdown",_))})),this.el.classList.remove("ui-draggable-disabled"))}disable(e=!1){!0!==this.disabled&&(super.disable(),this.dragEls.forEach((e=>{e.removeEventListener("mousedown",this._mouseDown),c&&(e.removeEventListener("touchstart",m),e.removeEventListener("pointerdown",_))})),e||this.el.classList.add("ui-draggable-disabled"))}destroy(){this.dragTimeout&&window.clearTimeout(this.dragTimeout),delete this.dragTimeout,this.mouseDownEvent&&this._mouseUp(this.mouseDownEvent),this.disable(!0),delete this.el,delete this.helper,delete this.option,super.destroy()}updateOption(e){return Object.keys(e).forEach((t=>this.option[t]=e[t])),this}_mouseDown(e){if(!d.mouseHandled)return 0!==e.button||!this.dragEls.find((t=>t===e.target))&&e.target.closest('input,textarea,button,select,option,[contenteditable="true"],.ui-resizable-handle')||this.option.cancel&&e.target.closest(this.option.cancel)||(this.mouseDownEvent=e,delete this.dragging,delete d.dragElement,delete d.dropElement,document.addEventListener("mousemove",this._mouseMove,{capture:!0,passive:!0}),document.addEventListener("mouseup",this._mouseUp,!0),c&&(e.currentTarget.addEventListener("touchmove",f),e.currentTarget.addEventListener("touchend",b)),e.preventDefault(),document.activeElement&&document.activeElement.blur(),d.mouseHandled=!0),!0}_callDrag(e){if(!this.dragging)return
const t=a.initEvent(e,{target:this.el,type:"drag"})
this.option.drag&&this.option.drag(t,this.ui()),this.triggerEvent("drag",t)}_mouseMove(e){const t=this.mouseDownEvent
if(this.lastDrag=e,this.dragging)if(this._dragFollow(e),d.pauseDrag){const t=Number.isInteger(d.pauseDrag)?d.pauseDrag:100
this.dragTimeout&&window.clearTimeout(this.dragTimeout),this.dragTimeout=window.setTimeout((()=>this._callDrag(e)),t)}else this._callDrag(e)
else if(Math.abs(e.x-t.x)+Math.abs(e.y-t.y)>3){this.dragging=!0,d.dragElement=this
const t=this.el.gridstackNode?.grid
t?d.dropElement=t.el.ddElement.ddDroppable:delete d.dropElement,this.helper=this._createHelper(),this._setupHelperContainmentStyle(),this.dragTransform=a.getValuesFromTransformedElement(this.helperContainment),this.dragOffset=this._getDragOffset(e,this.el,this.helperContainment),this._setupHelperStyle(e)
const i=a.initEvent(e,{target:this.el,type:"dragstart"})
this.option.start&&this.option.start(i,this.ui()),this.triggerEvent("dragstart",i),document.addEventListener("keydown",this._keyEvent)}return!0}_mouseUp(e){if(document.removeEventListener("mousemove",this._mouseMove,!0),document.removeEventListener("mouseup",this._mouseUp,!0),c&&e.currentTarget&&(e.currentTarget.removeEventListener("touchmove",f,!0),e.currentTarget.removeEventListener("touchend",b,!0)),this.dragging){delete this.dragging,delete this.el.gridstackNode?._origRotate,document.removeEventListener("keydown",this._keyEvent),d.dropElement?.el===this.el.parentElement&&delete d.dropElement,this.helperContainment.style.position=this.parentOriginStylePosition||null,this.helper!==this.el&&this.helper.remove(),this._removeHelperStyle()
const t=a.initEvent(e,{target:this.el,type:"dragstop"})
this.option.stop&&this.option.stop(t),this.triggerEvent("dragstop",t),d.dropElement&&d.dropElement.drop(e)}delete this.helper,delete this.mouseDownEvent,delete d.dragElement,delete d.dropElement,delete d.mouseHandled,e.preventDefault()}_keyEvent(e){const t=this.el.gridstackNode,i=t?.grid||d.dropElement?.el?.gridstack
if("Escape"===e.key)t&&t._origRotate&&(t._orig=t._origRotate,delete t._origRotate),i?.cancelDrag(),this._mouseUp(this.mouseDownEvent)
else if(t&&i&&("r"===e.key||"R"===e.key)){if(!a.canBeRotated(t))return
t._origRotate=t._origRotate||{...t._orig},delete t._moving,i.setAnimation(!1).rotate(t.el,{top:-this.dragOffset.offsetTop,left:-this.dragOffset.offsetLeft}).setAnimation(),t._moving=!0,this.dragOffset=this._getDragOffset(this.lastDrag,t.el,this.helperContainment),this.helper.style.width=this.dragOffset.width+"px",this.helper.style.height=this.dragOffset.height+"px",a.swap(t._orig,"w","h"),delete t._rect,this._mouseMove(this.lastDrag)}}_createHelper(){let e=this.el
return"function"==typeof this.option.helper?e=this.option.helper(this.el):"clone"===this.option.helper&&(e=a.cloneNode(this.el)),e.parentElement||a.appendTo(e,"parent"===this.option.appendTo?this.el.parentElement:this.option.appendTo),this.dragElementOriginStyle=R.originStyleProp.map((e=>this.el.style[e])),e}_setupHelperStyle(e){this.helper.classList.add("ui-draggable-dragging")
const t=this.helper.style
return t.pointerEvents="none",t.width=this.dragOffset.width+"px",t.height=this.dragOffset.height+"px",t.willChange="left, top",t.position="fixed",this._dragFollow(e),t.transition="none",setTimeout((()=>{this.helper&&(t.transition=null)}),0),this}_removeHelperStyle(){this.helper.classList.remove("ui-draggable-dragging")
const e=this.helper?.gridstackNode
if(!e?._isAboutToRemove&&this.dragElementOriginStyle){const e=this.helper,t=this.dragElementOriginStyle.transition||null
e.style.transition=this.dragElementOriginStyle.transition="none",R.originStyleProp.forEach((t=>e.style[t]=this.dragElementOriginStyle[t]||null)),setTimeout((()=>e.style.transition=t),50)}return delete this.dragElementOriginStyle,this}_dragFollow(e){const t=this.helper.style,i=this.dragOffset
t.left=(e.clientX+i.offsetLeft-0)*this.dragTransform.xScale+"px",t.top=(e.clientY+i.offsetTop-0)*this.dragTransform.yScale+"px"}_setupHelperContainmentStyle(){return this.helperContainment=this.helper.parentElement,"fixed"!==this.helper.style.position&&(this.parentOriginStylePosition=this.helperContainment.style.position,getComputedStyle(this.helperContainment).position.match(/static/)&&(this.helperContainment.style.position="relative")),this}_getDragOffset(e,t,i){let s=0,n=0
i&&(s=this.dragTransform.xOffset,n=this.dragTransform.yOffset)
const o=t.getBoundingClientRect()
return{left:o.left,top:o.top,offsetLeft:-e.clientX+o.left-s,offsetTop:-e.clientY+o.top-n,width:o.width*this.dragTransform.xScale,height:o.height*this.dragTransform.yScale}}ui(){const e=this.el.parentElement.getBoundingClientRect(),t=this.helper.getBoundingClientRect()
return{position:{top:(t.top-e.top)*this.dragTransform.yScale,left:(t.left-e.left)*this.dragTransform.xScale}}}}R.originStyleProp=["width","height","transform","transform-origin","transition","pointerEvents","position","left","top","minWidth","willChange"]
class k extends E{constructor(e,t={}){super(),this.el=e,this.option=t,this._mouseEnter=this._mouseEnter.bind(this),this._mouseLeave=this._mouseLeave.bind(this),this.enable(),this._setupAccept()}on(e,t){super.on(e,t)}off(e){super.off(e)}enable(){!1!==this.disabled&&(super.enable(),this.el.classList.add("ui-droppable"),this.el.classList.remove("ui-droppable-disabled"),this.el.addEventListener("mouseenter",this._mouseEnter),this.el.addEventListener("mouseleave",this._mouseLeave),c&&(this.el.addEventListener("pointerenter",y),this.el.addEventListener("pointerleave",v)))}disable(e=!1){!0!==this.disabled&&(super.disable(),this.el.classList.remove("ui-droppable"),e||this.el.classList.add("ui-droppable-disabled"),this.el.removeEventListener("mouseenter",this._mouseEnter),this.el.removeEventListener("mouseleave",this._mouseLeave),c&&(this.el.removeEventListener("pointerenter",y),this.el.removeEventListener("pointerleave",v)))}destroy(){this.disable(!0),this.el.classList.remove("ui-droppable"),this.el.classList.remove("ui-droppable-disabled"),super.destroy()}updateOption(e){return Object.keys(e).forEach((t=>this.option[t]=e[t])),this._setupAccept(),this}_mouseEnter(e){if(!d.dragElement)return
if(!this._canDrop(d.dragElement.el))return
e.preventDefault(),e.stopPropagation(),d.dropElement&&d.dropElement!==this&&d.dropElement._mouseLeave(e,!0),d.dropElement=this
const t=a.initEvent(e,{target:this.el,type:"dropover"})
this.option.over&&this.option.over(t,this._ui(d.dragElement)),this.triggerEvent("dropover",t),this.el.classList.add("ui-droppable-over")}_mouseLeave(e,t=!1){if(!d.dragElement||d.dropElement!==this)return
e.preventDefault(),e.stopPropagation()
const i=a.initEvent(e,{target:this.el,type:"dropout"})
if(this.option.out&&this.option.out(i,this._ui(d.dragElement)),this.triggerEvent("dropout",i),d.dropElement===this&&(delete d.dropElement,!t)){let t,i=this.el.parentElement
for(;!t&&i;)t=i.ddElement?.ddDroppable,i=i.parentElement
t&&t._mouseEnter(e)}}drop(e){e.preventDefault()
const t=a.initEvent(e,{target:this.el,type:"drop"})
this.option.drop&&this.option.drop(t,this._ui(d.dragElement)),this.triggerEvent("drop",t)}_canDrop(e){return e&&(!this.accept||this.accept(e))}_setupAccept(){return this.option.accept?("string"==typeof this.option.accept?this.accept=e=>e.classList.contains(this.option.accept)||e.matches(this.option.accept):this.accept=this.option.accept,this):this}_ui(e){return{draggable:e.el,...e.ui()}}}class C{static init(e){return e.ddElement||(e.ddElement=new C(e)),e.ddElement}constructor(e){this.el=e}on(e,t){return this.ddDraggable&&["drag","dragstart","dragstop"].indexOf(e)>-1?this.ddDraggable.on(e,t):this.ddDroppable&&["drop","dropover","dropout"].indexOf(e)>-1?this.ddDroppable.on(e,t):this.ddResizable&&["resizestart","resize","resizestop"].indexOf(e)>-1&&this.ddResizable.on(e,t),this}off(e){return this.ddDraggable&&["drag","dragstart","dragstop"].indexOf(e)>-1?this.ddDraggable.off(e):this.ddDroppable&&["drop","dropover","dropout"].indexOf(e)>-1?this.ddDroppable.off(e):this.ddResizable&&["resizestart","resize","resizestop"].indexOf(e)>-1&&this.ddResizable.off(e),this}setupDraggable(e){return this.ddDraggable?this.ddDraggable.updateOption(e):this.ddDraggable=new R(this.el,e),this}cleanDraggable(){return this.ddDraggable&&(this.ddDraggable.destroy(),delete this.ddDraggable),this}setupResizable(e){return this.ddResizable?this.ddResizable.updateOption(e):this.ddResizable=new x(this.el,e),this}cleanResizable(){return this.ddResizable&&(this.ddResizable.destroy(),delete this.ddResizable),this}setupDroppable(e){return this.ddDroppable?this.ddDroppable.updateOption(e):this.ddDroppable=new k(this.el,e),this}cleanDroppable(){return this.ddDroppable&&(this.ddDroppable.destroy(),delete this.ddDroppable),this}}class N{resizable(e,t,i,s){return this._getDDElements(e,t).forEach((e=>{if("disable"===t||"enable"===t)e.ddResizable&&e.ddResizable[t]()
else if("destroy"===t)e.ddResizable&&e.cleanResizable()
else if("option"===t)e.setupResizable({[i]:s})
else{const i=e.el.gridstackNode.grid
let s=e.el.getAttribute("gs-resize-handles")||i.opts.resizable.handles||"e,s,se"
"all"===s&&(s="n,e,s,w,se,sw,ne,nw")
const n=!i.opts.alwaysShowResizeHandle
e.setupResizable({...i.opts.resizable,handles:s,autoHide:n,start:t.start,stop:t.stop,resize:t.resize})}})),this}draggable(e,t,i,s){return this._getDDElements(e,t).forEach((e=>{if("disable"===t||"enable"===t)e.ddDraggable&&e.ddDraggable[t]()
else if("destroy"===t)e.ddDraggable&&e.cleanDraggable()
else if("option"===t)e.setupDraggable({[i]:s})
else{const i=e.el.gridstackNode.grid
e.setupDraggable({...i.opts.draggable,start:t.start,stop:t.stop,drag:t.drag})}})),this}dragIn(e,t){return this._getDDElements(e).forEach((e=>e.setupDraggable(t))),this}droppable(e,t,i,s){return"function"!=typeof t.accept||t._accept||(t._accept=t.accept,t.accept=e=>t._accept(e)),this._getDDElements(e,t).forEach((e=>{"disable"===t||"enable"===t?e.ddDroppable&&e.ddDroppable[t]():"destroy"===t?e.ddDroppable&&e.cleanDroppable():"option"===t?e.setupDroppable({[i]:s}):e.setupDroppable(t)})),this}isDroppable(e){return!(!e?.ddElement?.ddDroppable||e.ddElement.ddDroppable.disabled)}isDraggable(e){return!(!e?.ddElement?.ddDraggable||e.ddElement.ddDraggable.disabled)}isResizable(e){return!(!e?.ddElement?.ddResizable||e.ddElement.ddResizable.disabled)}on(e,t,i){return this._getDDElements(e).forEach((e=>e.on(t,(e=>{i(e,d.dragElement?d.dragElement.el:e.target,d.dragElement?d.dragElement.helper:null)})))),this}off(e,t){return this._getDDElements(e).forEach((e=>e.off(t))),this}_getDDElements(e,t){const i=e.gridstack||"destroy"!==t&&"disable"!==t,s=a.getElements(e)
return s.length?s.map((e=>e.ddElement||(i?C.init(e):null))).filter((e=>e)):[]}}const S=new N
class D{static init(e={},t=".grid-stack"){if("undefined"==typeof document)return null
const i=D.getGridElement(t)
return i?(i.gridstack||(i.gridstack=new D(i,a.cloneDeep(e))),i.gridstack):("string"==typeof t?console.error('GridStack.initAll() no grid was found with selector "'+t+'" - element missing or wrong selector ?\nNote: ".grid-stack" is required for proper CSS styling and drag/drop, and is the default selector.'):console.error("GridStack.init() no grid element was passed."),null)}static initAll(e={},t=".grid-stack"){const i=[]
return"undefined"==typeof document||(D.getGridElements(t).forEach((t=>{t.gridstack||(t.gridstack=new D(t,a.cloneDeep(e))),i.push(t.gridstack)})),0===i.length&&console.error('GridStack.initAll() no grid was found with selector "'+t+'" - element missing or wrong selector ?\nNote: ".grid-stack" is required for proper CSS styling and drag/drop, and is the default selector.')),i}static addGrid(e,t={}){if(!e)return null
let i=e
if(i.gridstack){const e=i.gridstack
return t&&(e.opts={...e.opts,...t}),void 0!==t.children&&e.load(t.children),e}return e.classList.contains("grid-stack")&&!D.addRemoveCB||(i=D.addRemoveCB?D.addRemoveCB(e,t,!0,!0):a.createDiv(["grid-stack",t.class],e)),D.init(t,i)}static registerEngine(e){D.engineClass=e}get placeholder(){if(!this._placeholder){this._placeholder=a.createDiv([this.opts.placeholderClass,h.itemClass,this.opts.itemClass])
const e=a.createDiv(["placeholder-content"],this._placeholder)
this.opts.placeholderText&&(e.textContent=this.opts.placeholderText)}return this._placeholder}constructor(e,t={}){this.el=e,this.opts=t,this.animationDelay=310,this._gsEventHandler={},this._extraDragRow=0,this.dragTransform={xScale:1,yScale:1,xOffset:0,yOffset:0},e.gridstack=this,this.opts=t=t||{},e.classList.contains("grid-stack")||this.el.classList.add("grid-stack"),t.row&&(t.minRow=t.maxRow=t.row,delete t.row)
const i=a.toNumber(e.getAttribute("gs-row"))
"auto"===t.column&&delete t.column,void 0!==t.alwaysShowResizeHandle&&(t._alwaysShowResizeHandle=t.alwaysShowResizeHandle)
const s=t.columnOpts
if(s){const e=s.breakpoints
s.columnWidth||e?.length?(s.columnMax=s.columnMax||12,e?.length>1&&e.sort(((e,t)=>(t.w||0)-(e.w||0)))):delete t.columnOpts}const n={...a.cloneDeep(h),column:a.toNumber(e.getAttribute("gs-column"))||h.column,minRow:i||a.toNumber(e.getAttribute("gs-min-row"))||h.minRow,maxRow:i||a.toNumber(e.getAttribute("gs-max-row"))||h.maxRow,staticGrid:a.toBool(e.getAttribute("gs-static"))||h.staticGrid,sizeToContent:a.toBool(e.getAttribute("gs-size-to-content"))||void 0,draggable:{handle:(t.handleClass?"."+t.handleClass:t.handle?t.handle:"")||h.draggable.handle},removableOptions:{accept:t.itemClass||h.removableOptions.accept,decline:h.removableOptions.decline}}
e.getAttribute("gs-animate")&&(n.animate=a.toBool(e.getAttribute("gs-animate"))),t=a.defaults(t,n),this._initMargin(),this.checkDynamicColumn(),this._updateColumnVar(t),"auto"===t.rtl&&(t.rtl="rtl"===e.style.direction),t.rtl&&this.el.classList.add("grid-stack-rtl")
const o=this.el.closest("."+h.itemClass),r=o?.gridstackNode
if(r&&(r.subGrid=this,this.parentGridNode=r,this.el.classList.add("grid-stack-nested"),r.el.classList.add("grid-stack-sub-grid")),this._isAutoCellHeight="auto"===t.cellHeight,this._isAutoCellHeight||"initial"===t.cellHeight)this.cellHeight(void 0)
else{"number"==typeof t.cellHeight&&t.cellHeightUnit&&t.cellHeightUnit!==h.cellHeightUnit&&(t.cellHeight=t.cellHeight+t.cellHeightUnit,delete t.cellHeightUnit)
const e=t.cellHeight
delete t.cellHeight,this.cellHeight(e)}"mobile"===t.alwaysShowResizeHandle&&(t.alwaysShowResizeHandle=c),this._setStaticClass()
const g=t.engineClass||D.engineClass||l
if(this.engine=new g({column:this.getColumn(),float:t.float,maxRow:t.maxRow,onChange:e=>{e.forEach((e=>{const t=e.el
t&&(e._removeDOM?(t&&t.remove(),delete e._removeDOM):this._writePosAttr(t,e))})),this._updateContainerHeight()}}),t.auto&&(this.batchUpdate(),this.engine._loading=!0,this.getGridItems().forEach((e=>this._prepareElement(e))),delete this.engine._loading,this.batchUpdate(!1)),t.children){const e=t.children
delete t.children,e.length&&this.load(e)}this.setAnimation(),t.subGridDynamic&&!d.pauseDrag&&(d.pauseDrag=!0),void 0!==t.draggable?.pause&&(d.pauseDrag=t.draggable.pause),this._setupRemoveDrop(),this._setupAcceptWidget(),this._updateResizeEvent()}_updateColumnVar(e=this.opts){this.el.classList.add("gs-"+e.column),"number"==typeof e.column&&this.el.style.setProperty("--gs-column-width",100/e.column+"%")}addWidget(e){if("string"==typeof e)return void console.error("V11: GridStack.addWidget() does not support string anymore. see #2736")
if(e.ELEMENT_NODE)return console.error("V11: GridStack.addWidget() does not support HTMLElement anymore. use makeWidget()"),this.makeWidget(e)
let t,i=e
if(i.grid=this,t=i?.el?i.el:D.addRemoveCB?D.addRemoveCB(this.el,e,!0,!1):this.createWidgetDivs(i),!t)return
if(i=t.gridstackNode,i&&t.parentElement===this.el&&this.engine.nodes.find((e=>e._id===i._id)))return t
const s=this._readAttr(t)
return a.defaults(e,s),this.engine.prepareNode(e),this.el.appendChild(t),this.makeWidget(t,e),t}createWidgetDivs(e){const t=a.createDiv(["grid-stack-item",this.opts.itemClass]),i=a.createDiv(["grid-stack-item-content"],t)
return a.lazyLoad(e)?e.visibleObservable||(e.visibleObservable=new IntersectionObserver((([t])=>{t.isIntersecting&&(e.visibleObservable?.disconnect(),delete e.visibleObservable,D.renderCB(i,e),e.grid?.prepareDragDrop(e.el))})),window.setTimeout((()=>e.visibleObservable?.observe(t)))):D.renderCB(i,e),t}makeSubGrid(e,t,i,s=!0){let n,o=e.gridstackNode
if(o||(o=this.makeWidget(e).gridstackNode),o.subGrid?.el)return o.subGrid
let r,l=this
for(;l&&!n;)n=l.opts?.subGridOpts,l=l.parentGridNode?.grid
t=a.cloneDeep({...this.opts,id:void 0,children:void 0,column:"auto",columnOpts:void 0,layout:"list",subGridOpts:void 0,...n||{},...t||o.subGridOpts||{}}),o.subGridOpts=t,"auto"===t.column&&(r=!0,t.column=Math.max(o.w||1,i?.w||1),delete t.columnOpts)
let h,d,c=o.el.querySelector(".grid-stack-item-content")
if(s&&(this._removeDD(o.el),d={...o,x:0,y:0},a.removeInternalForSave(d),delete d.subGridOpts,o.content&&(d.content=o.content,delete o.content),D.addRemoveCB?h=D.addRemoveCB(this.el,d,!0,!1):(h=a.createDiv(["grid-stack-item"]),h.appendChild(c),c=a.createDiv(["grid-stack-item-content"],o.el)),this.prepareDragDrop(o.el)),i){const e=r?t.column:o.w,s=o.h+i.h,n=o.el.style
n.transition="none",this.update(o.el,{w:e,h:s}),setTimeout((()=>n.transition=null))}const g=o.subGrid=D.addGrid(c,t)
return i?._moving&&(g._isTemp=!0),r&&(g._autoColumn=!0),s&&g.makeWidget(h,d),i&&(i._moving?window.setTimeout((()=>a.simulateMouseEvent(i._event,"mouseenter",g.el)),0):g.makeWidget(o.el,o)),this.resizeToContentCheck(!1,o),g}removeAsSubGrid(e){const t=this.parentGridNode?.grid
t&&(t.batchUpdate(),t.removeWidget(this.parentGridNode.el,!0,!0),this.engine.nodes.forEach((e=>{e.x+=this.parentGridNode.x,e.y+=this.parentGridNode.y,t.makeWidget(e.el,e)})),t.batchUpdate(!1),this.parentGridNode&&delete this.parentGridNode.subGrid,delete this.parentGridNode,e&&window.setTimeout((()=>a.simulateMouseEvent(e._event,"mouseenter",t.el)),0))}save(e=!0,t=!1,i=D.saveCB){const s=this.engine.save(e,i)
if(s.forEach((s=>{if(e&&s.el&&!s.subGrid&&!i){const e=s.el.querySelector(".grid-stack-item-content")
s.content=e?.innerHTML,s.content||delete s.content}else if(e||i||delete s.content,s.subGrid?.el){const n=s.subGrid.save(e,t,i)
s.subGridOpts=t?n:{children:n},delete s.subGrid}delete s.el})),t){const e=a.cloneDeep(this.opts)
e.marginBottom===e.marginTop&&e.marginRight===e.marginLeft&&e.marginTop===e.marginRight&&(e.margin=e.marginTop,delete e.marginTop,delete e.marginRight,delete e.marginBottom,delete e.marginLeft),e.rtl===("rtl"===this.el.style.direction)&&(e.rtl="auto"),this._isAutoCellHeight&&(e.cellHeight="auto"),this._autoColumn&&(e.column="auto")
const t=e._alwaysShowResizeHandle
return delete e._alwaysShowResizeHandle,void 0!==t?e.alwaysShowResizeHandle=t:delete e.alwaysShowResizeHandle,a.removeInternalAndSame(e,h),e.children=s,e}return s}load(e,t=D.addRemoveCB||!0){e=a.cloneDeep(e)
const i=this.getColumn()
e.forEach((e=>{e.w=e.w||1,e.h=e.h||1})),e=a.sort(e),this.engine.skipCacheUpdate=this._ignoreLayoutsNodeChange=!0
let s=0
e.forEach((e=>{s=Math.max(s,(e.x||0)+e.w)})),s>this.engine.defaultColumn&&(this.engine.defaultColumn=s),s>i&&(0===this.engine.nodes.length&&this.responseLayout?(this.engine.nodes=e,this.engine.columnChanged(s,i,this.responseLayout),e=this.engine.nodes,this.engine.nodes=[],delete this.responseLayout):this.engine.cacheLayout(e,s,!0))
const n=D.addRemoveCB
"function"==typeof t&&(D.addRemoveCB=t)
const o=[]
this.batchUpdate()
const r=!this.engine.nodes.length,l=r&&this.opts.animate
l&&this.setAnimation(!1),!r&&t&&[...this.engine.nodes].forEach((t=>{t.id&&(a.find(e,t.id)||(D.addRemoveCB&&D.addRemoveCB(this.el,t,!1,!1),o.push(t),this.removeWidget(t.el,!0,!1)))})),this.engine._loading=!0
const h=[]
return this.engine.nodes=this.engine.nodes.filter((t=>!a.find(e,t.id)||(h.push(t),!1))),e.forEach((e=>{const i=a.find(h,e.id)
if(i){if(a.shouldSizeToContent(i)&&(e.h=i.h),this.engine.nodeBoundFix(e),(e.autoPosition||void 0===e.x||void 0===e.y)&&(e.w=e.w||i.w,e.h=e.h||i.h,this.engine.findEmptyPosition(e)),this.engine.nodes.push(i),a.samePos(i,e)&&this.engine.nodes.length>1&&(this.moveNode(i,{...e,forceCollide:!0}),a.copyPos(e,i)),this.update(i.el,e),e.subGridOpts?.children){const t=i.el.querySelector(".grid-stack")
t&&t.gridstack&&t.gridstack.load(e.subGridOpts.children)}}else t&&this.addWidget(e)})),delete this.engine._loading,this.engine.removedNodes=o,this.batchUpdate(!1),delete this._ignoreLayoutsNodeChange,delete this.engine.skipCacheUpdate,n?D.addRemoveCB=n:delete D.addRemoveCB,l&&this.setAnimation(!0,!0),this}batchUpdate(e=!0){return this.engine.batchUpdate(e),e||(this._updateContainerHeight(),this._triggerRemoveEvent(),this._triggerAddEvent(),this._triggerChangeEvent()),this}getCellHeight(e=!1){if(this.opts.cellHeight&&"auto"!==this.opts.cellHeight&&(!e||!this.opts.cellHeightUnit||"px"===this.opts.cellHeightUnit))return this.opts.cellHeight
if("rem"===this.opts.cellHeightUnit)return this.opts.cellHeight*parseFloat(getComputedStyle(document.documentElement).fontSize)
if("em"===this.opts.cellHeightUnit)return this.opts.cellHeight*parseFloat(getComputedStyle(this.el).fontSize)
if("cm"===this.opts.cellHeightUnit)return this.opts.cellHeight*(96/2.54)
if("mm"===this.opts.cellHeightUnit)return this.opts.cellHeight*(96/2.54)/10
const t=this.el.querySelector("."+this.opts.itemClass)
if(t){const e=a.toNumber(t.getAttribute("gs-h"))||1
return Math.round(t.offsetHeight/e)}const i=parseInt(this.el.getAttribute("gs-current-row"))
return i?Math.round(this.el.getBoundingClientRect().height/i):this.opts.cellHeight}cellHeight(e){if(void 0!==e&&this._isAutoCellHeight!==("auto"===e)&&(this._isAutoCellHeight="auto"===e,this._updateResizeEvent()),"initial"!==e&&"auto"!==e||(e=void 0),void 0===e){const t=-this.opts.marginRight-this.opts.marginLeft+this.opts.marginTop+this.opts.marginBottom
e=this.cellWidth()+t}const t=a.parseHeight(e)
return this.opts.cellHeightUnit===t.unit&&this.opts.cellHeight===t.h||(this.opts.cellHeightUnit=t.unit,this.opts.cellHeight=t.h,this.el.style.setProperty("--gs-cell-height",`${this.opts.cellHeight}${this.opts.cellHeightUnit}`),this._updateContainerHeight(),this.resizeToContentCheck()),this}cellWidth(){return this._widthOrContainer()/this.getColumn()}_widthOrContainer(e=!1){return e&&this.opts.columnOpts?.breakpointForWindow?window.innerWidth:this.el.clientWidth||this.el.parentElement.clientWidth||window.innerWidth}checkDynamicColumn(){const e=this.opts.columnOpts
if(!e||!e.columnWidth&&!e.breakpoints?.length)return!1
const t=this.getColumn()
let i=t
const s=this._widthOrContainer(!0)
if(e.columnWidth)i=Math.min(Math.round(s/e.columnWidth)||1,e.columnMax)
else{i=e.columnMax
let n=0
for(;n<e.breakpoints.length&&s<=e.breakpoints[n].w;)i=e.breakpoints[n++].c||t}if(i!==t){const t=e.breakpoints?.find((e=>e.c===i))
return this.column(i,t?.layout||e.layout),!0}return!1}compact(e="compact",t=!0){return this.engine.compact(e,t),this._triggerChangeEvent(),this}column(e,t="moveScale"){if(!e||e<1||this.opts.column===e)return this
const i=this.getColumn()
return this.opts.column=e,this.engine?(this.engine.column=e,this.el.classList.remove("gs-"+i),this._updateColumnVar(),this.engine.columnChanged(i,e,t),this._isAutoCellHeight&&this.cellHeight(),this.resizeToContentCheck(!0),this._ignoreLayoutsNodeChange=!0,this._triggerChangeEvent(),delete this._ignoreLayoutsNodeChange,this):(this.responseLayout=t,this)}getColumn(){return this.opts.column}getGridItems(){return Array.from(this.el.children).filter((e=>e.matches("."+this.opts.itemClass)&&!e.matches("."+this.opts.placeholderClass)))}isIgnoreChangeCB(){return this._ignoreLayoutsNodeChange}destroy(e=!0){if(this.el)return this.offAll(),this._updateResizeEvent(!0),this.setStatic(!0,!1),this.setAnimation(!1),e?this.el.parentNode.removeChild(this.el):(this.removeAll(e),this.el.removeAttribute("gs-current-row")),this.parentGridNode&&delete this.parentGridNode.subGrid,delete this.parentGridNode,delete this.opts,delete this._placeholder?.gridstackNode,delete this._placeholder,delete this.engine,delete this.el.gridstack,delete this.el,this}float(e){return this.opts.float!==e&&(this.opts.float=this.engine.float=e,this._triggerChangeEvent()),this}getFloat(){return this.engine.float}getCellFromPixel(e,t=!1){const i=this.el.getBoundingClientRect()
let s
s=t?{top:i.top+document.documentElement.scrollTop,left:i.left}:{top:this.el.offsetTop,left:this.el.offsetLeft}
const n=e.left-s.left,o=e.top-s.top,r=i.width/this.getColumn(),a=i.height/parseInt(this.el.getAttribute("gs-current-row"))
return{x:Math.floor(n/r),y:Math.floor(o/a)}}getRow(){return Math.max(this.engine.getRow(),this.opts.minRow||0)}isAreaEmpty(e,t,i,s){return this.engine.isAreaEmpty(e,t,i,s)}makeWidget(e,t){const i=D.getElement(e)
if(!i||i.gridstackNode)return i
i.parentElement||this.el.appendChild(i),this._prepareElement(i,!0,t)
const s=i.gridstackNode
let n
return this._updateContainerHeight(),s.subGridOpts&&this.makeSubGrid(i,s.subGridOpts,void 0,!1),1!==this.opts.column||this._ignoreLayoutsNodeChange||(n=this._ignoreLayoutsNodeChange=!0),this._triggerAddEvent(),this._triggerChangeEvent(),n&&delete this._ignoreLayoutsNodeChange,i}on(e,t){if(-1!==e.indexOf(" "))return e.split(" ").forEach((e=>this.on(e,t))),this
if("change"===e||"added"===e||"removed"===e||"enable"===e||"disable"===e){const i="enable"===e||"disable"===e
this._gsEventHandler[e]=i?e=>t(e):e=>{e.detail&&t(e,e.detail)},this.el.addEventListener(e,this._gsEventHandler[e])}else"drag"===e||"dragstart"===e||"dragstop"===e||"resizestart"===e||"resize"===e||"resizestop"===e||"dropped"===e||"resizecontent"===e?this._gsEventHandler[e]=t:console.error("GridStack.on("+e+") event not supported")
return this}off(e){return-1!==e.indexOf(" ")?(e.split(" ").forEach((e=>this.off(e))),this):("change"!==e&&"added"!==e&&"removed"!==e&&"enable"!==e&&"disable"!==e||this._gsEventHandler[e]&&this.el.removeEventListener(e,this._gsEventHandler[e]),delete this._gsEventHandler[e],this)}offAll(){return Object.keys(this._gsEventHandler).forEach((e=>this.off(e))),this}removeWidget(e,t=!0,i=!0){return e?(D.getElements(e).forEach((e=>{if(e.parentElement&&e.parentElement!==this.el)return
let s=e.gridstackNode
s||(s=this.engine.nodes.find((t=>e===t.el))),s&&(t&&D.addRemoveCB&&D.addRemoveCB(this.el,s,!1,!1),delete e.gridstackNode,this._removeDD(e),this.engine.removeNode(s,t,i),t&&e.parentElement&&e.remove())})),i&&(this._triggerRemoveEvent(),this._triggerChangeEvent()),this):(console.error("Error: GridStack.removeWidget(undefined) called"),this)}removeAll(e=!0,t=!0){return this.engine.nodes.forEach((t=>{e&&D.addRemoveCB&&D.addRemoveCB(this.el,t,!1,!1),delete t.el.gridstackNode,this.opts.staticGrid||this._removeDD(t.el)})),this.engine.removeAll(e,t),t&&this._triggerRemoveEvent(),this}setAnimation(e=this.opts.animate,t){return t?setTimeout((()=>{this.opts&&this.setAnimation(e)})):e?this.el.classList.add("grid-stack-animate"):this.el.classList.remove("grid-stack-animate"),this.opts.animate=e,this}hasAnimationCSS(){return this.el.classList.contains("grid-stack-animate")}setStatic(e,t=!0,i=!0){return!!this.opts.staticGrid===e||(e?this.opts.staticGrid=!0:delete this.opts.staticGrid,this._setupRemoveDrop(),this._setupAcceptWidget(),this.engine.nodes.forEach((s=>{this.prepareDragDrop(s.el),s.subGrid&&i&&s.subGrid.setStatic(e,t,i)})),t&&this._setStaticClass()),this}updateOptions(e){const t=this.opts
return e===t||(void 0!==e.acceptWidgets&&(t.acceptWidgets=e.acceptWidgets,this._setupAcceptWidget()),void 0!==e.animate&&this.setAnimation(e.animate),e.cellHeight&&this.cellHeight(e.cellHeight),void 0!==e.class&&e.class!==t.class&&(t.class&&this.el.classList.remove(t.class),e.class&&this.el.classList.add(e.class)),e.columnOpts?(this.opts.columnOpts=e.columnOpts,this.checkDynamicColumn()):null===e.columnOpts&&this.opts.columnOpts?(delete this.opts.columnOpts,this._updateResizeEvent()):"number"==typeof e.column&&this.column(e.column),void 0!==e.margin&&this.margin(e.margin),void 0!==e.staticGrid&&this.setStatic(e.staticGrid),void 0===e.disableDrag||e.staticGrid||this.enableMove(!e.disableDrag),void 0===e.disableResize||e.staticGrid||this.enableResize(!e.disableResize),void 0!==e.float&&this.float(e.float),void 0!==e.row?t.minRow=t.maxRow=t.row=e.row:(void 0!==e.minRow&&(t.minRow=e.minRow),void 0!==e.maxRow&&(t.maxRow=e.maxRow)),e.children?.length&&this.load(e.children)),this}update(e,t){return D.getElements(e).forEach((e=>{const i=e?.gridstackNode
if(!i)return
const s={...a.copyPos({},i),...a.cloneDeep(t)}
this.engine.nodeBoundFix(s),delete s.autoPosition
const n=["x","y","w","h"]
let o
if(n.some((e=>void 0!==s[e]&&s[e]!==i[e]))&&(o={},n.forEach((e=>{o[e]=void 0!==s[e]?s[e]:i[e],delete s[e]}))),!o&&(s.minW||s.minH||s.maxW||s.maxH)&&(o={}),void 0!==s.content){const t=e.querySelector(".grid-stack-item-content")
t&&t.textContent!==s.content&&(i.content=s.content,D.renderCB(t,s),i.subGrid?.el&&(t.appendChild(i.subGrid.el),i.subGrid._updateContainerHeight())),delete s.content}let r=!1,l=!1
for(const t in s)"_"!==t[0]&&i[t]!==s[t]&&(i[t]=s[t],r=!0,l=l||!this.opts.staticGrid&&("noResize"===t||"noMove"===t||"locked"===t))
if(a.sanitizeMinMax(i),o){const e=void 0!==o.w&&o.w!==i.w
this.moveNode(i,o),e&&i.subGrid?i.subGrid.onResize(this.hasAnimationCSS()?i.w:void 0):this.resizeToContentCheck(e,i),delete i._orig}(o||r)&&this._writeAttr(e,i),l&&this.prepareDragDrop(i.el)})),this}moveNode(e,t){const i=e._updating
i||this.engine.cleanNodes().beginUpdate(e),this.engine.moveNode(e,t),this._updateContainerHeight(),i||(this._triggerChangeEvent(),this.engine.endUpdate())}resizeToContent(e){if(!e)return
if(e.classList.remove("size-to-content-max"),!e.clientHeight)return
const t=e.gridstackNode
if(!t)return
const i=t.grid
if(!i||e.parentElement!==i.el)return
const s=i.getCellHeight(!0)
if(!s)return
let n,o=t.h?t.h*s:e.clientHeight
if(t.resizeToContentParent&&(n=e.querySelector(t.resizeToContentParent)),n||(n=e.querySelector(D.resizeToContentParent)),!n)return
const r=e.clientHeight-n.clientHeight,a=t.h?t.h*s-r:n.clientHeight
let l
if(t.subGrid){l=t.subGrid.getRow()*t.subGrid.getCellHeight(!0)
const i=t.subGrid.el.getBoundingClientRect(),s=e.getBoundingClientRect()
l+=i.top-s.top}else{if(t.subGridOpts?.children?.length)return
{const e=n.firstElementChild
if(!e)return void console.error(`Error: GridStack.resizeToContent() widget id:${t.id} '${D.resizeToContentParent}'.firstElementChild is null, make sure to have a div like container. Skipping sizing.`)
l=e.getBoundingClientRect().height||a}}if(a===l)return
o+=l-a
let h=Math.ceil(o/s)
const d=Number.isInteger(t.sizeToContent)?t.sizeToContent:0
d&&h>d&&(h=d,e.classList.add("size-to-content-max")),t.minH&&h<t.minH?h=t.minH:t.maxH&&h>t.maxH&&(h=t.maxH),h!==t.h&&(i._ignoreLayoutsNodeChange=!0,i.moveNode(t,{h:h}),delete i._ignoreLayoutsNodeChange)}resizeToContentCBCheck(e){D.resizeToContentCB?D.resizeToContentCB(e):this.resizeToContent(e)}rotate(e,t){return D.getElements(e).forEach((e=>{const i=e.gridstackNode
if(!a.canBeRotated(i))return
const s={w:i.h,h:i.w,minH:i.minW,minW:i.minH,maxH:i.maxW,maxW:i.maxH}
if(t){const e=t.left>0?Math.floor(t.left/this.cellWidth()):0,n=t.top>0?Math.floor(t.top/this.opts.cellHeight):0
s.x=i.x+e-(i.h-(n+1)),s.y=i.y+n-e}Object.keys(s).forEach((e=>{void 0===s[e]&&delete s[e]}))
const n=i._orig
this.update(e,s),i._orig=n})),this}margin(e){if(!("string"==typeof e&&e.split(" ").length>1)){const t=a.parseHeight(e)
if(this.opts.marginUnit===t.unit&&this.opts.margin===t.h)return}return this.opts.margin=e,this.opts.marginTop=this.opts.marginBottom=this.opts.marginLeft=this.opts.marginRight=void 0,this._initMargin(),this}getMargin(){return this.opts.margin}willItFit(e){if(arguments.length>1){console.warn("gridstack.ts: `willItFit(x,y,w,h,autoPosition)` is deprecated. Use `willItFit({x, y,...})`. It will be removed soon")
const e=arguments
let t=0,i={x:e[t++],y:e[t++],w:e[t++],h:e[t++],autoPosition:e[t++]}
return this.willItFit(i)}return this.engine.willItFit(e)}_triggerChangeEvent(){if(this.engine.batchMode)return this
const e=this.engine.getDirtyNodes(!0)
return e&&e.length&&(this._ignoreLayoutsNodeChange||this.engine.layoutsNodesChange(e),this._triggerEvent("change",e)),this.engine.saveInitial(),this}_triggerAddEvent(){if(this.engine.batchMode)return this
if(this.engine.addedNodes?.length){this._ignoreLayoutsNodeChange||this.engine.layoutsNodesChange(this.engine.addedNodes),this.engine.addedNodes.forEach((e=>{delete e._dirty}))
const e=[...this.engine.addedNodes]
this.engine.addedNodes=[],this._triggerEvent("added",e)}return this}_triggerRemoveEvent(){if(this.engine.batchMode)return this
if(this.engine.removedNodes?.length){const e=[...this.engine.removedNodes]
this.engine.removedNodes=[],this._triggerEvent("removed",e)}return this}_triggerEvent(e,t){const i=t?new CustomEvent(e,{bubbles:!1,detail:t}):new Event(e)
let s=this
for(;s.parentGridNode;)s=s.parentGridNode.grid
return s.el.dispatchEvent(i),this}_updateContainerHeight(){if(!this.engine||this.engine.batchMode)return this
const e=this.parentGridNode
let t=this.getRow()+this._extraDragRow
const i=this.opts.cellHeight,s=this.opts.cellHeightUnit
if(!i)return this
if(!e){const e=a.parseHeight(getComputedStyle(this.el).minHeight)
if(e.h>0&&e.unit===s){const s=Math.floor(e.h/i)
t<s&&(t=s)}}return this.el.setAttribute("gs-current-row",String(t)),this.el.style.removeProperty("min-height"),this.el.style.removeProperty("height"),t&&(this.el.style[e?"minHeight":"height"]=t*i+s),e&&a.shouldSizeToContent(e)&&e.grid.resizeToContentCBCheck(e.el),this}_prepareElement(e,t=!1,i){i=i||this._readAttr(e),e.gridstackNode=i,i.el=e,i.grid=this,i=this.engine.addNode(i,t),this._writeAttr(e,i),e.classList.add(h.itemClass,this.opts.itemClass)
const s=a.shouldSizeToContent(i)
return s?e.classList.add("size-to-content"):e.classList.remove("size-to-content"),s&&this.resizeToContentCheck(!1,i),a.lazyLoad(i)||this.prepareDragDrop(i.el),this}_writePosAttr(e,t){return(t._moving||t._resizing)&&this._placeholder!==e||(e.style.top=t.y?1===t.y?"var(--gs-cell-height)":`calc(${t.y} * var(--gs-cell-height))`:null,e.style.left=t.x?1===t.x?"var(--gs-column-width)":`calc(${t.x} * var(--gs-column-width))`:null,e.style.width=t.w>1?`calc(${t.w} * var(--gs-column-width))`:null,e.style.height=t.h>1?`calc(${t.h} * var(--gs-cell-height))`:null),t.x>0?e.setAttribute("gs-x",String(t.x)):e.removeAttribute("gs-x"),t.y>0?e.setAttribute("gs-y",String(t.y)):e.removeAttribute("gs-y"),t.w>1?e.setAttribute("gs-w",String(t.w)):e.removeAttribute("gs-w"),t.h>1?e.setAttribute("gs-h",String(t.h)):e.removeAttribute("gs-h"),this}_writeAttr(e,t){if(!t)return this
this._writePosAttr(e,t)
const i={noResize:"gs-no-resize",noMove:"gs-no-move",locked:"gs-locked",id:"gs-id",sizeToContent:"gs-size-to-content"}
for(const s in i)t[s]?e.setAttribute(i[s],String(t[s])):e.removeAttribute(i[s])
return this}_readAttr(e,t=!0){const i={}
i.x=a.toNumber(e.getAttribute("gs-x")),i.y=a.toNumber(e.getAttribute("gs-y")),i.w=a.toNumber(e.getAttribute("gs-w")),i.h=a.toNumber(e.getAttribute("gs-h")),i.autoPosition=a.toBool(e.getAttribute("gs-auto-position")),i.noResize=a.toBool(e.getAttribute("gs-no-resize")),i.noMove=a.toBool(e.getAttribute("gs-no-move")),i.locked=a.toBool(e.getAttribute("gs-locked"))
const s=e.getAttribute("gs-size-to-content")
s&&(i.sizeToContent="true"===s||"false"===s?a.toBool(s):parseInt(s,10)),i.id=e.getAttribute("gs-id"),i.maxW=a.toNumber(e.getAttribute("gs-max-w")),i.minW=a.toNumber(e.getAttribute("gs-min-w")),i.maxH=a.toNumber(e.getAttribute("gs-max-h")),i.minH=a.toNumber(e.getAttribute("gs-min-h")),t&&(1===i.w&&e.removeAttribute("gs-w"),1===i.h&&e.removeAttribute("gs-h"),i.maxW&&e.removeAttribute("gs-max-w"),i.minW&&e.removeAttribute("gs-min-w"),i.maxH&&e.removeAttribute("gs-max-h"),i.minH&&e.removeAttribute("gs-min-h"))
for(const n in i){if(!i.hasOwnProperty(n))return
i[n]||0===i[n]||"gs-size-to-content"===n||delete i[n]}return i}_setStaticClass(){const e=["grid-stack-static"]
return this.opts.staticGrid?(this.el.classList.add(...e),this.el.setAttribute("gs-static","true")):(this.el.classList.remove(...e),this.el.removeAttribute("gs-static")),this}onResize(e=this.el?.clientWidth){if(!e)return
if(this.prevWidth===e)return
this.prevWidth=e,this.batchUpdate()
let t=!1
return this._autoColumn&&this.parentGridNode?this.opts.column!==this.parentGridNode.w&&(this.column(this.parentGridNode.w,this.opts.layout||"list"),t=!0):t=this.checkDynamicColumn(),this._isAutoCellHeight&&this.cellHeight(),this.engine.nodes.forEach((e=>{e.subGrid&&e.subGrid.onResize()})),this._skipInitialResize||this.resizeToContentCheck(t),delete this._skipInitialResize,this.batchUpdate(!1),this}resizeToContentCheck(e=!1,t=void 0){if(this.engine){if(e&&this.hasAnimationCSS())return setTimeout((()=>this.resizeToContentCheck(!1,t)),this.animationDelay)
if(t)a.shouldSizeToContent(t)&&this.resizeToContentCBCheck(t.el)
else if(this.engine.nodes.some((e=>a.shouldSizeToContent(e)))){const e=[...this.engine.nodes]
this.batchUpdate(),e.forEach((e=>{a.shouldSizeToContent(e)&&this.resizeToContentCBCheck(e.el)})),this._ignoreLayoutsNodeChange=!0,this.batchUpdate(!1),this._ignoreLayoutsNodeChange=!1}this._gsEventHandler.resizecontent&&this._gsEventHandler.resizecontent(null,t?[t]:this.engine.nodes)}}_updateResizeEvent(e=!1){const t=!this.parentGridNode&&(this._isAutoCellHeight||this.opts.sizeToContent||this.opts.columnOpts||this.engine.nodes.find((e=>e.sizeToContent)))
return e||!t||this.resizeObserver?!e&&t||!this.resizeObserver||(this.resizeObserver.disconnect(),delete this.resizeObserver,delete this._sizeThrottle):(this._sizeThrottle=a.throttle((()=>this.onResize()),this.opts.cellHeightThrottle),this.resizeObserver=new ResizeObserver((()=>this._sizeThrottle())),this.resizeObserver.observe(this.el),this._skipInitialResize=!0),this}static getElement(e=".grid-stack-item"){return a.getElement(e)}static getElements(e=".grid-stack-item"){return a.getElements(e)}static getGridElement(e){return D.getElement(e)}static getGridElements(e){return a.getElements(e)}_initMargin(){let e,t=0,i=[]
"string"==typeof this.opts.margin&&(i=this.opts.margin.split(" ")),2===i.length?(this.opts.marginTop=this.opts.marginBottom=i[0],this.opts.marginLeft=this.opts.marginRight=i[1]):4===i.length?(this.opts.marginTop=i[0],this.opts.marginRight=i[1],this.opts.marginBottom=i[2],this.opts.marginLeft=i[3]):(e=a.parseHeight(this.opts.margin),this.opts.marginUnit=e.unit,t=this.opts.margin=e.h),["marginTop","marginRight","marginBottom","marginLeft"].forEach((i=>{void 0===this.opts[i]?this.opts[i]=t:(e=a.parseHeight(this.opts[i]),this.opts[i]=e.h,delete this.opts.margin)})),this.opts.marginUnit=e.unit,this.opts.marginTop===this.opts.marginBottom&&this.opts.marginLeft===this.opts.marginRight&&this.opts.marginTop===this.opts.marginRight&&(this.opts.margin=this.opts.marginTop)
const s=this.el.style
return s.setProperty("--gs-item-margin-top",`${this.opts.marginTop}${this.opts.marginUnit}`),s.setProperty("--gs-item-margin-bottom",`${this.opts.marginBottom}${this.opts.marginUnit}`),s.setProperty("--gs-item-margin-right",`${this.opts.marginRight}${this.opts.marginUnit}`),s.setProperty("--gs-item-margin-left",`${this.opts.marginLeft}${this.opts.marginUnit}`),this}static getDD(){return S}static setupDragIn(e,t,i,s=document){void 0!==t?.pause&&(d.pauseDrag=t.pause),t={appendTo:"body",helper:"clone",...t||{}},("string"==typeof e?a.getElements(e,s):e).forEach(((e,s)=>{S.isDraggable(e)||S.dragIn(e,t),i?.[s]&&(e.gridstackNode=i[s])}))}movable(e,t){return this.opts.staticGrid||D.getElements(e).forEach((e=>{const i=e.gridstackNode
i&&(t?delete i.noMove:i.noMove=!0,this.prepareDragDrop(i.el))})),this}resizable(e,t){return this.opts.staticGrid||D.getElements(e).forEach((e=>{const i=e.gridstackNode
i&&(t?delete i.noResize:i.noResize=!0,this.prepareDragDrop(i.el))})),this}disable(e=!0){if(!this.opts.staticGrid)return this.enableMove(!1,e),this.enableResize(!1,e),this._triggerEvent("disable"),this}enable(e=!0){if(!this.opts.staticGrid)return this.enableMove(!0,e),this.enableResize(!0,e),this._triggerEvent("enable"),this}enableMove(e,t=!0){return this.opts.staticGrid||(e?delete this.opts.disableDrag:this.opts.disableDrag=!0,this.engine.nodes.forEach((i=>{this.prepareDragDrop(i.el),i.subGrid&&t&&i.subGrid.enableMove(e,t)}))),this}enableResize(e,t=!0){return this.opts.staticGrid||(e?delete this.opts.disableResize:this.opts.disableResize=!0,this.engine.nodes.forEach((i=>{this.prepareDragDrop(i.el),i.subGrid&&t&&i.subGrid.enableResize(e,t)}))),this}cancelDrag(){const e=this._placeholder?.gridstackNode
e&&(e._isExternal?(e._isAboutToRemove=!0,this.engine.removeNode(e)):e._isAboutToRemove&&D._itemRemoving(e.el,!1),this.engine.restoreInitial())}_removeDD(e){return S.draggable(e,"destroy").resizable(e,"destroy"),e.gridstackNode&&delete e.gridstackNode._initDD,delete e.ddElement,this}_setupAcceptWidget(){if(this.opts.staticGrid||!this.opts.acceptWidgets&&!this.opts.removable)return S.droppable(this.el,"destroy"),this
let e,t
const i=(i,s,n)=>{const o=(n=n||s).gridstackNode
if(!o)return
if(!o.grid?.el){n.style.transform=`scale(${1/this.dragTransform.xScale},${1/this.dragTransform.yScale})`
const e=n.getBoundingClientRect()
n.style.left=e.x+(this.dragTransform.xScale-1)*(i.clientX-e.x)/this.dragTransform.xScale+"px",n.style.top=e.y+(this.dragTransform.yScale-1)*(i.clientY-e.y)/this.dragTransform.yScale+"px",n.style.transformOrigin="0px 0px"}let{top:r,left:l}=n.getBoundingClientRect()
const h=this.el.getBoundingClientRect()
l-=h.left,r-=h.top
const d={position:{top:r*this.dragTransform.xScale,left:l*this.dragTransform.yScale}}
if(o._temporaryRemoved){if(o.x=Math.max(0,Math.round(l/t)),o.y=Math.max(0,Math.round(r/e)),delete o.autoPosition,this.engine.nodeBoundFix(o),!this.engine.willItFit(o)){if(o.autoPosition=!0,!this.engine.willItFit(o))return void S.off(s,"drag")
o._willFitPos&&(a.copyPos(o,o._willFitPos),delete o._willFitPos)}this._onStartMoving(n,i,d,o,t,e)}else this._dragOrResize(n,i,d,o,t,e)}
return S.droppable(this.el,{accept:e=>{const t=e.gridstackNode||this._readAttr(e,!1)
if(t?.grid===this)return!0
if(!this.opts.acceptWidgets)return!1
let i=!0
if("function"==typeof this.opts.acceptWidgets)i=this.opts.acceptWidgets(e)
else{const t=!0===this.opts.acceptWidgets?".grid-stack-item":this.opts.acceptWidgets
i=e.matches(t)}if(i&&t&&this.opts.maxRow){const e={w:t.w,h:t.h,minW:t.minW,minH:t.minH}
i=this.engine.willItFit(e)}return i}}).on(this.el,"dropover",((s,n,o)=>{let r=o?.gridstackNode||n.gridstackNode
if(r?.grid===this&&!r._temporaryRemoved)return!1
if(r?._sidebarOrig&&(r.w=r._sidebarOrig.w,r.h=r._sidebarOrig.h),r?.grid&&r.grid!==this&&!r._temporaryRemoved&&r.grid._leave(n,o),o=o||n,t=this.cellWidth(),e=this.getCellHeight(!0),!r){const e=o.getAttribute("data-gs-widget")||o.getAttribute("gridstacknode")
if(e){try{r=JSON.parse(e)}catch(t){console.error("Gridstack dropover: Bad JSON format: ",e)}o.removeAttribute("data-gs-widget"),o.removeAttribute("gridstacknode")}r||(r=this._readAttr(o)),r._sidebarOrig={w:r.w,h:r.h}}r.grid||(r.el||(r={...r}),r._isExternal=!0,o.gridstackNode=r)
const a=r.w||Math.round(o.offsetWidth/t)||1,l=r.h||Math.round(o.offsetHeight/e)||1
return r.grid&&r.grid!==this?(n._gridstackNodeOrig||(n._gridstackNodeOrig=r),n.gridstackNode=r={...r,w:a,h:l,grid:this},delete r.x,delete r.y,this.engine.cleanupNode(r).nodeBoundFix(r),r._initDD=r._isExternal=r._temporaryRemoved=!0):(r.w=a,r.h=l,r._temporaryRemoved=!0),D._itemRemoving(r.el,!1),S.on(n,"drag",i),i(s,n,o),!1})).on(this.el,"dropout",((e,t,i)=>{const s=i?.gridstackNode||t.gridstackNode
return!!s&&(s.grid&&s.grid!==this||(this._leave(t,i),this._isTemp&&this.removeAsSubGrid(s)),!1)})).on(this.el,"drop",((e,t,i)=>{const s=i?.gridstackNode||t.gridstackNode
if(s?.grid===this&&!s._isExternal)return!1
const n=!!this.placeholder.parentElement,o=t!==i
this.placeholder.remove(),delete this.placeholder.gridstackNode,n&&this.opts.animate&&(this.setAnimation(!1),this.setAnimation(!0,!0))
const r=t._gridstackNodeOrig
if(delete t._gridstackNodeOrig,n&&r?.grid&&r.grid!==this){const e=r.grid
e.engine.removeNodeFromLayoutCache(r),e.engine.removedNodes.push(r),e._triggerRemoveEvent()._triggerChangeEvent(),e.parentGridNode&&!e.engine.nodes.length&&e.opts.subGridDynamic&&e.removeAsSubGrid()}if(!s)return!1
if(n&&(this.engine.cleanupNode(s),s.grid=this),delete s.grid?._isTemp,S.off(t,"drag"),i!==t?(i.remove(),t=i):t.remove(),this._removeDD(t),!n)return!1
const l=s.subGrid?.el?.gridstack
return a.copyPos(s,this._readAttr(this.placeholder)),a.removePositioningStyles(t),o&&(s.content||s.subGridOpts||D.addRemoveCB)?(delete s.el,t=this.addWidget(s)):(this._prepareElement(t,!0,s),this.el.appendChild(t),this.resizeToContentCheck(!1,s),l&&(l.parentGridNode=s),this._updateContainerHeight()),this.engine.addedNodes.push(s),this._triggerAddEvent(),this._triggerChangeEvent(),this.engine.endUpdate(),this._gsEventHandler.dropped&&this._gsEventHandler.dropped({...e,type:"dropped"},r&&r.grid?r:void 0,s),!1})),this}static _itemRemoving(e,t){if(!e)return
const i=e?e.gridstackNode:void 0
i?.grid&&!e.classList.contains(i.grid.opts.removableOptions.decline)&&(t?i._isAboutToRemove=!0:delete i._isAboutToRemove,t?e.classList.add("grid-stack-item-removing"):e.classList.remove("grid-stack-item-removing"))}_setupRemoveDrop(){if("string"!=typeof this.opts.removable)return this
const e=document.querySelector(this.opts.removable)
return e?(this.opts.staticGrid||S.isDroppable(e)||S.droppable(e,this.opts.removableOptions).on(e,"dropover",((e,t)=>D._itemRemoving(t,!0))).on(e,"dropout",((e,t)=>D._itemRemoving(t,!1))),this):this}prepareDragDrop(e,t=!1){const i=e?.gridstackNode
if(!i)return
const s=i.noMove||this.opts.disableDrag,n=i.noResize||this.opts.disableResize,o=this.opts.staticGrid||s&&n
if((t||o)&&(i._initDD&&(this._removeDD(e),delete i._initDD),o&&e.classList.add("ui-draggable-disabled","ui-resizable-disabled"),!t))return this
if(!i._initDD){let t,s
const n=(n,o)=>{this.triggerEvent(n,n.target),t=this.cellWidth(),s=this.getCellHeight(!0),this._onStartMoving(e,n,o,i,t,s)},o=(n,o)=>{this._dragOrResize(e,n,o,i,t,s)},r=t=>{this.placeholder.remove(),delete this.placeholder.gridstackNode,delete i._moving,delete i._resizing,delete i._event,delete i._lastTried
const s=i.w!==i._orig.w,n=t.target
if(n.gridstackNode&&n.gridstackNode.grid===this){if(i.el=n,i._isAboutToRemove){const s=e.gridstackNode.grid
s._gsEventHandler[t.type]&&s._gsEventHandler[t.type](t,n),s.engine.nodes.push(i),s.removeWidget(e,!0,!0)}else a.removePositioningStyles(n),i._temporaryRemoved?(a.copyPos(i,i._orig),this._writePosAttr(n,i),this.engine.addNode(i)):this._writePosAttr(n,i),this.triggerEvent(t,n)
this._extraDragRow=0,this._updateContainerHeight(),this._triggerChangeEvent(),this.engine.endUpdate(),"resizestop"===t.type&&(Number.isInteger(i.sizeToContent)&&(i.sizeToContent=i.h),this.resizeToContentCheck(s,i))}}
S.draggable(e,{start:n,stop:r,drag:o}).resizable(e,{start:n,stop:r,resize:o}),i._initDD=!0}return S.draggable(e,s?"disable":"enable").resizable(e,n?"disable":"enable"),this}_onStartMoving(e,t,i,s,n,o){if(this.engine.cleanNodes().beginUpdate(s),this._writePosAttr(this.placeholder,s),this.el.appendChild(this.placeholder),this.placeholder.gridstackNode=s,s.grid?.el)this.dragTransform=a.getValuesFromTransformedElement(e)
else if(this.placeholder&&this.placeholder.closest(".grid-stack")){const e=this.placeholder.closest(".grid-stack")
this.dragTransform=a.getValuesFromTransformedElement(e)}else this.dragTransform={xScale:1,xOffset:0,yScale:1,yOffset:0}
if(s.el=this.placeholder,s._lastUiPosition=i.position,s._prevYPix=i.position.top,s._moving="dragstart"===t.type,s._resizing="resizestart"===t.type,delete s._lastTried,"dropover"===t.type&&s._temporaryRemoved&&(this.engine.addNode(s),s._moving=!0),this.engine.cacheRects(n,o,this.opts.marginTop,this.opts.marginRight,this.opts.marginBottom,this.opts.marginLeft),"resizestart"===t.type){const t=this.getColumn()-s.x,i=(this.opts.maxRow||Number.MAX_SAFE_INTEGER)-s.y
S.resizable(e,"option","minWidth",n*Math.min(s.minW||1,t)).resizable(e,"option","minHeight",o*Math.min(s.minH||1,i)).resizable(e,"option","maxWidth",n*Math.min(s.maxW||Number.MAX_SAFE_INTEGER,t)).resizable(e,"option","maxWidthMoveLeft",n*Math.min(s.maxW||Number.MAX_SAFE_INTEGER,s.x+s.w)).resizable(e,"option","maxHeight",o*Math.min(s.maxH||Number.MAX_SAFE_INTEGER,i)).resizable(e,"option","maxHeightMoveUp",o*Math.min(s.maxH||Number.MAX_SAFE_INTEGER,s.y+s.h))}}_dragOrResize(e,t,i,s,n,o){const r={...s._orig}
let l,h=this.opts.marginLeft,d=this.opts.marginRight,c=this.opts.marginTop,g=this.opts.marginBottom
const u=Math.round(.1*o),p=Math.round(.1*n)
if(h=Math.min(h,p),d=Math.min(d,p),c=Math.min(c,u),g=Math.min(g,u),"drag"===t.type){if(s._temporaryRemoved)return
const t=i.position.top-s._prevYPix
s._prevYPix=i.position.top,!1!==this.opts.draggable.scroll&&a.updateScrollPosition(e,i.position,t)
const l=i.position.left+(i.position.left>s._lastUiPosition.left?-d:h),u=i.position.top+(i.position.top>s._lastUiPosition.top?-g:c)
r.x=Math.round(l/n),r.y=Math.round(u/o)
const p=this._extraDragRow
if(this.engine.collide(s,r)){const e=this.getRow()
let t=Math.max(0,r.y+s.h-e)
this.opts.maxRow&&e+t>this.opts.maxRow&&(t=Math.max(0,this.opts.maxRow-e)),this._extraDragRow=t}else this._extraDragRow=0
if(this._extraDragRow!==p&&this._updateContainerHeight(),s.x===r.x&&s.y===r.y)return}else if("resize"===t.type){if(r.x<0)return
if(a.updateScrollResize(t,e,o),r.w=Math.round((i.size.width-h)/n),r.h=Math.round((i.size.height-c)/o),s.w===r.w&&s.h===r.h)return
if(s._lastTried&&s._lastTried.w===r.w&&s._lastTried.h===r.h)return
const d=i.position.left+h,g=i.position.top+c
r.x=Math.round(d/n),r.y=Math.round(g/o),l=!0}s._event=t,s._lastTried=r
const m={x:i.position.left+h,y:i.position.top+c,w:(i.size?i.size.width:s.w*n)-h-d,h:(i.size?i.size.height:s.h*o)-c-g}
if(this.engine.moveNodeCheck(s,{...r,cellWidth:n,cellHeight:o,rect:m,resizing:l})){s._lastUiPosition=i.position,this.engine.cacheRects(n,o,c,d,g,h),delete s._skipDown,l&&s.subGrid&&s.subGrid.onResize(),this._extraDragRow=0,this._updateContainerHeight()
const e=t.target
s._sidebarOrig||this._writePosAttr(e,s),this.triggerEvent(t,e)}}triggerEvent(e,t){let i=this
for(;i.parentGridNode;)i=i.parentGridNode.grid
i._gsEventHandler[e.type]&&i._gsEventHandler[e.type](e,t)}_leave(e,t){const i=(t=t||e).gridstackNode
if(!i)return
if(t.style.transform=t.style.transformOrigin=null,S.off(e,"drag"),i._temporaryRemoved)return
i._temporaryRemoved=!0,this.engine.removeNode(i),i.el=i._isExternal&&t?t:e
const s=i._sidebarOrig
i._isExternal&&this.engine.cleanupNode(i),i._sidebarOrig=s,!0===this.opts.removable&&D._itemRemoving(e,!0),e._gridstackNodeOrig?(e.gridstackNode=e._gridstackNodeOrig,delete e._gridstackNodeOrig):i._isExternal&&this.engine.restoreInitial()}commit(){return s(this,this.batchUpdate(!1),"commit","batchUpdate","5.2"),this}}D.renderCB=(e,t)=>{e&&t?.content&&(e.textContent=t.content)},D.resizeToContentParent=".grid-stack-item-content",D.Utils=a,D.Engine=l,D.GDRev="12.1.2"},948:(e,t,i)=>{"use strict"
var s=i(643)
function n(){}function o(){}o.resetWarningCache=n,e.exports=function(){function e(e,t,i,n,o,r){if(r!==s){var a=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types")
throw a.name="Invariant Violation",a}}function t(){return e}e.isRequired=e
var i={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:o,resetWarningCache:n}
return i.PropTypes=i,i}},762:(e,t,i)=>{e.exports=i(948)()},643:e=>{"use strict"
e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},814:e=>{function t(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw new Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw new Error("set is read-only")}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach((i=>{const s=e[i],n=typeof s
"object"!==n&&"function"!==n||Object.isFrozen(s)||t(s)})),e}class i{constructor(e){void 0===e.data&&(e.data={}),this.data=e.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function s(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function n(e,...t){const i=Object.create(null)
for(const s in e)i[s]=e[s]
return t.forEach((function(e){for(const t in e)i[t]=e[t]})),i}const o=e=>!!e.scope
class r{constructor(e,t){this.buffer="",this.classPrefix=t.classPrefix,e.walk(this)}addText(e){this.buffer+=s(e)}openNode(e){if(!o(e))return
const t=((e,{prefix:t})=>{if(e.startsWith("language:"))return e.replace("language:","language-")
if(e.includes(".")){const i=e.split(".")
return[`${t}${i.shift()}`,...i.map(((e,t)=>`${e}${"_".repeat(t+1)}`))].join(" ")}return`${t}${e}`})(e.scope,{prefix:this.classPrefix})
this.span(t)}closeNode(e){o(e)&&(this.buffer+="</span>")}value(){return this.buffer}span(e){this.buffer+=`<span class="${e}">`}}const a=(e={})=>{const t={children:[]}
return Object.assign(t,e),t}
class l{constructor(){this.rootNode=a(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(e){this.top.children.push(e)}openNode(e){const t=a({scope:e})
this.add(t),this.stack.push(t)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(e){return this.constructor._walk(e,this.rootNode)}static _walk(e,t){return"string"==typeof t?e.addText(t):t.children&&(e.openNode(t),t.children.forEach((t=>this._walk(e,t))),e.closeNode(t)),e}static _collapse(e){"string"!=typeof e&&e.children&&(e.children.every((e=>"string"==typeof e))?e.children=[e.children.join("")]:e.children.forEach((e=>{l._collapse(e)})))}}class h extends l{constructor(e){super(),this.options=e}addText(e){""!==e&&this.add(e)}startScope(e){this.openNode(e)}endScope(){this.closeNode()}__addSublanguage(e,t){const i=e.root
t&&(i.scope=`language:${t}`),this.add(i)}toHTML(){return new r(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function d(e){return e?"string"==typeof e?e:e.source:null}function c(e){return p("(?=",e,")")}function g(e){return p("(?:",e,")*")}function u(e){return p("(?:",e,")?")}function p(...e){return e.map((e=>d(e))).join("")}function m(...e){const t=function(e){const t=e[e.length-1]
return"object"==typeof t&&t.constructor===Object?(e.splice(e.length-1,1),t):{}}(e)
return"("+(t.capture?"":"?:")+e.map((e=>d(e))).join("|")+")"}function f(e){return new RegExp(e.toString()+"|").exec("").length-1}const b=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./
function _(e,{joinWith:t}){let i=0
return e.map((e=>{i+=1
const t=i
let s=d(e),n=""
for(;s.length>0;){const e=b.exec(s)
if(!e){n+=s
break}n+=s.substring(0,e.index),s=s.substring(e.index+e[0].length),"\\"===e[0][0]&&e[1]?n+="\\"+String(Number(e[1])+t):(n+=e[0],"("===e[0]&&i++)}return n})).map((e=>`(${e})`)).join(t)}const y="[a-zA-Z]\\w*",v="[a-zA-Z_]\\w*",w="\\b\\d+(\\.\\d+)?",E="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",x="\\b(0b[01]+)",R={begin:"\\\\[\\s\\S]",relevance:0},k={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[R]},C={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[R]},N=function(e,t,i={}){const s=n({scope:"comment",begin:e,end:t,contains:[]},i)
s.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0})
const o=m("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/)
return s.contains.push({begin:p(/[ ]+/,"(",o,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),s},S=N("//","$"),D=N("/\\*","\\*/"),T=N("#","$"),z={scope:"number",begin:w,relevance:0},O={scope:"number",begin:E,relevance:0},M={scope:"number",begin:x,relevance:0},H={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[R,{begin:/\[/,end:/\]/,relevance:0,contains:[R]}]},A={scope:"title",begin:y,relevance:0},L={scope:"title",begin:v,relevance:0},P={begin:"\\.\\s*"+v,relevance:0}
var G=Object.freeze({__proto__:null,APOS_STRING_MODE:k,BACKSLASH_ESCAPE:R,BINARY_NUMBER_MODE:M,BINARY_NUMBER_RE:x,COMMENT:N,C_BLOCK_COMMENT_MODE:D,C_LINE_COMMENT_MODE:S,C_NUMBER_MODE:O,C_NUMBER_RE:E,END_SAME_AS_BEGIN:function(e){return Object.assign(e,{"on:begin":(e,t)=>{t.data._beginMatch=e[1]},"on:end":(e,t)=>{t.data._beginMatch!==e[1]&&t.ignoreMatch()}})},HASH_COMMENT_MODE:T,IDENT_RE:y,MATCH_NOTHING_RE:/\b\B/,METHOD_GUARD:P,NUMBER_MODE:z,NUMBER_RE:w,PHRASAL_WORDS_MODE:{begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},QUOTE_STRING_MODE:C,REGEXP_MODE:H,RE_STARTERS_RE:"!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",SHEBANG:(e={})=>{const t=/^#![ ]*\//
return e.binary&&(e.begin=p(t,/.*\b/,e.binary,/\b.*/)),n({scope:"meta",begin:t,end:/$/,relevance:0,"on:begin":(e,t)=>{0!==e.index&&t.ignoreMatch()}},e)},TITLE_MODE:A,UNDERSCORE_IDENT_RE:v,UNDERSCORE_TITLE_MODE:L})
function B(e,t){"."===e.input[e.index-1]&&t.ignoreMatch()}function I(e,t){void 0!==e.className&&(e.scope=e.className,delete e.className)}function W(e,t){t&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=B,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,void 0===e.relevance&&(e.relevance=0))}function U(e,t){Array.isArray(e.illegal)&&(e.illegal=m(...e.illegal))}function j(e,t){if(e.match){if(e.begin||e.end)throw new Error("begin & end are not supported with match")
e.begin=e.match,delete e.match}}function F(e,t){void 0===e.relevance&&(e.relevance=1)}const $=(e,t)=>{if(!e.beforeMatch)return
if(e.starts)throw new Error("beforeMatch cannot be used with starts")
const i=Object.assign({},e)
Object.keys(e).forEach((t=>{delete e[t]})),e.keywords=i.keywords,e.begin=p(i.beforeMatch,c(i.begin)),e.starts={relevance:0,contains:[Object.assign(i,{endsParent:!0})]},e.relevance=0,delete i.beforeMatch},X=["of","and","for","in","not","or","if","then","parent","list","value"],q="keyword"
function Y(e,t,i=q){const s=Object.create(null)
return"string"==typeof e?n(i,e.split(" ")):Array.isArray(e)?n(i,e):Object.keys(e).forEach((function(i){Object.assign(s,Y(e[i],t,i))})),s
function n(e,i){t&&(i=i.map((e=>e.toLowerCase()))),i.forEach((function(t){const i=t.split("|")
s[i[0]]=[e,K(i[0],i[1])]}))}}function K(e,t){return t?Number(t):function(e){return X.includes(e.toLowerCase())}(e)?0:1}const V={},Z=e=>{console.error(e)},J=(e,...t)=>{console.log(`WARN: ${e}`,...t)},Q=(e,t)=>{V[`${e}/${t}`]||(console.log(`Deprecated as of ${e}. ${t}`),V[`${e}/${t}`]=!0)},ee=new Error
function te(e,t,{key:i}){let s=0
const n=e[i],o={},r={}
for(let a=1;a<=t.length;a++)r[a+s]=n[a],o[a+s]=!0,s+=f(t[a-1])
e[i]=r,e[i]._emit=o,e[i]._multi=!0}function ie(e){!function(e){e.scope&&"object"==typeof e.scope&&null!==e.scope&&(e.beginScope=e.scope,delete e.scope)}(e),"string"==typeof e.beginScope&&(e.beginScope={_wrap:e.beginScope}),"string"==typeof e.endScope&&(e.endScope={_wrap:e.endScope}),function(e){if(Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw Z("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),ee
if("object"!=typeof e.beginScope||null===e.beginScope)throw Z("beginScope must be object"),ee
te(e,e.begin,{key:"beginScope"}),e.begin=_(e.begin,{joinWith:""})}}(e),function(e){if(Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw Z("skip, excludeEnd, returnEnd not compatible with endScope: {}"),ee
if("object"!=typeof e.endScope||null===e.endScope)throw Z("endScope must be object"),ee
te(e,e.end,{key:"endScope"}),e.end=_(e.end,{joinWith:""})}}(e)}function se(e){function t(t,i){return new RegExp(d(t),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(i?"g":""))}class i{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(e,t){t.position=this.position++,this.matchIndexes[this.matchAt]=t,this.regexes.push([t,e]),this.matchAt+=f(e)+1}compile(){0===this.regexes.length&&(this.exec=()=>null)
const e=this.regexes.map((e=>e[1]))
this.matcherRe=t(_(e,{joinWith:"|"}),!0),this.lastIndex=0}exec(e){this.matcherRe.lastIndex=this.lastIndex
const t=this.matcherRe.exec(e)
if(!t)return null
const i=t.findIndex(((e,t)=>t>0&&void 0!==e)),s=this.matchIndexes[i]
return t.splice(0,i),Object.assign(t,s)}}class s{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(e){if(this.multiRegexes[e])return this.multiRegexes[e]
const t=new i
return this.rules.slice(e).forEach((([e,i])=>t.addRule(e,i))),t.compile(),this.multiRegexes[e]=t,t}resumingScanAtSamePosition(){return 0!==this.regexIndex}considerAll(){this.regexIndex=0}addRule(e,t){this.rules.push([e,t]),"begin"===t.type&&this.count++}exec(e){const t=this.getMatcher(this.regexIndex)
t.lastIndex=this.lastIndex
let i=t.exec(e)
if(this.resumingScanAtSamePosition())if(i&&i.index===this.lastIndex);else{const t=this.getMatcher(0)
t.lastIndex=this.lastIndex+1,i=t.exec(e)}return i&&(this.regexIndex+=i.position+1,this.regexIndex===this.count&&this.considerAll()),i}}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.")
return e.classNameAliases=n(e.classNameAliases||{}),function i(o,r){const a=o
if(o.isCompiled)return a;[I,j,ie,$].forEach((e=>e(o,r))),e.compilerExtensions.forEach((e=>e(o,r))),o.__beforeBegin=null,[W,U,F].forEach((e=>e(o,r))),o.isCompiled=!0
let l=null
return"object"==typeof o.keywords&&o.keywords.$pattern&&(o.keywords=Object.assign({},o.keywords),l=o.keywords.$pattern,delete o.keywords.$pattern),l=l||/\w+/,o.keywords&&(o.keywords=Y(o.keywords,e.case_insensitive)),a.keywordPatternRe=t(l,!0),r&&(o.begin||(o.begin=/\B|\b/),a.beginRe=t(a.begin),o.end||o.endsWithParent||(o.end=/\B|\b/),o.end&&(a.endRe=t(a.end)),a.terminatorEnd=d(a.end)||"",o.endsWithParent&&r.terminatorEnd&&(a.terminatorEnd+=(o.end?"|":"")+r.terminatorEnd)),o.illegal&&(a.illegalRe=t(o.illegal)),o.contains||(o.contains=[]),o.contains=[].concat(...o.contains.map((function(e){return function(e){return e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map((function(t){return n(e,{variants:null},t)}))),e.cachedVariants?e.cachedVariants:ne(e)?n(e,{starts:e.starts?n(e.starts):null}):Object.isFrozen(e)?n(e):e}("self"===e?o:e)}))),o.contains.forEach((function(e){i(e,a)})),o.starts&&i(o.starts,r),a.matcher=function(e){const t=new s
return e.contains.forEach((e=>t.addRule(e.begin,{rule:e,type:"begin"}))),e.terminatorEnd&&t.addRule(e.terminatorEnd,{type:"end"}),e.illegal&&t.addRule(e.illegal,{type:"illegal"}),t}(a),a}(e)}function ne(e){return!!e&&(e.endsWithParent||ne(e.starts))}class oe extends Error{constructor(e,t){super(e),this.name="HTMLInjectionError",this.html=t}}const re=s,ae=n,le=Symbol("nomatch"),he=function(e){const s=Object.create(null),n=Object.create(null),o=[]
let r=!0
const a="Could not find the language '{}', did you forget to load/include a language module?",l={disableAutodetect:!0,name:"Plain text",contains:[]}
let d={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:h}
function f(e){return d.noHighlightRe.test(e)}function b(e,t,i){let s="",n=""
"object"==typeof t?(s=e,i=t.ignoreIllegals,n=t.language):(Q("10.7.0","highlight(lang, code, ...args) has been deprecated."),Q("10.7.0","Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"),n=e,s=t),void 0===i&&(i=!0)
const o={code:s,language:n}
C("before:highlight",o)
const r=o.result?o.result:_(o.language,o.code,i)
return r.code=o.code,C("after:highlight",r),r}function _(e,t,n,o){const l=Object.create(null)
function h(){if(!k.keywords)return void N.addText(S)
let e=0
k.keywordPatternRe.lastIndex=0
let t=k.keywordPatternRe.exec(S),i=""
for(;t;){i+=S.substring(e,t.index)
const n=w.case_insensitive?t[0].toLowerCase():t[0],o=(s=n,k.keywords[s])
if(o){const[e,s]=o
if(N.addText(i),i="",l[n]=(l[n]||0)+1,l[n]<=7&&(D+=s),e.startsWith("_"))i+=t[0]
else{const i=w.classNameAliases[e]||e
g(t[0],i)}}else i+=t[0]
e=k.keywordPatternRe.lastIndex,t=k.keywordPatternRe.exec(S)}var s
i+=S.substring(e),N.addText(i)}function c(){null!=k.subLanguage?function(){if(""===S)return
let e=null
if("string"==typeof k.subLanguage){if(!s[k.subLanguage])return void N.addText(S)
e=_(k.subLanguage,S,!0,C[k.subLanguage]),C[k.subLanguage]=e._top}else e=y(S,k.subLanguage.length?k.subLanguage:null)
k.relevance>0&&(D+=e.relevance),N.__addSublanguage(e._emitter,e.language)}():h(),S=""}function g(e,t){""!==e&&(N.startScope(t),N.addText(e),N.endScope())}function u(e,t){let i=1
const s=t.length-1
for(;i<=s;){if(!e._emit[i]){i++
continue}const s=w.classNameAliases[e[i]]||e[i],n=t[i]
s?g(n,s):(S=n,h(),S=""),i++}}function p(e,t){return e.scope&&"string"==typeof e.scope&&N.openNode(w.classNameAliases[e.scope]||e.scope),e.beginScope&&(e.beginScope._wrap?(g(S,w.classNameAliases[e.beginScope._wrap]||e.beginScope._wrap),S=""):e.beginScope._multi&&(u(e.beginScope,t),S="")),k=Object.create(e,{parent:{value:k}}),k}function m(e,t,s){let n=function(e,t){const i=e&&e.exec(t)
return i&&0===i.index}(e.endRe,s)
if(n){if(e["on:end"]){const s=new i(e)
e["on:end"](t,s),s.isMatchIgnored&&(n=!1)}if(n){for(;e.endsParent&&e.parent;)e=e.parent
return e}}if(e.endsWithParent)return m(e.parent,t,s)}function f(e){return 0===k.matcher.regexIndex?(S+=e[0],1):(O=!0,0)}let b={}
function v(s,o){const a=o&&o[0]
if(S+=s,null==a)return c(),0
if("begin"===b.type&&"end"===o.type&&b.index===o.index&&""===a){if(S+=t.slice(o.index,o.index+1),!r){const t=new Error(`0 width match regex (${e})`)
throw t.languageName=e,t.badRule=b.rule,t}return 1}if(b=o,"begin"===o.type)return function(e){const t=e[0],s=e.rule,n=new i(s),o=[s.__beforeBegin,s["on:begin"]]
for(const i of o)if(i&&(i(e,n),n.isMatchIgnored))return f(t)
return s.skip?S+=t:(s.excludeBegin&&(S+=t),c(),s.returnBegin||s.excludeBegin||(S=t)),p(s,e),s.returnBegin?0:t.length}(o)
if("illegal"===o.type&&!n){const e=new Error('Illegal lexeme "'+a+'" for mode "'+(k.scope||"<unnamed>")+'"')
throw e.mode=k,e}if("end"===o.type){const e=function(e){const i=e[0],s=t.substring(e.index),n=m(k,e,s)
if(!n)return le
const o=k
k.endScope&&k.endScope._wrap?(c(),g(i,k.endScope._wrap)):k.endScope&&k.endScope._multi?(c(),u(k.endScope,e)):o.skip?S+=i:(o.returnEnd||o.excludeEnd||(S+=i),c(),o.excludeEnd&&(S=i))
do{k.scope&&N.closeNode(),k.skip||k.subLanguage||(D+=k.relevance),k=k.parent}while(k!==n.parent)
return n.starts&&p(n.starts,e),o.returnEnd?0:i.length}(o)
if(e!==le)return e}if("illegal"===o.type&&""===a)return 1
if(z>1e5&&z>3*o.index)throw new Error("potential infinite loop, way more iterations than matches")
return S+=a,a.length}const w=x(e)
if(!w)throw Z(a.replace("{}",e)),new Error('Unknown language: "'+e+'"')
const E=se(w)
let R="",k=o||E
const C={},N=new d.__emitter(d)
!function(){const e=[]
for(let t=k;t!==w;t=t.parent)t.scope&&e.unshift(t.scope)
e.forEach((e=>N.openNode(e)))}()
let S="",D=0,T=0,z=0,O=!1
try{if(w.__emitTokens)w.__emitTokens(t,N)
else{for(k.matcher.considerAll();;){z++,O?O=!1:k.matcher.considerAll(),k.matcher.lastIndex=T
const e=k.matcher.exec(t)
if(!e)break
const i=v(t.substring(T,e.index),e)
T=e.index+i}v(t.substring(T))}return N.finalize(),R=N.toHTML(),{language:e,value:R,relevance:D,illegal:!1,_emitter:N,_top:k}}catch(i){if(i.message&&i.message.includes("Illegal"))return{language:e,value:re(t),illegal:!0,relevance:0,_illegalBy:{message:i.message,index:T,context:t.slice(T-100,T+100),mode:i.mode,resultSoFar:R},_emitter:N}
if(r)return{language:e,value:re(t),illegal:!1,relevance:0,errorRaised:i,_emitter:N,_top:k}
throw i}}function y(e,t){t=t||d.languages||Object.keys(s)
const i=function(e){const t={value:re(e),illegal:!1,relevance:0,_top:l,_emitter:new d.__emitter(d)}
return t._emitter.addText(e),t}(e),n=t.filter(x).filter(k).map((t=>_(t,e,!1)))
n.unshift(i)
const o=n.sort(((e,t)=>{if(e.relevance!==t.relevance)return t.relevance-e.relevance
if(e.language&&t.language){if(x(e.language).supersetOf===t.language)return 1
if(x(t.language).supersetOf===e.language)return-1}return 0})),[r,a]=o,h=r
return h.secondBest=a,h}function v(e){let t=null
const i=function(e){let t=e.className+" "
t+=e.parentNode?e.parentNode.className:""
const i=d.languageDetectRe.exec(t)
if(i){const t=x(i[1])
return t||(J(a.replace("{}",i[1])),J("Falling back to no-highlight mode for this block.",e)),t?i[1]:"no-highlight"}return t.split(/\s+/).find((e=>f(e)||x(e)))}(e)
if(f(i))return
if(C("before:highlightElement",{el:e,language:i}),e.dataset.highlighted)return void console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",e)
if(e.children.length>0&&(d.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(e)),d.throwUnescapedHTML))throw new oe("One of your code blocks includes unescaped HTML.",e.innerHTML)
t=e
const s=t.textContent,o=i?b(s,{language:i,ignoreIllegals:!0}):y(s)
e.innerHTML=o.value,e.dataset.highlighted="yes",function(e,t,i){const s=t&&n[t]||i
e.classList.add("hljs"),e.classList.add(`language-${s}`)}(e,i,o.language),e.result={language:o.language,re:o.relevance,relevance:o.relevance},o.secondBest&&(e.secondBest={language:o.secondBest.language,relevance:o.secondBest.relevance}),C("after:highlightElement",{el:e,result:o,text:s})}let w=!1
function E(){"loading"!==document.readyState?document.querySelectorAll(d.cssSelector).forEach(v):w=!0}function x(e){return e=(e||"").toLowerCase(),s[e]||s[n[e]]}function R(e,{languageName:t}){"string"==typeof e&&(e=[e]),e.forEach((e=>{n[e.toLowerCase()]=t}))}function k(e){const t=x(e)
return t&&!t.disableAutodetect}function C(e,t){const i=e
o.forEach((function(e){e[i]&&e[i](t)}))}"undefined"!=typeof window&&window.addEventListener&&window.addEventListener("DOMContentLoaded",(function(){w&&E()}),!1),Object.assign(e,{highlight:b,highlightAuto:y,highlightAll:E,highlightElement:v,highlightBlock:function(e){return Q("10.7.0","highlightBlock will be removed entirely in v12.0"),Q("10.7.0","Please use highlightElement now."),v(e)},configure:function(e){d=ae(d,e)},initHighlighting:()=>{E(),Q("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")},initHighlightingOnLoad:function(){E(),Q("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")},registerLanguage:function(t,i){let n=null
try{n=i(e)}catch(e){if(Z("Language definition for '{}' could not be registered.".replace("{}",t)),!r)throw e
Z(e),n=l}n.name||(n.name=t),s[t]=n,n.rawDefinition=i.bind(null,e),n.aliases&&R(n.aliases,{languageName:t})},unregisterLanguage:function(e){delete s[e]
for(const t of Object.keys(n))n[t]===e&&delete n[t]},listLanguages:function(){return Object.keys(s)},getLanguage:x,registerAliases:R,autoDetection:k,inherit:ae,addPlugin:function(e){!function(e){e["before:highlightBlock"]&&!e["before:highlightElement"]&&(e["before:highlightElement"]=t=>{e["before:highlightBlock"](Object.assign({block:t.el},t))}),e["after:highlightBlock"]&&!e["after:highlightElement"]&&(e["after:highlightElement"]=t=>{e["after:highlightBlock"](Object.assign({block:t.el},t))})}(e),o.push(e)},removePlugin:function(e){const t=o.indexOf(e);-1!==t&&o.splice(t,1)}}),e.debugMode=function(){r=!1},e.safeMode=function(){r=!0},e.versionString="11.10.0",e.regex={concat:p,lookahead:c,either:m,optional:u,anyNumberOfTimes:g}
for(const i in G)"object"==typeof G[i]&&t(G[i])
return Object.assign(e,G),e},de=he({})
de.newInstance=()=>he({}),e.exports=de,de.HighlightJS=de,de.default=de},889:e=>{e.exports=function(e){const t=e.regex,i={$pattern:/[\w.\/]+/,built_in:["action","bindattr","collection","component","concat","debugger","each","each-in","get","hash","if","in","input","link-to","loc","log","lookup","mut","outlet","partial","query-params","render","template","textarea","unbound","unless","view","with","yield"]},s=/\[\]|\[[^\]]+\]/,n=/[^\s!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~]+/,o=t.either(/""|"[^"]+"/,/''|'[^']+'/,s,n),r=t.concat(t.optional(/\.|\.\/|\//),o,t.anyNumberOfTimes(t.concat(/(\.|\/)/,o))),a=t.concat("(",s,"|",n,")(?==)"),l={begin:r},h=e.inherit(l,{keywords:{$pattern:/[\w.\/]+/,literal:["true","false","undefined","null"]}}),d={begin:/\(/,end:/\)/},c={className:"attr",begin:a,relevance:0,starts:{begin:/=/,end:/=/,starts:{contains:[e.NUMBER_MODE,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,h,d]}}},g={contains:[e.NUMBER_MODE,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,{begin:/as\s+\|/,keywords:{keyword:"as"},end:/\|/,contains:[{begin:/\w+/}]},c,h,d],returnEnd:!0},u=e.inherit(l,{className:"name",keywords:i,starts:e.inherit(g,{end:/\)/})})
d.contains=[u]
const p=e.inherit(l,{keywords:i,className:"name",starts:e.inherit(g,{end:/\}\}/})}),m=e.inherit(l,{keywords:i,className:"name"}),f=e.inherit(l,{className:"name",keywords:i,starts:e.inherit(g,{end:/\}\}/})})
return{name:"Handlebars",aliases:["hbs","html.hbs","html.handlebars","htmlbars"],case_insensitive:!0,subLanguage:"xml",contains:[{begin:/\\\{\{/,skip:!0},{begin:/\\\\(?=\{\{)/,skip:!0},e.COMMENT(/\{\{!--/,/--\}\}/),e.COMMENT(/\{\{!/,/\}\}/),{className:"template-tag",begin:/\{\{\{\{(?!\/)/,end:/\}\}\}\}/,contains:[p],starts:{end:/\{\{\{\{\//,returnEnd:!0,subLanguage:"xml"}},{className:"template-tag",begin:/\{\{\{\{\//,end:/\}\}\}\}/,contains:[m]},{className:"template-tag",begin:/\{\{#/,end:/\}\}/,contains:[p]},{className:"template-tag",begin:/\{\{(?=else\}\})/,end:/\}\}/,keywords:"else"},{className:"template-tag",begin:/\{\{(?=else if)/,end:/\}\}/,keywords:"else if"},{className:"template-tag",begin:/\{\{\//,end:/\}\}/,contains:[m]},{className:"template-variable",begin:/\{\{\{/,end:/\}\}\}/,contains:[f]},{className:"template-variable",begin:/\{\{/,end:/\}\}/,contains:[f]}]}}}}])
