const { registerPlugin } = wp.plugins;

const renderInsecureContentWarnings = () => {
	if ( typeof wp.editPost.PluginPostStatusInfo === 'undefined' ) {
		return null;
	}
	const { PluginPostStatusInfo } = wp.editPost;
	const insecureWarnings = [];
	return wp.element.createElement( PluginPostStatusInfo, insecureWarnings	);
};

registerPlugin( 'insecure-content-warning-status-panel', { render: renderInsecureContentWarnings } );

