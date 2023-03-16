import React from 'react';
import { storage } from '../firebase';
import { getDownloadURL, ref } from 'firebase/storage';

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
    };
  }

  async componentDidMount() {
    const url = await getDownloadURL(ref(storage, 'user/zD7Ar5AzePcKxsEm9F0caemTCUh1/audio/aa.m4a'));
    this.setState({ url });
  }

  render() {
    return (
      <div>
        <audio controls src={this.state.url}>
        </audio>
      </div>
    );
  }
}

export default AudioPlayer;