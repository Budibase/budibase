import Wrapper from './shared/Wrapper';
import Renderer from '../Renderer';
import Block from '../Block';
import EachBlock from '../../nodes/EachBlock';
import IfBlock from '../../nodes/IfBlock';
import ElseBlock from '../../nodes/ElseBlock';
import FragmentWrapper from './Fragment';
import { Identifier, Node } from 'estree';
declare type DetachingOrNull = 'detaching' | null;
declare class IfBlockBranch extends Wrapper {
    block: Block;
    fragment: FragmentWrapper;
    dependencies?: string[];
    condition?: any;
    snippet?: Node;
    is_dynamic: boolean;
    node: IfBlock | ElseBlock;
    var: any;
    get_ctx_name: Node | undefined;
    constructor(renderer: Renderer, block: Block, parent: IfBlockWrapper, node: IfBlock | ElseBlock, strip_whitespace: boolean, next_sibling: Wrapper);
}
export default class IfBlockWrapper extends Wrapper {
    node: IfBlock;
    branches: IfBlockBranch[];
    needs_update: boolean;
    var: Identifier;
    constructor(renderer: Renderer, block: Block, parent: Wrapper, node: EachBlock, strip_whitespace: boolean, next_sibling: Wrapper);
    render(block: Block, parent_node: Identifier, parent_nodes: Identifier): void;
    render_compound(block: Block, parent_node: Identifier, _parent_nodes: Identifier, dynamic: boolean, { name, anchor, has_else, if_exists_condition, has_transitions }: {
        name: any;
        anchor: any;
        has_else: any;
        if_exists_condition: any;
        has_transitions: any;
    }, detaching: DetachingOrNull): void;
    render_compound_with_outros(block: Block, parent_node: Identifier, _parent_nodes: Identifier, dynamic: boolean, { name, anchor, has_else, has_transitions, if_exists_condition }: {
        name: any;
        anchor: any;
        has_else: any;
        has_transitions: any;
        if_exists_condition: any;
    }, detaching: DetachingOrNull): void;
    render_simple(block: Block, parent_node: Identifier, _parent_nodes: Identifier, dynamic: boolean, { name, anchor, if_exists_condition, has_transitions }: {
        name: any;
        anchor: any;
        if_exists_condition: any;
        has_transitions: any;
    }, detaching: DetachingOrNull): void;
}
export {};
