export declare const NEXT_PROJECT_ROOT: string;
export declare const NEXT_PROJECT_ROOT_DIST: string;
export declare const NEXT_PROJECT_ROOT_NODE_MODULES: string;
export declare const NEXT_PROJECT_ROOT_DIST_CLIENT: string;
export declare const NEXT_PROJECT_ROOT_DIST_SERVER: string;
export declare const API_ROUTE: RegExp;
export declare const MIDDLEWARE_ROUTE: RegExp;
export declare const PAGES_DIR_ALIAS = "private-next-pages";
export declare const DOT_NEXT_ALIAS = "private-dot-next";
export declare const PUBLIC_DIR_MIDDLEWARE_CONFLICT = "You can not have a '_next' folder inside of your public folder. This conflicts with the internal '/_next' route. https://nextjs.org/docs/messages/public-next-folder-conflict";
export declare const SSG_GET_INITIAL_PROPS_CONFLICT = "You can not use getInitialProps with getStaticProps. To use SSG, please remove your getInitialProps";
export declare const SERVER_PROPS_GET_INIT_PROPS_CONFLICT = "You can not use getInitialProps with getServerSideProps. Please remove getInitialProps.";
export declare const SERVER_PROPS_SSG_CONFLICT = "You can not use getStaticProps or getStaticPaths with getServerSideProps. To use SSG, please remove getServerSideProps";
export declare const STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR = "can not have getInitialProps/getServerSideProps, https://nextjs.org/docs/messages/404-get-initial-props";
export declare const SERVER_PROPS_EXPORT_ERROR = "pages with `getServerSideProps` can not be exported. See more info here: https://nextjs.org/docs/messages/gssp-export";
export declare const GSP_NO_RETURNED_VALUE = "Your `getStaticProps` function did not return an object. Did you forget to add a `return`?";
export declare const GSSP_NO_RETURNED_VALUE = "Your `getServerSideProps` function did not return an object. Did you forget to add a `return`?";
export declare const UNSTABLE_REVALIDATE_RENAME_ERROR: string;
export declare const GSSP_COMPONENT_MEMBER_ERROR = "can not be attached to a page's component and must be exported from the page. See more info here: https://nextjs.org/docs/messages/gssp-component-member";
export declare const NON_STANDARD_NODE_ENV = "You are using a non-standard \"NODE_ENV\" value in your environment. This creates inconsistencies in the project and is strongly advised against. Read more: https://nextjs.org/docs/messages/non-standard-node-env";
export declare const SSG_FALLBACK_EXPORT_ERROR = "Pages with `fallback` enabled in `getStaticPaths` can not be exported. See more info here: https://nextjs.org/docs/messages/ssg-fallback-true-export";
export declare const ESLINT_DEFAULT_DIRS: string[];
export declare const ESLINT_PROMPT_VALUES: ({
    title: string;
    recommended: boolean;
    config: {
        extends: string;
    };
} | {
    title: string;
    config: {
        extends: string;
    };
    recommended?: undefined;
} | {
    title: string;
    config: null;
    recommended?: undefined;
})[];
