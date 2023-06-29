{* input.ecb2fd_file_picker.tpl - v1.0 - 25Jun22 

***************************************************************************************************}
{if !empty($description)}
        {$description}<br>
{/if}

    <div class="ecb_file_picker">
{if $is_sub_field}
<pre>NOT YET IMPLEMENTED</pre>
{* Needs more work to understand how to trigger js when new row added. *}
    {if is_null($sub_row_number)}{* sub_field template field *}

        {*cms_filepicker|replace:$subFieldId:'' name=$subFieldId value=$value profile=$profile top=$top type=$type*}

    {else}{* sub_field *}

        {*cms_filepicker id=$subFieldId name=$subFieldName value=$value profile=$profile top=$top type=$type*}

    {/if}

{else}
        {cms_filepicker name=$block_name value=$value profile=$profile top=$top type=$type}

{/if}

{if $preview}
        <img class="ecb_file_picker_preview {if !empty($thumbnail_url)}show{/if}" {if !empty($thumbnail_url)}src="{$thumbnail_url}?{$smarty.now}"{/if} alt="{$block_name}" data-ajax-url="{$ajax_url}" data-top-dir="{$top_dir}" data-thumbnail-width="{$thumbnail_width}" data-thumbnail-height="{$thumbnail_height}">
{/if}
    </div>