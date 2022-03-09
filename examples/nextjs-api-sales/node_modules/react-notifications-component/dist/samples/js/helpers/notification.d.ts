declare const _default: {
    title: string;
    message: string;
    type: string;
    container: string;
    insert: string;
    animationIn: string[];
    animationOut: string[];
    slidingEnter: {
        duration: number;
        timingFunction: string;
        delay: number;
    };
    slidingExit: {
        duration: number;
        timingFunction: string;
        delay: number;
    };
    touchRevert: {
        duration: number;
        timingFunction: string;
        delay: number;
    };
    touchSlidingExit: {
        swipe: {
            duration: number;
            timingFunction: string;
            delay: number;
        };
        fade: {
            duration: number;
            timingFunction: string;
            delay: number;
        };
    };
    dismiss: {
        duration: number;
        onScreen: boolean;
        pauseOnHover: boolean;
        waitForAnimation: boolean;
        showIcon: boolean;
        click: boolean;
        touch: boolean;
    };
};
export default _default;
