import Wrapper from './shared/Wrapper';
import Renderer from '../Renderer';
import Block from '../Block';
import KeyBlock from '../../nodes/KeyBlock';
import FragmentWrapper from './Fragment';
import { Identifier } from 'estree';
export default class KeyBlockWrapper extends Wrapper {
    node: KeyBlock;
    fragment: FragmentWrapper;
    block: Block;
    dependencies: string[];
    var: Identifier;
    constructor(renderer: Renderer, block: Block, parent: Wrapper, node: KeyBlock, strip_whitespace: boolean, next_sibling: Wrapper);
    render(block: Block, parent_node: Identifier, parent_nodes: Identifier): void;
    render_static_key(_block: Block, parent_node: Identifier, parent_nodes: Identifier): void;
    render_dynamic_key(block: Block, parent_node: Identifier, parent_nodes: Identifier): void;
}
