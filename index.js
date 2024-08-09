/**
 * CRUD Generator
 */

/* eslint strict: ["off"] */

'use strict';
const pluralize = require('pluralize');

/**
 * Every path required across generators
 * @type {string}
 */
const ACTIONS_PATH = '../../app/actions';
const API_PATH = '../../app/api';
const ACTION_TYPES_PATH = '../../app/constants/actionTypes';
const REDUCERS_PATH = '../../app/reducers';
const SAGAS_PATH = '../../app/sagas';
const SELECTORS_PATH = '../../app/selectors';

module.exports = {
	description: 'Add all files needed for crud',
	prompts: [
		{
			type: 'input',
			name: 'modelName',
			message: 'What is the name of your model?',
			validate: (modelName) => {
				if (!modelName) {
					return 'The model name is required';
				}

				const isCamelcase = /^([a-z]+)(([A-Z]([a-z]+))+)$/.test(modelName);
				const isLowercase = modelName === modelName.toLowerCase();

				if ((!isLowercase && !isCamelcase) || !pluralize.isSingular(modelName)) {
					return 'Model names are always lowercase and singular';
				}
				return true;
			},
			filter: (modelName) => modelName.trim(),
		},
		{
			type: 'confirm',
			name: 'all',
			default: true,
			message: 'Do you want to create code for all standard CRUD operations?',
		},
		{
			when: function (response) {
				return response.all === false;
			},
			type: 'confirm',
			name: 'get',
			default: true,
			message: 'Do you want to create code for GET?',
		},
		{
			when: function (response) {
				return response.all === false;
			},
			type: 'confirm',
			name: 'post',
			default: true,
			message: 'Do you want to create code for POST?',
		},
		{
			when: function (response) {
				return response.all === false;
			},
			type: 'confirm',
			name: 'put',
			default: true,
			message: 'Do you want to create code for PUT?',
		},
		{
			when: function (response) {
				return response.all === false;
			},
			type: 'confirm',
			name: 'delete',
			default: true,
			message: 'Do you want to create code for DELETE?',
		},
	],
	actions: [
		{
			type: 'add',
			path: API_PATH + '/{{modelName}}/crud.js',
			templateFile: './endpointGenerator/apiTemplates/crud.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: API_PATH + '/{{modelName}}/index.js',
			templateFile: './endpointGenerator/apiTemplates/index.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'modify',
			pattern: /\nexport/g,
			path: API_PATH + '/index.js',
			template: "import * as {{modelName}} from './{{modelName}}';\n\n" + 'export',
			abortOnFail: true,
		},
		{
			type: 'modify',
			pattern: /(,\n};)/,
			path: API_PATH + '/index.js',
			template: ',\n\t...{{modelName}},\n' + '};',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: ACTION_TYPES_PATH + '/{{modelName}}.js',
			templateFile: './endpointGenerator/actionType.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'modify',
			pattern: /(\/\/ IMPORT OTHER ACTIONS)/g,
			path: ACTION_TYPES_PATH + '/index.js',
			template: "$1\nimport {{modelName}}Actions from './{{modelName}}';",
			abortOnFail: true,
		},
		{
			type: 'modify',
			pattern: /(,\n};)/g,
			path: ACTION_TYPES_PATH + '/index.js',
			template: ',\n\t...{{modelName}}Actions,\n' + '};',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: ACTIONS_PATH + '/{{modelName}}.js',
			templateFile: './endpointGenerator/action.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: ACTIONS_PATH + '/tests/{{modelName}}.test.js',
			templateFile: './endpointGenerator/testTemplates/action.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: SAGAS_PATH + '/{{modelName}}.js',
			templateFile: './endpointGenerator/saga.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: SAGAS_PATH + '/tests/{{modelName}}.test.js',
			templateFile: './endpointGenerator/testTemplates/saga.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: REDUCERS_PATH + '/{{modelName}}.js',
			templateFile: './endpointGenerator/reducer.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: REDUCERS_PATH + '/tests/{{modelName}}.test.js',
			templateFile: './endpointGenerator/testTemplates/reducer.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'modify',
			pattern: /(\nimport history from 'utils\/history';)/g,
			path: '../../app/reducers.js',
			template: "$1\nimport {{modelName}}Reducer from 'reducers/{{modelName}}';",
			abortOnFail: true,
		},
		{
			type: 'modify',
			pattern: /(\t\t...injectedReducers,)/g,
			path: '../../app/reducers.js',
			template: '$1\n\t\t{{modelName}}: {{modelName}}Reducer,',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: SELECTORS_PATH + '/{{modelName}}.js',
			templateFile: './endpointGenerator/selector.js.hbs',
			abortOnFail: true,
		},
		{
			type: 'add',
			path: SELECTORS_PATH + '/tests/{{modelName}}.test.js',
			templateFile: './endpointGenerator/testTemplates/selector.js.hbs',
			abortOnFail: true,
		},
		/*{
			type: 'command',
			command: 'eslint',
			//!!!! This currently lints the entire application //todo make it only lint the affected paths
		},*/
	],
};
