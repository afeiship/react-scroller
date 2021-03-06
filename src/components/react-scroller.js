import React, {PureComponent, createElement} from 'react';

import NxBrowser from 'next-browser';
import NxDomEvent from 'next-dom-event';
import PropTypes from 'prop-types';
import ReactEventEmitter from 'react-event-emitter';
import Scroller from 'next-scroller';
import classNames from 'classnames';
import noop from 'noop';
import nx from 'next-js-core2';
import NxTouchEvents from 'next-touch-events';

const userAgent = navigator.userAgent;
const helperElem = document.createElement("div");
const vendorPrefix = NxBrowser.jsPrefix();
const perspectiveProperty = vendorPrefix + "Perspective";
const transformProperty = vendorPrefix + "Transform";
const supportTransformProperty = helperElem.style[transformProperty] !== undefined;
const supportPerspectiveProperty = helperElem.style[perspectiveProperty] !== undefined;
const retainElementRE = /input|textarea|select/i;
const INNER_STATUS = ['init', 'active', 'running'];

//devices judgements:
const deviceIsWindowsPhone = userAgent.indexOf("Windows Phone") >= 0;
const deviceIsAndroid = userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;
const deviceIsIOS = /iP(ad|hone|od)/.test(userAgent) && !deviceIsWindowsPhone;


