const { registerPlugin } = wp.plugins;

const renderInsecureContentWarnings = () => {
	if ( typeof wp.editPost.PluginPostStatusInfo === 'undefined' ) {
		return null;
	}
	const { PluginPostStatusInfo } = wp.editPost;
	const insecureWarnings = [];
	return wp.element.createElement( PluginPostStatusInfo, insecureWarnings	);
};

registerPlugin( 'distributor-status-panel', { render: renderInsecureContentWarnings } );

