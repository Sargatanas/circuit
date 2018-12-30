"use strict";

(function createConductors() {
    let circuitCreateMode = document.getElementById('circuit-create-mode');
    let circuitChoosingBegin = document.getElementById('circuit-choosing-begin');

    let circuitBegin = null;
    let circuitEnd = null;

    // манипуляция фрагментами цепи
    let circuitElements = new Set();
    let points = Array.from(document.getElementsByClassName('point-area-element__input'));

    let pointFirst = null;
    let pointSecond = null;

    let lastBegin = null;
    let currentBegin = null;

    let temp = null;

    points.forEach(function (point) {
        point.addEventListener('click', function (p) {
            pointSecond = pointFirst;
            pointFirst = point;

            if (circuitChoosingBegin.checked) {
                lastBegin= currentBegin;
                currentBegin = point;
                if (lastBegin) {
                    temp = lastBegin.parentNode.getElementsByTagName('label')[0];
                    if (currentBegin !==lastBegin) {
                        temp.dataset.status = 'usual';
                        temp.dataset.orientation = '';
                    }

                    temp = currentBegin.parentNode.getElementsByTagName('label')[0];
                    temp.dataset.status = 'begin';

                    let orientation = temp.dataset.orientation;
                    switch (orientation) {
                        case '':
                            orientation = 'right';
                            circuitEnd =
                            break;
                        case 'right':
                            orientation = 'bottom';
                            break;
                        case 'bottom':
                            orientation = 'left';
                            break;
                        case 'left':
                            orientation = 'top';
                            break;
                        case 'top':
                            orientation = 'right';
                            break;
                    }
                    temp.dataset.orientation = orientation;

                    circuitBegin = currentBegin;

                } else {
                    temp = currentBegin.parentNode.getElementsByTagName('label')[0];
                    temp.dataset.status = "begin";
                    temp.dataset.orientation = 'right';

                    circuitBegin = currentBegin;
                }
            }

            if (pointSecond && (pointFirst !== pointSecond)) {
                let stringFirst = Number(pointFirst.dataset.string);
                let stringSecond = Number(pointSecond.dataset.string);
                let columnFirst = Number(pointFirst.dataset.column);
                let columnSecond = Number(pointSecond.dataset.column);

                if ((Math.abs(stringFirst - stringSecond) <= 1) && (Math.abs(columnFirst - columnSecond) === 0) ||
                    (Math.abs(stringFirst - stringSecond) === 0) && (Math.abs(columnFirst - columnSecond) <= 1)) {
                    let connection = getConnectionElement(stringFirst, stringSecond, columnFirst, columnSecond);

                    if (circuitCreateMode.checked) {
                        // создать ФЦ
                        connection.dataset.status = 'on';
                        circuitElements.add(connection);

                        // удалить ФЦ
                        connection.addEventListener('click', function (c) {
                            connection.dataset.status = 'off';
                            circuitElements.delete(connection);
                        });
                    }

                }
            }
        });
    });


    // функция, формирующая имя элемента
    function getConnectionElement(stringFirst, stringSecond, columnFirst, columnSecond) {
        let stringMin = Math.min(stringFirst, stringSecond);
        let stringMax = Math.max(stringFirst, stringSecond);
        let columnMin = Math.min(columnFirst, columnSecond);
        let columnMax = Math.max(columnFirst, columnSecond);

        let id = stringMin + '-' + stringMax + '_' + columnMin + '-' + columnMax;
        return document.getElementById(id);
    }

    // определение рабочей цепи
    let circuitActiveButton = document.getElementById('find-working-circuit');
    let circuitWorking = [];
    circuitActiveButton.addEventListener('click', function () {
        circuitWorking = [];

        // проверяем наличие элемента, исходящего из начала цепи
        if (circuitBegin) {
            let element = circuitBegin.parentNode.getElementsByTagName('label')[0];

            let hasActiveBegin = false;
            let string = Number(element.dataset.string);
            let column = Number(element.dataset.column);

            switch (element.dataset.orientation) {
                case 'right':
                    temp = getConnectionElement(string, string, column, column + 1);
                    hasActiveBegin = circuitElements.has(temp);
                    break;
                case 'bottom':
                    temp = getConnectionElement(string, string + 1, column, column);
                    hasActiveBegin = circuitElements.has(temp);
                    break;
                case 'left':
                    temp = getConnectionElement(string, string, column, column - 1);
                    hasActiveBegin = circuitElements.has(temp);
                    break;
                case 'top':
                    temp = getConnectionElement(string, string - 1, column, column);
                    hasActiveBegin = circuitElements.has(temp);
                    break;
            }

            if (hasActiveBegin) {
                temp = {
                    current: temp,
                    previous: null,
                    next: []
                };
                circuitWorking.push(temp);
            }

            circuitWorking.forEach(function (circuitWorkingElement) {
                createTree(circuitElements, circuitWorkingElement);
            });
            console.log(circuitWorking);
        }
    });

    function createTree(circuitElements, element) {
        let temp = null;

        for(let circuitElement of circuitElements) {
            if ((circuitElement !== element.current) && (circuitElement !== element.previous)) {
                if ((element.current.dataset.stringTo === circuitElement.dataset.stringFrom) &&
                    (element.current.dataset.columnTo === circuitElement.dataset.columnFrom) ||
                    (element.current.dataset.stringFrom === circuitElement.dataset.stringTo) &&
                    (element.current.dataset.columnFrom === circuitElement.dataset.columnTo)) {
                    temp = {
                        current: circuitElement,
                        previous: element.current,
                        next: []
                    };
                    element.next.push(temp);
                }
            }
        }

        if ()

        if (element.next) {
            element.next.forEach(function (element) {
                createTree(circuitElements, element);
            })
            ;
        } else {
            return null;
        }
    }
})();


