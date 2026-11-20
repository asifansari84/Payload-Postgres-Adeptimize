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
    name: '20261120_094055_location_slider_only'
  },
];
