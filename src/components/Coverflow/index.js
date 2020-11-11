/* eslint-disable */
/**
 * React Coverflow
 *
 * Author: andyyou & asalem1
 */
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Radium, { StyleRoot } from 'radium';
import Link from '../Link';
import './index.scss';

const TOUCH = {
  move: false,
  lastX: 0,
  sign: 0,
  lastMove: 0,
};

const TRANSITIONS = [
  'transitionend',
  'oTransitionEnd',
  'otransitionend',
  'MSTransitionEnd',
  'webkitTransitionEnd',
];

const HandleAnimationState = function() {
  this._removePointerEvents();
};


class Coverflow extends Component {
  /**
   * Life cycle events
   */
  refNode = createRef();

  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
    this._handleWheel = this._handleWheel.bind(this);
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
    displayQuantityOfSide: PropTypes.number.isRequired,
    navigation: PropTypes.bool,
    enableHeading: PropTypes.bool,
    enableScroll: PropTypes.bool,
    clickable: PropTypes.bool,
    currentFigureScale: PropTypes.number,
    otherFigureScale: PropTypes.number,
    active: PropTypes.number,
    media: PropTypes.any,
    classes: PropTypes.object,
    className: PropTypes.string,
    infiniteScroll: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    navigation: false,
    enableHeading: true,
    enableScroll: true,
    clickable: true,
    classes: {},
    className: '',
    currentFigureScale: 1.5,
    otherFigureScale: 0.8,
    active: 0,
    media: {},
    infiniteScroll: false,
    width: 'auto',
    height: 'auto',
  };

  state = {
    current: ~~(React.Children.count(this.props.children) / 2),
    move: 0,
    width: this.props.width,
    height: this.props.height,
    timer: null,
  };

  componentDidMount() {
    this.updateDimensions(this.props.active);
    const length = React.Children.count(this.props.children);

    TRANSITIONS.forEach(event => {
      for (let i = 0; i < length; i++) {
        const figureID = `figure_${i}`;
        this.refs[figureID].addEventListener(event, HandleAnimationState.bind(this));
      }
    });

    const eventListener = window && window.addEventListener;

    if (eventListener) {
      window.addEventListener('resize', this.updateDimensions);
    }
    if (this.refNode.current && this.props.enableScroll) {
      this.refNode.current.addEventListener('wheel', this._handleWheel);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.active !== prevProps.active) {
      this.updateDimensions(this.props.active);
    }
  }

  componentWillUnmount() {
    const length = React.Children.count(this.props.children);

    TRANSITIONS.forEach(event => {
      for (let i = 0; i < length; i++) {
        const figureID = `figure_${i}`;
        this.refs[figureID].removeEventListener(event, HandleAnimationState.bind(this));
      }
    });

    const removeListener = window && window.removeEventListener;

    if(removeListener) {
      window.removeEventListener('resize', this.updateDimensions);
    }

    if (this.refNode.current && this.props.enableScroll) {
      this.refNode.current.removeEventListener('wheel', this._handleWheel);
    }
  }

  updateDimensions(active) {
    const { displayQuantityOfSide } = this.props;
    const length = React.Children.count(this.props.children);
    const center = this._center();
    let state = {
      width: this.refNode.current.offsetWidth,
      height: this.refNode.current.offsetHeight,
    };
    const baseWidth = state.width / (displayQuantityOfSide * 2 + 1);
    let activeImg = typeof active === 'number' ? active : this.props.active;
    if (typeof active === 'number' && ~~active < length) {
      activeImg = ~~active;
      let move = 0;
      move = baseWidth * (center - activeImg);

      state = Object.assign({}, state, {
        current: active,
        move,
      });
    }
    this.setState(state);
  }

  render() {
    const { enableScroll, navigation, className, classes, infiniteScroll, media } = this.props;
    const { width, height, current } = this.state;
    const renderPrevBtn = infiniteScroll ? true : current > 0;
    const renderNextBtn = infiniteScroll ? true : current < this.props.children.length - 1;
    return (
      <div
        ref={this.refNode}
        className='Coverflow'
      >
        <StyleRoot>
          <div
            className={`${className} container`}
            style={
              Object.keys(media).length !== 0 ? media : { ...classes, width: typeof width === 'string' ? width : `${width}px`, height: typeof height === 'string' ? height : `${height}px` }
        }
            onTouchStart={this._handleTouchStart.bind(this)}
            onTouchMove={this._handleTouchMove.bind(this)}
            onKeyDown={this._keyDown.bind(this)}
            tabIndex="-1"
          >
            <div className='coverflow'>
              <div className='preloader' />
              <div className='stage' ref="stage">
                {navigation && (
                  <div
                    id='arrow1'
                    className='arrowWrapper'
                  >
                    {renderPrevBtn && (
                      <div
                        onClick={(e) => this._handlePrevFigure(e)}
                        className='arrow left'
                      >
                        <span/>
                      </div>
                    )}
                    {this._renderFigureNodes()}
                    {renderNextBtn && (
                      <div
                        onClick={(e) => this._handleNextFigure(e)}
                        className='arrow right'
                      >
                        <span/>
                      </div>
                    )}
                  </div>
                )}
                {!navigation && this._renderFigureNodes()}
              </div>
              </div>
          </div>
        </StyleRoot>
      </div>
    );
  }

  /**
   * Private methods
   */
  _center() {
    const length = React.Children.count(this.props.children);
    return ~~(length / 2);
  }

  _keyDown(e) {
    if (e.keyCode === 37) {
      this._handlePrevFigure();
    } else if (e.keyCode === 39) {
      this._handleNextFigure();
    }
  }

  _handleFigureStyle(index, current) {
    const { displayQuantityOfSide, navigation } = this.props;
    const { width } = this.state;
    const style = {};
    const baseWidth = width / (displayQuantityOfSide * 2 + 1);
    const length = React.Children.count(this.props.children);
    const offset = length % 2 === 0 ? -width / 10 : 0;
    // Handle opacity
    const depth = displayQuantityOfSide - Math.abs(current - index);
    /*
    let opacity = depth === 1 ? 0.95 : 0.5;
    opacity = depth === 2 ? 0.92 : opacity;
    opacity = depth === 3 ? 0.9 : opacity;
    opacity = current === index ? 1 : opacity;
    */
    const opacity = 1;
    
    // Handle translateX
    if (index === current) {
      style.width = `${baseWidth}px`;
      style.transform = `translateX(${this.state.move + offset}px)  scale(${
        this.props.currentFigureScale
      }`;
      style.zIndex = `${10 - depth}`;
      style.opacity = opacity;
    } else if (index < current) {
      // Left side
      style.width = `${baseWidth}px`;
      style.transform = `translateX(${this.state.move + offset}px) rotateY(40deg) scale(${
        this.props.otherFigureScale
      }`;
      style.zIndex = `${10 - depth}`;
      style.opacity = opacity;
      if (navigation) {
        style.pointerEvents = 'none';
      }
    } else if (index > current) {
      // Right side
      style.width = `${baseWidth}px`;
      style.transform = ` translateX(${this.state.move + offset}px) rotateY(-40deg) scale(${
        this.props.otherFigureScale
      })`;
      style.zIndex = `${10 - depth}`;
      style.opacity = opacity;
      if (navigation) {
        style.pointerEvents = 'none';
      }
    }
    return style;
  }

  _handleFigureClick = (index, to, e) => {
    if (!this.props.clickable) {
      e.preventDefault();
      return;
    }
    if (this.state.current === index) {

      this._removePointerEvents();
    } else {
      // Move to the selected figure
      e.preventDefault();
      e.stopPropagation();
      const { displayQuantityOfSide } = this.props;
      const { width } = this.state;
      const baseWidth = width / (displayQuantityOfSide * 2 + 1);
      const distance = this._center() - index;
      const move = distance * baseWidth;
      this.setState({ current: index, move });
    }
  };

  _renderFigureNodes = () => {
    const { enableHeading } = this.props;
    const { current } = this.state;
    const figureNodes = React.Children.map(this.props.children, (child, index) => {
      const figureElement = React.cloneElement(child, {
        className: 'cover',
      });
      const style = this._handleFigureStyle(index, current);
      return (
        <figure
          className='figure'
          key={index}
          style={style}
          ref={`figure_${index}`}
        >
          <Link
            to={figureElement.props['data-to']}
          >
            <div
              onClick={e => this._handleFigureClick(index, figureElement.props['data-to'], e)}
            >
              {figureElement}
              {enableHeading && <div className='text'>{figureElement.props.alt}</div>}
            </div>
          </Link>
        </figure>
      );
    });
    return figureNodes;
  };

  _removePointerEvents() {
    this.refs.stage.style.pointerEvents = 'auto';
  }

  _hasPrevFigure = () => this.state.current - 1 >= 0;

  _hasNextFigure = () => this.state.current + 1 < this.props.children.length;

  _handlePrevFigure = (e) => {
    const { displayQuantityOfSide, infiniteScroll } = this.props;
    const { width } = this.state;
    const { current } = this.state;
    const baseWidth = width / (displayQuantityOfSide * 2 + 1);
    const distance =
      this._center() - (current - 1 < 0 ? this.props.children.length - 1 : current - 1);
    const move = distance * baseWidth;

    if (current - 1 >= 0) {
      this.setState({ current: current - 1, move });
      TOUCH.lastMove = move;
    }
    if (current - 1 < 0 && infiniteScroll) {
      this.setState({ current: this.props.children.length - 1, move });
      TOUCH.lastMove = move;
    }
  };

  _handleNextFigure = (e) => {
    const { displayQuantityOfSide, infiniteScroll } = this.props;
    const { width } = this.state;
    const { current } = this.state;
    const baseWidth = width / (displayQuantityOfSide * 2 + 1);
    const distance = this._center() - (current + 1 >= this.props.children.length ? 0 : current + 1);
    const move = distance * baseWidth;

    if (current + 1 < this.props.children.length) {
      this.setState({ current: current + 1, move });
      TOUCH.lastMove = move;
    }
    if (current + 1 >= this.props.children.length && infiniteScroll) {
      this.setState({ current: 0, move });
      TOUCH.lastMove = move;
    }
  };

  _handleWheel(e) {
    e.stopPropagation();
    if (this.state.timer || Math.abs(e.deltaY) < 50) {
      e.preventDefault();
      return false;
    }
    this.setState({
      timer: setTimeout(() => {
        this.setState({ timer: null });
      }, 600),
    });

    const delta = e.deltaY > 0 ? -600000 : 600000;
    const count = 1;

    if (count > 0) {
      const sign = Math.abs(delta) / delta;
      let func = null;

      if (sign > 0 && this._hasPrevFigure()) {
        func = this._handlePrevFigure();
        e.preventDefault();
      } else if (sign < 0 && this._hasNextFigure()) {
        func = this._handleNextFigure();
        e.preventDefault();
      }

      if (typeof func === 'function') {
        for (let i = 0; i < count; i++) func();
      }
    }
    return false;
  }

  _handleTouchStart(e) {
    TOUCH.lastX = e.nativeEvent.touches[0].clientX;
    TOUCH.lastMove = this.state.move;
  }

  _handleTouchMove(e) {
    e.preventDefault();
    const { displayQuantityOfSide } = this.props;
    const { width } = this.state;

    const clientX = e.nativeEvent.touches[0].clientX;
    const lastX = TOUCH.lastX;
    const baseWidth = width / (displayQuantityOfSide * 2 + 1);
    const move = clientX - lastX;
    const totalMove = TOUCH.lastMove - move;
    const sign = Math.abs(move) / move;

    if (Math.abs(totalMove) >= baseWidth) {
      let fn = null;
      if (sign > 0) {
        fn = this._handlePrevFigure();
      } else if (sign < 0) {
        fn = this._handleNextFigure();
      }
      if (typeof fn === 'function') {
        fn();
      }
    }
  }
}

Coverflow.displayName = 'Coverflow';

export default Radium(Coverflow);
