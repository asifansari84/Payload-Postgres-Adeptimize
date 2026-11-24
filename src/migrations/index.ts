import * as migration_20261119_132701_posts_editor from './20261119_132701_posts_editor';
import * as migration_20261119_140408_page_builder_and_site_chrome from './20261119_140408_page_builder_and_site_chrome';
import * as migration_20261120_045819_home_hero_tab from './20261120_045819_home_hero_tab';
import * as migration_20261120_051059_home_section_tabs from './20261120_051059_home_section_tabs';
import * as migration_20261120_051926_home_all_section_tabs from './20261120_051926_home_all_section_tabs';
import * as migration_20261120_052809_trust_logo_links from './20261120_052809_trust_logo_links';
import * as migration_20261120_061938_about_contact_blog_tabs from './20261120_061938_about_contact_blog_tabs';
import * as migration_20261120_062615_contact_map from './20261120_062615_contact_map';
import * as migration_20261120_063525_header_fullscreen_menu from './20261120_063525_header_fullscreen_menu';
import * as migration_20261120_065417_services_locations from './20261120_065417_services_locations';
import * as migration_20261120_083541_listing_sections from './20261120_083541_listing_sections';
import * as migration_20261120_090804_location_page_slider from './20261120_090804_location_page_slider';
import * as migration_20261120_092717_services_page_sections from './20261120_092717_services_page_sections';
import * as migration_20261120_093103_services_grid from './20261120_093103_services_grid';
import * as migration_20261120_093725_remove_services_grid from './20261120_093725_remove_services_grid';
import * as migration_20261120_094055_location_slider_only from './20261120_094055_location_slider_only';
import * as migration_20261123_050801_optional_excerpt_and_alt from './20261123_050801_optional_excerpt_and_alt';
import * as migration_20261123_093604_post_categories from './20261123_093604_post_categories';
import * as migration_20261123_095000_post_author_user from './20261123_095000_post_author_user';
import * as migration_20261123_103156_user_username_avatar from './20261123_103156_user_username_avatar';
import * as migration_20261123_103641_user_display_name from './20261123_103641_user_display_name';
import * as migration_20261123_124003_site_settings from './20261123_124003_site_settings';
import * as migration_20261123_131704_single_admin_logo from './20261123_131704_single_admin_logo';
import * as migration_20261123_131706_admin_logo_tone from './20261123_131706_admin_logo_tone';
import * as migration_20261123_132118_remove_admin_logo_tone from './20261123_132118_remove_admin_logo_tone';
import * as migration_20261123_132626_site_favicon from './20261123_132626_site_favicon';
import * as migration_20261123_135154_discourage_search_engines from './20261123_135154_discourage_search_engines';
import * as migration_20261123_135942_content_trash from './20261123_135942_content_trash';
import * as migration_20261124_122734_lead_source_url from './20261124_122734_lead_source_url';
import * as migration_20261124_135627_user_social_links from './20261124_135627_user_social_links';
import * as migration_20261124_140918_user_bio from './20261124_140918_user_bio';

export const migrations = [
  {
    up: migration_20261119_132701_posts_editor.up,
    down: migration_20261119_132701_posts_editor.down,
    name: '20261119_132701_posts_editor',
  },
  {
    up: migration_20261119_140408_page_builder_and_site_chrome.up,
    down: migration_20261119_140408_page_builder_and_site_chrome.down,
    name: '20261119_140408_page_builder_and_site_chrome',
  },
  {
    up: migration_20261120_045819_home_hero_tab.up,
    down: migration_20261120_045819_home_hero_tab.down,
    name: '20261120_045819_home_hero_tab',
  },
  {
    up: migration_20261120_051059_home_section_tabs.up,
    down: migration_20261120_051059_home_section_tabs.down,
    name: '20261120_051059_home_section_tabs',
  },
  {
    up: migration_20261120_051926_home_all_section_tabs.up,
    down: migration_20261120_051926_home_all_section_tabs.down,
    name: '20261120_051926_home_all_section_tabs',
  },
  {
    up: migration_20261120_052809_trust_logo_links.up,
    down: migration_20261120_052809_trust_logo_links.down,
    name: '20261120_052809_trust_logo_links',
  },
  {
    up: migration_20261120_061938_about_contact_blog_tabs.up,
    down: migration_20261120_061938_about_contact_blog_tabs.down,
    name: '20261120_061938_about_contact_blog_tabs',
  },
  {
    up: migration_20261120_062615_contact_map.up,
    down: migration_20261120_062615_contact_map.down,
    name: '20261120_062615_contact_map',
  },
  {
    up: migration_20261120_063525_header_fullscreen_menu.up,
    down: migration_20261120_063525_header_fullscreen_menu.down,
    name: '20261120_063525_header_fullscreen_menu',
  },
  {
    up: migration_20261120_065417_services_locations.up,
    down: migration_20261120_065417_services_locations.down,
    name: '20261120_065417_services_locations',
  },
  {
    up: migration_20261120_083541_listing_sections.up,
    down: migration_20261120_083541_listing_sections.down,
    name: '20261120_083541_listing_sections',
  },
  {
    up: migration_20261120_090804_location_page_slider.up,
    down: migration_20261120_090804_location_page_slider.down,
    name: '20261120_090804_location_page_slider',
  },
  {
    up: migration_20261120_092717_services_page_sections.up,
    down: migration_20261120_092717_services_page_sections.down,
    name: '20261120_092717_services_page_sections',
  },
  {
    up: migration_20261120_093103_services_grid.up,
    down: migration_20261120_093103_services_grid.down,
    name: '20261120_093103_services_grid',
  },
  {
    up: migration_20261120_093725_remove_services_grid.up,
    down: migration_20261120_093725_remove_services_grid.down,
    name: '20261120_093725_remove_services_grid',
  },
  {
    up: migration_20261120_094055_location_slider_only.up,
    down: migration_20261120_094055_location_slider_only.down,
    name: '20261120_094055_location_slider_only',
  },
  {
    up: migration_20261123_050801_optional_excerpt_and_alt.up,
    down: migration_20261123_050801_optional_excerpt_and_alt.down,
    name: '20261123_050801_optional_excerpt_and_alt',
  },
  {
    up: migration_20261123_093604_post_categories.up,
    down: migration_20261123_093604_post_categories.down,
    name: '20261123_093604_post_categories',
  },
  {
    up: migration_20261123_095000_post_author_user.up,
    down: migration_20261123_095000_post_author_user.down,
    name: '20261123_095000_post_author_user',
  },
  {
    up: migration_20261123_103156_user_username_avatar.up,
    down: migration_20261123_103156_user_username_avatar.down,
    name: '20261123_103156_user_username_avatar',
  },
  {
    up: migration_20261123_103641_user_display_name.up,
    down: migration_20261123_103641_user_display_name.down,
    name: '20261123_103641_user_display_name',
  },
  {
    up: migration_20261123_124003_site_settings.up,
    down: migration_20261123_124003_site_settings.down,
    name: '20261123_124003_site_settings',
  },
  {
    up: migration_20261123_131704_single_admin_logo.up,
    down: migration_20261123_131704_single_admin_logo.down,
    name: '20261123_131704_single_admin_logo',
  },
  {
    up: migration_20261123_131706_admin_logo_tone.up,
    down: migration_20261123_131706_admin_logo_tone.down,
    name: '20261123_131706_admin_logo_tone',
  },
  {
    up: migration_20261123_132118_remove_admin_logo_tone.up,
    down: migration_20261123_132118_remove_admin_logo_tone.down,
    name: '20261123_132118_remove_admin_logo_tone',
  },
  {
    up: migration_20261123_132626_site_favicon.up,
    down: migration_20261123_132626_site_favicon.down,
    name: '20261123_132626_site_favicon',
  },
  {
    up: migration_20261123_135154_discourage_search_engines.up,
    down: migration_20261123_135154_discourage_search_engines.down,
    name: '20261123_135154_discourage_search_engines',
  },
  {
    up: migration_20261123_135942_content_trash.up,
    down: migration_20261123_135942_content_trash.down,
    name: '20261123_135942_content_trash',
  },
  {
    up: migration_20261124_122734_lead_source_url.up,
    down: migration_20261124_122734_lead_source_url.down,
    name: '20261124_122734_lead_source_url',
  },
  {
    up: migration_20261124_135627_user_social_links.up,
    down: migration_20261124_135627_user_social_links.down,
    name: '20261124_135627_user_social_links',
  },
  {
    up: migration_20261124_140918_user_bio.up,
    down: migration_20261124_140918_user_bio.down,
    name: '20261124_140918_user_bio'
  },
];
