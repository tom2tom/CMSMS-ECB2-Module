{* help.ecb2fd_module_picker.tpl *}
<p>The module_picker field creates a dropdown of all installed modules to select from.</p>

<fieldset>
    {$fielddef->get_demo_input()}
</fieldset>

<pre>{literal}{content_module module=ECB2 field=module block=test12 label='12: module_picker' default=FormBuilder}{/literal}</pre>

<p>Parameters:</p>
<ul>
    <li>field (required) - 'module_picker', alias:'<b>module</b>'</li>
    <li>block (required) - the name of the content block</li>
    <li>default (optional) - (alias: '<b>default_value</b>') - initial value when creating a new page</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul>