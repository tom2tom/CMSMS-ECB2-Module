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

class admin_link extends FieldDefBase
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
            'text' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
            'target' => ['default' => '_self',    'filter' => ECB2_SANITIZE_STRING],
            'link' => ['default' => '',    'filter' => ECB2_SANITIZE_STRING],
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

        if (!$this->options['link']) {
            return;
        }
        if (!$this->options['text']) {
            $this->options['text'] = $this->options['link'];
        }

        $smarty = CmsApp::get_instance()->GetSmarty();
        $tpl = $smarty->CreateTemplate('string:'.$this->get_template(), null, null, $smarty);
        $tpl->assign('text', $this->options['text']);
        $tpl->assign('target', $this->options['target']);
        $tpl->assign('link', $this->options['link']);
        $tpl->assign('description', $this->options['description']);
        return $tpl->fetch();
    }
}