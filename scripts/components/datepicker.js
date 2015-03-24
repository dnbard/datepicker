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

                this.calendarData(this.fillDateView(this.value()));

                if (event){ event.stopPropagation(); }
            }.bind(this);

            this.daysInMonth = function(date){
                return new Date(date.getYear(), date.getMonth(), 0).getDate();
            }

            this.fillDateView = function(argumentDate){
                var date = new Date(argumentDate);

                date.setDate(0);

                var dateDay = date.getDay(),
                    dateMonth = argumentDate.getMonth(),
                    daysInMonth = this.daysInMonth(date),
                    lastDayInMonth = new Date(date),
                    daysOverhead,
                    elements = [];

                lastDayInMonth.setDate(daysInMonth);
                daysOverhead = 7 - lastDayInMonth.getDay();

                dateDay = dateDay > 0 ? -dateDay : 0;
                date.setDate(date.getDate() + dateDay);

                for(var i = dateDay, max = daysInMonth + daysOverhead; i < max; i++){
                    date.setDate(date.getDate() + 1);

                    var currentDate = new Date(date);

                    elements.push({
                        date: currentDate,
                        day: currentDate.getDate(),
                        isOtherMonth : dateMonth !== currentDate.getMonth()
                    });

                    console.log('Check month %s of %s', dateMonth, currentDate.getMonth());
                }

                return elements;
            }

            this.calendarData = ko.observableArray(this.fillDateView(this.value()));

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
