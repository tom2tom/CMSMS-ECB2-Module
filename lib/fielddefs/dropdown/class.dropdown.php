<?php
#-----------------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016 Chris Taylor, TODOchris@cmsmadesimple.org
# Licence: GNU General Public License version 3
#          see /ECB2/LICENCE or <http://www.gnu.org/licenses/#GPL>
#-----------------------------------------------------------------------------

namespace ECB2\fielddefs;

use CmsApp;
use ECB2\FieldDefBase;
use const ECB2_SANITIZE_STRING;

class dropdown extends FieldDefBase
{
    public function __construct($mod, $blockName, $value, $params, $adding, $id = 0)
    {
        parent::__construct($mod, $blockName, $value, $params, $adding, $id);

        $this->get_values($value);              // common FieldDefBase method

        $this->set_field_parameters();

        $this->initialise_options($params);     // common FieldDefBase method
    }

    /**
     *  sets the allowed parameters for this field type
     *
     *  $this->default_parameters - array of parameter_names => [ default_value, filter_type ]
     *      ECB2_SANITIZE_STRING, FILTER_VALIDATE_INT, FILTER_VALIDATE_BOOLEAN, FILTER_SANITIZE_EMAIL
     *      see: https://www.php.net/manual/en/filter.filters.php
     *  $this->restrict_params - optionally allow any other parameters to be included, e.g. module calls
     */
    public function set_field_parameters()
    {
        $this->restrict_params = false;    // default: TRUE - needed for module call
        $this->parameter_aliases = [
            'gcb' => 'template',
            'default_value' => 'default'
        ];
        $this->default_parameters = [
            'values' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'default' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'label' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'size' => ['default' => 5,     'filter' => FILTER_VALIDATE_INT],
            'multiple' => ['default' => false, 'filter' => FILTER_VALIDATE_BOOLEAN],
            'first_value' => ['default' => false, 'filter' => FILTER_VALIDATE_BOOLEAN],
            'compact' => ['default' => false, 'filter' => FILTER_VALIDATE_BOOLEAN],
            'flip_values' => ['default' => false, 'filter' => FILTER_VALIDATE_BOOLEAN],
            'mod' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'udt' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'template' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'customgs_field' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'admin_groups' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'description' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING]
        ];
        // $this->use_json_format = TRUE;    // default: FALSE - can override e.g. 'groups' type
    }

    /**
     *  @return string complete content block
     */
    public function get_content_block_input()
    {
        if (!empty($this->options['admin_groups']) &&
             !$this->is_valid_group_member($this->options['admin_groups'])) {
            return $this->hidden_field();
        }

        // get the dropdown values/options
        if ($this->options['mod']) {
            // call module to get values (comma separated list)
            $exclude_options = ['size', 'multiple', 'values', 'default_value', 'first_value', 'description',
                'compact', 'field', 'mod', 'flip_values', 'template', 'udt', 'gbc', 'customgs_field'];
            $options = $this->get_values_from_module($this->options['mod'], [], $exclude_options);
        } elseif ($this->options['udt']) {
            // run UDT to get values (array or comma separated list)
            $options = $this->get_values_from_udt($this->options['udt']);
            if ($this->error) {
                return $this->mod->error_msg($this->error);
            }
        } elseif ($this->options['template']) {
            // smarty template to get values (array or comma separated list)
            $options = $this->get_values_from_template($this->options['template']);
            if ($this->error) {
                return $this->mod->error_msg($this->error);
            }
        } elseif ($this->options['customgs_field']) {
            // CustomGS field to get values from (newline or comma separated list)
            $options = $this->get_values_from_customgs($this->options['customgs_field']);
            if ($this->error) {
                return $this->mod->error_msg($this->error);
            }
        } else {
            // use provided 'values' (comma separated list)
            $options = $this->get_array_from_csl($this->options['values']);
        }

        // apply some other parameters
        if ($this->options['flip_values'] && !empty($options)) {
            $options = array_flip($options);
        }
        if (!empty($this->options['compact'])) {
            $this->options['size'] = count($options);
        }
        if (!empty($this->options['first_value'])) {
            $options = ['' => $this->options['first_value']] + $options;
        }

        $smarty = CmsApp::get_instance()->GetSmarty();
        $tpl = $smarty->CreateTemplate('string:'.$this->get_template(), null, null, $smarty);
        $tpl->assign('mod', $this->mod);
        $tpl->assign('block_name', $this->block_name);
        $tpl->assign('description', $this->options['description']);
        $tpl->assign('multiple', $this->options['multiple']);
        $tpl->assign('compact', $this->options['compact']);
        $tpl->assign('size', $this->options['size']);
        $tpl->assign('selected', $this->value);
        $tpl->assign('label', $this->options['label']);
        $tpl->assign('is_sub_field', $this->is_sub_field);
        $tpl->assign('sub_parent_block', $this->sub_parent_block);
        $tpl->assign('sub_row_number', $this->sub_row_number);
        $tpl->assign('not_sub_field_template', !is_null($this->sub_row_number));
        $tpl->assign('use_json_format', $this->use_json_format);

        if ($this->options['multiple']) {
            $selected_values = [];
            $selected_text = [];
            if (!empty($this->values)) {
                $selected_values = $this->values;
            } elseif (!empty($this->value)) {
                $selected_values = explode(',', $this->value);
            }
            foreach ($selected_values as $value) {
                $selected_text[] = isset($options[$value]) ? $options[$value] : '';
            }
            $selected_text = implode(', ', $selected_text);
            $tpl->assign('selected_values', $selected_values);  // array, might be unused when selected_keys is present
            if ($selected_values) {
                // workaround for deprecated in_array modifier
                $tpl->assign('selected_keys', array_flip($selected_values));  // array
            } else {
                $tpl->assign('selected_keys', []);
            }
            $tpl->assign('selected_text', $selected_text);      // text
        }

        $tpl->assign('options', $options);
        return $tpl->fetch();
    }

    /**
     *  Data entered by the editor is processed before its saved in props table
     *  Method IS overidden by this child class, e.g. gallery, group, dropdown
     *
     *  @return string formatted json containing all field data ready to be saved & output
     */
    public function get_content_block_value($inputArray)
    {
        if (!$this->is_sub_field) {
            // return comma separated list
            $value = implode(',', $inputArray);
            return $value;
        }

        // else is sub_field so return object
        $this->field_object = $this->create_field_object($inputArray);
        return $this->ECB2_json_encode_field_object();
    }
}
