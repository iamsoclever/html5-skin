/********************************************************************
 PAUSE SCREEN
 *********************************************************************/
var React = require('react'),
    ReactDOM = require('react-dom'),
    ClassNames = require('classnames'),
    ControlBar = require('../components/controlBar'),
    AdOverlay = require('../components/adOverlay'),
    UpNextPanel = require('../components/upNextPanel'),
    TextTrack = require('../components/textTrackPanel'),
    ResizeMixin = require('../mixins/resizeMixin'),
    Icon = require('../components/icon'),
    Utils = require('../components/utils');

var PauseScreen = React.createClass({
  mixins: [ResizeMixin],

  getInitialState: function() {
    return {
      descriptionText: this.props.contentTree.description,
      controlBarVisible: true,
      animate: false
    };
  },

  componentDidMount: function() {
    this.handleResize();
    this.setState({
      animate: true
    });
  },

  componentWillUnmount: function() {
    this.props.controller.enablePauseAnimation();
  },

  handleResize: function() {
    if (ReactDOM.findDOMNode(this.refs.description)){
      this.setState({
        descriptionText: Utils.truncateTextToWidth(ReactDOM.findDOMNode(this.refs.description), this.props.contentTree.description)
      });
    }
  },

  handleClick: function(event) {
    event.preventDefault();
    this.props.controller.togglePlayPause();
    this.props.controller.state.accessibilityControlsEnabled = true;
  },

  render: function() {
    //inline style for config/skin.json elements only
    var titleStyle = {
      color: this.props.skinConfig.startScreen.titleFont.color
    };
    var descriptionStyle = {
      color: this.props.skinConfig.startScreen.descriptionFont.color
    };
    var actionIconStyle = {
      color: this.props.skinConfig.pauseScreen.PauseIconStyle.color,
      opacity: this.props.skinConfig.pauseScreen.PauseIconStyle.opacity
    };

    //CSS class manipulation from config/skin.json
    var fadeUnderlayClass = ClassNames({
      'oo-fading-underlay': !this.props.pauseAnimationDisabled,
      'oo-fading-underlay-active': this.props.pauseAnimationDisabled,
      'oo-animate-fade': this.state.animate && !this.props.pauseAnimationDisabled
    });
    var infoPanelClass = ClassNames({
      'oo-state-screen-info': true,
      'oo-info-panel-top': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("top") > -1,
      'oo-info-panel-bottom': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("bottom") > -1,
      'oo-info-panel-left': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("left") > -1,
      'oo-info-panel-right': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("right") > -1
    });
    var titleClass = ClassNames({
      'oo-state-screen-title': true,
      'oo-text-truncate': true,
      'oo-text-capitalize': true,
      'oo-pull-right': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("right") > -1
    });
    var descriptionClass = ClassNames({
      'oo-state-screen-description': true,
      'oo-pull-right': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("right") > -1
    });
    var actionIconClass = ClassNames({
      'oo-action-icon-pause': !this.props.pauseAnimationDisabled,
      'oo-action-icon': this.props.pauseAnimationDisabled,
      'oo-animate-pause': this.state.animate && !this.props.pauseAnimationDisabled,
      'oo-action-icon-top': this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf("top") > -1,
      'oo-action-icon-bottom': this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf("bottom") > -1,
      'oo-action-icon-left': this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf("left") > -1,
      'oo-action-icon-right': this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf("right") > -1,
      'oo-hidden': !this.props.skinConfig.pauseScreen.showPauseIcon || this.props.pauseAnimationDisabled
    });

    var titleMetadata = (<div className={titleClass} style={titleStyle}>{this.props.contentTree.title}</div>);
    var descriptionMetadata = (<div className={descriptionClass} ref="description" style={descriptionStyle}>{this.state.descriptionText}</div>);
    var adOverlay = (this.props.controller.state.adOverlayUrl && this.props.controller.state.showAdOverlay) ?
      <AdOverlay {...this.props}
        overlay={this.props.controller.state.adOverlayUrl}
        showOverlay={this.props.controller.state.showAdOverlay}
        showOverlayCloseButton={this.props.controller.state.showAdOverlayCloseButton}/> : null;

    var upNextPanel = (this.props.controller.state.upNextInfo.showing && this.props.controller.state.upNextInfo.upNextData) ?
      <UpNextPanel {...this.props}
        controlBarVisible={this.state.controlBarVisible}
        currentPlayhead={this.props.currentPlayhead}/> : null;

    return (
      <div className="oo-state-screen oo-pause-screen">
        <div className={fadeUnderlayClass}></div>
        <div className={infoPanelClass}>
          {this.props.skinConfig.pauseScreen.showTitle ? titleMetadata : null}
          {this.props.skinConfig.pauseScreen.showDescription ? descriptionMetadata : null}
        </div>

        <a className="oo-state-screen-selectable" onClick={this.handleClick}></a>

        <a className={actionIconClass} onClick={this.handleClick}>
          <Icon {...this.props} icon="pause" style={actionIconStyle}/>
        </a>

        <div className="oo-interactive-container">

          <TextTrack closedCaptionOptions={this.props.closedCaptionOptions}/>

          <a className="oo-state-screen-selectable" onClick={this.handleClick}></a>

          {adOverlay}

          {upNextPanel}

          <ControlBar {...this.props}
            controlBarVisible={this.state.controlBarVisible}
            playerState={this.state.playerState}
            authorization={this.props.authorization}/>
        </div>
      </div>
    );
  }
});
module.exports = PauseScreen;