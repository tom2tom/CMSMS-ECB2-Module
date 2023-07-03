{* help.radio.tpl *}
<p>This type of field creates a simple text input, for storing a single string.</p>

<fieldset>
    {$fielddef->get_demo_input(['values'=>"Apple=apple,Orange=orange,Kiwifruit=kiwifruit", 'default'=>"orange"])}
</fieldset>

<pre>{literal}{ECB2 field=radio block=test17 label='Fruit' values='Apple=apple,Orange=orange,Kiwifruit=kiwifruit' default='orange'}{/literal}</pre>

<p>Parameters:</p>
<ul>
    <li>field (required) - 'radio'</li>
    <li>block (required) - the name of the content block</li>
    <li>values (required) - comma separated list of 'Text' or 'Text=value'. Example: 'Apple=apple,Orange=orange,Kiwifruit=kiwifruit'</li>
    <li>flip_values (optional) - swaps the dropdowns values <-> text</li>
    <li>inline (optional) - if set displays admin radio buttons inline</li>
    <li>default (optional) - (alias: '<b>default_value</b>') - initial value when creating a new page</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul>

<fieldset>
    <legend>radio with inline buttons - use 'inline=1'</legend>
    {$fielddef->get_demo_input(['values'=>'Apple=apple,Orange=orange,Kiwifruit=kiwifruit', 'inline'=>1, 'default'=>'orange'])}
</fieldset>