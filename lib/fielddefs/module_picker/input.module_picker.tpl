{* input.module_picker.tpl - v1.0 - 25Jun22

********************************************************************}
{if !empty($description)}
        {$description}<br>
{/if}

{if $is_sub_field}
    {if is_null($sub_row_number)}{* sub_field template field *}
        <select id="" name="" class="{$class}" data-repeater="#{$block_name}-repeater" data-field-name="{$block_name}">
            {html_options options=$modulesarray selected=$value}
        </select>

    {else}{* sub_field *}
        <select id="{$subFieldId}" name="{$subFieldName}" class="{$class}">
            {html_options options=$modulesarray selected=$value}
        </select>

    {/if}

{else}
        {html_options name=$block_name options=$modulesarray selected=$value}

{/if}
