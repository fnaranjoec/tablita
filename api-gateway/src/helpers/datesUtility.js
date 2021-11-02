Date.prototype.additionDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

Date.prototype.substractionDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() - days);
    return date;
};

Date.prototype.firstDayOfMonth = function() {
    var current_date = new Date();
    var first_date = new Date(current_date.getFullYear(), current_date.getMonth(), 1);
    return first_date;
};

Date.prototype.lastDayOfMonth = function() {
    var current_date = new Date();
    var last_date = new Date(current_date.getFullYear(), current_date.getMonth() + 1, 0);
    return last_date;
};

const addDays = (days) => {
    var date = new Date();
    return date.additionDays(days)
};

const subsDays = (days) => {
    var date = new Date();
    return date.substractionDays(days)
};

const firstDay = () => {
    var date = new Date();
    return date.firstDayOfMonth();
};

const lastDay = () => {
    var date = new Date();
    return date.lastDayOfMonth();
};

export {addDays, subsDays, firstDay, lastDay};


