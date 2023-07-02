{* input.textarea.tpl - v1.0 - 25Jun22

********************************************************************}
{if !empty($description)}
        {$description}<br>
{/if}

{if $is_sub_field}
    {if is_null($sub_row_number)}{* output template field *}
        <textarea id="" name="" class="{$class}" cols="{$cols}" rows="{$rows}" data-repeater="#{$block_name}-repeater" data-field-name="{$block_name}" {if $wysiwyg}style="display:none;"{/if}></textarea>

    {else}
        {cms_textarea id=$subFieldId name=$subFieldName enablewysiwyg=$wysiwyg rows=$rows cols=$cols value=$value class=$class}

    {/if}

{elseif !$repeater && !$use_json_format}
        {cms_textarea name=$block_name enablewysiwyg=$wysiwyg rows=$rows cols=$cols value=$value class='wysiwyg'}

{elseif !$repeater && $use_json_format}
        {cms_textarea name="$block_name[]" enablewysiwyg=$wysiwyg rows=$rows cols=$cols value=$values[0]  class=$class}

{else}{* $repeater *}
    {if empty($assign) && !(isset($field_alias_used) && $field_alias_used=='input_repeater')}
        <div class="pagewarning">
            {$mod->Lang('error_assign_required')}
        </div><br>
    {/if}

        <div id="{$block_name}-repeater" class="ecb_repeater sortable {if $wysiwyg}wysiwyg{/if}" data-block-name="{$block_name}" data-highest-row="{count($values)}"{if $max_blocks>0} data-max-blocks="{$max_blocks}"{/if}>

            <div class="repeater-wrapper-template" style="display:none;">
                <div class="drag-panel handle">
                    <span class="ecb2-icon-grip-dots-vertical-solid"></span>
                </div>
                <textarea id="" name="" class="repeater-field wysiwyg" cols="{$cols}" rows="{$rows}" data-repeater="#{$block_name}-repeater" style="display:none;"></textarea>
                <div class="right-panel">
                    <button class="ecb2-repeater-remove ecb2-btn ecb2-btn-default ecb2-icon-only" data-repeater="#{$block_name}-repeater" title="{$mod->Lang('remove_line')}" role="button" aria-disabled="false"><span class="ecb2-icon-trash-can-regular"></span></button>
                </div>
            </div>

            <button class="ecb2-repeater-add ecb2-btn ecb2-btn-default" data-repeater="#{$block_name}-repeater" title="{$mod->Lang('add_line')}" role="button" {if !empty($max_blocks) && count($values)>=$max_blocks}disabled aria-disabled="true"{else}aria-disabled="false"{/if}><span class="ecb2-icon-plus"></span>&nbsp;&nbsp;{$mod->Lang('add_item')}</button>

        {foreach $values as $value}
            <div class="repeater-wrapper">
                <div class="drag-panel handle">
                    <span class="ecb2-icon-grip-dots-vertical-solid"></span>
                </div>
                {cms_textarea id="{$block_name}_r_{$value@iteration}" name="{$block_name}[r_{$value@iteration}]" class='repeater-field wysiwyg' enablewysiwyg=$wysiwyg rows=$rows cols=$cols value=$value addtext="data-repeater=\"#{$block_name}-repeater\""}
                <div class="right-panel">
                    <button class="ecb2-repeater-remove ecb2-btn ecb2-btn-default ecb2-icon-only" data-repeater="#{$block_name}-repeater" title="{$mod->Lang('remove_line')}" role="button" aria-disabled="false"><span class="ecb2-icon-trash-can-regular"></span></button>
                </div>
            </div>
        {/foreach}

        </div>

{/if}