export default class extends ReactEventEmitter {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.object,
    refresherStatus: PropTypes.string,
    infiniterStatus: PropTypes.string,
    onRefresh: PropTypes.func,
    refresher: PropTypes.func,
    infiniter: PropTypes.func,
    distance: PropTypes.array,
    onInfinite: PropTypes.func,
    onScroll: PropTypes.func,
    onScrollEnd: PropTypes.func,
  };

  static defaultProps = {
    options: {
      animationDuration: 300,
      scrollingX: false,
      speedMultiplier:0.8,
      penetrationDeceleration: 0.1,
      penetrationAcceleration: 0.1
    },
    refresherStatus: 'init',
    infiniterStatus: 'init',
    onRefresh: noop,
    onInfinite: noop,
    onScroll: noop,
    onScrollEnd: noop,
    refresher: null,
    infiniter: null,
    distances: [50, 50]
  };

  constructor(props) {
    super(props);
    this.init();
    this._mouted = false;
  }

  init() {
    const {refresherStatus, infiniterStatus} = this.props;
    this.attachDocEvents();
    this.createScroller();
    this.activatePullToRrefresh();
    this.state = {
      contentStyle: {},
      refresherStatus,
      infiniterStatus
    };
  }
  componentAttachEvents(){}

  componentWillUnmount() {
    this.detachDocEvents();
    this._scroller = null;
    this._mouted = false;
    super.componentWillUnmount();
  }

  componentDidMount() {
    this.refresh();
    this._mouted = true;
  }

  componentWillReceiveProps(inNextProps) {
    this.setState(inNextProps);
  }

  componentDidUpdate(nextProps) {
    if (nextProps.children !== this.props.children) {
      this.refresh();
    }
  }

  attachDocEvents() {
    this._loadRes = NxDomEvent.on(window,'load',this._onRefresh);
    this._touchmoveRes = NxDomEvent.on(document,NxTouchEvents.TOUCH_MOVE,this._onMove );
    this._touchendRes = NxDomEvent.on(document,NxTouchEvents.TOUCH_END, this._onEnd );
  }

  detachDocEvents() {
    this._loadRes.destroy();
    this._touchmoveRes.destroy();
    this._touchendRes.destroy();
  }

  createScroller() {
    const {options} = this.props;
    this._scroller = new Scroller(this.scrollerRender(), options);
  }

  refresh() {
    let {container, content} = this.refs;
    this._scroller.setDimensions(
      container.clientWidth,
      container.clientHeight,
      content.offsetWidth,
      content.offsetHeight
    );
  }

  getValues (){
    return this._scroller.getValues();
  }

  scrollTo( inLeft,inTop,inAnimate,inZoom ){
    this._scroller.scrollTo( inLeft,inTop,inAnimate,inZoom );
  }

  scrollerRender() {
    switch (true) {
      case supportPerspectiveProperty:
        return (left, top, inZoom) => {
          const transformPropertyValue = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + inZoom + ')';
          this._mouted && this.setState({contentStyle: {[transformProperty]: transformPropertyValue}});
        };
      case supportTransformProperty:
        return (left, top, inZoom) => {
          const transformPropertyValue = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + inZoom + ')';
          this._mouted && this.setState({contentStyle: {[transformProperty]: transformPropertyValue}});
        };
      default:
        return (left, top, inZoom) => {
          const marginLeft = left ? (-left / inZoom) + 'px' : '';
          const marginTop = top ? (-top / inZoom) + 'px' : '';
          const zoom = inZoom || '';
          this._mouted && this.setState({contentStyle: {marginLeft, marginTop, inZoom}});
        };
    }
  }

  activateInfinite() {
    let {container, content} = this.refs;
    const {distances, infiniter} = this.props;
    const isInnerStatus = INNER_STATUS.indexOf(this.state.infiniterStatus) > -1;
    if (infiniter && isInnerStatus && container && content) {
      const contentBound = content.getBoundingClientRect();
      const containerBound = container.getBoundingClientRect();
      if (contentBound.bottom - containerBound.bottom < distances[1]) {
        this.setState({infiniterStatus: 'active'});
      } else {
        this.setState({infiniterStatus: 'init'});
      }
    }
  }

  activatePullToRrefresh() {
    let {distances, refresher, onRefresh} = this.props;
    if (refresher) {
      this._scroller.activatePullToRefresh(distances[0], () => {
        this.setState({refresherStatus: 'active'});
      }, () => {
        this.setState({
          refresherStatus: 'init',
          infiniterStatus: 'init',
        });
      }, () => {
        this.setState({refresherStatus: 'running'});
        this._scroller.__refreshActive && onRefresh.call(this, this);
      });
    }
  }

  finishInfinte() {
    const isInnerStatus = INNER_STATUS.indexOf(this.state.infiniterStatus) > -1;
    if(isInnerStatus){
      this.setState({infiniterStatus: 'init'});
    }
  }

  finishPullToRefresh() {
    this._scroller && this._scroller.finishPullToRefresh();
  }

  shouldRetainDefault(inEvent) {
    return inEvent.target.tagName.match(retainElementRE);
  }

  _onStart = (inEvent) => {
    const touches = this._getTouchEvents( inEvent );
    if (!this.shouldRetainDefault(inEvent) && deviceIsIOS) {
      inEvent.preventDefault();
    }
    this._scroller.doTouchStart(touches, inEvent.timeStamp);
  };

  _onRefresh = () => {
    this.refresh();
  };

  _onMove = (inEvent) => {
    const { onScroll } = this.props;
    const scrollValues = this._scroller.getValues();
    const touches = this._getTouchEvents( inEvent );
    if (this.shouldRetainDefault(inEvent)) {
      return null;
    }

    this._scroller.doTouchMove(touches, inEvent.timeStamp);
    this.activateInfinite();
    onScroll( scrollValues );
    this.fire('scroll', scrollValues );
    inEvent.preventDefault();
  };

  _onEnd = (inEvent) => {
    this.doEnd(inEvent);
    this.delayCheck();
    this._scroller.doTouchEnd(inEvent.timeStamp);
  };

  _getTouchEvents(inEvent){
    return typeof inEvent.touches != 'undefined' ? inEvent.touches : [{
      pageX: inEvent.pageX,
			pageY: inEvent.pageY
    }]
  }

  doEnd(inEvent){
    let {infiniterStatus} = this.state;
    let {onInfinite,onScrollEnd} = this.props;
    if (infiniterStatus === 'active') {
      this.setState({infiniterStatus: 'running'},()=>{
        !this._scroller.__refreshActive && onInfinite.call(this, this);
      });
    }
    onScrollEnd(inEvent);
    this.fire('scrollEnd',inEvent);
  }

  delayCheck(inEvent){
    const timer = setTimeout(()=>{
      this.activateInfinite();
      this.doEnd(inEvent);
      clearTimeout(timer);
    },500);
  }

  render() {
    const { contentStyle } = this.state;
    const {
      className, children, refresher, infiniter,
      onInfinite, onRefresh, options, distances,
      refresherStatus, infiniterStatus,
      onScroll,onScrollEnd,
      ...props
    } = this.props;

    return (
      <div
        {...props}
        ref='container'
        className={classNames('react-scroller', className)}
        onMouseDown={this._onStart}
        onTouchStart={this._onStart}>
        <div
          ref='content'
          className="react-scroller-content" style={contentStyle}>
          {refresher && createElement(refresher, {status: this.state.refresherStatus})}
          <div className="bd">
            {children}
          </div>
          {infiniter && createElement(infiniter, {status: this.state.infiniterStatus})}
        </div>
      </div>
    );
  }
}
