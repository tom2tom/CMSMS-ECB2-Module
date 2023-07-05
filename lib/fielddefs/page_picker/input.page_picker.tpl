{* input.page_picker.tpl - v1.0 - 25Jun22

********************************************************************}
{if !empty($description)}
    {$description}<br>
{/if}
{if $is_sub_field}
    {if is_null($sub_row_number)}{* output template field *}
    <input type="hidden" id="" name="" class="{$class}" value="-1" data-repeater="#{$block_name}-repeater" data-field-name="{$block_name}"/>
    {else}
    {* page_selector is an admin-only plugin, and needs relevant js to be present *}
    {page_selector id=$subFieldId name=$subFieldName value=$value}{* class not supported - use js to add *}
    {/if}
{else}
    {*$contentOps->CreateHierarchyDropdown('', $value, $block_name, 1, 1)*}
    {page_selector name=$block_name value=$value allowcurrent=1}
{/if}
