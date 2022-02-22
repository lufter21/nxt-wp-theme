<?php
/**
 * Nxt Customize Theme Menus
 *
 * @package Nxt
 */

 /**
  * Custom Menu Edit 
  */
if( is_admin() ){
    add_filter( 'wp_setup_nav_menu_item', function ($menu_item) {
        $menu_item->icon = get_post_meta( $menu_item->ID, '_menu_item_icon', true );
        $menu_item->target_hide = get_post_meta( $menu_item->ID, '_menu_item_target_hide', true );
        return $menu_item;
    });

    add_action( 'wp_update_nav_menu_item', function ($menu_id, $menu_item_db_id) {
        if ( is_array( $_REQUEST['menu-item-icon']) ) {
            $icon_value = $_REQUEST['menu-item-icon'][$menu_item_db_id];
            update_post_meta( $menu_item_db_id, '_menu_item_icon', $icon_value );
        }

        if ( is_array( $_REQUEST['menu-item-target-hide']) ) {
            $tg_hide_value = $_REQUEST['menu-item-target-hide'][$menu_item_db_id];
            update_post_meta( $menu_item_db_id, '_menu_item_target_hide', $tg_hide_value );
        }
    }, 10, 2);

	if( !class_exists('Walker_Nav_Menu_Edit') ) {
        require_once ABSPATH . 'wp-admin/includes/class-walker-nav-menu-edit.php';
    }

	class Custom_Walker_Nav_Menu_Edit extends Walker_Nav_Menu_Edit {
        /**
         * Start the element output.
         *
         * @see Walker_Nav_Menu::start_el()
         * @since 3.0.0
         * @since 5.9.0 Renamed `$item` to `$data_object` and `$id` to `$current_object_id`
         *              to match parent class for PHP 8 named parameter support.
         *
         * @global int $_wp_nav_menu_max_depth
         *
         * @param string   $output            Used to append additional content (passed by reference).
         * @param WP_Post  $data_object       Menu item data object.
         * @param int      $depth             Depth of menu item. Used for padding.
         * @param stdClass $args              Not used.
         * @param int      $current_object_id Optional. ID of the current menu item. Default 0.
         */
        public function start_el( &$output, $data_object, $depth = 0, $args = null, $current_object_id = 0 ) {
            global $_wp_nav_menu_max_depth;
    
            // Restores the more descriptive, specific name for use within this method.
            $menu_item              = $data_object;
            $_wp_nav_menu_max_depth = $depth > $_wp_nav_menu_max_depth ? $depth : $_wp_nav_menu_max_depth;
    
            ob_start();
            $item_id      = esc_attr( $menu_item->ID );
            $removed_args = array(
                'action',
                'customlink-tab',
                'edit-menu-item',
                'menu-item',
                'page-tab',
                '_wpnonce',
            );
    
            $original_title = false;
    
            if ( 'taxonomy' === $menu_item->type ) {
                $original_object = get_term( (int) $menu_item->object_id, $menu_item->object );
                if ( $original_object && ! is_wp_error( $original_object ) ) {
                    $original_title = $original_object->name;
                }
            } elseif ( 'post_type' === $menu_item->type ) {
                $original_object = get_post( $menu_item->object_id );
                if ( $original_object ) {
                    $original_title = get_the_title( $original_object->ID );
                }
            } elseif ( 'post_type_archive' === $menu_item->type ) {
                $original_object = get_post_type_object( $menu_item->object );
                if ( $original_object ) {
                    $original_title = $original_object->labels->archives;
                }
            }
    
            $classes = array(
                'menu-item menu-item-depth-' . $depth,
                'menu-item-' . esc_attr( $menu_item->object ),
                'menu-item-edit-' . ( ( isset( $_GET['edit-menu-item'] ) && $item_id === $_GET['edit-menu-item'] ) ? 'active' : 'inactive' ),
            );
    
            $title = $menu_item->title;
    
            if ( ! empty( $menu_item->_invalid ) ) {
                $classes[] = 'menu-item-invalid';
                /* translators: %s: Title of an invalid menu item. */
                $title = sprintf( __( '%s (Invalid)' ), $menu_item->title );
            } elseif ( isset( $menu_item->post_status ) && 'draft' === $menu_item->post_status ) {
                $classes[] = 'pending';
                /* translators: %s: Title of a menu item in draft status. */
                $title = sprintf( __( '%s (Pending)' ), $menu_item->title );
            }
    
            $title = ( ! isset( $menu_item->label ) || '' === $menu_item->label ) ? $title : $menu_item->label;
    
            $submenu_text = '';
            if ( 0 === $depth ) {
                $submenu_text = 'style="display: none;"';
            }
    
            ?>
            <li id="menu-item-<?php echo $item_id; ?>" class="<?php echo implode( ' ', $classes ); ?>">
                <div class="menu-item-bar">
                    <div class="menu-item-handle">
                        <label class="item-title" for="menu-item-checkbox-<?php echo $item_id; ?>">
                            <input id="menu-item-checkbox-<?php echo $item_id; ?>" type="checkbox" class="menu-item-checkbox" data-menu-item-id="<?php echo $item_id; ?>" disabled="disabled" />
                            <span class="menu-item-title"><?php echo esc_html( $title ); ?></span>
                            <span class="is-submenu" <?php echo $submenu_text; ?>><?php _e( 'sub item' ); ?></span>
                        </label>
                        <span class="item-controls">
                            <span class="item-type"><?php echo esc_html( $menu_item->type_label ); ?></span>
                            <span class="item-order hide-if-js">
                                <?php
                                printf(
                                    '<a href="%s" class="item-move-up" aria-label="%s">&#8593;</a>',
                                    wp_nonce_url(
                                        add_query_arg(
                                            array(
                                                'action'    => 'move-up-menu-item',
                                                'menu-item' => $item_id,
                                            ),
                                            remove_query_arg( $removed_args, admin_url( 'nav-menus.php' ) )
                                        ),
                                        'move-menu_item'
                                    ),
                                    esc_attr__( 'Move up' )
                                );
                                ?>
                                |
                                <?php
                                printf(
                                    '<a href="%s" class="item-move-down" aria-label="%s">&#8595;</a>',
                                    wp_nonce_url(
                                        add_query_arg(
                                            array(
                                                'action'    => 'move-down-menu-item',
                                                'menu-item' => $item_id,
                                            ),
                                            remove_query_arg( $removed_args, admin_url( 'nav-menus.php' ) )
                                        ),
                                        'move-menu_item'
                                    ),
                                    esc_attr__( 'Move down' )
                                );
                                ?>
                            </span>
                            <?php
                            if ( isset( $_GET['edit-menu-item'] ) && $item_id === $_GET['edit-menu-item'] ) {
                                $edit_url = admin_url( 'nav-menus.php' );
                            } else {
                                $edit_url = add_query_arg(
                                    array(
                                        'edit-menu-item' => $item_id,
                                    ),
                                    remove_query_arg( $removed_args, admin_url( 'nav-menus.php#menu-item-settings-' . $item_id ) )
                                );
                            }
    
                            printf(
                                '<a class="item-edit" id="edit-%s" href="%s" aria-label="%s"><span class="screen-reader-text">%s</span></a>',
                                $item_id,
                                $edit_url,
                                esc_attr__( 'Edit menu item' ),
                                __( 'Edit' )
                            );
                            ?>
                        </span>
                    </div>
                </div>
    
                <div class="menu-item-settings wp-clearfix" id="menu-item-settings-<?php echo $item_id; ?>">
                    <?php if ( 'custom' === $menu_item->type ) : ?>
                        <p class="field-url description description-wide">
                            <label for="edit-menu-item-url-<?php echo $item_id; ?>">
                                <?php _e( 'URL' ); ?><br />
                                <input type="text" id="edit-menu-item-url-<?php echo $item_id; ?>" class="widefat code edit-menu-item-url dd" name="menu-item-url[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $menu_item->url ); ?>" />
                            </label>
                        </p>
                    <?php endif; ?>
                    <p class="description description-wide">
                        <label for="edit-menu-item-title-<?php echo $item_id; ?>">
                            <?php _e( 'Navigation Label' ); ?><br />
                            <input type="text" id="edit-menu-item-title-<?php echo $item_id; ?>" class="widefat edit-menu-item-title" name="menu-item-title[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $menu_item->title ); ?>" />
                        </label>
                    </p>

                    <p class="description description-wide">
                        <label for="edit-menu-item-icon-<?php echo $item_id; ?>">
                            <?php _e( 'Image' ); ?><br />
                            <input type="text" id="edit-menu-item-icon-<?php echo $item_id; ?>" class="widefat edit-menu-item-icon" name="menu-item-icon[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $menu_item->icon ); ?>" />
                        </label>
                    </p>
                    <p class="field-link-target description">
                        <label for="edit-menu-item-target-hide-<?php echo $item_id; ?>">
                            <input type="checkbox" id="edit-menu-item-target-hide-<?php echo $item_id; ?>" value="_blank" name="menu-item-target-hide[<?php echo $item_id; ?>]"<?php checked( $menu_item->target_hide, '_blank' ); ?> />
                            <?php _e( 'Hide Navigation Label' ); ?>
                        </label>
                    </p>
                    
                    <p class="field-title-attribute field-attr-title description description-wide">
                        <label for="edit-menu-item-attr-title-<?php echo $item_id; ?>">
                            <?php _e( 'Title Attribute' ); ?><br />
                            <input type="text" id="edit-menu-item-attr-title-<?php echo $item_id; ?>" class="widefat edit-menu-item-attr-title" name="menu-item-attr-title[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $menu_item->post_excerpt ); ?>" />
                        </label>
                    </p>
                    <p class="field-link-target description">
                        <label for="edit-menu-item-target-<?php echo $item_id; ?>">
                            <input type="checkbox" id="edit-menu-item-target-<?php echo $item_id; ?>" value="_blank" name="menu-item-target[<?php echo $item_id; ?>]"<?php checked( $menu_item->target, '_blank' ); ?> />
                            <?php _e( 'Open link in a new tab' ); ?>
                        </label>
                    </p>
                    <p class="field-css-classes description description-thin">
                        <label for="edit-menu-item-classes-<?php echo $item_id; ?>">
                            <?php _e( 'CSS Classes (optional)' ); ?><br />
                            <input type="text" id="edit-menu-item-classes-<?php echo $item_id; ?>" class="widefat code edit-menu-item-classes" name="menu-item-classes[<?php echo $item_id; ?>]" value="<?php echo esc_attr( implode( ' ', $menu_item->classes ) ); ?>" />
                        </label>
                    </p>
                    <p class="field-xfn description description-thin">
                        <label for="edit-menu-item-xfn-<?php echo $item_id; ?>">
                            <?php _e( 'Link Relationship (XFN)' ); ?><br />
                            <input type="text" id="edit-menu-item-xfn-<?php echo $item_id; ?>" class="widefat code edit-menu-item-xfn" name="menu-item-xfn[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $menu_item->xfn ); ?>" />
                        </label>
                    </p>
                    <p class="field-description description description-wide">
                        <label for="edit-menu-item-description-<?php echo $item_id; ?>">
                            <?php _e( 'Description' ); ?><br />
                            <textarea id="edit-menu-item-description-<?php echo $item_id; ?>" class="widefat edit-menu-item-description" rows="3" cols="20" name="menu-item-description[<?php echo $item_id; ?>]"><?php echo esc_html( $menu_item->description ); // textarea_escaped ?></textarea>
                            <span class="description"><?php _e( 'The description will be displayed in the menu if the current theme supports it.' ); ?></span>
                        </label>
                    </p>
    
                    <?php
                    /**
                     * Fires just before the move buttons of a nav menu item in the menu editor.
                     *
                     * @since 5.4.0
                     *
                     * @param string        $item_id           Menu item ID as a numeric string.
                     * @param WP_Post       $menu_item         Menu item data object.
                     * @param int           $depth             Depth of menu item. Used for padding.
                     * @param stdClass|null $args              An object of menu item arguments.
                     * @param int           $current_object_id Nav menu ID.
                     */
                    do_action( 'wp_nav_menu_item_custom_fields', $item_id, $menu_item, $depth, $args, $current_object_id );
                    ?>
    
                    <fieldset class="field-move hide-if-no-js description description-wide">
                        <span class="field-move-visual-label" aria-hidden="true"><?php _e( 'Move' ); ?></span>
                        <button type="button" class="button-link menus-move menus-move-up" data-dir="up"><?php _e( 'Up one' ); ?></button>
                        <button type="button" class="button-link menus-move menus-move-down" data-dir="down"><?php _e( 'Down one' ); ?></button>
                        <button type="button" class="button-link menus-move menus-move-left" data-dir="left"></button>
                        <button type="button" class="button-link menus-move menus-move-right" data-dir="right"></button>
                        <button type="button" class="button-link menus-move menus-move-top" data-dir="top"><?php _e( 'To the top' ); ?></button>
                    </fieldset>
    
                    <div class="menu-item-actions description-wide submitbox">
                        <?php if ( 'custom' !== $menu_item->type && false !== $original_title ) : ?>
                            <p class="link-to-original">
                                <?php
                                /* translators: %s: Link to menu item's original object. */
                                printf( __( 'Original: %s' ), '<a href="' . esc_attr( $menu_item->url ) . '">' . esc_html( $original_title ) . '</a>' );
                                ?>
                            </p>
                        <?php endif; ?>
    
                        <?php
                        printf(
                            '<a class="item-delete submitdelete deletion" id="delete-%s" href="%s">%s</a>',
                            $item_id,
                            wp_nonce_url(
                                add_query_arg(
                                    array(
                                        'action'    => 'delete-menu-item',
                                        'menu-item' => $item_id,
                                    ),
                                    admin_url( 'nav-menus.php' )
                                ),
                                'delete-menu_item_' . $item_id
                            ),
                            __( 'Remove' )
                        );
                        ?>
                        <span class="meta-sep hide-if-no-js"> | </span>
                        <?php
                        printf(
                            '<a class="item-cancel submitcancel hide-if-no-js" id="cancel-%s" href="%s#menu-item-settings-%s">%s</a>',
                            $item_id,
                            esc_url(
                                add_query_arg(
                                    array(
                                        'edit-menu-item' => $item_id,
                                        'cancel'         => time(),
                                    ),
                                    admin_url( 'nav-menus.php' )
                                )
                            ),
                            $item_id,
                            __( 'Cancel' )
                        );
                        ?>
                    </div>
    
                    <input class="menu-item-data-db-id" type="hidden" name="menu-item-db-id[<?php echo $item_id; ?>]" value="<?php echo $item_id; ?>" />
                    <input class="menu-item-data-object-id" type="hidden" name="menu-item-object-id[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $menu_item->object_id ); ?>" />
                    <input class="menu-item-data-object" type="hidden" name="menu-item-object[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $menu_item->object ); ?>" />
                    <input class="menu-item-data-parent-id" type="hidden" name="menu-item-parent-id[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $menu_item->menu_item_parent ); ?>" />
                    <input class="menu-item-data-position" type="hidden" name="menu-item-position[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $menu_item->menu_order ); ?>" />
                    <input class="menu-item-data-type" type="hidden" name="menu-item-type[<?php echo $item_id; ?>]" value="<?php echo esc_attr( $menu_item->type ); ?>" />
                </div><!-- .menu-item-settings-->
                <ul class="menu-item-transport"></ul>
            <?php
            $output .= ob_get_clean();
        }
    }

    add_filter( 'wp_edit_nav_menu_walker', function ($walker, $menu_id) {
        return 'Custom_Walker_Nav_Menu_Edit';
    } , 10, 2 );
}

