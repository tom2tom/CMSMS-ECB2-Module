{* item_dropdown - LISE Summary template for ECB2 dropdown or sortablelist *}
{* either set the var $options & scope=global (important!) *}
{$options=[]}
{foreach $items as $item}
{$options[$item->alias]=$item->title scope=global}
{/foreach}
{* OR use the following format to return a comma separated list *}
{*
{foreach $items as $item}
{$item->title}={$item->alias}{if !$item@last},{/if}
{/foreach}
*}