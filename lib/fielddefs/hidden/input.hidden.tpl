{* input.hidden.tpl - v1.0 - 25Jun22

********************************************************************}
{if !empty($description)}
        {$description}<br>
{/if}
        <input type="hidden" name="{$block_name}" value="{$value}">
