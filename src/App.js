import React from 'react';
import PropTypes from 'prop-types'

class App extends React.Component {
  render() {
    const names = ['Alice', 'Emily', 'Kate'];
    const arr = [
      <h1 key={'1'}>Hello, world!</h1>,
      <h2 key={'2'}>React is awesome</h2>
    ]
    return (
      <div style={{
        width: 500,
        margin: '0 auto'
      }}>
        <h1>Hello world</h1>
        <hr/>
        <div>
          {names.map((name, index) => {
            return <div key={index}>Hello, {name}</div>
          })}
        </div>
        <hr/>
        <div>{arr}</div>
        <hr/>
        <HelloMessage name={'John'}/>
        <hr/>
        <NoteList>
          <span>hello</span>
          <span>world</span>
        </NoteList>
        <hr/>
        <MyTitle title={'hhhh'}/>
        <hr/>
        <MyComponent/>
        <hr/>
        <LikeButton/>
        <hr/>
        <Input/>
        <hr/>
        <Hello/>
        <hr/>
        <UserGist source={"https://api.github.com/users/octocat/gists"}/>
        <hr/>
        <RepoList promise={fetch('https://api.github.com/search/repositories?q=javascript&sort=stars')}/>
      </div>
    );
  }
}

const HelloMessage = (props) => (
  <div>Hello, {props.name}</div>
);

const NoteList = (props) => (
  <ol>
    {React.Children.map(props.children, (child) => (
      <li>{child}</li>
    ))}
  </ol>
);

class MyTitle extends React.Component {
  render() {
    return (
      <h1>{this.props.title}</h1>
    )
  }
}

MyTitle.propTypes = {
  title: PropTypes.string.isRequired
};

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myTextInput = React.createRef();
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.myTextInput.current.focus()
  }

  render() {
    return (
      <div>
        <input type={'text'} ref={this.myTextInput}/>
        <input type={'button'} value={'Focus the text input'} onClick={this.handleClick}/>
      </div>
    )
  }
}

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: false
    };
    this.handleClick = this.handleClick.bind(this)
  }

  /*getInitialState(){
    return {liked: false}
  }*/
  handleClick(event) {
    this.setState({
      liked: !this.state.liked
    })
  }

  render() {
    let text = this.state.liked ? 'like' : 'haven\'t like';
    return (
      <p onClick={this.handleClick}>
        You {text} this.Click to toggle
      </p>
    )
  }
}

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Hello'
    };
    this.handleChange = this.handleChange.bind(this)
  };

  handleChange(e) {
    this.setState({
      value: e.target.value
    })
  };

  render() {
    let value = this.state.value;
    return (
      <div>
        <input type={'text'} value={value} onChange={this.handleChange}/>
        <p>{value}</p>
      </div>
    )
  }
}

class Hello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: 1.0
    };
    this.change = this.change.bind(this)
  };

  change() {
    let opacity = this.state.opacity
    opacity -= .05
    if (opacity < 0.1) {
      opacity = 1.0
    }
    this.setState({
      opacity: opacity
    })
  }

  componentDidMount() {
    setInterval(this.change, 100)
  }

  render() {
    return (
      <div style={{opacity: this.state.opacity}}>
        Hello {this.props.name}
      </div>
    )
  }
}

class UserGist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      lastGistUrl: ''
    };
    this.getData = this.getData.bind(this)
  }

  //https://www.jianshu.com/p/dfd7cf757850
  async getData() {
    fetch(this.props.source).then((result) => {
      if (result) {
        result.json().then((res) => {
          // console.log(res)
          let lastGist = res[0]
          this.setState({
            username: lastGist.owner.login,
            lastGistUrl: lastGist.html_url
          })
        })
      }
    });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <div>{this.state.username}'s last gist is <a href={this.state.lastGistUrl}>here</a></div>
    )
  }
}

class RepoList extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      loading: true,
      error: null,
      data: null
    }
  }
  componentDidMount(){
    this.props.promise.then(res=>{
      res.json().then(result=>{
        // console.log(result)
        this.setState({
          loading: false,
          data: result.items,
          error: null
        })
        // console.log(this.state)
      })
    })
  }
  render(){
    if (this.state.loading){
      return <span>Loading...</span>
    } else if (this.state.error!==null){
      return <span>Error: {this.state.error.message}</span>
    } else {
      const repos = this.state.data
      let repoList = repos.map((repo,index)=>{
        return (
          <li key={index}>
            <a href={repo.html_url}>{repo.name}</a> ({repo.stargazers_count} stars)
            <br/>
            {repo.description}
          </li>
        )
      })
      return (
        <main>
          <h1>Most popular javascript projects in Github</h1>
          <ol>{repoList}</ol>
        </main>
      )
    }
  }
}

export default App;
