'use strict';

const GRIDSTACK_DIR = 'node_modules/gridstack/dist';

module.exports = {
	name: require('./package').name,

	included(app) {
		this._super.included.apply(this, arguments);

		app.import(`${GRIDSTACK_DIR}/gridstack-h5.js`, {
			using: [{ transformation: 'amd', as: 'gridstack-h5' }],
		});

		app.import(`${GRIDSTACK_DIR}/gridstack.css`);
		app.import(`${GRIDSTACK_DIR}/gridstack-extra.css`);
	},
};
