import React, { Component } from 'react';
declare type State = JSX.Element[] | undefined;
declare type SideEffectProps = {
    reduceComponentsToState: <T>(components: Array<React.ReactElement<any>>, props: T) => State;
    handleStateChange?: (state: State) => void;
    headManager: any;
    inAmpMode?: boolean;
};
export default class extends Component<SideEffectProps> {
    private _hasHeadManager;
    emitChange: () => void;
    constructor(props: any);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): null;
}
export {};
