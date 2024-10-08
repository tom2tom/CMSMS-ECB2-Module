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
use ECB2\FieldDefBase;
use ECB2\Utils;
use FilePicker\TemporaryProfileStorage;
use const ECB2_SANITIZE_STRING;
use function cms_join_path;
use function cmsms;

class file_picker extends FieldDefBase
{
    public function __construct($mod, $blockName, $value, $params, $adding, $id = 0)
    {
        parent::__construct($mod, $blockName, $value, $params, $adding, $id);

        $this->get_values($value);              // common FieldDefBase method

        $this->set_field_parameters();

        $this->initialise_options($params);     // common FieldDefBase method

        // $this->create_sub_fields( $params );      // common FieldDefBase method (if required)
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
        $this->default_parameters = [
            'label' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'profile' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'top' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'type' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'preview' => ['default' => true,  'filter' => FILTER_VALIDATE_BOOLEAN],
            'thumbnail_width' => ['default' => 0,     'filter' => FILTER_VALIDATE_INT],
            'thumbnail_height' => ['default' => 0,     'filter' => FILTER_VALIDATE_INT],
            'default_value' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'admin_groups' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'description' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING]
        ];
/*
        $this->parameter_aliases = [ 'alias' => 'parameter' ];
        $this->restrict_params = FALSE;    // default: true
        $this->use_json_format = TRUE;     // default: FALSE - can override e.g. 'groups' type
*/
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

        $thumbnail_url = '';
        $ajax_url = '';
        $FPmod = cms_utils::get_module('FilePicker');
        $FPprofile = $FPmod->get_profile_or_default($this->options['profile']);
        if ($this->options['preview']) {  // get thumbnail
            $config = cmsms()->GetConfig();
            $top_dir = $this->options['top'] ? $this->options['top'] : $FPprofile->reltop;
            $img_src = cms_join_path($config['uploads_path'], $top_dir, $this->value);
            $thumbnail_url = Utils::get_thumbnail_url(
                $img_src,
                $this->options['thumbnail_width'],
                $this->options['thumbnail_height']
            );
            $ajax_url = $this->mod->create_url('m1_', 'admin_ajax_get_thumb', '', [], false, false, '', false, 2);
        }

        $class = '';
        $smarty = CmsApp::get_instance()->GetSmarty();
        $tpl = $smarty->CreateTemplate('string:'.$this->get_template()); //, null, null, $smarty);
        $tpl->assign('block_name', $this->block_name);
        $tpl->assign('value', $this->value);

        $tpl->assign('description', $this->options['description']);
        $tpl->assign('label', $this->options['label']);
        $tpl->assign('profile', $this->options['profile']);
        $tpl->assign('top', $this->options['top']);
        $tpl->assign('type', $this->options['type']);
        $tpl->assign('preview', $this->options['preview']);
        $tpl->assign('thumbnail_url', $thumbnail_url);
        $tpl->assign('top_dir', $top_dir);
        $tpl->assign('thumbnail_width', $this->options['thumbnail_width']);
        $tpl->assign('thumbnail_height', $this->options['thumbnail_height']);
        $tpl->assign('ajax_url', $ajax_url);
        $tpl->assign('is_sub_field', $this->is_sub_field);
        if ($this->is_sub_field) {
            $tpl->assign('sub_row_number', $this->sub_row_number);
            $tpl->assign('subFieldName', $this->sub_parent_block.'[r_'.$this->sub_row_number.']['.
                $this->block_name.']');
            $tpl->assign('subFieldId', $this->sub_parent_block.'_r_'.$this->sub_row_number.'_'.
                $this->block_name);
            $profile_sig = TemporaryProfileStorage::set($FPprofile);
            $tpl->assign('profile_sig', $profile_sig);
            $tpl->assign('lang_clear', $FPmod->Lang('clear'));
            $class .= ' repeater-field';
        }
        $tpl->assign('class', $class);

        return $tpl->fetch();
    }

    /* *
     *  Data entered by the editor is processed before its saved in props table
     *  This method, if required, overides the parent class method, to enable additional processing
     *  before the data is saved.
     *  Can be omitted and ECB2\FieldDefBase will handle default processing
     *
     *  @return string formatted json containing all field data ready to be saved & output
     * /
    public function get_content_block_value( $inputArray )//: string
    {
        $this->set_field_object( $inputArray );

        // do other stuff here

        return $this->ECB2_json_encode_field_object();
    }
*/
}
