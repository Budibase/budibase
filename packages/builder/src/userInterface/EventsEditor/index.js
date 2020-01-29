export const deleteElement = (array, index) => {
  const arr = [...array];
  array.splice(index, 1);
  return arr;
};

export { default } from "./EventsEditor.svelte";