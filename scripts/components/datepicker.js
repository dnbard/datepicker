(function(window, ko){
    var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        SetTypes = {
            DAYS: 'days',
            MONTHS: 'months',
            YEARS: 'years'
        },
        Sets = [{
            type: SetTypes.DAYS,
            index: 0
        },{
            type: SetTypes.MONTHS,
            index: 1
        },{
            type: SetTypes.YEARS,
            index: 2
        }];

    ko.components.register('datepicker', {
        viewModel: function(params){
            element = params.element;

            this.value = params.value;
            this.displayValue = new Date(this.value());

            this.set = ko.observable(Sets[0]);
            this.set.subscribe(function(newSet){
                this.calendarData(this.getViewHandlerBySet(newSet)(this.value()));
                this.displayValue = new Date(this.value());
            }.bind(this));

            this.yearRange = ko.observable(null);

            this.getDateString = function(date, set){
                var yearRange = this.yearRange();

                set = set || Sets[0];

                try{
                    if (set.type === SetTypes.DAYS){
                        return Months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
                    } else if (set.type === SetTypes.MONTHS){
                        return date.getFullYear();
                    } else if (set.type === SetTypes.YEARS){
                        return yearRange.start + ' - ' + yearRange.finish;
                    }
                }
                catch(e){
                    return 'Invalid Date';
                }
            }.bind(this);

            this.view = ko.computed(function(){
                var date = this.value(),
                    set = this.set();

                if (!date){
                    return 'Select Date';
                }

                return this.getDateString(date);
            }, this);

            this.isOpened = ko.observable(false);

            this.isDaysSet = function(set){
                return set() === Sets[0];
            }.bind(this);

            this.isMonthsSet = function(set){
                return set() === Sets[1];
            }.bind(this);

            this.isYearsSet = function(set){
                return set() === Sets[2];
            }.bind(this);

            this.onDateBarClick = function(viewmodel, event){
                this.set(Sets[0]);

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
                return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
            }

            this.getViewHandlerBySet = function(set){
                if(set.type === SetTypes.DAYS){
                    return this.fillDateView;
                } else if(set.type === SetTypes.MONTHS){
                    return this.fillMonthView;
                } else if (set.type === SetTypes.YEARS){
                    return this.fillYearsView;
                }

                throw new Error('No view handler provided for %s', set);
            }.bind(this);

            this.fillYearsView = function(argumentDate){
                var date = new Date(argumentDate),
                    year = date.getFullYear(),
                    startYear = Math.floor( year / 10 ) * 10 - 1,
                    finishYear = Math.floor( year / 10 ) * 10 + 10,
                    elements = [];

                this.yearRange({
                    start: startYear,
                    finish: finishYear
                });

                for(year = startYear; year <= finishYear; year ++){
                    elements.push({
                        date: new Date(year, 0, 1),
                        caption: year,
                        muted: year === startYear || year === finishYear
                    });
                }

                return elements;
            }.bind(this);

            this.fillMonthView = function(argumentDate){
                var date = new Date(argumentDate),
                    day = date.getDate(),
                    year = date.getFullYear(),
                    elements = [],
                    currDate, maxDays;

                for(var i = 0; i < 12; i ++){
                    currDate = new Date(year, i + 1, 1);
                    maxDays = this.daysInMonth(currDate);

                    elements.push({
                        date: day > maxDays ? new Date(year, i, maxDays) : new Date(year, i, day),
                        caption: Months[i],
                        muted: false
                    });
                }

                return elements;
            }.bind(this);

            this.fillDateView = function(argumentDate){
                var date = new Date(argumentDate);

                date.setDate(0);

                var dateDay = date.getDay(),
                    dateMonth = argumentDate.getMonth(),
                    daysInMonth = this.daysInMonth(date),
                    lastDayInMonth = new Date(argumentDate),
                    elements = [],
                    daysOverhead;

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
                        muted : dateMonth !== currentDate.getMonth()
                    });
                }

                return elements;
            }.bind(this);

            this.calendarData = ko.observableArray(this.fillDateView(this.value()));

            this.isSelected = function(data){
                var currentDate = this.value(),
                    date = data.date;

                if (!currentDate || !date){
                    return false;
                }

                return currentDate.getDate() === date.getDate() &&
                    currentDate.getMonth() === date.getMonth() &&
                    currentDate.getFullYear() === date.getFullYear();
            }

            this.isYearSelected = function(data){
                var currentDate = this.value(),
                    date = data.date;

                if (!currentDate || !date){
                    return false;
                }

                return currentDate.getFullYear() === date.getFullYear();
            }

            this.isMonthSelected = function(data){
                var currentDate = this.value(),
                    date = data.date;

                if (!currentDate || !date){
                    return false;
                }

                return currentDate.getMonth() === date.getMonth() &&
                    currentDate.getFullYear() === date.getFullYear();
            }

            this.onDayClick = function(data){
                var isMonthChanged = this.value().getMonth() !== data.date.getMonth();

                this.value(data.date);
                if (isMonthChanged){
                    this.set.valueHasMutated();
                }
            }.bind(this);

            this.onMonthClick = function(data){
                this.value(data.date);
                this.set(Sets.filter(function(set){
                    return set.type === SetTypes.DAYS;
                })[0]);
            }.bind(this);

            this.onYearClick = function(data){
                this.value(data.date);
                this.set(Sets.filter(function(set){
                    return set.type === SetTypes.MONTHS;
                })[0]);
            }.bind(this);

            this.onSetToday = function(){
                this.value(new Date());
                this.set(Sets[0]);
            }.bind(this);

            this.onRightClick = function(viewmodel, event){
                var set = this.set(),
                    setsMaxIndex = Sets.reduce(function(maxSet, set){
                        return maxSet.index < set.index ? set : maxSet;
                    }).index;

                if (set.index < setsMaxIndex){
                    this.set(Sets.filter(function(newSet){
                        return newSet.index === set.index + 1;
                    })[0]);
                }
            }.bind(this);

            this.onPreviousPage = function(){
                var set = this.set(),
                    date = this.value();

                if (set.type === SetTypes.DAYS){
                    this.displayValue.setDate(this.displayValue.getDate() - 30);
                    this.calendarData(this.getViewHandlerBySet(this.set())(this.displayValue));
                } else if (set.type === SetTypes.MONTHS){
                    date.setFullYear(date.getFullYear() - 1);
                    this.set.valueHasMutated();
                } else if (set.type === SetTypes.YEARS){
                    date.setFullYear(date.getFullYear() - 10);
                    this.set.valueHasMutated();
                }
            }

            this.onNextPage = function(){
                var set = this.set(),
                    date = this.value();

                if (set.type === SetTypes.DAYS){
                    this.displayValue.setDate(this.displayValue.getDate() + 30);
                    this.calendarData(this.getViewHandlerBySet(this.set())(this.displayValue));
                } else if (set.type === SetTypes.MONTHS){
                    date.setFullYear(date.getFullYear() + 1);
                    this.set.valueHasMutated();
                } else if (set.type === SetTypes.YEARS){
                    date.setFullYear(date.getFullYear() + 10);
                    this.set.valueHasMutated();
                }
            }

            this.stopPropagation = function(event){
                event.stopPropagation();
            }
            element.addEventListener('click', this.stopPropagation);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function(){
                document.removeEventListener('click', this.onDateBarClick);
                element.removeEventListener('click', this.stopPropagation);
            }.bind(this));
        },
        template: window.document.querySelector('#datepicker-template').innerText
    });
})(window, ko);
