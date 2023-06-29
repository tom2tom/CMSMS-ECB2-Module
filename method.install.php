<?php
#---------------------------------------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016 Chris Taylor, chris@binnovative.co.uk
# Licence: GNU General Public License version 3
#          see /ECB2/lang/LICENCE.txt or <http://www.gnu.org/licenses/>
#---------------------------------------------------------------------------------------------------


if (!isset($gCms)) exit;

// Setup Module Permissions
$this->CreatePermission(ECB2::MANAGE_PERM,'Extended Content Blocks 2 - Manage');

//  create module_ecb2_blocks table
$blocks_table = new ecb2Blocks();
$blocks_table->create_database();

ecb2_FileUtils::CreateImagesDir();

