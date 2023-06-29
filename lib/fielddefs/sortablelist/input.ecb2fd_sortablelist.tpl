{* input.ecb2fd_sortablelist.tpl - v1.0 - 29Jun22 

***************************************************************************************************}
{if !empty($description)}
        {$description}<br>
{/if}
<input type="hidden" id="{$selectarea_prefix}" name="{$selectarea_prefix}" value="{$selected_str}" size="100"/>
<div class="c_full cf ecb2-cb {$selectarea_prefix}">
    <div class="grid_6 alpha">
        <fieldset>
            <legend>{if $labelLeft!=''}{$labelLeft}{else}{$mod->Lang('content_block_label_selected')}{/if}</legend>
            <div id="selected-items">
                <ul class="sortable-ecb2-list sortable-list selected-items" data-cmsms-cb-input="{$selectarea_prefix}"
                {if $maxNumber} data-max-number="{$maxNumber}"{/if}{if $requiredNumber} data-required-number="{$requiredNumber}"{/if}>
                    <li class="placeholder no-sort {if $selected|@count>0} hidden{/if}">{if $requiredNumber}{$mod->Lang('drop_required_items', $requiredNumber)}{else}{$mod->Lang('drop_items')}{/if}</li>
                    {foreach $selected as $alias => $name}
                        <li class="ui-state-default cf sortable-item" data-cmsms-item-id="{$alias}">
                            {$name}
                            <a href="#" title="{$mod->Lang('remove')}" class="ui-icon ui-icon-trash sortable-remove">{$mod->Lang('remove')}</a>
                        </li>
                    {/foreach}
                </ul>
            </div>
        </fieldset>
    </div>
    <div class="grid_6 omega draggable-area">
        <fieldset>
            <legend>{if $labelRight!=''}{$labelRight}{else}{$mod->Lang('content_block_label_available')}{/if}</legend>
            <div id="available-items">
                <ul class="sortable-ecb2-list sortable-list available-items">
                {foreach $available as $alias => $name}
                        <li class="ui-state-default" data-cmsms-item-id="{$alias}">
                            {$name}
                            <a href="#" title="{$mod->Lang('remove')}" class="ui-icon ui-icon-trash sortable-remove hidden">{$mod->Lang('remove')}</a>
                        </li>
                {/foreach}
                </ul>
            </div>
        </fieldset>
    </div>
</div>