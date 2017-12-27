// @flow

import React, { Component, type Node } from 'react';
import LayoutEvents from '../../lib/LayoutEvents';
import { Consumer } from './StickyContext';
import shallowEqual from 'fbjs/lib/shallowEqual';

type Props = {
  children?: Node
};

class Sticky extends Component<Props> {
  render() {
    return <Consumer>{this._renderSticky}</Consumer>;
  }

  _renderSticky = container => {
    if (!container) {
      return this.props.children;
    }
    return <StickyActive container={container} {...this.props} />;
  };
}

type StickyActiveProps = Props & {
  container: HTMLElement
};

type State = {
  top: number,
  left: number,
  fixedX: boolean,
  fixedY: boolean
};

type NodePositionType =
  | 'OutOfScreen'
  | 'IntersectsHorizontalBound'
  | 'IntersectsVericalBound'
  | 'IntersectsCrossedBound'
  | 'InBounds';

const initialState = {
  top: 0,
  left: 0,
  fixedX: false,
  fixedY: false
};

class StickyActive extends Component<StickyActiveProps, State> {
  state = initialState;

  _node: HTMLElement | null;
  _listener = null;

  componentDidMount() {
    this._reflow();
    this._listener = LayoutEvents.addListener(() => this._reflow());
  }

  shouldComponentUpdate(nextProps: StickyActiveProps) {
    return !shallowEqual(this.props, nextProps);
  }

  componentWillUnmount() {
    if (this._listener) {
      this._listener.remove();
    }
  }

  render() {
    const styles = {
      top: this.state.fixedY ? this.state.top : 'auto',
      left: this.state.fixedX ? this.state.left : 'auto'
    };
    return (
      <div ref={node => (this._node = node)} styles={styles}>
        {this.props.children}
      </div>
    );
  }

  _reflow() {
    const nodePositionType = this._getNodePositionType();
    let position;
    switch (nodePositionType) {
      case 'IntersectsCrossedBound':
        position = this._getTopLeftPosition();
        break;
      case 'IntersectsHorizontalBound':
        position = this._getLeftPosition();
        break;
      case 'IntersectsVericalBound':
        position = this._getTopPosition();
        break;
      default:
        position = initialState;
    }
    this.setState(position);
  }

  _getTopLeftPosition() {
    const { top, left } = this._getDisiredNodePositions();
    return { top, left, fixedX: true, fixedY: true };
  }

  _getLeftPosition() {
    const { left } = this._getDisiredNodePositions();
    return { top: 0, left, fixedX: true, fixedY: false };
  }

  _getTopPosition() {
    const { top } = this._getDisiredNodePositions();
    return { top, left: 0, fixedX: false, fixedY: true };
  }

  _getDisiredNodePositions() {
    return { top: 0, left: 0 };
  }

  _getNodePositionType(): NodePositionType {
    if (this._checkNodeOutOfScreen()) {
      return 'OutOfScreen';
    }
    if (this._checkCrossedIntersection()) {
      return 'IntersectsCrossedBound';
    }
    if (this._checkHorizontalIntersection()) {
      return 'IntersectsHorizontalBound';
    }
    if (this._checkVerticalIntersection()) {
      return 'IntersectsVericalBound';
    }
    return 'InBounds';
  }

  _checkNodeOutOfScreen() {
    return false;
  }

  _checkCrossedIntersection() {
    return (
      this._checkHorizontalIntersection() && this._checkVerticalIntersection()
    );
  }

  _checkHorizontalIntersection() {
    return false;
  }

  _checkVerticalIntersection() {
    return false;
  }
}

export default Sticky;
