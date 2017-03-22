import './dev.scss';
import ReactScroller from './main';
class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      items:[]
    };
  }
  getChildren(){
    var result = [];
    for(var i=0;i<100;i++){
      result.push(
        <li key={i}>{`item${i}`}</li>
      );
    }
    return result;
  }


  _onClick(){
    console.log('click!!');
    let {items} = this.state;
    items.push(`item-${Math.random()}`);

    this.setState({
      items:items
    });

    // this.refs.sc.refresh();
  }

  _onRefresh(inArgs){
    setTimeout(function() {
      console.log('on refresh....');
			// refreshElem.className = refreshElem.className.replace(" running", "");
			// insertItems();
			inArgs.finishPullToRefresh();
		}, 2000);
  }


  _onScroll(offset,inEvent){
    // console.log(inEvent,el);
    // inEvent.preventDefault();
    // this.refs.vl.setState({offset})
    return ;
  }



  render(){
    return (
      <div className="hello-react-scroller">
        <button onClick={this._onClick.bind(this)}>Add items!</button>
        <ReactScroller ref='sc' onRefresh={this._onRefresh.bind(this)}>
          my contetn...

          <div className="other-list">
            {
              this.state.items.map((item,index)=>{
                return <div className="item" key={index}>{`item====>${item}`}</div>
              })
            }
          </div>
        </ReactScroller>
    </div>
    );
  }
}


ReactDOM.render(
    <App />,
    document.getElementById('app')
);
