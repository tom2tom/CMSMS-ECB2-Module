{* input.group.tpl - v1.1 - 14Sep23

********************************************************************}
{if !empty($description)}
    {$description}<br>
{/if}

{if empty($assign)}
    <p class="pagewarning">
        {$mod->Lang('error_assign_required')}
    </p><br>
{/if}

{if $layout!='table'}
    <div id="{$block_name}-repeater" class="ecb_repeater {$layout}-layout sortable" data-block-name="{$block_name}" data-highest-row="{count($values)}"{if $max_blocks>0} data-max-blocks="{$max_blocks}"{/if} data-repeater-add="#{$block_name}-repeater-add">

        <div class="repeater-wrapper-template sortable-item" style="display:none;">
            <div class="left-panel handle">
                <span class="ecb2-icon-grip-dots-vertical-solid"></span>
            </div>
        {foreach $sub_fields as $field_def}
            <div class="sub-field sub-field-{$field_def->get_type()}">
                <label class="sub_field_label">{$field_def->get_field_label()}</label>
                {$field_def->get_content_block_input()}
            </div>
        {/foreach}
            <div class="right-panel controls">
                <button class="ecb2-repeater-remove ecb2-btn ecb2-btn-default ecb2-icon-only" data-repeater="#{$block_name}-repeater" title="{$mod->Lang('remove_line')}" role="button" aria-disabled="false"><span class="ecb2-icon-trash-can-regular"></span></button>
            </div>
        </div>

    {foreach $values as $row => $fields}
        <div class="repeater-wrapper sortable-item">
            <div class="left-panel handle">
                <span class="ecb2-icon-grip-dots-vertical-solid"></span>
            </div>

        {foreach $sub_fields as $field_def}
            <div class="sub-field row{$fields@iteration} col{$field_def@iteration} sub-field-{$field_def->get_type()}">
                <label class="sub_field_label">{$field_def->get_field_label()}:</label>
                {$field_def->set_sub_field_value($fields, $row)}
                {$field_def->get_content_block_input()}
            </div>
        {/foreach}

            <div class="right-panel controls">
                <button class="ecb2-repeater-remove ecb2-btn ecb2-btn-default ecb2-icon-only" data-repeater="#{$block_name}-repeater" title="{$mod->Lang('remove_line')}" role="button" aria-disabled="false"><span class="ecb2-icon-trash-can-regular"></span></button>
            </div>
        </div>
    {/foreach}

    </div>
{else}{* layout 'table' *}
    <div class="table-responsive">
        <table id="{$block_name}-repeater" class="ecb_repeater sortable {$layout}-layout" data-block-name="{$block_name}" data-highest-row="{count($values)}"{if $max_blocks>0} data-max-blocks="{$max_blocks}"{/if} data-repeater-add="#{$block_name}-repeater-add">
            <thead>
                <tr class="repeater-wrapper-header">
                    <th class="left-panel"></th>
                {foreach $sub_fields as $field_def}
                    <th class="sub-field-heading sub-field-heading-{$field_def->get_type()} col{$field_def@iteration}" data-heading-for=".col{$field_def@iteration}">
                        {$field_def->get_field_label()}
                    </th>
                {/foreach}
                    <th class="right-panel"></th>
                </tr>
            </thead>

            <tbody{* class="sortable"*}>
                <tr class="repeater-wrapper-template sortable-item" style="display:none;">
                    <td class="left-panel handle">
                        <span class="ecb2-icon-grip-dots-vertical-solid"></span>
                    </td>
                {foreach $sub_fields as $field_def}
                    <td class="sub-field sub-field-{$field_def->get_type()}">
                        {$field_def->get_content_block_input()}
                    </td>
                {/foreach}
                    <td class="right-panel controls">
                        <button class="ecb2-repeater-remove ecb2-btn ecb2-btn-default ecb2-icon-only" data-repeater="#{$block_name}-repeater" title="{$mod->Lang('remove_line')}" role="button" aria-disabled="false"><span class="ecb2-icon-trash-can-regular"></span></button>
                    </td>
                </tr>

            {foreach $values as $row => $fields}
                <tr class="repeater-wrapper sortable-item">
                    <td class="left-panel handle">
                        <span class="ecb2-icon-grip-dots-vertical-solid"></span>
                    </td>

                {foreach $sub_fields as $field_def}
                    <td class="sub-field row{$fields@iteration} col{$field_def@iteration} sub-field-{$field_def->get_type()}">
                        {$field_def->set_sub_field_value($fields, $row)}
                        {$field_def->get_content_block_input()}
                    </td>
                {/foreach}

                    <td class="right-panel controls">
                        <button class="ecb2-repeater-remove ecb2-btn ecb2-btn-default ecb2-icon-only" data-repeater="#{$block_name}-repeater" title="{$mod->Lang('remove_line')}" role="button" aria-disabled="false"><span class="ecb2-icon-trash-can-regular"></span></button>
                    </td>
                </tr>
            {/foreach}
            </tbody>
        </table>
    </div>
{/if}

    <div class="ecb_repeater_footer">
        <button id="{$block_name}-repeater-add" class="ecb2-repeater-add ecb2-btn ecb2-btn-default" data-repeater="#{$block_name}-repeater" title="{$mod->Lang('add_line')}" role="button" {if !empty($max_blocks) && count($values)>=$max_blocks}disabled aria-disabled="true"{else}aria-disabled="false"{/if}><span class="ecb2-icon-plus"></span>&nbsp;&nbsp;{$mod->Lang('add_item')}</button>
    </div>
