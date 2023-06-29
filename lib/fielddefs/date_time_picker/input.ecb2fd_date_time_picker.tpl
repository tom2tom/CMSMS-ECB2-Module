{* input.ecb2fd_date_time_picker.tpl - v1.0 - 25Jun22 

***************************************************************************************************}
{if !empty($description)}
        {$description}<br>
{/if}

        {strip}
{if $is_sub_field}
    {if is_null($sub_row_number)}{* output template field *}
        <input type="text" id="" name="" class="{$class|replace:'picker':'picker-template'}" value="" size="{$size}" maxlength="{$max_length}" data-repeater="#{$block_name}-repeater" data-field-name="{$block_name}"
            {if !empty($date_format)} data-date-format="{$date_format}"{/if}
            {if !empty($time_format)} data-time-format="{$time_format}"{/if}
            {if !empty($change_month)} data-change-month="{$change_month}"{/if}
            {if !empty($change_year)} data-change-year="{$change_year}"{/if}
            {if !empty($year_range)} data-year-range="{$year_range}"{/if}
        />

    {else}
        <input type="text" id="{$subFieldId}" name="{$subFieldName}" class="{$class}" value="{$value}" size="{$size}" maxlength="{$max_length}"
            {if !empty($date_format)} data-date-format="{$date_format}"{/if}
            {if !empty($time_format)} data-time-format="{$time_format}"{/if}
            {if !empty($change_month)} data-change-month="{$change_month}"{/if}
            {if !empty($change_year)} data-change-year="{$change_year}"{/if}
            {if !empty($year_range)} data-year-range="{$year_range}"{/if}
        />

    {/if}

{else}
        <input type="text" class="{$class}" name="{$block_name}" size="{$size}" maxlength="{$max_length}" 
            value="{$value}"
            {if !empty($date_format)} data-date-format="{$date_format}"{/if}
            {if !empty($time_format)} data-time-format="{$time_format}"{/if}
            {if !empty($change_month)} data-change-month="{$change_month}"{/if}
            {if !empty($change_year)} data-change-year="{$change_year}"{/if}
            {if !empty($year_range)} data-year-range="{$year_range}"{/if}
        />
{/if}
{/strip}
