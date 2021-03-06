﻿/// <reference path="scripts/typings/jquery/jquery.d.ts" />

class CreateExamen {
    predmet: number;
    date: Date;
    event_range: Array<time_for_event>;
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

        this.current_item.event_key = "" + this.current_item.time_from.getTime() + "-" + this.current_item.time_to.getTime();
    }

    event_apply() {

        //    Обнуление времени
        $("#addRange").find(".input-time").each(function () {
            $(this).val("");
        });
        //    Обнуление блоков с выбором
        $("#event_wrapper").empty();

        if (this.current_item.multi_students) {
            this.event_range[this.current_item.event_key] = this.copy_event_to_array(this.current_item, new time_for_event());
            this.print_range(this.current_item);
            this.current_item = null;
        }
        else {
            
            $("#range_error").text("Hfp,bnm?").fadeIn().fadeOut(3000);
        }        
        this.show_save();
    }

    copy_event_to_array(item: time_for_event, new_item: time_for_event) {
        for (var key in item) {
            new_item[key] = item[key];
        }
        return new_item;
    }

    print_range(time: time_for_event) {
        $("#rangeComplit ul").append("<li data-key='" + this.current_item.event_key + "'>" +
            time.time_from.getHours() + " : " +
            (time.time_from.getMinutes() < 10 ? "0" + time.time_from.getMinutes() : time.time_from.getMinutes()) +
            " — " +
            time.time_to.getHours() + " : " + (time.time_to.getMinutes() < 10 ? "0" + time.time_to.getMinutes() : time.time_to.getMinutes()) +
            " | " +
            "Экзамен для " +
            (time.multi_students ? time.how_multi_student : "1") +
            " студента\\ов" +
            "</li>");
    }

    //  Кнопка Сохранить все диапазоны
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
            this.event_range[this.current_item.event_key] = this.copy_event_to_array(this.current_item, new time_for_event());
            this.current_item.time_from.setMinutes(this.current_item.time_from.getMinutes() + raznica);
        }
    }

    chek_times(time_start: Date, time_end: Date) {

        var error: boolean = true;  //      Проверка времени, первое меньше второго, затем на пересечение с временем которое есть в массиве диапазонов на пересечение.
                                    //      error по умолчанию - true, если находится косяк то устанавливается в false

        if (time_start.getTime() > time_end.getTime()) {
            error = false;
        }
        else if (Object.keys(this.event_range).length > 0) {
            for (var key in this.event_range) {

                //  Время элемента из массива добавленных (готовых) диапазонов
                var aaa1 = this.event_range[key].time_from.getTime();
                var bbb1 = this.event_range[key].time_to.getTime();

                //  Определение на пересечения
                if (
                    (time_start.getTime() <= aaa1 && (time_end.getTime() > aaa1 || time_end.getTime() > bbb1)) ||
                    ((time_start.getTime() < bbb1 || time_start.getTime() < aaa1) && time_end.getTime() >= bbb1) ||
                    (time_start.getTime() == aaa1 && time_end.getTime() == bbb1)
                ) {
                    error = false;
                } 
            }
        }

        return error;
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
    how_range_time: number;
    event_key: string;
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

            if (Item.chek_times(Item.current_item.time_from, Item.current_item.time_to)) {
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
                $("#range_error").text("Ошибка! Укажите правильное время начала и окончания. Возможно Вы допустили пересечение диапазонов либо время старта больше чем окончания.").fadeIn();
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
                        '<p id="save_interval">Создать время</p>' +
                    '</div>' +
                '</div>'
            );
        } else {
            Item.current_item.how_multi_student = 1;
            $("#event_step2").remove();
            wrapper.append(
                '<div id="event_step2">' +
                '<div id="kolvo_minut">' +
                '<p>Сколько минут длится один экзамен?</p>' +
                '<input type="text" class="kolvo_minut" /> <span> — Заполните поле</span>' +
                '<p id="save_interval">Создать время</p>' +
                '</div>' +
                '</div>'
            );
        } 
    });

    $(wrapper).on("keyup", "#kolvo_minut input", function () {
        $(this).parent().find("span").fadeOut();
        Item.current_item.how_range_time = parseInt($(this).val());
    });

    $(wrapper).on("keyup", "#howstudentinvite input", function () {
        $(this).parent().find("span").fadeOut();
        Item.current_item.how_multi_student = parseInt($(this).val());
    });

    $(wrapper).on("click", "#save_interval", function () {
       
            if (Item.current_item.multi_students) {
                if (Item.current_item.how_multi_student) {
                    Item.event_apply();
                } else {
                    $("#range_error").text("Укажите количество студентов").fadeIn().fadeOut(3000);
                }
            } else {
                if (Item.current_item.how_range_time) {
                    Item.event_apply();
                } else {
                    $("#range_error").text("Укажите, сколько длится (min) один экзамен?").fadeIn().fadeOut(3000);
                }
            }

    });
};