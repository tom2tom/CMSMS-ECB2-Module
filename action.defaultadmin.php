<?php
#-----------------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016 Chris Taylor, TODOchris@cmsmadesimple.org
# Licence: GNU General Public License version 3
#          see /ECB2/LICENCE or <http://www.gnu.org/licenses/#GPL>
#-----------------------------------------------------------------------------

if (!defined('CMS_VERSION')) {
    exit;
}

if (!$this->CheckPermission(ECB2::MANAGE_PERM)) {
    $this->ShowErrors($this->Lang('need_permission'));
    return;
}

// process edits if form submitted - Save Options
if (isset($params['submit'])) {
    if (!empty($params['customModuleName'])) {
        $this->SetPreference('customModuleName', $params['customModuleName']);
    }
    if (!empty($params['adminSection'])) {
        $this->SetPreference('adminSection', $params['adminSection']);
    }
    $this->SetPreference('thumbnailWidth', $params['thumbnailWidth']);
    $this->SetPreference('thumbnailHeight', $params['thumbnailHeight']);

    $this->SetMessage($this->Lang('options_saved'));
    $this->RedirectToAdminTab('options');
}

echo $this->get_admin();
