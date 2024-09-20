{if !empty($pset)}
{tab_header name='main' label=$mod->Lang('extended_content_blocks') active=$tab}
{tab_header name='settings' label=$mod->Lang('settings') active=$tab}
{tab_start name='main'}
{/if}
{include file='module_file_tpl:ECB2;content_blocks.tpl'}
{if !empty($pset)}
{tab_start name='settings'}
{include file='module_file_tpl:ECB2;settings.tpl'}
{tab_end}
{/if}
