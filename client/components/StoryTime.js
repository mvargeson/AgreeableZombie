import React, { PropTypes, Component } from 'react';
import Library from './Library.js';
import Book from './Book.js';
import Logo from './Logo.js';
import Title from './Title.js';
import Background from './Background.js';
import PrevButton from './PrevButton.js';
import NextButton from './NextButton.js';
import LeftPageText from './LeftPageText.js';
import RightPageText from './RightPageText.js';
import LeftPageImage from './LeftPageImage.js';
import RightPageImage from './RightPageImage.js';
import WebCam from './WebCam.js';
import Canvas from './Canvas.jsx';
import socket from '../../websocket.js';
import $ from 'jquery';


class StoryTime extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageCounter: 0,
      bookTitle: '',
      bookData: [],
      author: 'Eric Carle'
    };

    socket.on('prev page', (data) => {
      console.log ('data from server', data);
      this.setState({msg: data.msg});
      this.setState({pageCounter: data.pageCounter});
    });

    socket.on('next page', (data) => {
      this.setState({msg: data.msg});
      this.setState({pageCounter: data.pageCounter});
    });
  }

  componentWillMount() {
    var app = this;
    $.getJSON('/api/books', function(data) {

      console.log('data from server is - ', data);

      var title = data[0].bookTitle;
      var bookData = data[0].bookData;

      console.log('bookTitle is - ', title);
      console.log('bookdata is - ', bookData);

      app.setState({
        bookTitle: title,
        bookData: bookData
      });
    });
  }

  componentDidMount() {
    this.render();
  }

  onClickPrev() {
    console.log('Previous Clicked');
    socket.emit('PrevButtonClick', {msg: 'Previous button clicked', pageCounter: this.state.pageCounter-2});
    if(this.state.pageCounter-1>=0) {
      this.setState({pageCounter: this.state.pageCounter-2});
    } else {
      socket.emit('PrevButtonClick', {msg: "BEGINNING OF BOOK!", pageCounter: this.state.pageCounter});
    }
  }

  onClickNext() {
    console.log('Next clicked');
    if (this.state.pageCounter<this.state.bookData.length-1) {
      this.setState({pageCounter: this.state.pageCounter+2});
      socket.emit('NextButtonClick', {msg: 'Next button clicked', pageCounter: this.state.pageCounter+2});
    } else {
      socket.emit('NextButtonClick', {msg: "END OF BOOK!", pageCounter: this.state.pageCounter});
    }
  }

  changeText(event) {
    this.setState ({msg: event.msg});
  }

  render() {
    if (this.state.bookData.length > 0) {
     return (
          <div>
            <div id="webcam-features">
              <WebCam conversation={this.state.conversation}/>
            </div>
            <Logo />
            <Title bookTitle={this.state.bookTitle} author={this.state.author}/>
            <div id='buttons-with-book'>
              <div id='left-button'><PrevButton clickHandler={this.onClickPrev.bind(this)}/></div>
              <div id='right-button'><NextButton clickHandler={this.onClickNext.bind(this)}/></div>
              <div id='center'><Background />
                <LeftPageText bookData={this.state.bookData} pageCounter={this.state.pageCounter}/>
                <LeftPageImage bookData={this.state.bookData} pageCounter={this.state.pageCounter}/>
                <RightPageText bookData={this.state.bookData} pageCounter={this.state.pageCounter}/>
                <RightPageImage bookData={this.state.bookData} pageCounter={this.state.pageCounter}/>
              </div>
            </div>
            <Canvas />
          </div>
        );
  } else {
    return(<p> Loading ... </p>);
  }
}
};

export default StoryTime;
