<?php
#---------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016 Chris Taylor, TODOchris@cmsmadesimple.org
# Licence: GNU General Public License version 3
#          see /ECB2/LICENCE or <http://www.gnu.org/licenses/#GPL>
#---------------------------------------------------------------------

use ECB2\Blocks;

if (!isset($gCms)) {
    exit;
}

// remove the permissions, etc
$this->RemovePermission(ECB2::MANAGE_PERM);
$this->RemovePreference();
$this->DeleteTemplate();

// remove the database tables & index
$blocks_table = new Blocks();
$blocks_table->remove_database();

// remove plugin registration
$this->RemoveSmartyPlugin();
