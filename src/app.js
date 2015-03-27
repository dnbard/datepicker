(function(window, ko){
    function AppViewModel(){
        this.date = ko.observable(new Date());
    }

    ko.applyBindings(new AppViewModel());
})(window, ko);
