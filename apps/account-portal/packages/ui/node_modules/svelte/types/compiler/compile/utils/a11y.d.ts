import { ARIARoleDefintionKey } from 'aria-query';
import Attribute from '../nodes/Attribute';
export declare function is_non_interactive_roles(role: ARIARoleDefintionKey): boolean;
export declare function is_interactive_roles(role: ARIARoleDefintionKey): boolean;
export declare function is_presentation_role(role: ARIARoleDefintionKey): boolean;
export declare function is_hidden_from_screen_reader(tag_name: string, attribute_map: Map<string, Attribute>): boolean;
export declare function is_interactive_element(tag_name: string, attribute_map: Map<string, Attribute>): boolean;
export declare function is_semantic_role_element(role: ARIARoleDefintionKey, tag_name: string, attribute_map: Map<string, Attribute>): boolean;
