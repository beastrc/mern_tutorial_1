'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _propTypes = require('prop-types');

var _react2 = _interopRequireDefault(_react);

var _Truncate = require('./Truncate');

var _Truncate2 = _interopRequireDefault(_Truncate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReadMore = function (_Component) {
  _inherits(ReadMore, _Component);

  function ReadMore() {
    var _ref;

    _classCallCheck(this, ReadMore);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_ref = ReadMore.__proto__ || Object.getPrototypeOf(ReadMore)).call.apply(_ref, [this].concat(args)));

    _this.state = {
      readMore: true
    };

    _this.toggleLines = _this.toggleLines.bind(_this);
    return _this;
  }

  _createClass(ReadMore, [{
    key: 'toggleLines',
    value: function toggleLines(event) {
      event.preventDefault();

      this.setState({
        readMore: !this.state.readMore
      });

      this.props.onShowMore && this.props.onShowMore(event);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          text = _props.text,
          lines = _props.lines;


      return _react2.default.createElement(
        _Truncate2.default,
        {
          ellipsis: _react2.default.createElement(
            'span',
            null,
            '... ',
            _react2.default.createElement(
              'a',
              { href: '#', onClick: this.toggleLines },
              text
            )
          ),
          lines: this.state.readMore && lines,
          options: this.props.options },
        children
      );
    }
  }]);

  return ReadMore;
}(_react.Component);

ReadMore.defaultProps = {
  lines: 3,
  text: 'Read more',
  options: {}
};

ReadMore.propTypes = {
  children: _propTypes.node.isRequired,
  text: _propTypes.node,
  options: _propTypes.object,
  onShowMore: _propTypes.func,
  lines: _propTypes.number
};

exports.default = ReadMore;
module.exports = exports['default'];