{* help.ecb2fd_admin_fieldset_start.tpl *}
<p>Creates the start of a fieldset for grouping relavant admin fields together. Note: a matching 'admin_fieldset_end' block is required for each 'admin_fieldset_start'.</p>


{$fielddef->get_demo_input(['legend'=>'A sample fieldset with legend'])}
    some admin fields can go in here :)
    </fieldset>

<pre>{literal}{content_module module=ECB2 field=admin_fieldset_start block=test label='15: admin_fieldset_start'}{/literal}</pre>

<p>TIP: set label='&nbsp;' to not show the field label.</p>

<p>Parameters:</p>
<ul>
    <li>field (required) - 'admin_fieldset_start', alias: '<b>fieldset_start</b>'</li>
    <li>block (required) - the name of the content block</li>
    <li>legend (optional) - text to show as fieldset legend - default: ''</li>
    <li>description (optional) - adds additional text explanation for editor</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
</ul>