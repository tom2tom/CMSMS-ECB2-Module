{* help.ecb2fd_ZZZ.tpl *}
<p>The ZZZ field creates a simple text input, for storing a single string.</p>

<fieldset>
    {$fielddef->get_demo_input([])}
</fieldset>

<pre>{literal}{content_module module=ECB2 field=ZZZ block=test label='Test' default='a sample ZZZ'}{/literal}</pre>

<p>Parameters:</p>
<ul>
    <li>field (required) - 'ZZZ'</li>
    <li>block (required) - the name of the content block</li>
    <li></li>
    <li></li>
    <li>default_value (optional) - initial value when creating a new page</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul>