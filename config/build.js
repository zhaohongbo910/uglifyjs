//yarn ug ./src/index.js -c -m -b  -o ./index.a.min.js
let uglify = require('uglify-js');
let fs = require('fs');
let path = require('path');
class Build {
    constructor(options) {
        this.dir = path.dirname(__dirname);
        this.lib = `${this.dir}/lib`;
        this.src = `${this.dir}/src/`;
        this.dist = `${this.dir}/dist/`
        this.filesList = []
        this.options = {
            output: {
                comments: false,
            },
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
            mangle: true,
            ie8: true,

        }
        this.main()
    }
    main() {
        this.filesList = fs.readdirSync(this.lib, 'utf-8')
        this.readFile(this.filesList)
    }
    readFile(arr) {
        arr.map((item, index) => {
            fs.readFile(this.lib + `/${item}`, 'utf-8', (err, data) => {
                if (err) return err;
                let { code } = uglify.minify(data, this.options);

                let files = item.split('.');
                let filename = files[0] + '.min.' + files[files.length - 1];
                fs.writeFile(this.dist + `${filename}`, code, 'utf-8', (e, d) => {
                    if (!e) {
                        console.log('压缩混淆完成')
                    }
                })
            })
        })
    }
}
new Build()