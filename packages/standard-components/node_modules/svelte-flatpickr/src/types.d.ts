import { SvelteComponentTyped } from 'svelte';
import flatpickr from 'flatpickr';

export type HookProps = [ Date[], string, flatpickr.Instance ];

declare module 'svelte-flatpickr' {
  export interface SvelteFlatpickrProps {
	  value?: Date | string;
	  formattedValue?: string;
	  element?: HTMLInputElement | string;
	  dateFormat?: string;
	  options?: flatpickr.Options.Options;
	  input?: HTMLInputElement | string;
	  fp?: flatpickr.Instance;
	  flatpickr?: flatpickr.Instance;
  }

  class Flatpickr extends SvelteComponentTyped<SvelteFlatpickrProps, {
	  change: CustomEvent<HookProps>,
	  open: CustomEvent<HookProps>,
	  close: CustomEvent<HookProps>,
	  monthChange: CustomEvent<HookProps>,
	  yearChange: CustomEvent<HookProps>,
	  ready: CustomEvent<HookProps>,
	  valueUpdate: CustomEvent<HookProps>,
	  dayCreate: CustomEvent<HookProps>,
  }, {}> {}

  export default Flatpickr;
}
