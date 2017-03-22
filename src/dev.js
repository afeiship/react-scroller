import './dev.scss';
import ReactScroller from './main';
import VirtualList from 'react-tiny-virtual-list';
const data = [
  'A', 'B', 'C', 'D', 'E', 'F',
  'A', 'B', 'C', 'D', 'E', 'F',
  'A', 'B', 'C', 'D', 'E', 'F',
  'A', 'B', 'C', 'D', 'E', 'F',
  'A', 'B', 'C', 'D', 'E', 'F',
  'A', 'B', 'C', 'D', 'E', 'F',
  'A', 'B', 'C', 'D', 'E', 'F',
  'A', 'B', 'C', 'D', 'E', 'F'
];
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
          <VirtualList
            ref='vl'
            width='100%'
            height={600}
            onScroll={this._onScroll.bind(this)}
            itemCount={data.length}
            itemSize={50} // Also supports variable heights (array or function getter)
            renderItem={({index, style}) =>
              <div key={index} style={style}>
                Letter: {data[index]}, Row: #{index}
              </div>
            }
          />
        </ReactScroller>
    </div>
    );
  }
}


ReactDOM.render(
    <App />,
    document.getElementById('app')
);
