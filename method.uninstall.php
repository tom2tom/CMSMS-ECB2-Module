<?php
/*
 * Module: ECB2 - Extended Content Blocks 2
 * Author: Chris Taylor
 * Copyright: (C) 2016-2022 CMS Made Simple Foundation
 * Licence: GNU General Public License version 3 or later
 *  see <https://www.gnu.org/licenses/gpl-3.0.txt>
 */
if (!isset($gCms)) exit;

// plugin handling
$this->RemoveSmartyPlugin();
// all settings
$this->RemovePreference();
// all templates
$this->DeleteTemplate();
