{* ECB2 admin_content_blocks.tpl *}

<div id="ecb_c">

    <div class="help-toc">
        <h3 class="border-bottom m_top_15 p_bottom_5">{$mod->Lang('field_types')}</h3>
        <ul>
        {foreach $field_types as $field_type}
            {if $field_type==$first_admin_only_field}
            <h5 class="border-bottom m_top_25 p_bottom_5">{$mod->Lang('admin_only_help')}</h5>
            {/if}
{*useless<li><a class="smooth-scroll" href="#{$field_type}">{$field_type}</a></li>*}
            <li><a class="smooth-scroll" href="javascript:void(0)" onclick="document.location.hash='{$field_type}';">{$field_type}</a></li>
        {/foreach}
        </ul>
    </div>

    <div class="help-content">
        {$mod->Lang('general_c')}

        <h2 class="border-bottom p_bottom_5 m_bottom_15">{$mod->Lang('field_types')}</h2>

    {foreach $field_help as $field_type => $help_content}
        {if $field_type==$first_admin_only_field}
        <h2 class="border-bottom m_top_25 p_bottom_5">{$mod->Lang('admin_only_help')}</h2>
        <p>{$mod->Lang('admin_only_help_intro')}</p>
        <br>
        {/if}
        <h2 id="{$field_type}" class="m_bottom_5">{$field_type}</h2>
        {$help_content}
        <br>
    {/foreach}
    </div>

</div>


