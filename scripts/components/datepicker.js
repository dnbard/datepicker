(function(window, ko){
    var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];

    ko.components.register('datepicker', {
        viewModel: function(params){
            element = params.element;

            this.value = params.value;

            this.getDateString = function(date){
                try{
                    return Months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
                }
                catch(e){
                    return 'Invalid Date';
                }
            }

            this.view = ko.computed(function(){
                var date = this.value();

                if (!date){
                    return 'Select Date';
                }

                return this.getDateString(date);
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
                    lastDayInMonth = new Date(argumentDate),
                    daysOverhead,
                    elements = [];

                lastDayInMonth.setDate(daysInMonth - 1);
                daysOverhead = 6 - lastDayInMonth.getDay();

                dateDay = dateDay > 0 ? -dateDay : 0;
                date.setDate(date.getDate() + dateDay);

                for(var i = dateDay, max = daysInMonth + daysOverhead; i < max; i++){
                    date.setDate(date.getDate() + 1);

                    var currentDate = new Date(date);

                    elements.push({
                        date: currentDate,
                        caption: currentDate.getDate(),
                        isOtherMonth : dateMonth !== currentDate.getMonth()
                    });
                }

                return elements;
            }

            this.calendarData = ko.observableArray(this.fillDateView(this.value()));

            this.isSelected = function(data){
                var currentDate = this.value(),
                    date = data.date;

                if (!currentDate || !date){
                    return false;
                }

                return currentDate.getDate() === date.getDate() &&
                    currentDate.getMonth() === date.getMonth() &&
                    currentDate.getYear() === date.getYear();
            }

            this.onDayClick = function(data){
                this.value(data.date);
            }.bind(this);

            this.onSetToday = function(){
                this.value(new Date());
                //TODO: move datepicker view to DAYS with current month selected
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
