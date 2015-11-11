/// <reference path="scripts/typings/jquery/jquery.d.ts" />

class CreateExamen {
    predmet: number;
    date: Date;
    event_range: Array<time_for_event>;
    event_key: string;
    current_item: time_for_event;

    convert_date(year, mounth, day) { return new Date(year, mounth, day); }

    create_event(dom_item: JQuery) {

        this.current_item = new time_for_event();

        var from_time = dom_item.first().val();
        var from_array = from_time.split(':');
        this.current_item.time_from = new Date();
        this.current_item.time_from.setTime(this.date.getTime());
        this.current_item.time_from.setHours(from_array[0]);
        this.current_item.time_from.setMinutes(from_array[1]);

        var to_time = dom_item.last().val();
        var to_array = to_time.split(':');
        this.current_item.time_to = new Date();
        this.current_item.time_to.setTime(this.date.getTime());
        this.current_item.time_to.setHours(to_array[0]);
        this.current_item.time_to.setMinutes(to_array[1]);

        this.event_key = "" + this.current_item.time_from.getTime() + this.current_item.time_to.getTime();
    }

    event_apply() {
        this.event_range[this.event_key] = this.copy_event_to_array(this.current_item, new time_for_event());
        this.show_save();
    }

    copy_event_to_array(item: time_for_event, new_item: time_for_event) {
        for (var key in item) {
            new_item[key] = item[key];
        }
        return new_item;
    }

    show_save() {
        if (Object.keys(this.event_range).length) {
            $("#append_interval").fadeIn();
        } else {
            $("#append_interval").fadeOut();
        }
    }

    divide_range(kolvo) {
        var raznica = this.current_item.time_to.getTime() - this.current_item.time_from.getTime();
        raznica = raznica / kolvo;
        raznica = raznica / 60000;

        //this.current_item.time_from.getMinutes() + raznica;

        while (this.current_item.time_from.getTime() <= this.current_item.time_to.getTime()) {
            this.event_range[this.event_key] = this.copy_event_to_array(this.current_item, new time_for_event());
            this.current_item.time_from.setMinutes(this.current_item.time_from.getMinutes() + raznica);
        }
    }


    constructor() {

        this.event_range = new Array();

        $('.input-time').clockpicker({
            autoclose: true
        });

        var calendar = $('#calendar');
        calendar.eCalendar({
            events: [
                { title: 'Event Title 1', description: 'Description 1', datetime: new Date(2015, 11, 12, 17) },
                { title: 'Event Title 2', description: 'Description 2', datetime: new Date(2015, 10, 17, 16) },
                { title: 'Event Title 2', description: 'Description 2', datetime: new Date(2015, 10, 16, 16) },
                { title: 'Event Title 2', description: 'Description 2', datetime: new Date(2015, 11, 15, 16) },
                { title: 'Event Title 2', description: 'Description 2', datetime: new Date(2015, 10, 14, 16) },
                { title: 'Event Title 2', description: 'Description 2', datetime: new Date(2015, 10, 13, 16) },
                { title: 'Event Title 2', description: 'Description 2', datetime: new Date(2015, 11, 3, 16) },
                { title: 'Event Title 2', description: 'Description 2', datetime: new Date(2015, 10, 2, 16) },
                { title: 'Event Title 2', description: 'Description 2', datetime: new Date(2015, 10, 1, 16) },
                { title: 'Event Title 2', description: 'Description 2', datetime: new Date(2015, 11, 20, 16) },
                { title: 'Event Title 2', description: 'Description 2', datetime: new Date(2015, 10, 21, 16) },
                { title: 'Event Title 2', description: 'Description 2', datetime: new Date(2015, 11, 25, 16) }
            ]
        });

    }

}

class time_for_event {
    time_from: Date;
    time_to: Date;
    multi_students: boolean;
    how_multi_student: number;
}

enum Mounth { "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря" };

