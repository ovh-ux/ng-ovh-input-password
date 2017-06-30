[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)]()
[![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux)
[![Build Status](https://travis-ci.org/ovh-ux/ovh-ng-input-password.svg)](https://travis-ci.org/ovh-ux/ovh-ng-input-password)

[![NPM](https://nodei.co/npm/ovh-ng-input-password.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-ng-input-password/)
![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

# Input Password

## Installation

Before using it, you have to install it with bower cli :

```
bower install ovh-ng-input-password --save
```

## Get the sources

```bash
$ git clone https://github.com/ovh-ux/ovh-angular-input-password.git
$ cd ovh-ng-input-password
$ npm install
$ bower install
```

## How to use?

```javascript
angular.module("yourModule", [
    "inputPassword"
])
.controller("mainCtrl", function(scope) {
    this.rules = [
        {
            id: "length",
            caption: "Must contain 8 to 20 characters",
            validator: function (str) {
                return str && str.length > 7 && str.length < 21;
            }
        },
        {
            id: "specialChar",
            caption: "Can contain following characters #{}()[]-|@=*+/!:;",
            validator: /^[\w~"#'\{\}\(\\)[\]\-\|\\^@=\*\+\/!:;.,?<>%*µÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ]+$/,
            immediateWarning: true
        },
    ];
    this.getStrength = function(val) {
        return (val.length-8) / 12;
    }
});
```

```html
<input-password data-ng-model="mainCtrl.password"
                name="password"
                data-strength="mainCtrl.getStrength(value)"
                data-rules="mainCtrl.rules">
</input-password>
```

## Docs

You can show the generated documentation using the command below in a command prompt:

```bash
grunt ngdocs && grunt connect
```

Then open a browser and go to `http://localhost:8000/docs/`.

## Unit Tests

You can unitary test by executing in a command prompt:
 ```bash
 grunt test
 ```

# Contributing

You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy to hear from you !

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-ng-input-password/blob/master/CONTRIBUTING.md)


## Related links

 * Contribute: https://github.com/ovh-ux/ovh-ng-input-password/blob/master/CONTRIBUTING.md
 * Report bugs: https://github.com/ovh-ux/ovh-ng-input-password/issues
 * Get latest version: https://github.com/ovh-ux/ovh-ng-input-password

# License

See https://github.com/ovh-ux/ovh-ng-input-password/blob/master/LICENSE
