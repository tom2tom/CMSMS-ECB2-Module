{* input.ecb2fd_file_selector.tpl - v1.0 - 25Jun22 

***************************************************************************************************}
{if !empty($description)}
        {$description}<br>
{/if}

{if $is_sub_field}
    {if is_null($sub_row_number)}{* output template field *}
        <div class="ecb_file_selector_select">
            <select id="" name="" class="{$class}" data-repeater="#{$block_name}-repeater" data-field-name="{$block_name}">
                {html_options options=$opts selected=$value}
            </select>
        </div>

    {else}    
        <div class="ecb_file_selector_select">
            <select id="{$subFieldId}" name="{$subFieldName}" class="{$class}">
                {html_options options=$opts selected=$value}
            </select>
        </div>
    {/if}

{else}
        <div class="ecb_file_selector_select">
            <select class="cms_dropdown" name="{$block_name}">
                {html_options options=$opts selected=$value}
            </select>
        </div>
{/if}

{if $preview}      
        <img style="max-width:130px;" class="ecb_file_selector_preview {if !empty($value)}show{/if}" {if !empty($value)}src="{$uploads_url}/{$value}"{/if} alt="{$block_name}" data-uploadsurl="{$uploads_url}" data-supported-extensions="{$supported_extensions}">
{/if}