window.onload = () => {

    var wrapper = $("#event_wrapper");

    var Item = new CreateExamen();

    $("#calendar").on("click", ".c-day", function () {
        // Получаем данные даты и создаем объект даты для Item.
        var sel_day = parseInt($(this).text());
        var sel_month = parseInt($(this).parent().find(".c-month").data("month"));
        var sel_year = parseInt($(this).parent().find(".c-month").data("year"));

        if (Item.convert_date(sel_year, sel_month - 1, sel_day) < new Date) {
            $("#range_error").text("Указана прошлая дата").fadeIn().fadeOut(1000);
        } else {
            $(this).parent().find(".selected").each(function () {
                $(this).removeClass("selected");
            });
            $(this).addClass("selected");

            Item.date = Item.convert_date(sel_year, sel_month - 1, sel_day);
            //  -----------------------------------------------------

            $("#allTimes").fadeIn();

            $('#select_date').text(
                Item.date.getDate() + " " + Mounth[Item.date.getMonth()] + " " + Item.date.getFullYear());
        }
    });

    $(".input-time").on("change", function () {

        wrapper.empty();

        //  Оба ли заполнены
        var fill = true;
        $(this).parent().find(".input-time").each(function () {
            if ($(this).val() != '') { fill = fill && true; } else { fill = fill && false; }
        });


        if (fill) {
            var item = $(this).parent().find(".input-time");
            Item.create_event(item);    // Создание временного экзамена

            if (Item.current_item.time_from.getTime() < Item.current_item.time_to.getTime()) {
                $("#range_error").text("").fadeOut();
                $(wrapper).append(
                    "<div id='OneOrMore'>"+
                    "<p>Все студенты сдают экзамен в одно время, либо у каждого будет свое время сдачи? </p>" +
                        "<p>" +
                        "<label><input class='radiooneormore' type= 'radio' name= 'oneormore' value= 'true' /> - В одно время  </label>" +
                        "<label><input class='radiooneormore' type= 'radio' name= 'oneormore' value= 'false' /> - В разное время </label>"+
                       "</p>" +
                    "</div>"
                );
            } else {
                $("#range_error").text("Время окончания раньше чем время начала").fadeIn();
            }
        }
    });

    $(wrapper).on("change", "#OneOrMore .radiooneormore", function () {
        var select = JSON.parse($(this).val());
        Item.current_item.multi_students = select;
        Item.current_item.how_multi_student = 0;

        if (Item.current_item.multi_students) {
            $("#event_step2").remove();
            wrapper.append(
                '<div id="event_step2">' +
                    '<div id="howstudentinvite">' +
                    '<p>Сколько студентов может записаться на заданое время?</p>' +
                        '<input type="text" class="selecthowstudent" /> <span> — Заполните поле</span>' +
                        '<p id="save_interval">Добавить время</p>' +
                    '</div>' +
                '</div>'
            );
        } else {
            Item.current_item.how_multi_student = 1;
            $("#event_step2").remove();
            wrapper.append(
                '<div id="event_step2">' +
                '<div id="divide">' +
                '<p>Разбить указаное время можно на количество студентов, которое вы хотите принять, либо на заданые промежутки времени.</p>' +
                '<label><input class="radiodivideone" value="kolvo" type="radio" name="radiodivide" /> - Указать количество  </label>' +
                '<label><input class="radiodivideone" value="prom" type="radio" name="radiodivide" /> - Разбить на равные промежутки </label>' +
                '</div>' +
                '</div>'
            );
        } 
    });

    $(wrapper).on("keyup", "#howstudentinvite input", function () {
        $(this).parent().find("span").fadeOut();
        Item.current_item.how_multi_student = parseInt($(this).val());
    });

    $(wrapper).on("change", "#divide .radiodivideone", function () {
        if ($(this).val() == 'kolvo') {
            $("#event_step3").remove();
            $(this).parent().parent().append(
                '<div id="event_step3">' +
                '<label><input id="kolvo_student" value="" type="text" name="kolvo_student" /> - Введите количество студентов  </label>' +
                '<p id="save_interval">Добавить время</p>' +
                '</div>'
            );
        }
        if ($(this).val() == 'prom') {
            $("#event_step3").remove();
            $(this).parent().parent().append(
                '<div id="event_step3">' +
                '<label><input id="prom_time" value="" type="text" name="prom_time" /> - Введите количество минут одного экзамена </label>' +
                '</div>'
            );
        }
    });

    $(wrapper).on("click", "#save_interval", function () {

        if (!(Item.event_key in Item.event_range)) {        // Защита от 2го сохранения. Если такое время уже добавлено, то сообщение об этом...
            if (Item.current_item.multi_students) {
                if (Item.current_item.how_multi_student) {
                    $("#addRange").find(".input-time").each(function () {
                        $(this).val("");
                    });
                    Item.event_apply();
                    wrapper.empty();

                    $("#rangeComplit ul").append("<li data-key='" + Item.event_key + "'>" +
                        Item.current_item.time_from.getHours() + " : " +
                        (Item.current_item.time_from.getMinutes() < 10 ? "0" + Item.current_item.time_from.getMinutes() : Item.current_item.time_from.getMinutes()) +
                        " — " +
                        Item.current_item.time_to.getHours() + " : " + (Item.current_item.time_to.getMinutes() < 10 ? "0" + Item.current_item.time_to.getMinutes() : Item.current_item.time_to.getMinutes()) +
                        " | " +
                        "Экзамен для " +
                        (Item.current_item.multi_students ? Item.current_item.how_multi_student : "1") +
                        " студента\\ов" +
                        "</li>");
                } else {
                    $("#range_error").text("Укажите количество студентов").fadeIn().fadeOut(3000);
                }
            } else {
                var students = parseInt($("#kolvo_student").val());
                if (students > 0) {
                    wrapper.append("OOOOOOOOOOOOO");
                    Item.divide_range(students);
                } else {
                    $("#range_error").text("Укажите, сколько студентов для этого промежутка?").fadeIn().fadeOut(3000);
                }
            }
        } else {
            $("#range_error").text("Это время уже добавлено в список").fadeIn().fadeOut(3000);
        }
    });
};