/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import '../Pomodoro.scss';

export default class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSession: true,
      timerSecond: 0,
      intervalId: 0,
    };

    this.playPomo = this.playPomo.bind(this);
    this.stopPomo = this.stopPomo.bind(this);
    this.refreshPomo = this.refreshPomo.bind(this);
    this.decreaseTimer = this.decreaseTimer.bind(this);
  }

  playPomo() {
    console.log(this.props.isPause);
    if (this.props.isPlay && !this.props.isPause) return;
    const myIntervalId = setInterval(this.decreaseTimer, 1000); //
    this.props.onPlayStopTimer(true);
    this.props.onPauseTimer(false);
    console.log(this.state.intervalId);
    this.setState({
      intervalId: myIntervalId,
    });
  }

  stopPomo() {
    clearInterval(this.state.intervalId);
    this.props.onPlayStopTimer(true);
    this.props.onPauseTimer(true);
  }

  refreshPomo() {
    this.stopPomo();
    this.props.onPlayStopTimer(false);
    this.setState({
      timerSecond: 0,
      isSession: true,
    });
    this.props.onRefreshPomo();
  }

  decreaseTimer() {
    if (this.state.timerSecond === 0) {
      if (this.props.timerMinute === 0) {
        this.setState((prevState) => ({
          isSession: !prevState.isSession,
        }));
        this.props.onToggleInterval(this.state.isSession);
      }
      this.props.updateTimerMinute();
      this.setState({ timerSecond: 59 });
    } else {
      this.setState((prevState) => ({
        timerSecond: prevState.timerSecond - 1,
      }));
    }
  }

  render() {
    return (
      <div className="pomodoro__timer">
        <div className="clock">
          <p>{this.state.isSession ? 'Session' : 'Break'}</p>
          <span>{this.props.timerMinute}</span>
          <span>:</span>
          <span>
            {this.state.timerSecond < 10
              ? '0' + this.state.timerSecond
              : this.state.timerSecond}
          </span>
        </div>
        <div className="action-buttons">
          <button type="button" onClick={this.playPomo}>
            Play
          </button>
          <button type="button" onClick={this.stopPomo}>
            Pause
          </button>
          <button type="button" onClick={this.refreshPomo}>
            Refresh
          </button>
        </div>
      </div>
    );
  }
}
