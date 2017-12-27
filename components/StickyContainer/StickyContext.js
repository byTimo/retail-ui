// @flow

import createReactContext, { type Context } from 'create-react-context';

type ContextType = Context<HTMLElement | null>;

// $FlowFixMe wrong definition for createReactContext default value
const context: ContextType = createReactContext(null);

export const Provider = context.Provider;
export const Consumer = context.Consumer;
