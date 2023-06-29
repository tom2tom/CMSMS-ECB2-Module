<?php
#---------------------------------------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016 Chris Taylor, chris@binnovative.co.uk
# Licence: GNU General Public License version 3
#          see /ECB2/lang/LICENCE.txt or <http://www.gnu.org/licenses/>
#---------------------------------------------------------------------------------------------------


if (!isset($gCms)) exit;

define('MANAGE_PERM', 'manage_ecb2');   // duplicated from ECB2.module.php

// remove permission USE_ECB2
define('USE_ECB2', 'Use Extended Content Blocks');
$db = $this->GetDb();
if ( version_compare($oldversion, '1.4') < 0 ) {
    $this->RemovePermission(USE_ECB2);
}
$module_path = $this->GetModulePath();
if ( version_compare($oldversion, '1.8') < 0 ) {
    // remove sub dirs
    $dirsToRemove = ['/lib/js/images', '/icons'];
    foreach ($dirsToRemove as $delDir) {
        foreach (glob($module_path.$delDir.'/*.*') as $filename) @unlink($filename);
        @rmdir($module_path.$delDir);
    }
    // individual files to remove
    $filesToRemove = ['/lib/js/mColorPicker.min.js', '/changelog.inc', '/lib/js/jquery-ui-timepicker-addon.js', 
        '/lib/js/colpick.js'];
    foreach ($filesToRemove as $delFile) @unlink($module_path.$delFile);
}

if ( version_compare($oldversion, '2.0') < 0 ) {
    // remove sub dirs
    $dirsToRemove = ['/lib/fielddefs/input_repeater'];
    foreach ($dirsToRemove as $delDir) {
        if ( file_exists($module_path.$delDir) ) {
            foreach (glob($module_path.$delDir.'/*.*') as $filename) @unlink($filename);
            @rmdir($module_path.$delDir);
        }
    }
    // individual files to remove
    $filesToRemove = [
        '/lib/class.ecb2_tools.php',
        '/test/ecb2_sortable_udt_test.php',
        '/templates/colorpicker_template.tpl',
        '/templates/datepicker_template.tpl',
        '/templates/image_template.tpl',
        '/templates/input_repeater_template.tpl',
        '/templates/select_template.tpl',
        '/templates/sortablelist_template.tpl',
        '/templates/_help.tpl',
        '/templates/_changelog.tpl',
        '/action.refresh.php'
    ];
    foreach ($filesToRemove as $delFile) @unlink($module_path.$delFile);

    ecb2_FileUtils::CreateImagesDir();
}

if ( version_compare($oldversion, '1.99.3') < 0 ) {
    $this->CreatePermission(MANAGE_PERM,'Extended Content Blocks 2 - Manage');
}

if ( version_compare($oldversion, '1.99.5') < 0 ) {
    //  create module_ecb2_blocks table
    $blocks_table = new ecb2Blocks();
    $blocks_table->create_database();
    
}


