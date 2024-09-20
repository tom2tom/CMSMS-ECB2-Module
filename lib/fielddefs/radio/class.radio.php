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

class radio extends FieldDefBase
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
    public function set_field_parameters()//: void
    {
        $this->parameter_aliases = [
            'default_value' => 'default'
        ];
        $this->default_parameters = [
            'values' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'label' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'inline' => ['default' => false, 'filter' => FILTER_VALIDATE_BOOLEAN],
            'flip_values' => ['default' => false, 'filter' => FILTER_VALIDATE_BOOLEAN],
            'default' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'admin_groups' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'description' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING]
        ];
        // $this->parameter_aliases = [ 'alias' => 'parameter' ];
        // $this->restrict_params = FALSE;    // default: true
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

        $options = $this->get_array_from_csl($this->options['values']);
        if ($this->options['flip_values'] && !empty($options)) {
            $options = array_flip($options);
        }
        $separator = ($this->options['inline']) ? '&nbsp;&nbsp;&nbsp;&nbsp;' : '<br>';

        $smarty = CmsApp::get_instance()->GetSmarty();
        $tpl = $smarty->CreateTemplate('string:'.$this->get_template()); //, null, null, $smarty);
        $tpl->assign('block_name', $this->block_name);
        $tpl->assign('value', $this->value);
        $tpl->assign('options', $options);
        $tpl->assign('separator', $separator);
        $tpl->assign('description', $this->options['description']);
        $tpl->assign('label', $this->options['label']);
        $tpl->assign('is_sub_field', $this->is_sub_field);
        if ($this->is_sub_field) {
            $tpl->assign('sub_row_number', $this->sub_row_number);
            $tpl->assign('subFieldName', $this->sub_parent_block.'[r_'.$this->sub_row_number.']['.
                $this->block_name.']');
            $tpl->assign('subFieldId', $this->sub_parent_block.'_r_'.$this->sub_row_number.'_'.
                $this->block_name);
        }
        return $tpl->fetch();
    }
}
