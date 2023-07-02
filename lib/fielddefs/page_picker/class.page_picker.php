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
//use CMSMS\ContentOperations; // for CMSMS3
use ContentOperations;  // for CMSMS2
use ECB2\FieldDefBase;
use const ECB2_SANITIZE_STRING;

class page_picker extends FieldDefBase
{
    //NOTE picker component display uses admin plugin {page_selector}
    // and that might assume that relevant js (e.g. jquery.cmsms_hierselector.js)
    // is already available
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
        $this->parameter_aliases = [
            'default_value' => 'default'
        ];
        $this->default_parameters = [
            'label' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
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
    public function get_content_block_input()
    {
        if (!empty($this->options['admin_groups']) &&
             !$this->is_valid_group_member($this->options['admin_groups'])) {
            return $this->hidden_field();
        }

        $contentOps = ContentOperations::get_instance();

        $class = '';
        $smarty = CmsApp::get_instance()->GetSmarty();
        $tpl = $smarty->CreateTemplate('string:'.$this->get_template(), null, null, $smarty);
        $tpl->assign('block_name', $this->block_name);
        $tpl->assign('value', $this->value);
        $tpl->assign('contentOps', $contentOps);
        $tpl->assign('description', $this->options['description']);
        $tpl->assign('label', $this->options['label']);
        $tpl->assign('is_sub_field', $this->is_sub_field);
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
