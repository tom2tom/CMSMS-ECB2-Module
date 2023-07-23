<?php
#---------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016-2023 Chris Taylor, chris@binnovative.co.uk
# Licence: GNU General Public License version 3
#          see /ECB2/LICENCE or <http://www.gnu.org/licenses/gpl-3.0.html>
#---------------------------------------------------------------------

use ECB2\Blocks;
use ECB2\FileUtils;

if (!isset($gCms)) {
    exit;
}

// Setup module permissions
$this->CreatePermission(ECB2::MANAGE_PERM, 'Extended Content Blocks 2 - Manage');

// create module_ecb2_blocks table
$blocks_table = new Blocks();
$blocks_table->create_database();

// support simple-format tags
$this->RegisterModulePlugin(true);

FileUtils::CreateImagesDir();
