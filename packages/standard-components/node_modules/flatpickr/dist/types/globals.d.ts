import { Options } from "./options";
import { Instance, FlatpickrFn } from "./instance";
declare global {
    interface HTMLElement {
        flatpickr: (config?: Options) => Instance;
        _flatpickr?: Instance;
    }
    interface NodeList {
        flatpickr: (config?: Options) => Instance | Instance[];
    }
    interface HTMLCollection {
        flatpickr: (config?: Options) => Instance | Instance[];
    }
    interface Window {
        flatpickr: FlatpickrFn;
    }
    interface Date {
        fp_incr: (n: number) => Date;
    }
}
