/* eslint-disable react/destructuring-assignment */

import React, { Component } from 'react';
import Timer from './Timer';
import './Pomodoro.scss';

export default class Pomodoro extends Component {
  constructor() {
    super();

    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerMinute: 25,
      isPlay: false,
      isPause: false,
    };
    this.decreaseBreakLength = this.decreaseBreakLength.bind(this);
    this.increaseBreakLength = this.increaseBreakLength.bind(this);
    this.decreaseSessionLength = this.decreaseSessionLength.bind(this);
    this.increaseSessionLength = this.increaseSessionLength.bind(this);
    this.onUpdateTimerMinute = this.onUpdateTimerMinute.bind(this);
    this.onToggleInterval = this.onToggleInterval.bind(this);
    this.onRefreshPomo = this.onRefreshPomo.bind(this);
    this.onPlayStopTimer = this.onPlayStopTimer.bind(this);
    this.onPauseTimer = this.onPauseTimer.bind(this);
  }

  onToggleInterval(isSession) {
    const { sessionLength, breakLength } = this.state;

    if (isSession) {
      this.setState({
        timerMinute: sessionLength,
      });
    } else {
      this.setState({
        timerMinute: breakLength,
      });
    }
  }

  onUpdateTimerMinute() {
    this.setState((prevState) => ({
      timerMinute: prevState.timerMinute - 1,
    }));
  }

  onRefreshPomo() {
    const { sessionLength } = this.state;
    this.setState({
      timerMinute: sessionLength,
    });
  }

  onPlayStopTimer(isPlay) {
    this.setState({ isPlay });
  }

  onPauseTimer(isPause) {
    this.setState({ isPause });
  }

  decreaseBreakLength() {
    if (this.state.breakLength === 1 || this.state.isPlay) return;
    this.setState((prevState) => ({
      breakLength: prevState.breakLength - 1,
    }));
  }

  increaseBreakLength() {
    if (this.state.isPlay) return;
    this.setState((prevState) => ({
      breakLength: prevState.breakLength + 1,
    }));
  }

  decreaseSessionLength() {
    if (this.state.sessionLength === 1 || this.state.isPlay) return;
    this.setState((prevState) => ({
      sessionLength: prevState.sessionLength - 1,
      timerMinute: prevState.timerMinute - 1,
    }));
  }

  increaseSessionLength() {
    if (this.state.isPlay) return;
    this.setState((prevState) => ({
      sessionLength: prevState.sessionLength + 1,
      timerMinute: prevState.timerMinute + 1,
    }));
  }

  render() {
    return (
      <div className="pomodoro">
        <div className="pomodoro__settings">
          <div className="breakLength ">
            <p>Break Length</p>
            <div className="buttons">
              <button type="button" onClick={this.decreaseBreakLength}>
                Down
              </button>
              <p>{this.state.breakLength}</p>
              <button type="button" onClick={this.increaseBreakLength}>
                Up
              </button>
            </div>
          </div>

          <div className="sessionLength">
            <p>Session length</p>
            <div className="buttons">
              <button type="button" onClick={this.decreaseSessionLength}>
                Down
              </button>
              <p>{this.state.sessionLength}</p>
              <button type="button" onClick={this.increaseSessionLength}>
                Up
              </button>
            </div>
          </div>
        </div>

        <Timer
          timerMinute={this.state.timerMinute}
          breakLength={this.state.breakLength}
          updateTimerMinute={this.onUpdateTimerMinute}
          onToggleInterval={this.onToggleInterval}
          onRefreshPomo={this.onRefreshPomo}
          onPlayStopTimer={this.onPlayStopTimer}
          onPauseTimer={this.onPauseTimer}
          isPlay={this.state.isPlay}
          isPause={this.state.isPause}
        />
      </div>
    );
  }
}
