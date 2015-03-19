(function(window, ko){
    function AppViewModel(){
        this.date = ko.observable(null);
    }

    ko.applyBindings(new AppViewModel());
})(window, ko);
