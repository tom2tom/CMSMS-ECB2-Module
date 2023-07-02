{* input.admin_module_link.tpl - v1.0 - 25Jun22

********************************************************************}
{if !empty($description)}
        {$description}<br>
{/if}
        {$target_mod->CreateLink('', 'defaultadmin', '', $text, [], '', false, 0, $addtext)}
