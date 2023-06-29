{* input.ecb2fd_ZZZ.tpl - v1.0 - 25Jun22 

***************************************************************************************************}
{if !empty($description)}
        {$description}<br>
{/if}

{if $is_sub_field}
    {if is_null($sub_row_number)}{* sub_field template field *}
        <input type="text" id="" name="" class="{$class}" value="" size="{$size}" maxlength="{$max_length}" data-repeater="#{$block_name}-repeater" data-field-name="{$block_name}"/>

    {else}{* sub_field *}
        <input type="text" id="{$subFieldId}" name="{$subFieldName}" class="{$class}" value="{$value}" size="{$size}" maxlength="{$max_length}"/>

    {/if}

{else}
        <input type="text" name="{$block_name}" value="{$value}"/>

{/if}