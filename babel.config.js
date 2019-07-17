const presets = [
    [
        "@babel/env",
        {
            targets: {
                edge: "17",
                firefox: "60",
                chrome: "67",
                safari: "11",
            },
            useBuiltIns: "usage",
        },
    ],
];
const plugins = [
    '@babel/plugin-transform-arrow-functions',
    '@babel/plugin-transform-property-mutators',
    '@babel/plugin-transform-template-literals',
    '@babel/plugin-transform-spread',
    '@babel/plugin-transform-shorthand-properties',
    '@babel/plugin-transform-new-target',
    '@babel/plugin-transform-function-name'
]

module.exports = { presets, plugins };