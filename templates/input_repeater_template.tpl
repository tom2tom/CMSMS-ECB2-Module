{* input_repeater_template.tpl - v1.1
  - v1.1 - 20Apr22 - id for all elements, no 1st-field removal 
  - v1.0 - 15Feb19 - initial
*}
{if !empty($description)}{$description}{/if}
<input type="hidden" id="ecb2-repeater-{$block_name}" name="{$block_name}" value="{$value}" />
<div id="{$block_name}-repeater" class="ecb2_repeater" data-parent="#ecb2-repeater-{$block_name}">
{foreach $fields as $field}
  <div class="repeater-wrapper">
    <input id="repeater-field-{$block_name}-{$field@iteration}" class="repeater-field" size="{$size}" maxlength="{$max_length}" value="{$field}" data-repeater="#{$block_name}-repeater" />
    <button id="repeater-add-{$block_name}-{$field@iteration}" class="ecb2-button-inline ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" data-repeater="#{$block_name}-repeater" title="{$title_add_line}" role="button" aria-disabled="false">+</button>
  {if !$field@first}
    <button id="repeater-remove-{$block_name}-{$field@iteration}" class="ecb2-button-inline ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" data-repeater="#{$block_name}-repeater" title="{$title_remove_line}" role="button" aria-disabled="false">&minus;</button>
  {/if} 
  </div>
{/foreach}
</div>
