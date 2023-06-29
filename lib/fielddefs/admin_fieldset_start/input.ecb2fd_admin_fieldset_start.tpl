{* input.ecb2fd_admin_fieldset_start.tpl - v1.0 - 25Jun22 

***************************************************************************************************}
{if !$is_demo}
    </p>
        </div>
{/if}
            <fieldset name="{$block_name}">
        {if $legend}
            <legend>{$legend}</legend>
        {/if}
{if !empty($description)}
            {$description}<br>
{/if}
{if !$is_demo}
        <div>
    <p>
{/if}