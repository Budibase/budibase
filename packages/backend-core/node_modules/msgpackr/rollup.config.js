import minify from "rollup-plugin-babel-minify";
import json  from "@rollup/plugin-json";

export default [
    {
        input: "node-index.js",
        output: [
            {
                file: "dist/node.cjs",
                format: "cjs",
                sourcemap: true
            }
        ]
    },
    {
        input: "index.js",
        output: {
            file: "dist/index.js",
            format: "umd",
            name: "msgpackr",
            sourcemap: true
        }
    },    
    {
        input: "index.js",
        plugins: [minify({
        })],
        output: {
            file: "dist/index.min.js",
            format: "umd",
            name: "msgpackr",
            sourcemap: true
        }
    },
    {
        input: "tests/test.js",
        plugins: [json()],
        external: ['chai', '../index.js'],
        output: {
            file: "dist/test.js",
            format: "iife",
            sourcemap: true,
            globals: {
                chai: 'chai',
                './index.js': 'msgpackr',
            },
        }
    }
];
