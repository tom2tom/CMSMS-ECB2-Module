{* input.ecb2fd_checkbox.tpl - v1.0 - 25Jun22 

***************************************************************************************************}
{if !empty($description)}
        {$description}<br>
{/if}

{if $is_sub_field}
    {if is_null($sub_row_number)}{* output template field *}
        <input type="hidden" name="" value="0">
        <input type="checkbox" name="" id="" value="1" class="cms_checkbox {if $inline_label}inline-label ecb2-hide-label{/if} repeater-field" data-repeater="#{$block_name}-repeater" data-field-name="{$block_name}">
        {if $inline_label}<label for="">{$inline_label}&nbsp;</label>{/if}

    {else}    
        <input type="hidden" name="{$subFieldName}" value="0">
        <input type="checkbox" name="{$subFieldName}" id="{$subFieldId}" value="1" class="cms_checkbox repeater-field {if $inline_label}inline-label ecb2-hide-label{/if}" {if $value}checked="checked"{/if}>
        {if $inline_label}<label for="{$subFieldId}">{$inline_label}&nbsp;</label>{/if}

    {/if}


{else}
        <input type="hidden" name="{$block_name}" value="0">
        <input type="checkbox" id="{$block_name}" class="cms_checkbox{if $inline_label} inline-label ecb2-hide-label{/if}" name="{$block_name}" value="1" {if $value}checked="checked"{/if}>
    {if $inline_label}
        <label for="{$block_name}"> <b>{$inline_label}</b></label>
    {/if}

{/if}