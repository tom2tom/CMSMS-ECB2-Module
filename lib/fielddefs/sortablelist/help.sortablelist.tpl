{* help.sortablelist.tpl *}
<p>This type of field creates a sortable list that the editor can drag-and-drop to select from the list. The options can be created from a: comma separated list (values), module call (mod), User Defined Tag (udt), or a smarty template (template / udt). One of these parameters must be used (*).</p>

<fieldset>
{$fielddef->get_demo_input(['values'=>'apple=Apple,orange=Orange,green=Green,value=Label', 'default'=>'orange'])}
</fieldset>

{literal}
<p>Parameters:</p>
<ul>
    <li>field (required) - 'sortablelist'</li>
    <li>block (required) - the name of the content block</li>
    <li>values (*) - comma separated string of 'Text' or 'value=Text'. (Note: this is reversed compared to 'dropdown' values - use flip_values if necessary) e.g:<br>
        <pre>{ECB2 field=sortablelist block=test4 label='Fruit' values='apple=Apple,orange=Orange,green=Green,value=Label'}</pre>
    </li>
    <li>mod (*) - specifies the name of a module to call to get the option values.
    The template call needs to either: set an array $options of 'value' => 'Text' with scope=global, or return a comma separated list of 'Text,...' or 'Text=value,...'. Any additional parameters are also passed onto the specified module. You may want to include 'action' and 'template' parameters. e.g:<br>
        <pre>{ECB2 field=sortablelist block=test4a label='Sortable List - from module' mod=LISEProjects template_summary='item_dropdown' pagelimit=2}</pre>
    </li>
    <li>udt (*) - specifies the name of a User Defined Tag to call to get the option values. The UDT should either return an array of 'value' => 'Text', or return a comma separated string of 'Text' or 'Text=value'.<br>
        <pre>{ECB2 field=sortablelist block=test4b udt='ecb2_test_udt_options' label='Sortable List - from udt'}</pre>
    </li>
    <li>template (*) - specifies the name of a smarty template from Design Manager to call to get the option values. The template call needs to either: set an array $options of 'value' => 'Text' with scope=global, or return a comma separated list of 'Text,...' or 'Text=value,...'.<br>
        <pre>{ECB2 field=sortablelist block=test4c template='ECB2_test_template_options' label='Sortable List - from template' label_left='Selected items from template' label_right='Available items from template'}</pre>
    </li>
    <li>customgs_field (*) - name of customgs_field to retrieve (with spaces, not underscores) e.g. 'Section Styles'. This needs to be a CustomGS 'textarea' containing a set of 'Text' or 'Text=value', either on separate lines or separated by commas.<br>
        <pre>{ECB2 field=sortablelist block=test4d customgs_field='Section Styles' label='Sortable List - from CustomGS'}</pre>
    </li>
    <li>label_left (optional) - default: 'Selected'</li>
    <li>label_right (optional) - default: 'Available'</li>
    <li>max_number (optional) - limits the maximum number of items that can be selected</li>
    <li>required_number (optional) - sets a specific number of items that must be selected (or none)</li>
    <li>flip_values (optional) - swaps the dropdowns values <-> text</li>
    <li>default (optional) - (alias: '<b>default_value</b>') - initial value when creating a new page</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
</ul>
<br>
{/literal}