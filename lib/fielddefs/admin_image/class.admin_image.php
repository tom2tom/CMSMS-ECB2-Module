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
use function cms_join_path;
use function cmsms;

class admin_image extends FieldDefBase
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
        $this->default_parameters = [
            'image' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
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

        $help_sample_filename = 'sample_admin_only_image.png';
        $config = cmsms()->GetConfig();
        $img_url = cms_join_path($config['uploads_url'], $this->options['image']);
        $img_path = cms_join_path($config['uploads_path'], $this->options['image']);
        if ($this->options['image'] == $help_sample_filename) {
            // just to make sure the help image always works!
            $img_url = $this->mod->GetModuleURLPath() .DIRECTORY_SEPARATOR. 'lib' .DIRECTORY_SEPARATOR.
                'fielddefs' .DIRECTORY_SEPARATOR. $this->field .DIRECTORY_SEPARATOR.
                $help_sample_filename;
        } elseif (!is_readable($img_path)) {
            $this->error = $this->mod->Lang('error_filename', $img_url, 'image');
            return $this->mod->error_msg($this->error);
        }

        $smarty = CmsApp::get_instance()->GetSmarty();
        $tpl = $smarty->CreateTemplate('string:'.$this->get_template(), null, null, $smarty);
        $tpl->assign('block_name', $this->block_name);
        $tpl->assign('img_url', $img_url);
        $tpl->assign('description', $this->options['description']);
        return $tpl->fetch();
    }
}
