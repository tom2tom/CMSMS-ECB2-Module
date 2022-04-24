{* input_repeater_template.tpl - v1.0 - 15Feb19

   - v1.0 - 15Feb19 - initial

***************************************************************************************************}
   {$description}
   <input type="hidden" id="{$block_name}" name="{$block_name}" value="{$value}" size="100"/>

   <div id="{$block_name}-repeater" class="ecb_repeater" data-parent="#{$block_name}">
{foreach $fields as $field}
      <div class="repeater-wrapper">
         <input id="repeater-field-{$block_name}-{$field@iteration}" class="repeater-field" size="{$size}" maxlength="{$max_length}" value="{$field}" data-repeater="#{$block_name}-repeater"/>
         <button class="ecb2-repeater-add ecb2-button-inline ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" data-repeater="#{$block_name}-repeater" title="{$title_add_line}" role="button" aria-disabled="false">+</button>
         <button class="ecb2-repeater-remove ecb2-button-inline ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" data-repeater="#{$block_name}-repeater" title="{$title_remove_line}" role="button" aria-disabled="false">&minus;</button>
      </div>
{/foreach}
   </div>