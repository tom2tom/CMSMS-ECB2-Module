<?php
#-----------------------------------------------------------------------------
# Module: ECB2 - Extended Content Blocks 2
# Author: Chris Taylor
# Copyright: (C) 2016-2024 Chris Taylor, chris@binnovative.co.uk
# Licence: GNU General Public License version 3
#   see /ECB2/LICENCE or <http://www.gnu.org/licenses/gpl-3.0.html>
#-----------------------------------------------------------------------------

if (!defined('CMS_VERSION')) {
	exit;
}

if (!$this->CheckPermission(ECB2::MANAGE_PERM)) {
	$this->ShowErrors($this->Lang('need_permission'));
	return;
}

$tpl = $smarty->CreateTemplate($this->GetTemplateResource('defaultadmin.tpl')); //, null, null, $smarty);

if (isset($params['submit'])) {
	if (!empty($params['customModuleName'])) {
		$this->SetPreference('customModuleName', $params['customModuleName']);
	}
	if (!empty($params['adminSection'])) {
		$this->SetPreference('adminSection', $params['adminSection']);
	}
	$this->SetPreference('thumbnailWidth', $params['thumbnailWidth']);
	$this->SetPreference('thumbnailHeight', $params['thumbnailHeight']);

	$this->ShowMessage($this->Lang('settings_saved'));
	$tpl->assign('tab', 'settings');
} elseif (isset($params['cancel'])) {
	$tpl->assign('tab', 'settings');
} else {
	$tpl->assign('tab', 'main');
}

/*
$this->get_admin_css_js( TRUE );
$output = '';
$smarty = \CmsApp::get_instance()->GetSmarty();

$tpl = $smarty->CreateTemplate($this->GetTemplateResource('admin_content_blocks.tpl)); // *, null, null, $smarty));
$tpl->assign('field_types', self::FIELD_TYPES);
$tpl->assign('first_admin_only_field', self::FIRST_ADMIN_ONLY_FIELD);
$field_help = [];
foreach(self::FIELD_TYPES as $field_type) {
	$type = self::FIELD_DEF_PREFIX.$field_type;
	if ( class_exists($type) ) {    // stops errors with old field types on upgrade
		$ecb2 = new $type($this, $this::DEMO_BLOCK_PREFIX.$field_type, NULL, ['field' => $field_type], TRUE);
		$field_help[$field_type] = $ecb2->get_field_help();
	}
}
$tpl->assign('field_help', $field_help);
$output .= $tpl->fetch();
*/
$tpl->assign('field_types', ECB2::FIELD_TYPES);
$tpl->assign('first_admin_only_field', ECB2::FIRST_ADMIN_ONLY_FIELD);
$field_help = [];
foreach (ECB2::FIELD_TYPES as $field_type) {
	$type = ECB2::FIELD_DEF_PREFIX.$field_type;
	if (class_exists($type)) { // stops errors with old field types on upgrade
		$ecb2 = new $type($this, ECB2::DEMO_BLOCK_PREFIX.$field_type, null, ['field' => $field_type], true);
		$field_help[$field_type] = $ecb2->get_field_help();
	}
}
$tpl->assign('field_help', $field_help);

$pset = $this->CheckPermission('Modify Site Settings');
if ($pset) {
	// admin menu sections
	$sections = explode(',','main,content,layout,files,usersgroups,extensions,preferences,siteadmin,myprefs,ecommerce');
	// the corresponding 'public' versions of those section names
	$names = explode(',', $this->Lang('adminSectionOptions'));
	$selopts = array_combine($sections, $names);
	$tpl->assign('customModuleName', $this->GetPreference('customModuleName', $this->Lang('extended_content_blocks')));
	$tpl->assign('adminSection', $this->GetPreference('adminSection', 'extensions'));
	$tpl->assign('adminSectionOptions', $selopts);
	$tpl->assign('thumbnailWidth', $this->GetPreference('thumbnailWidth', ''));
	$tpl->assign('thumbnailHeight', $this->GetPreference('thumbnailHeight', ''));
	$tpl->assign('pset', 1);
}

//TODO update header html/js per $this->get_admin_css_js(false); etc
$tpl->display();
