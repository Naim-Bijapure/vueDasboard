/** @format */

export async function InputTo(wrapper, elementId, value) {
  let countField = await wrapper.find(elementId);
  countField.element.value = value;
  countField.trigger("input");
}
export async function ClickTo(wrapper,elementId) {
      
     await wrapper.find(elementId).trigger("click"); 
    
}
