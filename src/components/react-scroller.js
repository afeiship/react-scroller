import React, {PureComponent, createElement} from 'react';

import Browser from 'next-browser';
import PropTypes from 'prop-types';
import Scroller from 'next-scroller';
import classNames from 'classnames';
import noop from 'noop';

const userAgent = navigator.userAgent;
const helperElem = document.createElement("div");
const vendorPrefix = Browser.jsPrefix();
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


export default class extends PureComponent {
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
    refresher: null,
    infiniter: null,
    distances: [50, -50]
  };

  constructor(props) {
    super(props);
    this.init();
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

  componentWillUnmount() {
    this.detachDocEvents();
    this._scroller = null;
  }

  componentDidMount() {
    this.refresh();
  }

  componentWillReceiveProps(inNextProps) {
    this.setState(inNextProps);
  }

  componentDidUpdate(nextProps) {
    if (nextProps.children !== this.props.children) {
      this.refresh();
    }
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

  scrollerRender() {
    switch (true) {
      case supportPerspectiveProperty:
        return (left, top, inZoom) => {
          const transformPropertyValue = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + inZoom + ')';
          this.setState({contentStyle: {[transformProperty]: transformPropertyValue}});
        };
      case supportTransformProperty:
        return (left, top, inZoom) => {
          const transformPropertyValue = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + inZoom + ')';
          this.setState({contentStyle: {[transformProperty]: transformPropertyValue}});
        };
      default:
        return (left, top, inZoom) => {
          const marginLeft = left ? (-left / inZoom) + 'px' : '';
          const marginTop = top ? (-top / inZoom) + 'px' : '';
          const zoom = inZoom || '';
          this.setState({contentStyle: {marginLeft, marginTop, inZoom}});
        };
    }
  }

  attachDocEvents() {
    document.addEventListener('touchmove', this._onMove, false);
    document.addEventListener('touchend', this._onEnd, false);
  }

  detachDocEvents() {
    document.removeEventListener('touchmove', this._onMove, false);
    document.removeEventListener('touchend', this._onEnd, false);
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
    this.setState({infiniterStatus: 'init'});
    this._scroller && this._scroller.finishPullToRefresh();
  }

  finishPullToRefresh() {
    this._scroller && this._scroller.finishPullToRefresh();
  }

  shouldRetainDefault(inEvent) {
    return inEvent.target.tagName.match(retainElementRE);
  }

  _onStart = (inEvent) => {
    if (!this.shouldRetainDefault(inEvent) && deviceIsIOS) {
      inEvent.preventDefault();
    }
    this._scroller.doTouchStart(inEvent.touches, inEvent.timeStamp);

  };

  _onMove = (inEvent) => {
    if (this.shouldRetainDefault(inEvent)) {
      return null;
    }
    this._scroller.doTouchMove(inEvent.touches, inEvent.timeStamp);
    this.activateInfinite();
    inEvent.preventDefault();
  };

  _onEnd = (inEvent) => {
    let {infiniterStatus} = this.state;
    let {onInfinite} = this.props;
    if (infiniterStatus === 'active') {
      this.setState({infiniterStatus: 'running'});
      !this._scroller.__refreshActive && onInfinite.call(this, this);
    }
    this._scroller.doTouchEnd(inEvent.timeStamp);
  };

  render() {
    const {contentStyle} = this.state;
    const {
      className, children, refresher, infiniter,
      onInfinite, onRefresh, options, distances,
      refresherStatus, infiniterStatus,
      ...props
    } = this.props;

    return (
      <div
        {...props}
        ref='container'
        className={classNames('react-scroller', className)}
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
