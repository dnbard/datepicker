(function(window, ko){
    ko.components.register('datepicker', {
        viewModel: function(params){
            element = params.element;

            this.value = params.value;

            this.view = ko.computed(function(){
                if (!this.value()){
                    return 'Select Date';
                }

                return 'Format Me';
            }, this);

            this.isOpened = ko.observable(false);

            this.onDateBarClick = function(viewmodel, event){
                var newState = !this.isOpened();
                this.isOpened(newState);

                if (newState){
                    document.addEventListener('click', this.onDateBarClick);
                } else {
                    document.removeEventListener('click', this.onDateBarClick);
                }

                if (event){ event.stopPropagation(); }
            }.bind(this);

            this.stopPropagation = function(event){
                event.stopPropagation();
            }
            element.addEventListener('click', this.stopPropagation);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function(){
                document.removeEventListener('click', this.onDateBarClick);
                element.removeEventListener('click', this.stopPropagation);
            });
        },
        template: window.document.querySelector('#datepicker-template').innerText
    });
})(window, ko);
