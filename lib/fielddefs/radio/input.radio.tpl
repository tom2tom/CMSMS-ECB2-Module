{* input.radio.tpl - v1.0 - 25Jun22

********************************************************************}
{if !empty($description)}
        {$description}<br>
{/if}

{if $is_sub_field}
    {if is_null($sub_row_number)}{* output template field *}
        {foreach $options as $opt_key => $opt_text}
            <label><input type="radio" name="" value="{$opt_key}" class="repeater-field"  data-repeater="#{$block_name}-repeater" data-field-name="{$block_name}"{if $opt_key==$value} checked="checked"{/if}>{$opt_text|escape}</label>{$separator}
        {/foreach}

    {else}
        {html_radios id=$subFieldId name=$subFieldName options=$options separator=$separator selected=$value}

    {/if}

{else}
        {html_radios name=$block_name options=$options separator=$separator selected=$value}

{/if}