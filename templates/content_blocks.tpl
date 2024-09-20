{* ECB2 content_blocks.tpl *}
<div class="ecb2-help">
  <div class="help-toc">
    <h3>{$mod->Lang('fields_index')}</h3>
    <ul>
{foreach $field_types as $field_type}
      {if $field_type==$first_admin_only_field}
      <h4>{$mod->Lang('admin_only_help')}</h4>
      {/if}
{*useless<li><a class="smooth-scroll" href="#{$field_type}">{$field_type}</a></li>*}
      <li><a class="smooth-scroll" href="javascript:void(0)" onclick="document.location.hash='{$field_type}';">{$field_type}</a></li>
{/foreach}
    </ul>
  </div>
  <div class="help-content">
    {$mod->Lang('general_c')}
    <br>
    <h2>{$mod->Lang('field_types')}</h2>
{foreach $field_help as $field_type => $help_content}
    {if $field_type==$first_admin_only_field}
    <h2>{$mod->Lang('admin_only_help')}</h2>
    <p>{$mod->Lang('admin_only_help_intro')}</p>
    <br>
    {/if}
    <h2 id="{$field_type}">{$field_type}</h2>
    {$help_content}
    {if !$help_content@last}<br>{/if}
{/foreach}
  </div>
</div>
