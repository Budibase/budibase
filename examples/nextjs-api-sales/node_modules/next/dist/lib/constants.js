"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ESLINT_PROMPT_VALUES = exports.ESLINT_DEFAULT_DIRS = exports.SSG_FALLBACK_EXPORT_ERROR = exports.NON_STANDARD_NODE_ENV = exports.GSSP_COMPONENT_MEMBER_ERROR = exports.UNSTABLE_REVALIDATE_RENAME_ERROR = exports.GSSP_NO_RETURNED_VALUE = exports.GSP_NO_RETURNED_VALUE = exports.SERVER_PROPS_EXPORT_ERROR = exports.STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR = exports.SERVER_PROPS_SSG_CONFLICT = exports.SERVER_PROPS_GET_INIT_PROPS_CONFLICT = exports.SSG_GET_INITIAL_PROPS_CONFLICT = exports.PUBLIC_DIR_MIDDLEWARE_CONFLICT = exports.DOT_NEXT_ALIAS = exports.PAGES_DIR_ALIAS = exports.MIDDLEWARE_ROUTE = exports.API_ROUTE = exports.NEXT_PROJECT_ROOT_DIST_SERVER = exports.NEXT_PROJECT_ROOT_DIST_CLIENT = exports.NEXT_PROJECT_ROOT_NODE_MODULES = exports.NEXT_PROJECT_ROOT_DIST = exports.NEXT_PROJECT_ROOT = void 0;
var _path = require("path");
const NEXT_PROJECT_ROOT = (0, _path).join(__dirname, '..', '..');
exports.NEXT_PROJECT_ROOT = NEXT_PROJECT_ROOT;
const NEXT_PROJECT_ROOT_DIST = (0, _path).join(NEXT_PROJECT_ROOT, 'dist');
exports.NEXT_PROJECT_ROOT_DIST = NEXT_PROJECT_ROOT_DIST;
const NEXT_PROJECT_ROOT_NODE_MODULES = (0, _path).join(NEXT_PROJECT_ROOT, 'node_modules');
exports.NEXT_PROJECT_ROOT_NODE_MODULES = NEXT_PROJECT_ROOT_NODE_MODULES;
const NEXT_PROJECT_ROOT_DIST_CLIENT = (0, _path).join(NEXT_PROJECT_ROOT_DIST, 'client');
exports.NEXT_PROJECT_ROOT_DIST_CLIENT = NEXT_PROJECT_ROOT_DIST_CLIENT;
const NEXT_PROJECT_ROOT_DIST_SERVER = (0, _path).join(NEXT_PROJECT_ROOT_DIST, 'server');
exports.NEXT_PROJECT_ROOT_DIST_SERVER = NEXT_PROJECT_ROOT_DIST_SERVER;
const API_ROUTE = /^\/api(?:\/|$)/;
exports.API_ROUTE = API_ROUTE;
const MIDDLEWARE_ROUTE = /_middleware$/;
exports.MIDDLEWARE_ROUTE = MIDDLEWARE_ROUTE;
const PAGES_DIR_ALIAS = 'private-next-pages';
exports.PAGES_DIR_ALIAS = PAGES_DIR_ALIAS;
const DOT_NEXT_ALIAS = 'private-dot-next';
exports.DOT_NEXT_ALIAS = DOT_NEXT_ALIAS;
const PUBLIC_DIR_MIDDLEWARE_CONFLICT = `You can not have a '_next' folder inside of your public folder. This conflicts with the internal '/_next' route. https://nextjs.org/docs/messages/public-next-folder-conflict`;
exports.PUBLIC_DIR_MIDDLEWARE_CONFLICT = PUBLIC_DIR_MIDDLEWARE_CONFLICT;
const SSG_GET_INITIAL_PROPS_CONFLICT = `You can not use getInitialProps with getStaticProps. To use SSG, please remove your getInitialProps`;
exports.SSG_GET_INITIAL_PROPS_CONFLICT = SSG_GET_INITIAL_PROPS_CONFLICT;
const SERVER_PROPS_GET_INIT_PROPS_CONFLICT = `You can not use getInitialProps with getServerSideProps. Please remove getInitialProps.`;
exports.SERVER_PROPS_GET_INIT_PROPS_CONFLICT = SERVER_PROPS_GET_INIT_PROPS_CONFLICT;
const SERVER_PROPS_SSG_CONFLICT = `You can not use getStaticProps or getStaticPaths with getServerSideProps. To use SSG, please remove getServerSideProps`;
exports.SERVER_PROPS_SSG_CONFLICT = SERVER_PROPS_SSG_CONFLICT;
const STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR = `can not have getInitialProps/getServerSideProps, https://nextjs.org/docs/messages/404-get-initial-props`;
exports.STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR = STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR;
const SERVER_PROPS_EXPORT_ERROR = `pages with \`getServerSideProps\` can not be exported. See more info here: https://nextjs.org/docs/messages/gssp-export`;
exports.SERVER_PROPS_EXPORT_ERROR = SERVER_PROPS_EXPORT_ERROR;
const GSP_NO_RETURNED_VALUE = 'Your `getStaticProps` function did not return an object. Did you forget to add a `return`?';
exports.GSP_NO_RETURNED_VALUE = GSP_NO_RETURNED_VALUE;
const GSSP_NO_RETURNED_VALUE = 'Your `getServerSideProps` function did not return an object. Did you forget to add a `return`?';
exports.GSSP_NO_RETURNED_VALUE = GSSP_NO_RETURNED_VALUE;
const UNSTABLE_REVALIDATE_RENAME_ERROR = 'The `unstable_revalidate` property is available for general use.\n' + 'Please use `revalidate` instead.';
exports.UNSTABLE_REVALIDATE_RENAME_ERROR = UNSTABLE_REVALIDATE_RENAME_ERROR;
const GSSP_COMPONENT_MEMBER_ERROR = `can not be attached to a page's component and must be exported from the page. See more info here: https://nextjs.org/docs/messages/gssp-component-member`;
exports.GSSP_COMPONENT_MEMBER_ERROR = GSSP_COMPONENT_MEMBER_ERROR;
const NON_STANDARD_NODE_ENV = `You are using a non-standard "NODE_ENV" value in your environment. This creates inconsistencies in the project and is strongly advised against. Read more: https://nextjs.org/docs/messages/non-standard-node-env`;
exports.NON_STANDARD_NODE_ENV = NON_STANDARD_NODE_ENV;
const SSG_FALLBACK_EXPORT_ERROR = `Pages with \`fallback\` enabled in \`getStaticPaths\` can not be exported. See more info here: https://nextjs.org/docs/messages/ssg-fallback-true-export`;
exports.SSG_FALLBACK_EXPORT_ERROR = SSG_FALLBACK_EXPORT_ERROR;
const ESLINT_DEFAULT_DIRS = [
    'pages',
    'components',
    'lib',
    'src/pages',
    'src/components',
    'src/lib', 
];
exports.ESLINT_DEFAULT_DIRS = ESLINT_DEFAULT_DIRS;
const ESLINT_PROMPT_VALUES = [
    {
        title: 'Strict',
        recommended: true,
        config: {
            extends: 'next/core-web-vitals'
        }
    },
    {
        title: 'Base',
        config: {
            extends: 'next'
        }
    },
    {
        title: 'Cancel',
        config: null
    }, 
];
exports.ESLINT_PROMPT_VALUES = ESLINT_PROMPT_VALUES;

//# sourceMappingURL=constants.js.map