{* input.ecb2fd_textinput.tpl - v1.0 - 25Jun22 

***************************************************************************************************}
{if !empty($description)}
        {$description}<br>
{/if}

{if $is_sub_field}
    {if is_null($sub_row_number)}{* output template field *}
        <input type="text" id="" name="" class="{$class}" value="" size="{$size}" maxlength="{$max_length}" data-repeater="#{$block_name}-repeater" data-field-name="{$block_name}"/>

    {else}    
        <input type="text" id="{$subFieldId}" name="{$subFieldName}" class="{$class}" value="{$value|escape}" size="{$size}" maxlength="{$max_length}"/>

    {/if}

{elseif !$repeater}
    {if !$use_json_format}
        <input type="text" name="{$block_name}" size="{$size}" maxlength="{$max_length}" value="{$value|escape}"/>

    {else}
        <input type="text" name="{$block_name}[]" size="{$size}" maxlength="{$max_length}" value="{$values[0]|escape}"/>
    {/if}

{else}{* is repeater *}
    {if empty($assign) && $field_alias_used!='input_repeater'}
        <div class="pagewarning">
            {$mod->Lang('error_assign_required')}
        </div><br>
    {/if}
        
        <div id="{$block_name}-repeater" class="ecb_repeater sortable" data-block-name="{$block_name}" data-highest-row="{$values|@count}" {if $max_blocks>0}data-max-blocks="{$max_blocks}"{/if}>
        
            <div class="repeater-wrapper-template" style="display:none;">
                <div class="drag-panel handle">
                    <span class="ecb2-icon-grip-dots-vertical-solid"></span>
                </div>
                <input id="" name="" class="repeater-field" size="{$size}" maxlength="{$max_length}" value="" data-repeater="#{$block_name}-repeater"/>
                <div class="right-panel">
                    <button class="ecb2-repeater-remove ecb2-btn ecb2-btn-default ecb2-icon-only" data-repeater="#{$block_name}-repeater" title="{$mod->Lang('remove_line')}" role="button" aria-disabled="false"><span class="ecb2-icon-trash-can-regular"></span></button>
                </div>
            </div>

            <button class="ecb2-repeater-add ecb2-btn ecb2-btn-default" data-repeater="#{$block_name}-repeater" title="{$mod->Lang('add_line')}" role="button" {if !empty($max_blocks) && $values|count>=$max_blocks} disabled aria-disabled="true"{else}aria-disabled="false"{/if}><span class="ecb2-icon-plus"></span>&nbsp;&nbsp;{$mod->Lang('add_item')}</button>

        {foreach $values as $value}
            <div class="repeater-wrapper">
                <div class="drag-panel handle">
                    <span class="ecb2-icon-grip-dots-vertical-solid"></span>
                </div>
                <input id="{$block_name}_r_{$value@iteration}" name="{$block_name}[r_{$value@iteration}]" class="repeater-field" size="{$size}" maxlength="{$max_length}" value="{$value|escape}" data-repeater="#{$block_name}-repeater"/>
                <div class="right-panel">
                    <button class="ecb2-repeater-remove ecb2-btn ecb2-btn-default ecb2-icon-only" data-repeater="#{$block_name}-repeater" title="{$mod->Lang('remove_line')}" role="button" aria-disabled="false"><span class="ecb2-icon-trash-can-regular"></span></button>
                </div>
            </div>
        {/foreach}

        </div>

{/if}