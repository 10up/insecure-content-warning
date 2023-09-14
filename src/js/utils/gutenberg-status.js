import { __ } from '@wordpress/i18n';
import { CheckboxControl } from '@wordpress/components';
import { dispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { PluginPostStatusInfo } from '@wordpress/edit-post';
import { registerPlugin } from '@wordpress/plugins';

export const registerInsecureContentPlugin = (insecureElementURLs) => {
	const renderInsecureContentWarnings = () => {
		const [isChecked, setChecked] = useState(false); // eslint-disable-line react-hooks/rules-of-hooks

		return (
			<PluginPostStatusInfo className="insecure-warnings-panel">
				<p>{__('Insecure Warnings', 'insecure-content-warning')}</p>
				<ol className="js-icw-errors">
					{insecureElementURLs.map((element, i) => {
						return (
							<li className="icw-list-item" key={i}>
								{element}
								<button
									data-check={insecureElementURLs[i]}
									className="gutenberg-js-icw-view components-button is-secondary"
									type="button"
								>
									{__(
										'View element',
										'insecure-content-warning'
									)}
								</button>
								<button
									data-check={insecureElementURLs[i]}
									className="gutenberg-js-icw-check components-button is-secondary"
									type="button"
								>
									{__('Fix this', 'insecure-content-warning')}
								</button>
								<img
									alt="Loading"
									src={insecureContentAdmin.spinner}
									className="js-icw-spinner"
								/>
								<span className="js-icw-fixed">
									{__('Success!', 'insecure-content-warning')}
								</span>
								<span className="js-icw-error">
									{__(
										'Unable to find https:// equivalent. Please replace manually.',
										'insecure-content-warning'
									)}
								</span>
							</li>
						);
					})}
				</ol>

				<CheckboxControl
					className="js-icw-force-checkbox"
					label={__(
						'Publish with insecure assets',
						'insecure-content-warning'
					)}
					checked={isChecked}
					onChange={(checked) => {
						setChecked(checked);

						// Lock and unlock saving
						if (checked) {
							dispatch('core/editor').unlockPostSaving(
								'insecureContentWarning'
							);
						} else {
							dispatch('core/editor').lockPostSaving(
								'insecureContentWarning'
							);
						}
					}}
				/>
			</PluginPostStatusInfo>
		);
	};

	registerPlugin('insecure-warnings', {
		render: renderInsecureContentWarnings,
	});
};
