{* input.color_picker.tpl - v1.0 - 25Jun22

********************************************************************}
{if !empty($description)}
        {$description}<br>
{/if}

{if $is_sub_field}
    {if is_null($sub_row_number)}{* output template field *}
        <input type="text" name="" id="" class="colorpicker-template repeater-field" size="{$size}" value="{$value}"  data-repeater="#{$block_name}-repeater" data-field-name="{$block_name}" {if !empty($no_hash)} data-no-hash="{$no_hash}"{/if}/>

    {else}
        <input type="text" name="{$subFieldName}" id="{$subFieldId}" class="{$class}" size="{$size}" value="{$value}" {if !empty($no_hash)} data-no-hash="{$no_hash}"{/if} />

    {/if}

{else}
        <input class="{$class}" type="text" name="{$block_name}" id="{$alias}" size="{$size}" value="{$value}" {if !empty($no_hash)} data-no-hash="{$no_hash}"{/if} />

{/if}