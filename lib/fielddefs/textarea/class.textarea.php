<?php
#-----------------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016-2024 Chris Taylor, chris@binnovative.co.uk
# Licence: GNU General Public License version 3
#          see /ECB2/LICENCE or <http://www.gnu.org/licenses/gpl-3.0.html>
#-----------------------------------------------------------------------------

namespace ECB2\fielddefs;

use CMSMS\App as CmsApp; //for CMSMS3
use ECB2\FieldDefBase;
use const ECB2_SANITIZE_STRING;

class textarea extends FieldDefBase
{
    public function __construct($mod, $blockName, $value, $params, $adding, $id = 0)
    {
        parent::__construct($mod, $blockName, $value, $params, $adding, $id);

        if (!empty($params['repeater'])) {
            $this->use_json_format = true;
        }

        $this->get_values($value);              // common FieldDefBase method

        $this->set_field_parameters();

        $this->initialise_options($params);     // common FieldDefBase method

        if (isset($this->field_alias_used) && $this->field_alias_used == 'editor') {
            $this->options['wysiwyg'] = true;
        }
    }

    /**
     *  sets the allowed parameters for this field type
     *
     *  $this->default_parameters - array of parameter_names => [ default_value, filter_type ]
     *      ECB2_SANITIZE_STRING, FILTER_VALIDATE_INT, FILTER_VALIDATE_BOOLEAN, FILTER_SANITIZE_EMAIL
     *      see: https://www.php.net/manual/en/filter.filters.php
     *  $this->restrict_params - optionally allow any other parameters to be included, e.g. module calls
     */
    public function set_field_parameters()//: void
    {
        // $this->restrict_params = FALSE;    // default: true
        // $this->use_json_format = TRUE;    // default: FALSE - can override e.g. 'groups' type
        $this->parameter_aliases = [
            'default_value' => 'default'
        ];
        $this->default_parameters = [
            'default' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'label' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'rows' => ['default' => 4,    'filter' => FILTER_VALIDATE_INT],
            'cols' => ['default' => 80,    'filter' => FILTER_VALIDATE_INT],
            'wysiwyg' => ['default' => false, 'filter' => FILTER_VALIDATE_BOOLEAN],
            'repeater' => ['default' => false, 'filter' => FILTER_VALIDATE_BOOLEAN],
            'max_blocks' => ['default' => 0,     'filter' => FILTER_VALIDATE_INT],
            'description' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'admin_groups' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'assign' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING]
        ];
    }

    /**
     *  @return string complete content block
     */
    public function get_content_block_input()//: string
    {
        if (!empty($this->options['admin_groups']) &&
             !$this->is_valid_group_member($this->options['admin_groups'])) {
            return $this->hidden_field();
        }

        $smarty = CmsApp::get_instance()->GetSmarty();
        $tpl = $smarty->CreateTemplate('string:'.$this->get_template()); //, null, null, $smarty);
        $tpl->assign('mod', $this->mod);
        $tpl->assign('block_name', $this->block_name);
        $tpl->assign('type', $this->field);
        $tpl->assign('value', $this->value);
        $tpl->assign('values', $this->values);
        $tpl->assign('rows', $this->options['rows']);
        $tpl->assign('cols', $this->options['cols']);
        $tpl->assign('wysiwyg', $this->options['wysiwyg']);
        $tpl->assign('repeater', $this->options['repeater']);
        $tpl->assign('max_blocks', $this->options['max_blocks']);
        $tpl->assign('description', $this->options['description']);
        $tpl->assign('assign', $this->options['assign']);
        $tpl->assign('use_json_format', $this->use_json_format);
        $tpl->assign('label', $this->options['label']);
        $tpl->assign('is_sub_field', $this->is_sub_field);
        $class = '';
        if ($this->options['wysiwyg']) {
            $class .= ' wysiwyg';
        }
        if ($this->is_sub_field) {
            $tpl->assign('sub_row_number', $this->sub_row_number);
            $tpl->assign('subFieldName', $this->sub_parent_block.'[r_'.$this->sub_row_number.']['.
                $this->block_name.']');
            $tpl->assign('subFieldId', $this->sub_parent_block.'_r_'.$this->sub_row_number.'_'.
                $this->block_name);
            $class .= ' repeater-field';
        }
        $tpl->assign('class', $class);
        return $tpl->fetch();
    }
}
