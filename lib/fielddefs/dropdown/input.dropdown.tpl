{* input.dropdown.tpl - v1.0 - 27Jun22

    Note: $selected_values is an array supplied when select is multiple
          $options array of: $text => $value

********************************************************************}
{if !empty($description)}
        {$description}<br>
{/if}

{if $is_sub_field}
    {if $multiple}
        <div class="ecb_multiple_select json cms_dropdown {if $compact}ecb_compact{/if}">
        {if $compact}
            {$none_selected=$mod->Lang('none_selected')}
            <div class="ecb_select_summary">
                <span class="ecb_select_text" data-empty="{$none_selected}">{$selected_text|default:$none_selected}</span>
                &nbsp;<a class="ecb_select_edit" href="edit/hide"></a>
            </div>
        {/if}
        {* uses json format *}
            {strip}<select class="cms_dropdown repeater-field"
            name="{if $not_sub_field_template}{$sub_parent_block}[r_{$sub_row_number}][{$block_name}][]{/if}" multiple size="{$size}">{/strip}
            {foreach $options as $value => $text}
                <option value="{$value|escape}"{if isset($selected_keys.$value)} selected{/if}>{$text|default:$value|escape}</option>
            {/foreach}
            </select>
        </div>
    {else}

        <select id="{if $not_sub_field_template}{$sub_parent_block}_r_{$sub_row_number}_{$block_name}{/if}" class="cms_dropdown repeater-field" name="{if $not_sub_field_template}{$sub_parent_block}[r_{$sub_row_number}][{$block_name}]{/if}" data-repeater="#{$sub_parent_block}-repeater" data-field-name="{$block_name}">
        {foreach $options as $value => $text}
            <option value="{$value|escape}"{if $selected==$value} selected{/if}>{$text}</option>
        {/foreach}
        </select>
    {/if}


{else}{* not $is_sub_field *}
    {if $multiple}
        <div class="ecb_multiple_select {if $use_json_format}json{/if} cms_dropdown {if $compact}ecb_compact{/if}">
        {if $compact}
            {$none_selected=$mod->Lang('none_selected')}
            <div class="ecb_select_summary">
                <span class="ecb_select_text" data-empty="{$none_selected}">{$selected_text|default:$none_selected}</span>
                &nbsp;<a class="ecb_select_edit" href="edit/hide"></a>
            </div>
        {/if}
        {if $use_json_format}
            <select class="cms_dropdown" name="{$block_name}[]" multiple size="{$size}">
            {foreach $options as $value => $text}
                <option value="{$value|escape}"{if isset($selected_keys.$value)} selected{/if}>{$text|default:$value|escape}</option>
            {/foreach}
            </select>
        {else}
            <input type="hidden" id="{$block_name}" class="ecb_select_input" name="{$block_name}" value="{$selected}" />
            <select class="cms_dropdown" name="{$block_name}_tmp" multiple size="{$size}">
            {foreach $options as $value => $text}
                <option value="{$value|escape}"{if isset($selected_keys.$value)} selected{/if}>{$text|default:$value|escape}</option>
            {/foreach}
            </select>
        {/if}
        </div>

    {else}

        <select class="cms_dropdown" name="{$block_name}">
        {foreach $options as $value => $text}
            <option value="{$value|escape}"{if $selected==$value} selected{/if}>{$text}</option>
        {/foreach}
        </select>
    {/if}
{/if}