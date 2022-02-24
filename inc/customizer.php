<?php
/**
 * nxt Theme Customizer
 *
 * @package nxt
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function nxt_customize_register( $wp_customize ) {
	$transport = 'postMessage';
	
	$wp_customize->get_setting( 'blogname' )->transport = $transport;
	$wp_customize->get_setting( 'blogdescription' )->transport = $transport;
	$wp_customize->get_setting( 'header_textcolor' )->transport = $transport;

	if ( isset( $wp_customize->selective_refresh ) ) {
		$wp_customize->selective_refresh->add_partial(
			'blogname',
			array(
				'selector'        => '.site-title a',
				'render_callback' => 'nxt_customize_partial_blogname',
			)
		);
		$wp_customize->selective_refresh->add_partial(
			'blogdescription',
			array(
				'selector'        => '.site-description',
				'render_callback' => 'nxt_customize_partial_blogdescription',
			)
		);
		$wp_customize->selective_refresh->add_partial(
			'navmenu',
			array(
				'selector'        => '.nxt-menu',
				'render_callback' => 'nxt_customize_partial_navmenu',
			)
		);
	}

	$wp_customize->add_setting( 'example_prop' , array(
        'default'   => '#565665',
        'transport' => 'refresh',
    ) );
	$wp_customize->add_setting( 'example_prop2' , array(
        'transport' => 'refresh',
    ) );

	$wp_customize->add_panel( 'example_panel', array(
		'title' => __( 'Моя панель настроек', 'nxt' ),
		'description' => 'descr', // Include html tags such as <p>.
		'priority' => 3, // Mixed with top-level-section hierarchy.
	  ) );

	$wp_customize->add_section(
        'example_section_one',
        array(
            'title' => 'Мои настройки',
            'description' => 'Пример секции',
            'priority' => 11,
			'panel'=>'example_panel'
        )
    );
	
	$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'link_color', array(
		'label'      => __( 'Header Color', 'nxt' ),
		'section'    => 'example_section_one',
		'settings'   => 'example_prop',
	) ) );
	
}

add_action( 'customize_register', 'nxt_customize_register');

/**
 * Render the site title for the selective refresh partial.
 *
 * @return void
 */
function nxt_customize_partial_blogname() {
	bloginfo( 'name' );
}

/**
 * Render the site tagline for the selective refresh partial.
 *
 * @return void
 */
function nxt_customize_partial_blogdescription() {
	bloginfo( 'description' );
}

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function nxt_customize_preview_js() {
	wp_enqueue_script( 'nxt-customizer', get_template_directory_uri() . '/js/customizer.js', array( 'customize-preview' ), _S_VERSION, true );
}
add_action( 'customize_preview_init', 'nxt_customize_preview_js' );