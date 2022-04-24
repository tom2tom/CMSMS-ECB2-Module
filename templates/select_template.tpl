{* select_template.tpl - v1.0 - 21Dec19

   - v1.0 - 21Dec19 - initial

   Note: $selected_values is an array supplied when select is multiple
         $options array of: $text => $value

***************************************************************************************************}
{if $description}{$description}{/if}
{if $multiple}
      <div class="ecb_multiple_select cms_dropdown {if $compact}ecb_compact{/if}">
      {if $compact}
         <div class="ecb_select_summary">
            <span class="ecb_select_text" data-empty="{$none_selected}">{$selected_text|default:$none_selected}</span>
            &nbsp;<a class="ecb_select_edit" href="edit/hide"></a>
         </div>
      {/if}
         <input type="hidden" id="{$block_name}" class="ecb_select_input" name="{$block_name}" value="{$selected}" />
         <select class="cms_dropdown" name="{$block_name}_tmp" multiple size="{$size}">
         {foreach $options as $text => $value}
            <option value="{$value}" {if $value|in_array:$selected_values}selected{/if}>{$text|default:$value}</option>
         {/foreach}
         </select>
      </div>
{else}

      <select class="cms_dropdown" name="{$block_name}">
      {foreach $options as $text => $value}
         <option value="{$value}" {if $selected==$value}selected{/if}>{$text}</option>
      {/foreach}
      </select>
{/if}