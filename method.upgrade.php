<?php
/*
 * Module: ECB2 - Extended Content Blocks 2
 * Author: Chris Taylor
 * Copyright: (C) 2016-2022 CMS Made Simple Foundation
 * Licence: GNU General Public License version 3 or later
 *  see <https://www.gnu.org/licenses/gpl-3.0.txt>
 */
if (!isset($gCms)) exit;

if ( version_compare($oldversion, '1.4') < 0 ) {
    // remove permission USE_ECB2
    $this->RemovePermission('Use Extended Content Blocks 2');
}
if ( version_compare($oldversion, '1.6.1') <= 0 ) {
    // module settings not used (any more?)
    $this->RemovePreference();
    // module-specific templates not stored (any more?)
    $this->DeleteTemplate();
}
