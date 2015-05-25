var events = require('add-event-listener');
var React = require('react/addons');

var Center = require('../Center');

var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var PropTypes = React.PropTypes;

require('./Modal.less');
var cx = require('../cx')('RTModal');

var Modal = React.createClass({
  propTypes: {
    opened: PropTypes.bool,
  },

  render() {
    var modal = null;
    if (this.props.opened) {
      modal = <OpenedModal key="one" {...this.props} />;
    }

    return (
      <CSSTransitionGroup transitionName={cx('anim')}>
        {modal}
      </CSSTransitionGroup>
    );
  },
});

var OpenedModal = React.createClass({
  render() {
    return (
      <Center className={cx('')}>
        <div className={cx('bg')} onClick={this.handleClose} />
        <div className={cx('window')}>
          <a href="javascript:" className={cx('close')}
              onClick={this.handleClose}>
            &times;
          </a>
          {this.props.render()}
        </div>
      </Center>
    );
  },

  componentDidMount() {
    events.addEventListener(document, 'keydown', this.handleNativeKey);
  },

  componentWillUnmount() {
    events.removeEventListener(document, 'keydown', this.handleNativeKey);
  },

  handleClose(event) {
    if (this.props.onClose) {
      this.props.onClose();
    }
  },

  handleNativeKey(event) {
    if (event.keyCode === 27 && this.props.onClose) {
      this.props.onClose();
    }
  },
});

Modal.Header = React.createClass({
  render() {
    return <div className={cx('Header')}>{this.props.children}</div>;
  },
});

Modal.Body = React.createClass({
  render() {
    return <div className={cx('Body')}>{this.props.children}</div>;
  },
});

Modal.Footer = React.createClass({
  render() {
    return <div className={cx('Footer')}>{this.props.children}</div>;
  },
});

module.exports = Modal;