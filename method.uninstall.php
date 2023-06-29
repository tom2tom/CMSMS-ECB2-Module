<?php
#---------------------------------------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016 Chris Taylor, chris@binnovative.co.uk
# Licence: GNU General Public License version 3
#          see /ECB2/lang/LICENCE.txt or <http://www.gnu.org/licenses/>
#---------------------------------------------------------------------------------------------------

if (!isset($gCms)) exit;

// remove the permissions, etc
$this->RemovePermission(ECB2::MANAGE_PERM);
$this->RemovePreference();
$this->DeleteTemplate();



// remove the database tables & index
$blocks_table = new ecb2Blocks();
$blocks_table->remove_database();