/**
 * Customize menus output Walker
 */
class Custom_Header_Menu extends Walker_Nav_Menu {
	public function start_lvl( &$output, $depth = 0, $args = array() ) {
		if ( isset( $args->item_spacing ) && 'discard' === $args->item_spacing ) {
			$t = '';
			$n = '';
		} else {
			$t = "\t";
			$n = "\n";
		}
		$indent = str_repeat( $t, $depth );

		$classes = array( 'sub-menu', 'nxt-menu__sub-menu' );

		$class_names = join( ' ', apply_filters( 'nav_menu_submenu_css_class', $classes, $args, $depth ) );
		$class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';

		$output .= "{$n}{$indent}<ul $class_names>{$n}";
	}

	public function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
		if ( isset( $args->item_spacing ) && 'discard' === $args->item_spacing ) {
			$t = '';
			$n = '';
		} else {
			$t = "\t";
			$n = "\n";
		}
		
		$indent = ( $depth ) ? str_repeat( $t, $depth ) : '';

		$classes = empty( $item->classes ) ? array() : (array) $item->classes;
		$classes[] = 'menu-item-' . $item->ID;

		$args = apply_filters( 'nav_menu_item_args', $args, $item, $depth );

		$class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args, $depth ) );

		$menu_item_class = ($depth) ? 'nxt-sub-menu__item ' : 'nxt-menu__item ';

		if (!$depth && !empty($args->walker->has_children)) {
			$menu_item_class .= 'nxt-menu__item_has-children ';
		}

		if ($depth && in_array('current-menu-item', $classes)) {
			$menu_item_class .= 'nxt-sub-menu__item_current ';
		} elseif (!$depth && in_array('current-menu-item', $classes)) {
			$menu_item_class .= 'nxt-menu__item_current ';
		}

		$class_names = $class_names ? ' class="'. $menu_item_class . esc_attr( $class_names ) . '"' : '';

		$id = apply_filters( 'nav_menu_item_id', 'menu-item-'. $item->ID, $item, $args, $depth );
		$id = $id ? ' id="' . esc_attr( $id ) . '"' : '';

		$output .= $indent . '<li' . $id . $class_names .'>';

		$atts = array();
		$atts['title']  = ! empty( $item->attr_title ) ? $item->attr_title : '';
		$atts['target'] = ! empty( $item->target )     ? $item->target     : '';
		$atts['rel']    = ! empty( $item->xfn )        ? $item->xfn        : '';
		$atts['href']   = ! empty( $item->url )        ? $item->url        : '';

		$atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args, $depth );

		$attributes = '';
		foreach ( $atts as $attr => $value ) {
			if ( ! empty( $value ) ) {
				$value = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
				$attributes .= ' ' . $attr . '="' . $value . '"';
			}
		}

        $icon = get_post_meta( $item->ID, '_menu_item_icon', true );
        $target_hide = get_post_meta( $item->ID, '_menu_item_target_hide', true );

		$title = apply_filters( 'the_title', $item->title, $item->ID );

		$title = apply_filters( 'nav_menu_item_title', $title, $item, $args, $depth );

		$menu_a_class = ($depth) ? 'nxt-sub-menu__a' : 'nxt-menu__a';

		$item_output = $args->before;

		$item_output .= '<a'. $attributes .' class="'. $menu_a_class .'">';

        if (!empty($icon) && $target_hide) {
            $item_output .= '<i class="nxt-menu-icon"><svg><use xlink:href="'. get_template_directory_uri() . '/images/sprite-symbol.svg#'. $icon .'"></use></svg></i>';
        } else {
            $item_output .= $args->link_before . $title . $args->link_after;
        }

		$item_output .= '</a>'.((!$depth) ? ' <button class="nxt-menu__arr"></button>' : '');

        if (!empty($icon) && !$target_hide) {
            $item_output .= '<i class="nxt-menu-icon"><svg><use xlink:href="'. get_template_directory_uri() . '/images/sprite-symbol.svg#'. $icon .'"></use></svg></i>';
        }

		$item_output .= $args->after;

		$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
	}
}