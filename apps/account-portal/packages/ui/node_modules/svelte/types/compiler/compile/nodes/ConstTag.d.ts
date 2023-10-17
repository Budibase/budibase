import Node from './shared/Node';
import Expression from './shared/Expression';
import Component from '../Component';
import TemplateScope from './shared/TemplateScope';
import { Context } from './shared/Context';
import { ConstTag as ConstTagType } from '../../interfaces';
import { INodeAllowConstTag } from './interfaces';
import { Node as ESTreeNode } from 'estree';
export default class ConstTag extends Node {
    type: 'ConstTag';
    expression: Expression;
    contexts: Context[];
    node: ConstTagType;
    scope: TemplateScope;
    context_rest_properties: Map<string, ESTreeNode>;
    assignees: Set<string>;
    dependencies: Set<string>;
    constructor(component: Component, parent: INodeAllowConstTag, scope: TemplateScope, info: ConstTagType);
    parse_expression(): void;
}
