import ElseBlock from './ElseBlock';
import Expression from './shared/Expression';
import AbstractBlock from './shared/AbstractBlock';
import Component from '../Component';
import TemplateScope from './shared/TemplateScope';
import { TemplateNode } from '../../interfaces';
import Node from './shared/Node';
import ConstTag from './ConstTag';
export default class IfBlock extends AbstractBlock {
    type: 'IfBlock';
    expression: Expression;
    else: ElseBlock;
    scope: TemplateScope;
    const_tags: ConstTag[];
    constructor(component: Component, parent: Node, scope: TemplateScope, info: TemplateNode);
}
