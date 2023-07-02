{* help.dropdown.tpl *}
<p>Creates a dropdown (or select) that the editor can choose from the provided options. The dropdown options can be from a: comma separated list (values), module call (mod), User Defined Tag (udt), or a smarty template (template / udt). One of these parameters must be used (*).</p>

<fieldset>
{$fielddef->get_demo_input(['values'=>'Apple=apple,Orange=orange,Kiwifruit=kiwifruit', 'first_value'=>'select fruit'])}
</fieldset>

{literal}
<p>Parameters:</p>
<ul>
    <li>field (required) - '<b>dropdown</b>', or alias: '<b>select</b>', '<b>dropdown_from_module</b>', '<b>dropdown_from_udt</b>', '<b>dropdown_from_gbc</b>', '<b>dropdown_from_customgs</b>'</li>
    <li>block (required) - the name of the content block</li>
    <li>values (*) - comma separated string of 'Text' or 'Text=value'. Example: 'Apple=apple,Orange=orange,Green=green'<br>
        <pre>{ECB2 block=test5 field=dropdown1 values='Apple=apple,Orange=orange' first_value='select fruit' label='Fruit'}</pre>
    </li>
    <li>mod (*) - specifies the name of a module to call to get the option values. The module call needs to either: set an array $options of 'value' => 'Text' with scope=global, or return a comma separated list of 'Text,...' or 'Text=value,...'. Any additional parameters are also passed onto the specified module. You may want to include 'action' and 'template' parameters.<br>
        <pre>{ECB2 block=dropdown2 field=dropdown mod=LISEProjects template_summary='item_dropdown' pagelimit=2 label='Dropdown - from module'}</pre>
    </li>
    <li>udt (*) - specifies the name of a User Defined Tag to call to get the option values. The UDT should either return an array of 'Text' => 'value', or return a comma separated string of 'Text' or 'Text=value'.<br>
        <pre>{ECB2 block=dropdown3 field=dropdown udt='ecb2_test_udt_options' label='Dropdown - from udt'}</pre>
    </li>
    <li>template (*) - (alias: '<b>gcb</b>') - specifies the name of a smarty template from Design Manager to call to get the option values. The template call needs to either: set an array $options of 'value' => 'Text' with scope=global, or return a comma separated list of 'Text,...' or 'Text=value,...'. <br>
        <pre>{ECB2 block=dropdown4 field=dropdown template='ECB2_test_template_options' label='Dropdown - from template'}</pre>
    </li>
    <li>customgs_field (*) - name of customgs_field to retrieve (with spaces, not underscores) e.g. 'Section Styles'. This needs to be a CustomGS 'textarea' containing a set of 'Text' or 'Text=value', either on separate lines or separated by commas.<br>
        <pre>{ECB2 block=dropdown3 field=dropdown customgs_field='Section Styles'  label='Dropdown - from CustomGS'}</pre>
    </li>
    <li>first_value (optional) - sets an text sting for the first blank value, e.g. '--- select one ---'</li>
    <li>flip_values (optional) - swaps the dropdowns values <-> text</li>
    <li>multiple (optional) - add multiple option select support</li>
    <li>size (optional) - multiple enabled only</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
    <li>compact (optional) - default:false - if set, for multiple only, a summary of the selected options is displayed and the full select is shown/hidden when 'edit/hide' is clicked</li>
    <li>default (optional) - (alias: '<b>default_value</b>') - initial value when creating a new page</li>
</ul>
<br>
<p>Sample template for 'mod' parameter for a LISE Instance summary template. Similar can also be used with the 'template' parameter.</p>
<pre>
{* item_dropdown - LISE Summary template for ECB2 dropdown or sortablelist *}
{* EITHER set the var $options & scope=global (important!) *}
{$options=[]}
{foreach $items as $item}
    {$options[$item->alias]=$item->title scope=global}
{/foreach}
{* OR use the following format to return a comma separated list *}
{*
{foreach $items as $item}
    {$item->title}={$item->alias}{if !$item@last},{/if}
{/foreach}
*}
</pre>
{/literal}

<fieldset>
    <legend>Sample dropdown with multiple select - use 'multiple=1' </legend>
    {$fielddef->get_demo_input(['values'=>'Apple=apple,Orange=orange,Kiwifruit=kiwifruit', 'multiple'=>1, 'size'=>4, default=>'orange'])}
</fieldset>

<fieldset>
<legend>Sample dropdown with multiple & compact select - use 'multiple=1 compact=1' </legend>
{$fielddef->get_demo_input(['values'=>'Apple=apple,Orange=orange,Kiwifruit=kiwifruit', 'multiple'=>1, 'compact'=>1, 'size'=>4, default=>'apple,kiwifruit'])}
</fieldset>

<br>