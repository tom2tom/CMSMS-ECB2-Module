<?php
/*
 * Extended Content Blocks 2 class: ecb2_tools
 * Copyright (C) 2016-2022 CMS Made Simple Foundation <foundation@cmsmadesimple.org>
 * Thanks to Chris Tatlor and all other contributors from the CMSMS Development Team.
 *
 * This file is a component of CMS Made Simple module Extended Content Blocks 2.
 * CMS Made Simple is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of that license, or
 * (at your option) any later version.
 *
 * CMS Made Simple is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of that license along with CMS Made Simple.
 * If not, see <https://www.gnu.org/licenses/>.
 */
 class ecb2_tools
 {
    /**
     * @var object
     * ECB2 module
     */
    protected $mod;

    public function __construct($mod = null)
    {
        if ($mod) {
            $this->mod = $mod;
        } else {
            $this->mod = cms_utils::get_module('ECB2');
        }
    }

    /**
     * Get a content block of the specified type
     * @param string $blockName
     * @param mixed $value
     * @param array $params Appropriate block parameters
     * @param boolean $adding Optional flag whether processing a new page. Default false
     * @return string, html maybe with associated js, or maybe an error/warning or empty
     */
    public function get_content_block_input($blockName, $value, $params, $adding = false)
    {
        $options = $this->init($blockName, $value, $params, $adding);
        if (!empty($options['field'])) {
            $fname = 'get_' . strtolower($options['field']);
        } else {
            $fname = 'nothing';
        }
        if (empty($options['field']) || !method_exists($this, $fname)) {
            return '<div class="pagewarning">' . $this->mod->Lang('field_error') . '</div><br />';
        }

        if (!empty($options['description'])) {
            $options['description'] .= '<br />';
        }
        return $this->$fname($options);
    }

    /*
     * Get a dropdown with choices from the values in a CustomGS-module field
     * NOTE: the CustomGS field should be a plain textarea
     * Use either newlines or commas to separate each title-value pair
     * @param array $options
     * @return string
     */
    public function get_dropdown_from_customgs($options)
    {
        $CustomGS = cms_utils::get_module('CustomGS');
        if (!is_object($CustomGS)) {
            return '<div class="pageerror">' . $this->mod->Lang('module_error', 'CustomGS') . '</div><br />';
        }

        $fopts = array();
        $selectOptions = $CustomGS->GetField($options['customgs_field']);
        if (empty($selectOptions['value'])) {
            $err = '<div class="pagewarning">' . $this->mod->Lang('customgs_field_error', $options['customgs_field']) . '</div><br />';
        } else {
            $err = '';
            // use either newlines or commas to separate each title-value pair
            $selectOptions = str_replace(PHP_EOL, ',', $selectOptions['value']);
            $selectLines = explode(',', $selectOptions);
            foreach ($selectLines as $oneOption) {
                $opt = explode('=', trim($oneOption));
                $fopts[$opt[0]] = isset($opt[1]) ? $opt[1] : $opt[0];
            }
        }
        return $err . $this->create_select($options, $fopts);
    }

    /**
     * Get a hidden input
     * @param array $options
     * @return string
     */
    public function get_hidden($options)
    {
        $tmp = '<input type="hidden" name="%s" value="%s">';
        return sprintf($tmp, $options['block_name'], $options['value']);
    }

    /**
     * Get a fieldset start
     * @param array $options
     * @return string
     */
    public function get_fieldset_start($options)
    {
        $tmp = <<<'EOS'
<fieldset name="%s">
 <legend>%s</legend>
EOS;
        $out  = sprintf($tmp, $options['block_name'], $options['legend']);
        if ($options['description']) {
            $out .= "\n<div>" . nl2br($options['description']) . "</div>\n";
        }
        return $out;
    }

    /**
     * Get the fieldset end to finalize get_fieldset_start()
     * @return string
     */
    public function get_fieldset_end()
    {
        return <<<'EOS'
</fieldset>
EOS;
    }

    /**
     * Get a gallery_picker content block
     *
     * @param array $options
     *  'dir' - only return galleries that are sub-galleries of this gallery dir,
     *    default is all galleries, excluding default top-level gallery
     * @return string an select input of galleries 'gallery title' => 'gallery-dir', home gallery is excluded
     */
    public function get_gallery_picker($options)
    {
        $GalleryModule = cms_utils::get_module('Gallery');
        if (!is_object($GalleryModule)) {
            return '<div class="pageerror">' . $this->mod->Lang('module_error', 'Gallery') . '</div><br />';
        }

        $dir = $options['dir'].DIRECTORY_SEPARATOR; // default dir (needs trailing sep)
        $galleries = Gallery_utils::GetGalleries();
        $galleryArray = array('--- none ---' => '');

        foreach ($galleries as $gallery) {
            if ($gallery['filename'] != '') {    // ignores default gallery
                if ($dir != DIRECTORY_SEPARATOR) {
                    // only select sub-galleries of $dir
                    $isSubDir = stripos($gallery['filepath'], $dir);

                    if ($isSubDir !== false && $isSubDir == 0) {
                        $gallery_dir = $gallery['filepath'].rtrim($gallery['filename'], '/');
                        $galleryArray[$gallery['title']] = $gallery_dir;
                    }
                } else {
                    // select all galleries
                    $gallery_dir = $gallery['filepath'].rtrim($gallery['filename'], '/');
                    $galleryArray[$gallery['title']] = $gallery_dir;
                }
            }
        }
        return $options['description'] .
          $this->mod->CreateInputDropdown('', $options['block_name'], $galleryArray, -1, $options['value']);
    }

    /**
     * Get a textarea block
     * @param array $options
     * @return string
     */
    private function get_textarea($options)
    {
        $tmp = '<textarea name="%s" rows="%d" cols="%d">%s</textarea>';
        $value = $options['value'] ? $options['value'] : $options['default'];
        return $options['description'] . sprintf($tmp, $options['block_name'], (int)$options['rows'], (int)$options['cols'], $value);
    }

    /**
     * Get a page-selector block
     * @param array $options
     * @return string
     */
    private function get_pages($options)
    {
        $contentOps = ContentOperations::get_instance();
        return $options['description'] .
          $contentOps->CreateHierarchyDropdown('', $options['value'], $options['block_name'], 1, 1);
    }

    /**
     * Get a text editor block
     * @param array $options
     * @return string
     */
    private function get_editor($options)
    {
        $value = $options['value'] ? $options['value'] : $options['default'];
        return $options['description'] .
          $this->mod->CreateTextArea(true, '', $value, $options['block_name'], '', '', '', '', $options['cols'], $options['rows']);
    }

    /**
     *
     * @param array $options
     * @return string
     */
    private function get_input($options)
    {
        $tmp = '<input type="text" name="%s" size="%d" maxlength="%d" value="%s" />';
        $value = $options['value'] ? $options['value'] : $options['default'];
        return $options['description'] .
          sprintf($tmp, $options['block_name'], (int)$options['size'], (int)$options['max_length'], $value);
    }

    /**
     * @ignore
     */
    private function get_datepicker_lib()
    {
        if (!isset($this->mod->loadjs['datepick_lib'])) {
            $base_url = $this->mod->GetModuleURLPath();
            $this->mod->loadcss['datepick_lib'] = "<link rel=\"stylesheet\"  type=\"text/css\" href=\"$base_url/lib/css/zebra_datepicker.min.css\" />";
            $this->mod->loadjs['datepick_lib'] = "<script type=\"text/javascript\" src=\"$base_url/lib/js/zebra_datepicker.min.js\"></script>";
        }
    }

    /**
     * Get a time-selector block
     * @param array $options
     * @return string
     */
    private function get_timepicker($options)
    {
        $this->get_datepicker_lib();
        $id = !empty($options['alias']) ? $options['alias'] : 'tpick';
        if (!isset($this->mod->loadjs['time_picker'])) {
            //TODO other picker options per https://github.com/stefangabos/Zebra_Datepicker#configuration-options
            //enabled_ampm: [] rtl: true
            $s = $this->mod->Lang('clear');
            if (!empty($options['time_format'])) {
                $X = "    format: '" . $options['time_format'] . "',";
            } else {
                $X = '';
            }
            $this->mod->loadjs['time_picker'] = <<<EOS
<script type="text/javascript">
$(function() {
  $('#$id').Zebra_DatePicker({
    lang_clear_date: '$s',
$X
    view: 'time'
  });
});
</script>
EOS;
        }
        $tmp = '<input type="text" class="timepicker" id="%s" name="%s" size="%d" maxlength="%d" value="%s" />';
        return $options['description'] .
          sprintf($tmp, $id, $options['block_name'], (int)$options['size'], (int)$options['max_length'], $options['value']);
    }

    /**
     * Get a date[/time]-selector block
     * @param array $options
     * @return string
     */
    private function get_datepicker($options)
    {
        $this->get_datepicker_lib();
        $id = !empty($options['alias']) ? $options['alias'] : 'dpick';
        if (!isset($this->mod->loadjs['date_picker'])) {
            //TODO other picker options per https://github.com/stefangabos/Zebra_Datepicker#configuration-options
            //days: [], months: [], enabled_ampm: [] rtl: true
            $s = $this->mod->Lang('clear');
            if (!empty($options['date_format'])) {
                $X = "    format: '".$options['date_format'];
                if (!empty($options['time']) && !empty($options['time_format'])) {
                   $X .= ' '.$options['time_format'];
                }
                $X .= "',";
            } else {
                $X = '';
            }
            if (empty($options['time'])) {
               $Y = '    disable_time_picker: true,';
            } else {
               $Y = '';
            }
            $this->mod->loadjs['date_picker'] = <<<EOS
<script type="text/javascript">
$(function() {
  $('#$id').Zebra_DatePicker({
    lang_clear_date: '$s',
$X
$Y
    select_other_months: true
  });
});
</script>
EOS;
        }
        $tmp = '<input type="text" class="datepicker" id="%s" name="%s" size="%d" maxlength="%d" value="%s" />';
        return $options['description'] .
          sprintf($tmp, $id, $options['block_name'], (int)$options['size'], (int)$options['max_length'], $options['value']);
    }

    /**
     * Get a color-selector block
     * @param array $options
     * @return string
     */
    private function get_color_picker($options)
    {
        if (!isset($this->mod->loadjs['color_picker'])) {
            $base_url = $this->mod->GetModuleURLPath();
            $this->mod->loadcss['color_picker'] = "<link rel=\"stylesheet\" type=\"text/css\" href=\"$base_url/lib/css/spectrum.min.css\" />";
            $this->mod->loadjs['color_picker'] = "<script type=\"text/javascript\" src=\"$base_url/lib/js/spectrum.min.js\"></script>";
        }
        $id = !empty($options['alias']) ? $options['alias'] : 'cpick';
        $first = !empty($options['value']) ? $options['value'] : '#f00';
        //TODO other picker options - per https://seballot.github.io/spectrum
        $this->mod->loadjs[] = <<<EOS
<script type="text/javascript">
$(function() {
  $('#$id').spectrum({
    color: '$first',
    showInput: true
  });
});
</script>
EOS;
        $tmp = '<input name="%s" id="%s" size="%d" value="%s" />';
        $txt = sprintf($tmp, $options['block_name'], $id, (int)$options['size'], $first);
        return $options['description'] . $txt;
    }

    /**
     * Get checkbox block
     * @param array $options
     * @return string
     */
    private function get_checkbox($options)
    {
        return $options['description'] .
          $this->mod->CreateInputHidden('', $options['block_name'], 0) .
          $this->mod->CreateInputCheckbox('', $options['block_name'], $options['value'], $options['value']);
    }

    /**
     *
     * @param array $options
     * @return string
     */
    private function get_file_selector($options)
    {
        $config = cmsms()->GetConfig();

        // Get the directory contents
        if ($options['dir']) {
            $adddir = $options['dir'];
        } else {
            $adddir = get_site_preference('contentimage_path');
        }

        $dir = cms_join_path($config['uploads_path'], $adddir);
        $filetypes = $options['filetypes'];
        if ($filetypes != '') {
            $filetypes = explode(',', $filetypes);
        }

        $excludes = $options['excludeprefix'];
        if ($excludes != '') {
            $excludes = explode(',', $excludes);
            for ($i = 0, $n = count($excludes); $i < $n; ++$i) {
                $excludes[$i] = $excludes[$i] . '*';
            }
        }
        $maxdepth = !empty($options['recurse']) ? -1 : 0;   // default
        $fl = get_recursive_file_list($dir, $excludes, $maxdepth, 'FILES');

        // Remove prefix
        $filelist = array();
        for ($i = 0, $n = count($fl); $i < $n; ++$i) {
            if (in_array(pathinfo($fl[$i], PATHINFO_EXTENSION), $filetypes)) {
                $filelist[] = str_replace($dir, '', $fl[$i]);
            }
        }

        // Sort
        if (is_array($filelist) && $options['sortfiles']) {
            sort($filelist);
        }

        // Create select options
        $fopts = array();
        $url_prefix = $adddir;
        for ($i = 0, $n = count($filelist); $i < $n; ++$i) {
            $opts[$filelist[$i]] = $url_prefix . $filelist[$i];
        }
        $fopts = array('' => '') + $fopts;

        $preview = '';
        if ($options['preview']) {
            if ($options['value']) {
                $preview = '<img style="max-width:130px;" class="file_selector_preview" data-uploadsurl="' . $config['uploads_url'] . '"   src="' . $config['uploads_url'] . '/' . $options['value'] . '" alt="">';
            } else {
                $preview = '<img style="max-width:130px;" class="file_selector_preview" alt="" data-uploadsurl="' . $config['uploads_url'] . '">';
            }
        }
        return $options['description'] .
          '<div class="ecb_file_selector_select">' . $this->mod->CreateInputDropdown('', $options['block_name'], $opts, -1, $options['value']) . '</div>' .
          $preview;
    }

    /**
     *
     * @param array $options
     * @return string
     */
    private function get_sortablelist(&$options)
    {
        $optionsarray = explode(',', $options['values']);
        if (empty($optionsarray)) {
            return '';
        }
        $fopts = array();
        if ($options['udt']) {
            $fopts = UserTagOperations::get_instance()->CallUserTag($options['udt'], $tmp);
        }
        $tmp = array();
        foreach ($optionsarray as $option) {
            if ($option != '') {
                $key_val = explode('=', $option);
                $fopts[$key_val[0]] = $key_val[1];
            }
        }
        if (!empty($options['first_value'])) {
            $fopts = array($options['first_value'] => '') + $fopts;
        }
        $selectedList = explode(',', $options['value']);
        $available = $fopts;
        $selected = array();
        foreach ($selectedList as $item) {
            if (array_key_exists($item, $available)) {
                $selected[$item] = $available[$item];
                unset($available[$item]);
            }
        }
        if ($options['max_number']) { // max_number takes precedence if both set
            $options['required_number'] = '';
        }
        $smarty = cmsms()->GetSmarty();
        $tpl = $smarty->CreateTemplate($this->mod->GetTemplateResource('sortablelist_template.tpl'), null, null, $smarty);
        $tpl->assign('selectarea_prefix', $options['block_name']);
        $tpl->assign('selected_str', $options['value']);
        $tpl->assign('selected', $selected);
        $tpl->assign('available', $available);
        $tpl->assign('description', $options['description']);
        $tpl->assign('labelLeft', $options['label_left']);
        $tpl->assign('labelRight', $options['label_right']);
        $tpl->assign('mod', $this->mod); // prob. redundant
        $tpl->assign('maxNumber', $options['max_number']);
        $tpl->assign('requiredNumber', $options['required_number']);
        return $options['description'] . $tpl->fetch();
    }

    /**
     * Get a (fixed) text string
     * @param array $options
     * @return string, maybe empty
     */
    private function get_text($options)
    {
        if (!$options['text']) {
            return '';
        }
        return $options['description'] . $options['text'];
    }

    /**
     * Get a horizontal rule element
     * @param array $options
     * @return string
     */
    private function get_hr($options)
    {
        return $options['description'] .
          '<hr style="display:block; border:0 none; background:#ccc;" />'; // TODO external css for this
    }

    /**
     * Get an anchor link element
     * @param array $options
     * @return string, maybe empty
     */
    private function get_link($options)
    {
        if (!$options['link'] || !$options['text']) {
            return '';
        }
        return $options['description'].'<a target="' . $options['target'] . '" href="' . $options['link'] . '">' . $options['text'] . '</a>';
    }

    /**
     * Get a content block with a link to a module's defaultadmin action
     * @param array $options
     * @return string
     */
    private function get_module_link($options)
    {
/* CT comment out
        $userid = get_userid();
        $userops = cmsms()->GetUserOperations();
        $adminuser = $userops->UserInGroup($userid, 1);

        $tmp = '<input id="mt_' . $options['block_name'] . '" ' . ($adminuser ? 'type="text"' : 'type="hidden"') . ' name="' . $options['block_name'] . '" value="' . ($options['value'] ? $options['value'] : $options['default']) . '"  size="%d" maxlength="%d" />';
        $tmp = sprintf($tmp, (int)$options['size'], (int)$options['max_length']);
*/
        $mod = '';
        if ($options['mod']) {
            $mod = cms_utils::get_module($options['mod']);
        }
        // original CT edit
        return $options['description'] .
            (is_object($mod) ?
            $mod->CreateLink('', 'defaultadmin', '', $options['text'], [], '', false, 0, 'target="' . $options['target'] . '"') :
            $options['text']);// . '<br />' . $tmp; // CT comment out
    }

    /**
     * Get a dropdown content block
     * @internal
     * @param array $options
     * @param array $fopts
     * @return string
     */
    private function create_select($options, $fopts)
    {
        $smarty = cmsms()->GetSmarty();
        $tpl = $smarty->CreateTemplate($this->mod->GetTemplateResource('select_template.tpl'), null, null, $smarty);
        $tpl->assign('block_name', $options['block_name']);
        $tpl->assign('description', $options['description']);
        $tpl->assign('multiple', $options['multiple']);
        $tpl->assign('compact', $options['compact']);
        $tpl->assign('none_selected', $this->mod->Lang('none_selected'));

        if (!empty($options['first_value'])) {
            $fopts = array($options['first_value'] => '') + $fopts;
        }
        $tpl->assign('options', $fopts);

        if (isset($options['size']) && $options['size'] > 0) {
            $size = (int)$options['size'];
        } elseif (!empty($options['compact'])) {
            $size = count($fopts);
            if (!empty($options['first_value'])) {
                $size++;
            }
        } else {
            $size = 5; // default
        }
        $tpl->assign('size', $size);

        $tpl->assign('selected', $options['value']);
        if ($options['multiple']) {
            $selected_values = explode(',', $options['value']);
            $selected_text = array();
            foreach ($selected_values as $value) {
                $selected_text[] = array_search($value, $fopts);
            }
            $selected_text = implode(', ', $selected_text);
            $tpl->assign('selected_values', $selected_values);  // array
            $tpl->assign('selected_text', $selected_text); // text
        }
        return $tpl->fetch();
    }

    /**
     * Get a dropdown content block with specified values as choices
     *
     * @param array $options
     * @return string representing a select, or empty
     */
    private function get_dropdown($options)
    {
        if (!$options['values']) {
            return '';
        }

        $fopts = array();
        $tmpOptions = explode(',', $options['values']);
        foreach ($tmpOptions as $option) {
            $key_val = explode('=', $option);
            if (count($key_val) > 1) {
                $fopts[$key_val[0]] = $key_val[1];
            } else {
                $fopts[$key_val[0]] = $key_val[0];
            }
        }
        return $this->create_select($options, $fopts);
    }

    /**
     * Get a dropdown content block with choices derived from a UDT
     *
     * @param array $options
     * @return string representing a select, or empty
     */
    private function get_dropdown_from_udt($options)
    {
        if (!$options['udt']) {
            return '';
        }

        if (UserTagOperations::get_instance()->UserTagExists($options['udt'])) {
            $tmp = array();
            $fopts = UserTagOperations::get_instance()->CallUserTag($options['udt'], $tmp);
        } else {
            $err = $this->mod->Lang('udt_error', $options['udt']);
            return '<div class="pagewarning">'.$err.'</div>';
        }

        if (!empty($options['first_value'])) {
            $fopts = array($options['first_value'] => '') + $fopts;
        }
        return $this->create_select($options, $fopts);
    }

    /**
     * Get dropdown content block with choices from a GCB's list
     * @deprecated since CMSMS 2 (no GCB's)
     * @ignore
     * @param array $options
     * @return string error message
     */
    private function get_dropdown_from_gbc($options)
    {
/*      if (!$options['gbc']) {
            return '';
        }

        $smarty = cmsms()->GetSmarty();

        $fopts = array();
        $optionsgbc = $smarty->fetch('globalcontent:' . $options['gbc']);

        $optionsarray = explode(',', $optionsgbc);
        if (empty($optionsarray)) {
            return '';
        }

        foreach ($optionsarray as $option) {
            $key_val = explode('=', $option);
            $fopts[$key_val[0]] = $key_val[1];
        }

        if (!empty($options['first_value'])) {
            $fopts = array($options['first_value'] => '') + $fopts;
        }
        return $this->create_select($options, $fopts);
*/
        $err = 'Invalid field type \'dropdown_from_gbc\' - global content blocks are not supported now';
        return '<div class="pageerror">' . $err . '</div>';
    }

    /**
     * Get dropdown content block with choices from a module-action
     * @param array $options
     * @return string, maybe empty
     */
    private function get_dropdown_from_module($options)
    {
        if (!$options['mod']) {
            return '';
        }

        $data = $this->mod->ProcessTemplateFromData('{' . $options['mod'] . '}');

        $optionsarray = explode(',', $data);
        if (empty($optionsarray)) {
            return '';
        }

        $fopts = array();
        foreach ($optionsarray as $option) {
            $key_val = explode('=', $option);
            $fopts[$key_val[0]] = $key_val[1];
        }
        if (!empty($options['default'])) {
            $fopts = array($options['default'] => '') + $fopts;
        }
        return $options['description'] .
          $this->mod->CreateInputDropdown('', $options['block_name'], $fopts, -1, $options['value']);
    }

    /**
     * Get dropdown content block with loadable modules as choices
     * @param array $options
     * @return string
     */
    private function get_module($options)
    {
        $modops = cmsms()->GetModuleOperations();
        $modules = $modops->GetInstalledModules();
        $modulesarray = array();
        foreach ($modules as $module) {
            $mod = cms_utils::get_module($module);
            if (is_object($mod)) {
                $modulesarray[$mod->GetFriendlyName()] = $module;
            }
        }

        return $options['description'] .
          $this->mod->CreateInputDropdown('', $options['block_name'], $modulesarray, -1, $options['value']);
    }

    /**
     * Get radio-group content block
     * @param array $options
     * @return string maybe empty
     */
    private function get_radio($options)
    {
        if (!$options['values']) {
            return '';
        }

        $optionsarray = explode(',', $options['values']);
        if (empty($optionsarray)) {
            return '';
        }

        $fopts = array();
        foreach ($optionsarray as $option) {
            $key_val = explode('=', $option);
            $fopts[$key_val[0]] = $key_val[1];
        }

        $delimiter = ($options['inline']) ? '&nbsp;&nbsp;&nbsp;&nbsp;' : '<br />';

        if (isset($options['value'])) {
            $selectedValue = $options['value'];
        } elseif ($options['default'] == '-1') {
            $selectedValue = reset($options);
        } else {
            $selectedValue = $fopts[$options['default']];
        }

        return $options['description'] .
          $this->mod->CreateInputRadioGroup('', $options['block_name'], $fopts, $selectedValue, '', $delimiter);
    }

    /**
     * Get a repeating text content block
     * @param array $options
     * @return string
     */
    private function get_input_repeater($options)
    {
        $smarty = cmsms()->GetSmarty();

        $fields = explode('||', $options['value']);
        $tpl = $smarty->CreateTemplate($this->mod->GetTemplateResource('input_repeater_template.tpl'), null, null, $smarty);
        $tpl->assign('block_name', $options['block_name']);
        $tpl->assign('size', $options['size']);
        $tpl->assign('max_length', $options['max_length']);
        $tpl->assign('value', $options['value']);
        $tpl->assign('fields', $fields);
        $tpl->assign('description', $options['description']);
        $tpl->assign('title_add_line', $this->mod->Lang('add_line'));
        $tpl->assign('title_remove_line', $this->mod->Lang('remove_line'));
        return $tpl->fetch();
    }

    /**
     * Initialization
     * @param string $blockName
     * @param mixed $value
     * @param array $params
     * @param boolean $adding Optional new-page flag. Default false
     * @return array
     */
    private function init($blockName, $value, $params, $adding = false)
    {
        $alias = munge_string_to_url($blockName, true);
        $field = !empty($params['field']) ? $params['field'] : '';
        $options = array(
          'adding' => $adding,
          'alias' => $alias,
          'block_name' => $blockName,
          'field' => $field,
          'txt' => '', // unused ?
          'value' => $value
          ) + $this->get_default_options($field);

        if (isset($params['default_value'])) {
            $params['default'] = $params['default_value'];
            unset($params['default_value']);
        }
        foreach ($params as $key => $val) {
            if (isset($options[$key])) {
                $options[$key] = $val;
            }
        }
        if (isset($params['default'])) {
            if ($adding || !isset($options['value'])) {
                $options['value'] = $options['default'];
            }
        }
        return $options;
    }

    /**
     * More initialization
     * @param string $field
     * @return array
     */
    private function get_default_options($field)
    {
        $default_options = array();
        switch (strtolower($field)) {
            case 'color_picker':
                $default_options['size'] = 10;
                $default_options['default'] = '';
                $default_options['description'] = '';
                break;
            case 'module_link':
                $default_options['mod'] = '';
                $default_options['text'] = '';
                $default_options['target'] = '_self';
                $default_options['default'] = '';
                $default_options['size'] = 30;
                $default_options['max_length'] = 255;
                $default_options['description'] = '';
                break;
            case 'link':
                $default_options['text'] = '';
                $default_options['target'] = '_self';
                $default_options['link'] = '';
                $default_options['description'] = '';
                break;
            case 'module':
                $default_options['default'] = '';
                $default_options['text'] = '';
                $default_options['link'] = '';
                $default_options['description'] = '';
                break;
            case 'dropdown_from_module':
                $default_options['mod'] = '';
                $default_options['default'] = '';
                $default_options['first_value'] = '';
                $default_options['description'] = '';
                break;
            case 'file_selector':
                $default_options['filetypes'] = '';
                $default_options['excludeprefix'] = '';
                $default_options['recurse'] = '';
                $default_options['sortfiles'] = '';
                $default_options['dir'] = '';
                $default_options['preview'] = '';
                $default_options['description'] = '';
                break;
            case 'dropdown':
                $default_options['size'] = '';
                $default_options['multiple'] = '';
                $default_options['values'] = '';
                $default_options['default'] = '';
                $default_options['first_value'] = '';
                $default_options['description'] = '';
                $default_options['compact'] = '';
                break;
            case 'dropdown_from_udt':
                $default_options['size'] = 5;
                $default_options['multiple'] = '';
                $default_options['values'] = '';
                $default_options['default'] = '';
                $default_options['first_value'] = '';
                $default_options['udt'] = '';
                $default_options['description'] = '';
                $default_options['compact'] = '';
                break;
/*          case 'dropdown_from_gbc':
                $default_options['size'] = 5;
                $default_options['multiple'] = '';
                $default_options['values'] = '';
                $default_options['default'] = '';
                $default_options['first_value'] = '';
                $default_options['gbc'] = '';
                $default_options['description'] = '';
                $default_options['compact'] = '';
                break;
*/
            case 'dropdown_from_customgs':
                $default_options['multiple'] = '';
                $default_options['size'] = '';
                $default_options['customgs_field'] = '';
                $default_options['description'] = '';
                $default_options['compact'] = '';
                break;
            case 'textarea':
                $default_options['default'] = '';
                $default_options['rows'] = 20;
                $default_options['cols'] = 80;
                $default_options['description'] = '';
                break;
            case 'editor':
                $default_options['default'] = '';
                $default_options['rows'] = 20;
                $default_options['cols'] = 80;
                $default_options['description'] = '';
                break;
            case 'input':
                $default_options['default'] = '';
                $default_options['size'] = 30;
                $default_options['max_length'] = 255;
                $default_options['description'] = '';
                break;
            case 'sortablelist':
                $default_options['values'] = '';
                $default_options['first_value'] = '';
                $default_options['allowduplicates'] = false;
                $default_options['max_selected'] = -1;
                $default_options['label_left'] = '';
                $default_options['label_right'] = '';
                $default_options['udt'] = '';
                $default_options['description'] = '';
                $default_options['max_number'] = '';
                $default_options['required_number'] = '';
                break;
            case 'text':
                $default_options['text'] = '';
                $default_options['execute'] = '';
                $default_options['description'] = '';
                break;
            case 'pages':
                $default_options['default'] = '';
                $default_options['description'] = '';
                break;
            case 'checkbox':
                $default_options['default'] = 0;
                $default_options['description'] = '';
                break;
            case 'timepicker':
                $default_options['size'] = 10;
                $default_options['max_length'] = 10;
                $default_options['time_format'] = 'HH:mm';
                $default_options['description'] = '';
                break;
            case 'datepicker':
                $default_options['size'] = 20;
                $default_options['max_length'] = 20;
                $default_options['date_format'] = 'yy-mm-dd';
                $default_options['time_format'] = 'HH:mm';
                $default_options['time'] = false;
                $default_options['description'] = '';
                break;
            case 'radio':
                $default_options['multiple'] = '';
                $default_options['values'] = '';
                $default_options['default'] = -1;
                $default_options['inline'] = false;
                $default_options['description'] = '';
                break;
            case 'hr':
                $default_options['description'] = '';
                break;
            case 'image_picker':
                $default_options['description'] = '';
                break;
            case 'hidden':
                $default_options['value'] = '';
                break;
            case 'fieldset_start':
                $default_options['legend'] = '';
                $default_options['description'] = '';
                break;
            case 'gallery_picker':
                $default_options['dir'] = '';
                $default_options['description'] = '';
                break;
            case 'input_repeater':
                $default_options['default'] = '';
                $default_options['size'] = 50;
                $default_options['max_length'] = 255;
                $default_options['description'] = '';
                break;
        }
        return $default_options;
    }
}
