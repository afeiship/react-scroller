!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("classnames"),require("next-browser"),require("next-dom-event"),require("next-scroller"),require("noop"),require("prop-types"),require("react"),require("react-event-emitter")):"function"==typeof define&&define.amd?define(["classnames","next-browser","next-dom-event","next-scroller","noop","prop-types","react","react-event-emitter"],t):"object"==typeof exports?exports.ReactScroller=t(require("classnames"),require("next-browser"),require("next-dom-event"),require("next-scroller"),require("noop"),require("prop-types"),require("react"),require("react-event-emitter")):e.ReactScroller=t(e.classnames,e["next-browser"],e["next-dom-event"],e["next-scroller"],e.noop,e["prop-types"],e.react,e["react-event-emitter"])}(this,function(e,t,n,r,i,o,s,a){return function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return e[r].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="/",t(0)}([function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=n(1),o=r(i);t.default=o.default},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var l,c,f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},h=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=n(8),p=r(d),v=n(3),m=r(v),y=n(4),S=r(y),_=n(7),x=r(_),b=n(9),R=r(b),g=n(5),w=r(g),P=n(2),k=r(P),O=n(6),E=r(O),j=navigator.userAgent,T=document.createElement("div"),q=m.default.jsPrefix(),D=q+"Perspective",M=q+"Transform",I=void 0!==T.style[M],N=void 0!==T.style[D],A=/input|textarea|select/i,W=["init","active","running"],C=j.indexOf("Windows Phone")>=0,B=(j.indexOf("Android")>0&&!C,/iP(ad|hone|od)/.test(j)&&!C),H=(c=l=function(e){function t(e){s(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n._onStart=function(e){!n.shouldRetainDefault(e)&&B&&e.preventDefault(),n._scroller.doTouchStart(e.touches,e.timeStamp)},n._onRefresh=function(){n.refresh()},n._onMove=function(e){var t=n.props.onScroll,r=n._scroller.getValues();return n.shouldRetainDefault(e)?null:(n._scroller.doTouchMove(e.touches,e.timeStamp),n.activateInfinite(),n.fire("scroll",r),t(r),void e.preventDefault())},n._onEnd=function(e){var t=n.state.infiniterStatus,r=n.props.onInfinite;"active"===t&&(n.setState({infiniterStatus:"running"}),!n._scroller.__refreshActive&&r.call(n,n)),n._scroller.doTouchEnd(e.timeStamp)},n.init(),n._mouted=!1,n}return u(t,e),h(t,[{key:"init",value:function(){var e=this.props,t=e.refresherStatus,n=e.infiniterStatus;this.attachDocEvents(),this.createScroller(),this.activatePullToRrefresh(),this.state={contentStyle:{},refresherStatus:t,infiniterStatus:n}}},{key:"componentAttachEvents",value:function(){}},{key:"attachDocEvents",value:function(){var e=this;this._loadRes=S.default.on(window,"load",function(){e.refresh()})}},{key:"componentWillUnmount",value:function(){this.detachDocEvents(),this._scroller=null,this._mouted=!1,this._loadRes=null}},{key:"componentDidMount",value:function(){this.refresh(),this._mouted=!0}},{key:"componentWillReceiveProps",value:function(e){this.setState(e)}},{key:"componentDidUpdate",value:function(e){e.children!==this.props.children&&this.refresh()}},{key:"attachDocEvents",value:function(){this._loadRes=S.default.on(window,"load",this._onRefresh),this._touchmoveRes=S.default.on(document,"touchmove",this._onMove),this._touchmoveRes=S.default.on(document,"touchend",this._onEnd)}},{key:"detachDocEvents",value:function(){this._loadRes=null,this._touchmoveRes=null,this._touchmoveRes=null}},{key:"createScroller",value:function(){var e=this.props.options;this._scroller=new w.default(this.scrollerRender(),e)}},{key:"refresh",value:function(){var e=this.refs,t=e.container,n=e.content;this._scroller.setDimensions(t.clientWidth,t.clientHeight,n.offsetWidth,n.offsetHeight)}},{key:"scrollTo",value:function(e,t,n,r){this._scroller.scrollTo(e,t,n,r)}},{key:"scrollerRender",value:function(){var e=this;switch(this._mouted){case N:return function(t,n,r){var i="translate3d("+-t+"px,"+-n+"px,0) scale("+r+")";e.setState({contentStyle:o({},M,i)})};case I:return function(t,n,r){var i="translate("+-t+"px,"+-n+"px) scale("+r+")";e.setState({contentStyle:o({},M,i)})};default:return function(t,n,r){var i=t?-t/r+"px":"",o=n?-n/r+"px":"";e.setState({contentStyle:{marginLeft:i,marginTop:o,inZoom:r}})}}}},{key:"activateInfinite",value:function(){var e=this.refs,t=e.container,n=e.content,r=this.props,i=r.distances,o=r.infiniter,s=W.indexOf(this.state.infiniterStatus)>-1;if(o&&s&&t&&n){var a=n.getBoundingClientRect(),u=t.getBoundingClientRect();a.bottom-u.bottom<i[1]?this.setState({infiniterStatus:"active"}):this.setState({infiniterStatus:"init"})}}},{key:"activatePullToRrefresh",value:function(){var e=this,t=this.props,n=t.distances,r=t.refresher,i=t.onRefresh;r&&this._scroller.activatePullToRefresh(n[0],function(){e.setState({refresherStatus:"active"})},function(){e.setState({refresherStatus:"init",infiniterStatus:"init"})},function(){e.setState({refresherStatus:"running"}),e._scroller.__refreshActive&&i.call(e,e)})}},{key:"finishInfinte",value:function(){this.setState({infiniterStatus:"init"}),this._scroller&&this._scroller.finishPullToRefresh()}},{key:"finishPullToRefresh",value:function(){this._scroller&&this._scroller.finishPullToRefresh()}},{key:"shouldRetainDefault",value:function(e){return e.target.tagName.match(A)}},{key:"render",value:function(){var e=this.state.contentStyle,t=this.props,n=t.className,r=t.children,o=t.refresher,s=t.infiniter,a=(t.onInfinite,t.onRefresh,t.options,t.distances,t.refresherStatus,t.infiniterStatus,i(t,["className","children","refresher","infiniter","onInfinite","onRefresh","options","distances","refresherStatus","infiniterStatus"]));return p.default.createElement("div",f({},a,{ref:"container",className:(0,k.default)("react-scroller",n),onTouchStart:this._onStart}),p.default.createElement("div",{ref:"content",className:"react-scroller-content",style:e},o&&(0,d.createElement)(o,{status:this.state.refresherStatus}),p.default.createElement("div",{className:"bd"},r),s&&(0,d.createElement)(s,{status:this.state.infiniterStatus})))}}]),t}(R.default),l.propTypes={className:x.default.string,options:x.default.object,refresherStatus:x.default.string,infiniterStatus:x.default.string,onRefresh:x.default.func,refresher:x.default.func,infiniter:x.default.func,distance:x.default.array,onInfinite:x.default.func,onScroll:x.default.func},l.defaultProps={options:{animationDuration:300,scrollingX:!1,speedMultiplier:.8,penetrationDeceleration:.1,penetrationAcceleration:.1},refresherStatus:"init",infiniterStatus:"init",onRefresh:E.default,onInfinite:E.default,onScroll:E.default,refresher:null,infiniter:null,distances:[50,-50]},c);t.default=H},function(t,n){t.exports=e},function(e,n){e.exports=t},function(e,t){e.exports=n},function(e,t){e.exports=r},function(e,t){e.exports=i},function(e,t){e.exports=o},function(e,t){e.exports=s},function(e,t){e.exports=a}])});
//# sourceMappingURL=react-scroller.js.map