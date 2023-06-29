{* help.ecb2fd_group.tpl *}
<p>The group field creates a group of one or more sub fields. An unlimited number of groups can be added by the editors, sorted or deleted. Can be displayed in table or block layout.</p>

<fieldset>
    {$fielddef->get_demo_input(['assign'=>'test20',
    'sub1_field' => 'textinput', 'sub1_name' => 'height', 'sub1_label' => 'Height', 'sub1_size' => '20',
    'sub2_field' => 'select', 'sub2_name' => 'fruit', 'sub2_label' => 'Fruit', 'sub2_values' => 'Apple,Orange,Kiwifruit', 'sub2_first_value' => '--- select one ---',
    'sub3_field' => 'checkbox', 'sub3_name' => 'checkbox1', 'sub3_label' => 'Check this out', 'sub3_default' => '1',
    'sub4_field' => 'radio', 'sub4_name' => 'test7radio', 'sub4_label' => 'A radio', 'sub4_values' => 'Apple,Orange,Kiwifruit', 'sub4_inline' => '1'])}
</fieldset>
<pre>{literal}{content_module module=ECB2 field=group block=test20 assign=test20
sub1_field=textinput sub1_name=height sub1_label='Height' sub1_size=5 
sub2_field=select sub2_name=fruit sub2_label='Fruit', sub2_values='Apple,Orange,Kiwifruit', sub2_first_value='--- select one ---' 
sub3_field=checkbox sub3_name=checkbox1 sub3_label='A checkbox' sub3_default=1
sub4_field=radio sub4_name=test7radio sub4_label='radio test' sub4_values='Apple,Orange,Kiwifruit' sub4_inline=1}{/literal}</pre>



<p>Parameters:</p>
<ul>
    <li>field (required) - 'group'</li>
    <li>block (required) - the name of the content block</li>
    <li>layout (optional) - either 'table' (default), or 'block'.</li>
    <li>remove_empty (optional) - will remove any groups where all sub_fields are 'empty' - default false</li>
    <li>max_blocks (optional) - the maximum number of repeater fields that can be created</li>
    <li>admin_groups (optional) - a comma separated list of admin groups that can view & edit this field</li>
    <li>description (optional) - adds additional text explanation for editor</li>
    <li>assign (required) - to pass the sub field data to a smarty variable</li>
</ul>
<p>Sub field parameters:</p>
<p>Each sub field can be specified using 'subX_yyyyy' parameters where X is a number and yyyyy is the parameter. e.g. 'sub1_name=textinput'. Each sub fields has required and optional parameters</p>
<ul>
    <li>subX_field (required) - must be one of the supported sub field types:<br>
        {foreach $fielddef->allowed_sub_fields as $allowed_types}{$allowed_types}, {/foreach}
    </li>
    <li>subX_name (required) - used reference the sub field - must start with a letter followed by any number of letters, numbers or underscores '_'.</li>
    <li>subX_<i>parameter</i> (optional) - where '<i>parameter</i>' is any of the parameters that work with that field type. e.g. for textinput sub field the following can be used:<br>
        <pre>sub1_field=textinput sub1_name=text1 sub1_size=20 sub1_max_length=50</pre>
    </li>

</ul>

<p>Output format:</p>
<pre>{literal}
{if !empty($test20->sub_fields)}{* test if any data exists *}
    {foreach $test20->sub_fields as $sub_field}
        {foreach $sub_field as $name => $value}
            {$name}: {$value}
        {/foreach}
        {* or directly access each sub_field *}
        Height is:{$sub_field->height}
        Fruit is:{$sub_field->fruit}
    {/foreach}
{/if}
{/literal}</pre><br>

<p>Notes & tips:</p>
<ol>
    <li>change the order of the subX_ parameters to change the order of the fields in the admin page.</li>
    <li>the default PHP limit for inputs on one page is 1000. This is set by max_input_vars in php.ini. If you may need more than this on a single page you can increase max_input_vars. Each sub field in each group row is 1 input, plus all other fields on the page.</li>
    <li>sub field parameters like 'repeater', 'max-blocks' and 'assign' are ignored.</li>
    <li>if only one group is added and all it's values are empty the ->sub_fields object will be empty</li>
</ol>
