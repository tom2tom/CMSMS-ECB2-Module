<?php
#-----------------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016-2024 Chris Taylor, chris@binnovative.co.uk
# Licence: GNU General Public License version 3
#          see /ECB2/LICENCE or <http://www.gnu.org/licenses/gpl-3.0.html>
#-----------------------------------------------------------------------------

namespace ECB2\fielddefs;

use CMSMS\App as CmsApp;
use CMSMS\Utils as cms_utils;
use Collator;
use ECB2\FieldDefBase;
//use Exception;
use const ECB2_SANITIZE_STRING;
use function cmsms;

// this class prefers to use a Collator, in which case it needs PHP's Intl extension

class module_picker extends FieldDefBase
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
            'label' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'text' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'link' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
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

        $modops = cmsms()->GetModuleOperations();
        $modules = $modops->GetInstalledModules();
        $modulesarray = ['' => $this->mod->Lang('none_selected')];
        foreach ($modules as $module) {
            $mod = cms_utils::get_module($module);
            if (is_object($mod)) {
                $name = $mod->GetFriendlyName();
                $modulesarray[$module] = ($name) ? $name : $module;
            }
        }
        if (class_exists('Collator')) {
            $coll = new Collator('en_US'); // TODO default locale always ok? OR 'root'?
            uksort($modulesarray, function($a, $b) use ($coll)/* : int*/ {
                return collator_compare($coll, $a, $b);
            });
        }

        $class = '';
        $smarty = CmsApp::get_instance()->GetSmarty();
        $tpl = $smarty->CreateTemplate('string:'.$this->get_template()); //, null, null, $smarty);
        $tpl->assign('block_name', $this->block_name);
        $tpl->assign('value', $this->value);
        $tpl->assign('modulesarray', $modulesarray);
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
