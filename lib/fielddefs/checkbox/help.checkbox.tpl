{* help.checkbox.tpl *}
<p>This type of field creates a simple check-able input.</p>

<fieldset>
    <p class="pagetext">Test checkbox</p>
    {$fielddef->get_demo_input(['default'=>1])}
</fieldset>

<pre>{literal}{ECB2 field=checkbox block=test5 label='Test checkbox' default=1}{/literal}</pre>

<p>Parameters:</p>
<ul>
    <li>field (required) - 'checkbox'</li>
    <li>block (required) - the name of the content block</li>
    <li>inline_label (optional) - adds a clickable inline label to the checkbox. Tip: If you add label='&amp;nbsp;' the label above the checkbox will be hidden</li>
    <li>default (optional) - (alias: '<b>default_value</b>') - initial value when creating a new page</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul>

<fieldset>
    <legend>Sample checkbox with inline_label - use 'inline_label="inline label for checkbox" label="&amp;nbsp;"' </legend>
    {$fielddef->get_demo_input(['inline_label'=>"inline label for checkbox", 'label'=>"&amp;nbsp;", 'default'=>1])}
</fieldset>