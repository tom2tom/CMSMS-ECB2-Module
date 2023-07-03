{* help.admin_module_link.tpl *}
<p>This type of field creates a link on the admin page to the specified module.</p>

<fieldset>
    {$fielddef->get_demo_input(['mod'=>"CMSContentManager", 'text'=>"Edit Content Pages", 'target'=>'_blank'])}
</fieldset>

<pre>{literal}{ECB2 field=admin_module_link block=test18 mod=CMSContentManager text='Edit Content Pages' label='18: module_link:ContentManager' target='_blank' description='Test description (optional) can be shown here'}{/literal}</pre>

<p>Parameters:</p>
<ul>
    <li>field (required) - 'admin_module_link', alias: '<b>module_link</b>'</li>
    <li>block (required) - the name of the content block</li>
    <li>mod (required) - name of the module to link to<br>
    <li>text (optional) - text to use in the link</li>
    <li>target (optional) - default: '_self'</li>
    <li>default (optional) - (alias: '<b>default_value</b>') - initial value when creating a new page</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul>