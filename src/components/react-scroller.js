import './style.scss';
import classNames from 'classnames';
import Scroller from 'next-scroller';
import Browser from 'next-browser';
import noop from 'noop';

const helperElem = document.createElement("div");
const vendorPrefix = Browser.jsPrefix();
const perspectiveProperty = vendorPrefix + "Perspective";
const transformProperty = vendorPrefix + "Transform";
const supportTransformProperty = helperElem.style[transformProperty] !== undefined;
const supportPerspectiveProperty = helperElem.style[perspectiveProperty] !== undefined;
const supportTouchEvents = 'touchstart' in window;

export default class extends React.PureComponent{
  static propTypes = {
    className:React.PropTypes.string,
    options:React.PropTypes.object,
    onRefresh:React.PropTypes.func,
    refreshOptions:React.PropTypes.object,
    onInfinite:React.PropTypes.func,
    infiniteOptions:React.PropTypes.object,
  };

  static defaultProps = {
    options: {
      animationDuration:180,
      scrollingX:false
    },
    onRefresh:noop,
    onInfinite:noop,
    refreshOptions:{
      distance:50,
      status:'init',
      statusMap:{
        init:'下拉刷新',
        active:'释放更新',
        running:'数据更新中'
      }
    },
    infiniteOptions:{
      distance:-50,
      status:'init',
      statusMap:{
        init:'加载更多',
        active:'释放更新',
        running:'数据更新中'
      }
    }
  };

  constructor(props) {
    super(props);
    const {refreshOptions,infiniteOptions} = this.props;
    this.state = {
      contentStyle:{},
      refreshOptions,
      infiniteOptions
    };
    this.attachDocEvents();
    this.createScroller();
    this.activatePullToRrefresh();
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
  }

  refresh(){
    let {container,content} = this.refs;
    let {refreshOptions} = this.props;
    this._scroller.setDimensions(
      container.clientWidth,
      container.clientHeight,
      content.offsetWidth,
      content.offsetHeight - refreshOptions.distance
    );
  }

  scrollerRender(){
    var self = this;
    switch(true){
      case supportPerspectiveProperty:
        return function(left, top, inZoom) {
          const transformPropertyValue = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + inZoom + ')';
          self.setState({contentStyle:{[transformProperty]:transformPropertyValue}});
        };
      case supportTransformProperty:
        return function(left, top, inZoom) {
          const transformPropertyValue = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + inZoom + ')';
          self.setState({contentStyle:{[transformProperty]:transformPropertyValue}});
        };
      default:
        return function(left, top, inZoom) {
          const marginLeft = left ? (-left/inZoom) + 'px' : '';
          const marginTop = top ? (-top/inZoom) + 'px' : '';
          const zoom = inZoom || '';
          self.setState({contentStyle:{marginLeft,marginTop,inZoom}});
        };
    }
  }

  attachDocEvents(){
    document.addEventListener('touchmove', this._onMove.bind(this), false);
    document.addEventListener('touchend',  this._onEnd.bind(this), false);
  }

  detachDocEvents(){
    document.removeEventListener('touchmove', this._onMove.bind(this), false);
		document.removeEventListener('touchend',  this._onEnd.bind(this), false);
  }

  checkInfinite(){
    let {container,content} = this.refs;
    let {infiniteOptions} = this.state;
    if(content.getBoundingClientRect().bottom - container.getBoundingClientRect().bottom < infiniteOptions.distance){
      infiniteOptions.status = 'active';
    }else{
      infiniteOptions.status = 'init';
    }
    this.setState({infiniteOptions})
  }

  finishPullToRefresh(){
    let {refreshOptions} = this.props;
    refreshOptions.status='init';
    this.setState({refreshOptions});
    this._scroller.finishPullToRefresh();
  }

  finishInfinte(){
    let {infiniteOptions} = this.props;
    infiniteOptions.status='init';
    this.setState({infiniteOptions});
    this._scroller.finishPullToRefresh();
  }

  activatePullToRrefresh(){
    let {onRefresh,refreshOptions} = this.props;
    this._scroller.activatePullToRefresh(refreshOptions.distance, ()=>{
      refreshOptions.status = 'active';
      this.setState({refreshOptions});
    }, ()=>{
      refreshOptions.status = 'init';
      this.setState({refreshOptions});
    }, ()=>{
      refreshOptions.status = 'running';
      this.setState({refreshOptions});
      onRefresh.call(this,this);
    });
  }

  shouldRetainDefault(inEvent){
    return inEvent.target.tagName.match(/input|textarea|select/i);
  }

  _onStart(inEvent){
    if (this.shouldRetainDefault(inEvent)) {
      return null;
    }
    this._scroller.doTouchStart(inEvent.touches, inEvent.timeStamp);
    inEvent.preventDefault();
  }

  _onMove(inEvent){
    if (this.shouldRetainDefault(inEvent)) {
      return null;
    }
    this._scroller.doTouchMove(inEvent.touches, inEvent.timeStamp);
    this.checkInfinite();
    inEvent.preventDefault();
  }
  _onEnd(inEvent){

    let {infiniteOptions} = this.state;
    let {onInfinite} = this.props;

    if(infiniteOptions.status==='active'){
      infiniteOptions.status ='running';
      this.setState({infiniteOptions},()=>{
        onInfinite.call(this,this);
      });
    }else{
      infiniteOptions.status ='init';
      this.setState({infiniteOptions});
    }
    this._scroller.doTouchEnd(inEvent.timeStamp);
  }

  render(){
    const {contentStyle,refreshOptions,infiniteOptions} = this.state;
    const {className,children} = this.props;

    return (
      <div
      ref='container'
      className={classNames('react-scroller',className)}
      onTouchStart={this._onStart.bind(this)}
      >
        <div
        ref='content'
        className="react-scroller-content" style={contentStyle}>
          <div data-status={refreshOptions.status} style={{marginTop:-refreshOptions.distance}} className="react-scroller-refresher">{refreshOptions.statusMap[refreshOptions.status]}</div>
          <div className="bd">
            {children}
          </div>
          <div data-status={infiniteOptions.status} className="react-scroller-infinite">{infiniteOptions.statusMap[infiniteOptions.status]}</div>
        </div>
      </div>
    );
  }
}
