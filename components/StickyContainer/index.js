// @flow

import React, { Component, type Node } from 'react';

import { Provider } from './StickyContext';

type Props = {
  children?: Node,
  className?: string,
  // eslint-disable-next-line flowtype/no-weak-types
  styles: Object
};

const defaultStyles = {
  display: 'inline-block'
};

class StickyContainer extends Component<Props> {
  static defaultProps = {
    styles: defaultStyles
  };

  _container: HTMLElement | null;

  render() {
    const { className, styles, children } = this.props;
    return (
      <div className={className} styles={styles}>
        <Provider value={this._container}>{children}</Provider>
      </div>
    );
  }
}

export default StickyContainer;
