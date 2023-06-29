{* help.ecb2fd_admin_link.tpl *}
<p>The admin_link field creates a link on the admin page to any specified url.</p>

<fieldset>
    {$fielddef->get_demo_input(['link'=>"http://www.bing.com", 'text'=>"bing search", 'target'=>"_blank"])}
</fieldset>

<pre>{literal}{content_module module=ECB2 field=admin_link block=test17 target='_blank' link='http://www.bing.com' text='bing search' label='17: admin_link' description='Test description (optional) can be shown here'}{/literal}</pre>

<p>Parameters:</p>
<ul>
    <li>field (required) - 'admin_link', alias: '<b>link</b>'</li>
    <li>block (required) - the name of the content block</li>
    <li>link (required) - initial value when creating a new page</li>
    <li>text (optional) - the displayed text</li>
    <li>target (optional) - e.g. '_blank' - default: '_self'</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul>