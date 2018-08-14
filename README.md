# @hammad.fauz/parser

fork of @bbob/parser
> Parses BBCode and returns array AST tree 

Valid for use with [posthtml-render](https://github.com/posthtml/posthtml-render)

## Usage

```js
import parse from '@hammad.fauz/parser'

const options = {
    onlyAllowTags: ['url', 'h'],
    onError: (err) => console.warn(err.message, err.lineNumber, err.columnNumber)
}
const ast = parse('[url=https://github.com]hello world![/url]', options)
```

## Results 

```json
[
    {
        "tag": "url",
        "attrs": {
            "url": "https://github.com"
        },
        "content": ["hello", " ", "world!"]
    }
]
```
