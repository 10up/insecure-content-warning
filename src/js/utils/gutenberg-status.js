const { __ } = wp.i18n;
const { CheckboxControl } = wp.components;
const { useState } = wp.element;
const { PluginPostStatusInfo } = wp.editPost;
const { registerPlugin } = wp.plugins;

export const registerInsecureContentPlugin = (insecureElementURLs) => {
	const renderInsecureContentWarnings = () => {
		const [isChecked, setChecked] = useState(false); // eslint-disable-line react-hooks/rules-of-hooks

		return (
			<PluginPostStatusInfo className="insecure-warnings-panel">
				<p>{__('Insecure Warnings')}</p>
				<ol className="js-icw-errors">
					{insecureElementURLs.map((element, i) => {
						return (
							<li>
								{element}
								<button
									data-check={insecureElementURLs[i]}
									className="gutenberg-js-icw-check components-button is-secondary"
									type="button"
								>
									{insecureContentAdmin.checkHttps}
								</button>
								<img
									alt="Loading"
									src={insecureContentAdmin.spinner}
									className="js-icw-spinner"
								/>
								<span className="js-icw-fixed">
									{insecureContentAdmin.success}!
								</span>
								<span className="js-icw-error">
									{insecureContentAdmin.imageNotFound}
								</span>
							</li>
						);
					})}
				</ol>

				<CheckboxControl
					className="js-icw-force-checkbox"
					label={insecureContentAdmin.disclaimer}
					checked={isChecked}
					onChange={setChecked}
				/>
			</PluginPostStatusInfo>
		);
	};

	registerPlugin('insecure-warnings', { render: renderInsecureContentWarnings });
};
