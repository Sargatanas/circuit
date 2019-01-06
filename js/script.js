"use strict";

(function createConductors() {
    let circuitCreateMode = document.getElementById('circuit-create-mode');
    let circuitChoosingBegin = document.getElementById('circuit-choosing-begin');

    let circuitBegin = null;

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

            let firstLink = null;
            let lastLink = null;
            let siblingsLinks = [];
            let siblings = [];
            let previous = null;

            switch (element.dataset.orientation) {
                case 'right':
                    firstLink = getConnectionElement(string, string, column, column + 1);

                    lastLink = getConnectionElement(string, string, column, column - 1);
                    if (circuitElements.has(lastLink)) {
                        previous = lastLink;
                    }

                    siblingsLinks.push(getConnectionElement(string, string + 1, column, column));
                    siblingsLinks.push(getConnectionElement(string, string - 1, column, column));
                    for (let siblingLink of siblingsLinks) {
                        if (circuitElements.has(siblingLink)) {
                            siblings.push(siblingLink);
                        }
                    }

                    hasActiveBegin = circuitElements.has(firstLink);
                    break;
                case 'bottom':
                    firstLink = getConnectionElement(string, string + 1, column, column);

                    lastLink = getConnectionElement(string, string - 1, column, column);
                    if (circuitElements.has(lastLink)) {
                        previous = lastLink;
                    }

                    siblingsLinks.push(getConnectionElement(string, string, column, column + 1));
                    siblingsLinks.push(getConnectionElement(string, string, column, column - 1));
                    for (let siblingLink of siblingsLinks) {
                        if (circuitElements.has(siblingLink)) {
                            siblings.push(siblingLink);
                        }
                    }

                    hasActiveBegin = circuitElements.has(firstLink);
                    break;
                case 'left':
                    firstLink = getConnectionElement(string, string, column, column - 1);

                    lastLink = getConnectionElement(string, string, column, column + 1);
                    if (circuitElements.has(lastLink)) {
                        previous = lastLink;
                    }

                    siblingsLinks.push(getConnectionElement(string, string + 1, column, column));
                    siblingsLinks.push(getConnectionElement(string, string - 1, column, column));
                    for (let siblingLink of siblingsLinks) {
                        if (circuitElements.has(siblingLink)) {
                            siblings.push(siblingLink);
                        }
                    }

                    hasActiveBegin = circuitElements.has(firstLink);
                    break;
                case 'top':
                    firstLink = getConnectionElement(string, string - 1, column, column);

                    lastLink = getConnectionElement(string, string + 1, column, column);
                    if (circuitElements.has(lastLink)) {
                        previous = lastLink;
                    }

                    siblingsLinks.push(getConnectionElement(string, string, column, column + 1));
                    siblingsLinks.push(getConnectionElement(string, string, column, column - 1));
                    for (let siblingLink of siblingsLinks) {
                        if (circuitElements.has(siblingLink)) {
                            siblings.push(siblingLink);
                        }
                    }

                    hasActiveBegin = circuitElements.has(firstLink);
                    break;
            }

            if (hasActiveBegin) {
                temp = {
                    current: firstLink,
                    previous: previous,
                    next: [],
                    siblings: siblings
                };
                circuitWorking.push(temp);
            }

            circuitWorking.forEach(function (circuitWorkingElement) {
                createTree(circuitElements, circuitWorkingElement, lastLink, siblingsLinks);
            });
            console.log(circuitWorking);
        }
    });

    function createTree(circuitElements, element, lastLink, siblingsLinks) {
        let temp = null;
        let neighbors = [];

        for(let circuitElement of circuitElements) {
            if (circuitElement !== element.current) {
                if ((element.current.dataset.stringTo === circuitElement.dataset.stringFrom) &&
                    (element.current.dataset.columnTo === circuitElement.dataset.columnFrom) ||

                    (element.current.dataset.stringFrom === circuitElement.dataset.stringTo) &&
                    (element.current.dataset.columnFrom === circuitElement.dataset.columnTo) ||

                    (element.current.dataset.stringTo === circuitElement.dataset.stringTo) &&
                    (element.current.dataset.columnTo === circuitElement.dataset.columnTo) ||

                    (element.current.dataset.stringFrom === circuitElement.dataset.stringFrom) &&
                    (element.current.dataset.columnFrom === circuitElement.dataset.columnFrom)) {
                    neighbors.push(circuitElement);
                }
            }
        }

        let siblings = [];
        for (let neighbor of neighbors) {
            if ((neighbor !== element.previous) && (element.siblings.indexOf(neighbor, 0)) === -1) {
                siblings.push(neighbor);
                temp = {
                    current: neighbor,
                    previous: element.current,
                    next: [],
                    siblings: []
                };
                element.next.push(temp);
            }
        }
        for (let nextElement of element.next) {
            for (let sibling of siblings) {
                if (sibling !== nextElement.current) {
                    nextElement.siblings.push(sibling);
                }
            }
        }


        // рассмотрим каждый из следующих элементов
        element.next.forEach(function (nextElement) {
            if ((nextElement.current !== lastLink) && (siblingsLinks.indexOf(nextElement.current, 0) === -1)) {
                console.log('yes');
                createTree(circuitElements, nextElement, lastLink, siblingsLinks);
            } else {
                return null;
            }
        });
    }
})();


