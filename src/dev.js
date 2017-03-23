import './dev.scss';
import ReactScroller from './main';
import ReactStatusManager from 'react-status-manager';
import loadingImg from './loading.svg';

class Refresher extends React.PureComponent{
  render(){
    const {status} = this.props;
    return (
      <ReactStatusManager className='react-refresher' status={status} statusList={['init','active','running']}>
        <span>下拉刷新</span>
        <span>释放更新</span>
        <img width="30" src={loadingImg} alt='' />
      </ReactStatusManager>
    );
  }
}


class Infiniter extends React.PureComponent{
  render(){
    const {status} = this.props;
    return (
      <ReactStatusManager className='react-infiniter' status={status} statusList={['init','active','running']}>
        <span>加载更多</span>
        <span>释放更新</span>
        <img width="30" src={loadingImg} alt='' />
      </ReactStatusManager>
    );
  }
}


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


  addMore(){
    let {items} = this.state;
    items.push(`push infinite item-${Math.random()}`);
    items.push(`push infinite item-${Math.random()}`);
    items.push(`push infinite item-${Math.random()}`);
    items.push(`push infinite item-${Math.random()}`);
    items.push(`push infinite item-${Math.random()}`);
    items.push(`push infinite item-${Math.random()}`);
    items.push(`push infinite item-${Math.random()}`);
    this.setState({
      items
    });
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

  _onInfinite(inArgs){
    setTimeout(()=>{
      console.log('on infinite....');
			// refreshElem.className = refreshElem.className.replace(" running", "");
			// insertItems();
      this.addMore();
			inArgs.finishInfinte();
		}, 1000);
  }



  render(){
    return (
      <div className="hello-react-scroller">

        <button onClick={this._onClick.bind(this)}>Add items!</button>
        <ReactScroller ref='sc'
        refresher={Refresher}
        infiniter={Infiniter}
        onInfinite={this._onInfinite.bind(this)}
        onRefresh={this._onRefresh.bind(this)}>
          <textarea name="" id="" cols="30" rows="10">

海外网3月22日电 3月22日外交部举行例行记者会，发言人华春莹就以下问题作出回应。

中国外交部新闻发言人华春莹22日在例行记者会上表示，美国国务卿蒂勒森访华期间，中美在朝着不冲突、不对抗、相互尊重、合作共赢的正确方向上又迈出重要一步。

有记者表示，美国国务卿蒂勒森访华期间曾表示，中美两国应该本着不冲突、不对抗、相互尊重、合作共赢的精神。这引起国际社会的广泛关注，其中美国一些学者和高管认为蒂勒森的说法是“中国的外交胜利”、“替中国背书”。中方对此如何看待？

华春莹表示，中方注意到有关议论。在这次蒂勒森国务卿访华期间，中美两国再次明确发出了应该努力朝着不冲突、不对抗、相互尊重、合作共赢方向努力的信号。这不是谁的胜利，而是中美作为世界上两个大国正在朝着正确方向又迈出了新的重要一步。

发言人指出，相互尊重、不冲突、不对抗是过去几十年来中美关系得以顺利发展的根本经验，这样行之有效的思路和途径是值得继续继承和发扬的。


          </textarea>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>
          <p className="p">my contetn...</p>

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
