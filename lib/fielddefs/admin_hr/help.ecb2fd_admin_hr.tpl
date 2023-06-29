{* help.ecb2fd_admin_hr.tpl *}
<p>Displays an 'hr' on the admin page.</p>

<fieldset>
    {$fielddef->get_demo_input()}
</fieldset>

<pre>{literal}{content_module module=ECB2 field=admin_hr block=test17 description='Can also add a description in here :)'}{/literal}</pre>

<p>Parameters:</p>
<ul>
    <li>field (required) - 'admin_hr', alias: '<b>hr</b>'</li>
    <li>block (required) - the name of the content block</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul>

<p>TIP: set label='&amp;nbsp;' to not show the field label.</p>