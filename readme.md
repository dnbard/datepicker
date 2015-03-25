Knockout Datepicker
===================
Datepicker component for KnockoutJS


Requirement
------------
* KnockoutJS >= v3.2.0

Documentation
-------------

Apply script and stylesheet to your HTML page:
```html
<link rel="stylesheet" href="styles/datepicker.css">
<script type="text/javascript" src="scripts/components/datepicker.js"></script>
```

Binding:
```html
<datepicker params="value: date"></datepicker>
```

ViewModel:
```js
function ViewModel(){
    this.date = new Date();
}

ko.applyBindings(new ViewModel());
```