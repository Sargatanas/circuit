<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Title</title>

    <link rel="stylesheet" href="resources/less/style.css">
</head>
<body>

<header class="properties">
    <div class="properties-element">
        <input type="radio"
               name="properties"
               id="clear">
        <label for="clear">
            очистить
        </label>
    </div>

    <div class="properties-element">
        <input type="radio"
               name="properties"
               id="circuit-create-mode">
        <label for="circuit-create-mode">
            формировать цепь
        </label>
    </div>

    <div class="properties-element">
        <input type="radio"
               name="properties"
               id="circuit-choosing-begin"
               checked>
        <label for="circuit-choosing-begin">
            выбрать начало
        </label>
    </div>

    <div class="properties-element">
        <button id="find-working-circuit">
            рабочая цепь?
        </button>
    </div>
</header>

<main class="workspace">
    <table class="point-area">
        <?php
        $string = 15;
        $column = 15;
        for ($i = 1; $i <= $string; $i++) {
            echo "<tr>";
            for ($j = 1; $j <= $column; $j++) {
                echo '<td class="point-area-element" 
                          data-status="usual">
                          <input class="point-area-element__input" 
                                 type="radio"
                                 name="point-element"
                                 id="'.$i.'-'.$j.'" 
                                 data-string="'.$i.'"
                                 data-column="'.$j.'">
                          <label class="point-area-element__skin" 
                                 for="'.$i.'-'.$j.'" 
                                 data-string="'.$i.'"
                                 data-column="'.$j.'"
                                 data-orientation=""></label>
                      </td>';
                if ($j !== 20) {
                    // строка-строка_столбец-столбец
                    echo '<td>
                              <div class="point-area-element__connection point-area-element__connection_string" 
                                   id="'.$i.'-'.$i.'_'.$j.'-'.($j + 1).'" 
                                   data-string-from="'.$i.'" 
                                   data-string-to="'.$i.'" 
                                   data-column-from="'.$j.'" 
                                   data-column-to="'.($j + 1).'"></div>
                          </td>';
                }
            }
            echo '</tr>';
            echo '<tr>';
            if ($i !== 20) {
                for ($j = 1; $j <= $column; $j++) {
                    echo '<td>
                          <div class="point-area-element__connection point-area-element__connection_column" 
                               id="'.$i.'-'.($i + 1).'_'.$j.'-'.$j.'" 
                               data-string-from="'.$i.'" 
                               data-string-to="'.($i + 1).'" 
                               data-column-from="'.$j.'" 
                               data-column-to="'.$j.'"></div>
                       </td>';
                    if ($j !== 20) {
                        echo '<td></td>';
                    }
                }
            }
            echo '</tr>';
        }
        ?>
    </table>
</main>

<script src="js/script.js"></script>
</body>
</html>