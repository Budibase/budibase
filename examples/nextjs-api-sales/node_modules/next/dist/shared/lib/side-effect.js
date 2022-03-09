"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
const isServer = typeof window === 'undefined';
class _class extends _react.Component {
    constructor(props){
        super(props);
        this.emitChange = ()=>{
            if (this._hasHeadManager) {
                this.props.headManager.updateHead(this.props.reduceComponentsToState([
                    ...this.props.headManager.mountedInstances
                ], this.props));
            }
        };
        this._hasHeadManager = this.props.headManager && this.props.headManager.mountedInstances;
        if (isServer && this._hasHeadManager) {
            this.props.headManager.mountedInstances.add(this);
            this.emitChange();
        }
    }
    componentDidMount() {
        if (this._hasHeadManager) {
            this.props.headManager.mountedInstances.add(this);
        }
        this.emitChange();
    }
    componentDidUpdate() {
        this.emitChange();
    }
    componentWillUnmount() {
        if (this._hasHeadManager) {
            this.props.headManager.mountedInstances.delete(this);
        }
        this.emitChange();
    }
    render() {
        return null;
    }
}
exports.default = _class;

//# sourceMappingURL=side-effect.js.map