import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

const hideElement = (hide, element) => {
	if (hide) {
		element.classList.add('hidden');
		element.setAttribute('aria-hidden', 'true');
	} else {
		element.classList.remove('hidden');
		element.setAttribute('aria-hidden', 'false');
	}
};

document
	.querySelector('#icw-fix-content-btn')
	.addEventListener('click', async (event) => {
		event.preventDefault();

		const postSelection = document.querySelector(
			'#icw-post-selection'
		).value;
		const postIds = document.querySelector('#icw-post-ids').value;
		const postType = document.querySelector('#icw-post-type').value;
		const batchSize = +document.querySelector('#icw-batch-size').value;
		const dryRun = document.querySelector('#icw-dry-run').checked;
		const log = document.querySelector('#icw-fix-log');
		const loadingSpinner = document.querySelector('#icw-loading-spinner');
		const btn = document.querySelector('#icw-fix-content-btn');

		const toggleSpinnerVisibility = () => {
			loadingSpinner.classList.toggle('hidden');
			loadingSpinner.setAttribute('aria-hidden', 'true');
		};

		const disableButton = (disable) => {
			if (disable) {
				btn.setAttribute('disabled', '');
			} else {
				btn.removeAttribute('disabled');
			}
		};

		const setLogHTML = (html) => {
			log.innerHTML = html;

			log.scrollTop = log.scrollHeight;
		};

		toggleSpinnerVisibility();
		disableButton(true);
		setLogHTML('');
		hideElement(true, log);

		const count = await apiFetch({
			path: `/icw/v1/count-for-fix`,
			method: 'POST',
			data: {
				postSelection,
				postIds: postSelection === 'posts' ? postIds : false,
				postType:
					postSelection === 'all_from_post_type' ? postType : '',
				batchSize,
			},
		});

		const times = Math.ceil(count / batchSize);

		hideElement(false, log);

		const getProgressBar = (time, __times, __batchSize, __count) => {
			const progressBarMax = 50;
			const percentage = time > 0 ? Math.ceil((100 / __times) * time) : 0;
			const value = (percentage * progressBarMax) / 100;
			const completed = time !== __times ? __batchSize * time : __count;
			return `<span>[${'#'.repeat(value)}${'-'.repeat(
				progressBarMax - value
			)}] | ${percentage}% || ${completed}/${__count} ${__(
				'posts',
				'insecure-content-warning'
			)}</span>`;
		};

		setLogHTML(getProgressBar(0, times, batchSize, count));
		let innerHTML = '';
		for (let i = 1; i <= times; i++) {
			// eslint-disable-next-line no-await-in-loop
			const data = await apiFetch({
				path: `/icw/v1/fix`,
				method: 'POST',
				data: {
					postSelection,
					postIds: postSelection === 'posts' ? postIds : false,
					postType:
						postSelection === 'all_from_post_type' ? postType : '',
					batchSize,
					offset: (i - 1) * batchSize,
					dryRun,
				},
			});

			innerHTML += data;
			setLogHTML(innerHTML + getProgressBar(i, times, batchSize, count));
		}

		toggleSpinnerVisibility();
		disableButton(false);
	});

document.querySelector('#icw-post-selection').addEventListener('change', () => {
	const postSelection = document.querySelector('#icw-post-selection').value;

	const hidePostIdsRow = (hide) => {
		const postIdsRow = document.querySelector('#icw-post-ids-row');
		hideElement(hide, postIdsRow);
	};

	const hidePostTypeRow = (hide) => {
		const postTypeRow = document.querySelector('#icw-post-type-row');
		hideElement(hide, postTypeRow);
	};

	switch (postSelection) {
		case 'all':
			hidePostIdsRow(true);
			hidePostTypeRow(true);
			break;
		case 'posts':
			hidePostIdsRow(false);
			hidePostTypeRow(true);
			break;
		case 'all_from_post_type':
			hidePostTypeRow(false);
			hidePostIdsRow(true);
			break;
		default:
			break;
	}
});
