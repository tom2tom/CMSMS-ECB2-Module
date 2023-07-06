{* help.module_picker.tpl *}
<p>This type of field creates a dropdown of all installed modules to select from.</p>
<p>Module pickers like to use PHP's Collator class for sorting, so the Intl extension should preferably be available.<p>

<fieldset>
    {$fielddef->get_demo_input()}
</fieldset>

<pre>{literal}{ECB2 field=module block=test12 label='12: module_picker' default=FormBuilder}{/literal}</pre>

<p>Parameters:</p>
<ul>
    <li>field (required) - 'module_picker', alias:'<b>module</b>'</li>
    <li>block (required) - the name of the content block</li>
    <li>default (optional) - (alias: '<b>default_value</b>') - initial value when creating a new page</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul>
