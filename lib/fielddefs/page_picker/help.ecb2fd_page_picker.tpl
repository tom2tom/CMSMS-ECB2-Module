{* help.ecb2fd_page_picker.tpl *}
<p>The page_picker field creates a hierarchy of dropdowns to select a content page.</p>

<fieldset>
    {$fielddef->get_demo_input()}
</fieldset>

<pre>{literal}{content_module module=ECB2 field=page_picker label='Select a page' block=test10}{/literal}</pre>
<p>Note: sets the content page id.</p>

<p>Parameters:</p>
<ul>
    <li>field (required) - 'page_picker', alias: '<b>pages</b>'</li>
    <li>block (required) - the name of the content block</li>
    <li>default (optional) - (alias: '<b>default_value</b>') - initial value when creating a new page</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul>