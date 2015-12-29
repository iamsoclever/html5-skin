/********************************************************************
  CLOSED CAPTION PANEL
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class ClosedCaptionPanel
* @constructor
*/
var React = require('react'),
    CONSTANTS = require('../constants/constants'),
    Utils = require('./utils'),
    ClassNames = require('classnames');

var ClosedCaptionPanel = React.createClass({
  render: function(){
    var closedCaptionOptionsString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.CC_OPTIONS, this.props.localizableStrings);
    return (
        <div className="closed-captions-panel">
          <div className="closed-captions-panel-title">
            {closedCaptionOptionsString} 
            <span className={this.props.skinConfig.icons.cc.fontStyleClass}></span>
          </div>
          <OnOffSwitch {...this.props} />
          <LanguageTabContent {...this.props} />
          <CCPreviewPanel {...this.props} />
        </div>
    );
  }
});
module.exports = ClosedCaptionPanel;

var OnOffSwitch = React.createClass({
  handleOnOffSwitch: function() {
    this.props.controller.toggleClosedCaptionEnabled();
  },

  render: function(){
    var switchThumbClassName = ClassNames({
      'switch-thumb': true,
      'switch-thumb-on': this.props.closedCaptionOptions.enabled,
      'switch-thumb-off': !this.props.closedCaptionOptions.enabled
    });
    var switchBodyClassName = ClassNames({
      'switch-body': true,
      'switch-body-off': !this.props.closedCaptionOptions.enabled
    });
    var onCaptionClassName = ClassNames({
      'switch-captions switch-captions-on': true,
      'switch-captions-active': this.props.closedCaptionOptions.enabled
    });
    var offCaptionClassName = ClassNames({
      'switch-captions switch-captions-off': true,
      'switch-captions-active': !this.props.closedCaptionOptions.enabled
    });

    var offString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.OFF, this.props.localizableStrings);
    var onString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.ON, this.props.localizableStrings);

    return (
        <div className="switch-container">
          <span className={offCaptionClassName}>{offString}</span>
          <div className="switch-element">
            <span className={switchBodyClassName}></span>
            <span className={switchThumbClassName}></span>
          </div>
          <span className={onCaptionClassName}>{onString}</span>
          <a className="switch-container-selectable" onClick={this.handleOnOffSwitch}></a>
        </div>
    );
  }
});

var CCPreviewPanel = React.createClass({
  render: function(){
    var closedCaptionPreviewTitle = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.CLOSED_CAPTION_PREVIEW, this.props.localizableStrings);
    var closedCaptionSampleText = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.SAMPLE_TEXT, this.props.localizableStrings);

    var previewCaptionClassName = ClassNames({
      'preview-caption': true,
      'disabled': !this.props.closedCaptionOptions.enabled
    });
    var previewTextClassName = ClassNames({
      'preview-text': true,
      'disabled': !this.props.closedCaptionOptions.enabled
    });

    return (
      <div className="preview-panel">
        <div className={previewCaptionClassName}>{closedCaptionPreviewTitle}</div>
        <div className={previewTextClassName}>{closedCaptionSampleText}</div>
      </div>
    );
  }
});

var LanguageTabContent = React.createClass({
  propTypes: {
    languagesPerPage: React.PropTypes.objectOf(React.PropTypes.number)
  },

  getDefaultProps: function () {
    return {
      languagesPerPage: {
        small: 2,
        medium: 12,
        large: 25
      }
    }
  },

  getInitialState: function() {
    return {
      selectedLanguage: this.props.closedCaptionOptions.language,
      currentPage: 1
    };
  },

  changeLanguage: function(language){
    if (this.props.closedCaptionOptions.enabled){
      this.props.controller.onClosedCaptionLanguageChange(language);
    }
  },

  handleLeftChevronClick: function(event){
    event.preventDefault();
    this.setState({
      currentPage: this.state.currentPage - 1
    });
  },

  handleRightChevronClick: function(event){
    event.preventDefault();
    this.setState({
      currentPage: this.state.currentPage + 1
    });
  },

  setClassname: function(item){
    return ClassNames({
      'item': true,
      'item-selected': this.props.closedCaptionOptions.language == item && this.props.closedCaptionOptions.enabled,
      'disabled': !this.props.closedCaptionOptions.enabled
    });
  },

  render: function(){
    var availableLanguages = this.props.closedCaptionOptions.availableLanguages; //getting list of languages

    //pagination
    var languagesPerPage = this.props.languagesPerPage.medium;
    var startAt = languagesPerPage * (this.state.currentPage - 1);
    var endAt = languagesPerPage * this.state.currentPage;
    var languagePage = availableLanguages.languages.slice(startAt,endAt);

    //if there is only one element, do not show it at all
    if (availableLanguages.languages.length > 1) {
      //Build language content blocks
      var languageContentBlocks = [];
      for (var i = 0; i < languagePage.length; i++) {
        languageContentBlocks.push(
          <a className={this.setClassname(languagePage[i])} onClick={this.changeLanguage.bind(this, languagePage[i])} key={i}>
            <span>{availableLanguages.locale[languagePage[i]]}</span>
          </a>
        );
      }
    }

    var leftChevron = ClassNames({
      'leftButton': true,
      'hidden': !this.props.closedCaptionOptions.enabled || this.state.currentPage <= 1
    });
    var rightChevron = ClassNames({
      'rightButton': true,
      'hidden': !this.props.closedCaptionOptions.enabled || endAt >= availableLanguages.languages.length
    });

    return(
      <div className="language-container">
        <div className="language-panel flexcontainer">
          {languageContentBlocks}
        </div>

        <a className={leftChevron} ref="leftChevron" onClick={this.handleLeftButtonClick}>
          <span className={this.props.skinConfig.icons.left.fontStyleClass} aria-hidden="true"></span>
        </a>
        <a className={rightChevron} ref="rightChevron" onClick={this.handleRightChevronClick}>
          <span className={this.props.skinConfig.icons.right.fontStyleClass}  aria-hidden="true"></span>
        </a>
      </div>
    );
  }
});