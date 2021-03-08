<script>
  import { createEventDispatcher } from 'svelte'
  import Colorpicker from "@budibase/colorpicker"
  
  const dispatch = createEventDispatcher();

  export let value
  
  const WAIT = 150;
  
  function throttle(callback, wait, immediate = false) {
    let timeout = null 
    let initialCall = true
    
    return function() {
      const callNow = immediate && initialCall
      const next = () => {
        callback.apply(this, arguments)
        timeout = null
      }
      
      if (callNow) { 
        initialCall = false
        next()
      }
  
      if (!timeout) {
        timeout = setTimeout(next, wait)
      }
    }
  }
  
  const onChange = throttle(e => {
    dispatch('change', e.detail)
  }, WAIT, true)
</script>

<Colorpicker value={value || '#000'} on:change={onChange} />
