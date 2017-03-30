import './style.scss';
import React,{PureComponent,createElement} from 'react';
import classNames from 'classnames';
import Scroller from 'next-scroller';
import Browser from 'next-browser';
import noop from 'noop';
import {throttle} from 'next-debounce-throttle';

const helperElem = document.createElement("div");
const vendorPrefix = Browser.jsPrefix();
const perspectiveProperty = vendorPrefix + "Perspective";
const transformProperty = vendorPrefix + "Transform";
const supportTransformProperty = helperElem.style[transformProperty] !== undefined;
const supportPerspectiveProperty = helperElem.style[perspectiveProperty] !== undefined;
const retainElementRE=/input|textarea|select/i;


export default class extends PureComponent{
  static propTypes = {
    className:React.PropTypes.string,
    options:React.PropTypes.object,
    onRefresh:React.PropTypes.func,
    refresher:React.PropTypes.func,
    distance:React.PropTypes.array,
    onInfinite:React.PropTypes.func,
  };

  static defaultProps = {
    options: {
      animationDuration:180,
      scrollingX:false
    },
    action:'refresh',
    status:'init',
    onRefresh:noop,
    onInfinite:noop,
    refresher:null,
    infiniter:null,
    distances:[50,-50]
  };

  constructor(props) {
    super(props);
    this.init();
  }

  init(){
    const {status} = this.props;
    this.attachDocEvents();
    this.createScroller();
    this.activatePullToRrefresh();
    this.state = {
      contentStyle:{},
      status
    }
  }

  componentWillUnmount(){
    this.detachDocEvents();
    this._scroller = null;
  }

  componentDidMount(){
    this.refresh();
  }

  componentDidUpdate(nextProps){
    if(nextProps.children !== this.props.children){
      this.refresh();
    }
  }

  createScroller(){
    const {options} = this.props;
    this._scroller = new Scroller(this.scrollerRender(),options);
    window.sc=this._scroller;
  }

  refresh(){
    let {container,content} = this.refs;
    this._scroller.setDimensions(
      container.clientWidth,
      container.clientHeight,
      content.offsetWidth,
      content.offsetHeight
    );
  }

  scrollerRender(){
    switch(true){
      case supportPerspectiveProperty:
        return (left, top, inZoom) => {
          const transformPropertyValue = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + inZoom + ')';
          this.setState({contentStyle:{[transformProperty]:transformPropertyValue}});
        };
      case supportTransformProperty:
        return (left, top, inZoom) => {
          const transformPropertyValue = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + inZoom + ')';
          this.setState({contentStyle:{[transformProperty]:transformPropertyValue}});
        };
      default:
        return (left, top, inZoom) => {
          const marginLeft = left ? (-left/inZoom) + 'px' : '';
          const marginTop = top ? (-top/inZoom) + 'px' : '';
          const zoom = inZoom || '';
          this.setState({contentStyle:{marginLeft,marginTop,inZoom}});
        };
    }
  }

  attachDocEvents(){
    document.addEventListener('touchmove', this._onMove, false);
    document.addEventListener('touchend',  this._onEnd, false);
  }

  detachDocEvents(){
    document.removeEventListener('touchmove', this._onMove, false);
		document.removeEventListener('touchend',  this._onEnd, false);
  }

  activateInfinite(){
    const {distances,infiniter,onInfinite} = this.props;
    if(infiniter){
      let {container,content} = this.refs;
      if(content.getBoundingClientRect().bottom - container.getBoundingClientRect().bottom < distances[1]){
        this.setState({status:'active'});
      }else{
        this.setState({status:'init'});
      }
    }
  }

  activatePullToRrefresh(){
    let {distances,refresher,onRefresh} = this.props;
    if(refresher){
      this._scroller.activatePullToRefresh(distances[0], ()=>{
        this.setState({status:'active'});
      }, ()=>{
        this.setState({status:'init'});
      }, ()=>{
        this.setState({status:'running'});
        onRefresh.call(this,this);
      });
    }
  }

  finishInfinte(){
    this.setState({status:'init'});
    this._scroller.finishPullToRefresh();
  }

  finishPullToRefresh(){
    this._scroller.finishPullToRefresh();
  }

  shouldRetainDefault(inEvent){
    return inEvent.target.tagName.match(retainElementRE);
  }

  _onStart = (inEvent)=>{
    if (this.shouldRetainDefault(inEvent)) {
      return null;
    }
    this._scroller.doTouchStart(inEvent.touches, inEvent.timeStamp);
    inEvent.preventDefault();
  }

  _onMove = (inEvent)=>{
    if (this.shouldRetainDefault(inEvent)) {
      return null;
    }

    this._scroller.doTouchMove(inEvent.touches, inEvent.timeStamp);
    this.activateInfinite();
    inEvent.preventDefault();
  }

  _onEnd = (inEvent)=>{
    let {status} = this.state;
    let {onInfinite} = this.props;
    if(status === 'active'){
      this.setState({status:'running'});
      onInfinite.call(this,this);
    }else{
      this.setState({status:'init'});
    }
    this._scroller.doTouchEnd(inEvent.timeStamp);
  }

  render(){
    const {contentStyle,status} = this.state;
    const {className,children,refresher,infiniter} = this.props;
    return (
      <div
      ref='container'
      className={classNames('react-scroller',className)}
      onTouchStart={this._onStart}>
        <div
        ref='content'
        className="react-scroller-content" style={contentStyle}>
          {refresher && createElement(refresher,{status})}
          <div className="bd">
            {children}
          </div>
          {infiniter && createElement(infiniter,{status})}
        </div>
      </div>
    );
  }
}
