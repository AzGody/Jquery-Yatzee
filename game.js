$(document).ready(function () {
    $("#game-finished").hide();

    var body = $('body');
    var deValeur = [];
    var nbLances = 0;
    var imgDe = $('.affichage-buttons img');
    var images = ['./img/1.png', './img/2.png', './img/3.png', './img/4.png', './img/5.png', './img/6.png'];
    var nbTours = 1;
    var desChoisis = [];


    body.addClass('etape-1');


    $('.start-button').click(function () {
        nbLances += 1;
        var nbDes = 6;
        var desId;
        var desLances;
        var imageCollec;
        if (nbLances <= 2) {
            if (!body.hasClass("relancer")) {
                deValeur = [];
                for (var i = 0; i < nbDes - 1; i++) {
                    desLances = getDes(1, 6);
                    desId = desLances - 1;
                    imageCollec = images[desId];
                    deValeur.push(desLances);
                    imgDe[i].src = imageCollec;
                    imgDe[i].parentNode.setAttribute('numbers', desLances);
                }
                desChoisis = deValeur;
            } else {
                if ($('.desSelectionne').length == 0) {
                    deValeur = [];
                    for (var i = 0; i < nbDes - 1; i++) {
                        desLances = getDes(1, 6);
                        desId = desLances - 1;
                        imageCollec = images[desId];
                        deValeur.push(desLances);
                        imgDe[i].src = imageCollec;
                        imgDe[i].parentNode.setAttribute('numbers', desLances);
                    }
                    desChoisis = deValeur;
                } else {
                    desChoisis = relancer();
                    for (var i = 0; i < nbDes - 1; i++) {
                        imgDe[i].src = `./img/${desChoisis[i]}.png`;
                        imgDe[i].parentNode.setAttribute('numbers', desChoisis[i]);
                    }
                }
            }
            $('*').removeClass('oldScore');
            var uniqueScore = checkPoints(desChoisis);
            var comb = uniqueScore.comb;
            var unique = uniqueScore.unique;
            animatecomb(comb, uniqueScore, desChoisis);
            animateunique(unique, uniqueScore);
            if (!$('#chance').hasClass('scoreActuel')) {
                $("#chance").addClass('oldScore');
                $("#chance").children().last().attr('desValue', uniqueScore.chance);
            }
            if ($('.oldScore').length > 0) {
                $('.oldScore').each(function () {
                    $(this).click(function () {
                        if ($(this).hasClass('oldScore')) {
                            if ($('.scoreActuel').length + $('.perdu').length < nbTours || $('.scoreActuel').length < nbTours) {
                                $(this).addClass('scoreActuel');
                                $(this).children().last().text($(this).children().last().attr('desValue'));
                            }
                        }
                    });
                });
            } else {
                $('tbody > tr').each(function () {
                    if (!$(this).hasClass('oldScore') && !$(this).hasClass('scoreActuel')) {
                        if (!$(this).hasClass('perdu')) {
                            $(this).click(function () {
                                if (nbLances > 1 && ('.scoreActuel').length + $('.perdu').length < nbTours) {
                                    $(this).addClass('perdu');
                                }
                            });
                        }
                    }
                });
            }

            $('.continuer-button').click(function () {
                var STPlayer = 0;
                var scoreRight = 0;
                if ($('.scoreActuel').length == nbTours || $('.perdu').length + $('.scoreActuel').length == nbTours) {
                    nbTours++;
                    nbLances = 0;
                    $('.only-once').remove();
                    $('*').removeClass('desSelectionne');
                    body.removeClass('relancer');
                    $('*').removeClass('oldScore');
                    body.removeClass('etape-3');
                    body.removeClass('etape-4');
                    body.addClass('etape-2');
                    $('.image-de').each(function () {
                        $(this).removeAttr('numbers');
                    });
                    $('.score-left tbody tr.scoreActuel').each(function () {
                        STPlayer += parseInt($(this).children().last().attr('desValue'));
                    });
                    if ($('.score-left tbody tr.scoreActuel').length == 6 || $('.score-left tbody tr.scoreActuel').length + $('.score-left tbody tr.perdu').length == 6) {
                        if (STPlayer > 63) {
                            STPlayer += 35;
                            $(".score-left #prime").children().last().text('35').css('font-weight', 'bold');
                        } else {
                            $(".score-left #prime").children().last().text('0').css('font-weight', 'bold');
                        }
                        $(".score-left #total-left").children().last().text(STPlayer).css('font-weight', 'bold');
                    }
                    $(".score-left #ST").children().last().text(STPlayer).css('font-weight', 'bold');

                    $('.score-right tbody tr.scoreActuel').each(function () {
                        scoreRight += parseInt($(this).children().last().attr('desValue'));
                    });

                    $(".score-right #total-combinaisons").children().last().text(scoreRight).css('font-weight', 'bold');
                    $(".score-right #total-jeu").children().last().text(scoreRight + STPlayer).css('font-weight', 'bold');

                    if ($('.scoreActuel').length + $('.perdu').length == 13) {
                        $("#game-finished #finished-text").text(`Vous avez marqué ${scoreRight + STPlayer} points en ${nbTours} tours de jeu.`);
                        $("#game-finished").show();
                        $('.continuer-button').after('<button class="restart-button" onClick="window.location.reload();">Rejouer</button>');
                    }
                }
            });
        }

        if (nbLances == 1 && body.hasClass('etape-2')) {
            body.removeClass('etape-2').addClass('etape-3');
        } else if (nbLances == 2 && body.hasClass('etape-3')) {
            body.removeClass('etape-3').addClass('etape-4');
        } else if (nbLances == 3) {
            if (!$(".only-once").length) {
                $('.start-button').after('<span style="padding-left: 20px; color: red;" class="only-once">Vous n\'avez plus de lancés disponibles</span>');
            }
        }
    });





    function checkPoints(arr) {
        var compte = countOccurences(arr);
        var trie = arr.slice();
        trie = trie.sort();
        var userScores = [];
        var scoreuniques = [];
        var combinaisons = [];
        var chance = 0
        for (var i = 1; i <= 6; i++) {
            switch (compte[i]) {
                case 2: for (var j = 1; j <= 6; j++) {
                    if (i !== j && compte[j] == 3) {
                        combinaisons.push('full');
                    }
                } break;
                case 3: combinaisons.push('brelan'); break;
                case 4: combinaisons.push('carre'); break;
                case 5: combinaisons.push('yahtzee');
                    combinaisons.push('carre'); break;

            }
            chance += compte[i] * i;
        }
        for (var i = 0; i < trie.length - 3; i++) {
            if (trie[i] + 1 == trie[i + 1] && trie[i + 1] + 1 == trie[i + 2] && trie[i + 2] + 1 == trie[i + 3]) {
                combinaisons.push('petite suite');
                break;
            }
        }
        for (var i = 0; i < trie.length - 4; i++) {
            if (trie[i] + 1 == trie[i + 1] && trie[i + 1] + 1 == trie[i + 2] && trie[i + 2] + 1 == trie[i + 3] && trie[i + 3] + 1 == trie[i + 4]) {
                combinaisons.push('grande suite');
                break;
            }
        }
        scoreuniques.push(calculatePoints(arr));
        userScores["comb"] = combinaisons;
        userScores["unique"] = scoreuniques;
        userScores["chance"] = chance;
        return userScores;
    }

    function countOccurences(arr) {
        var compte = {};
        for (var i = 1; i <= 6; i++) {
            compte[i] = 0;
        }
        for (var i = 0; i < arr.length; i++) {
            compte[arr[i]]++;
        }
        return compte;
    }



   

    $('.image-de').each(function () {
        $(this).click(function () {
            if (body.hasClass("etape-3")) {
                $(this).toggleClass("desSelectionne");
                body.addClass('relancer');
            } else {
                if (!$(".only-once").length) {
                    if (!body.hasClass("etape-2")) {
                        $('.start-button').after('<span style="padding-left: 20px; color: red;" class="only-once">Vous n\'avez plus de lancés disponibles</span>');
                    }
                }
            }
        });
    });


    function calculatePoints(arr) {
        var compte = countOccurences(arr);
        var points = {};
        for (var i = 1; i <= 6; i++) {
            points[i] = i * compte[i];
        }
        return points;
    }
    
    function animatecomb(arr, uniqueScore, desChoisis) {
        for (var i = 0; i < arr.length; i++) {
            switch (arr[i]) {
                case "brelan": if (!$('#brelan').hasClass('scoreActuel')) {
                    $('#brelan').addClass("oldScore");
                    $('#brelan').children().last().attr('desValue', uniqueScore.chance);
                } break;
                case "full": if (!$('#full').hasClass('scoreActuel')) {
                    $('#full').addClass("oldScore");
                    $('#full').children().last().attr('desValue', "25");
                } break;
                case "petite suite": if (!$('#petite-suite').hasClass('scoreActuel')) {
                    $('#petite-suite').addClass("oldScore");
                    $('#petite-suite').children().last().attr('desValue', '30');
                } break;
                case "grande suite": if (!$('#grande-suite').hasClass('scoreActuel')) {
                    $('#grande-suite').addClass("oldScore");
                    $('#grande-suite').children().last().attr('desValue', '40');
                } break;
                case "carre": if (!$('#carre').hasClass('scoreActuel')) {
                    $('#carre').addClass("oldScore");
                    var carre_value = [];
                    var occurencesCounter = countOccurences(desChoisis);
                    var yahtzeeSoustr = 0;
                    for (var i = 1; i < 6; i++) {
                        carre_value.push(uniqueScore.unique[0][i]);
                        if (occurencesCounter[i] !== 0) {
                            yahtzeeSoustr = i;
                        }
                    }
                    carre_value.sort()
                    var returnedValue = carre_value[carre_value.length - 1];
                    if ($.inArray("yahtzee", uniqueScore.comb)) {
                        $('#carre').children().last().attr('desValue', returnedValue - yahtzeeSoustr);
                    } else {
                        $('#carre').children().last().attr('desValue', returnedValue);
                    }
                } break;
                case "yahtzee": if (!$('#yahtzee').hasClass('scoreActuel')) {
                    $('#yahtzee').addClass("oldScore");
                    $('#yahtzee').children().last().attr('desValue', '50');
                }
            }
        }
    }

    function getDes(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function relancer() {
        var deChoisi = $(".desSelectionne");
        var finalValues = [];
        deChoisi.each(function () {
            var position = parseInt($(this).attr('id') - 1);
            var nouveauDe = getDes(1, 6);
            deValeur.splice(position, 1, nouveauDe);
        });
        finalValues = deValeur;
        return finalValues;
    }

    function animateunique(arr, uniqueScore) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][1] > 0) {
                if (!$('#un').hasClass('scoreActuel')) {
                    $('#un').addClass('oldScore');
                    $('#un').children().last().attr('desValue', uniqueScore.unique[0][1]);
                }
            } else {
                $('#un').removeClass('oldScore');
            }
            if (arr[i][2] > 0) {
                if (!$('#deux').hasClass('scoreActuel')) {
                    $('#deux').addClass('oldScore');
                    $('#deux').children().last().attr('desValue', uniqueScore.unique[0][2]);
                }
            } else {
                $('#deux').removeClass('oldScore');
            }
            if (arr[i][3] > 0) {
                if (!$('#3').hasClass('scoreActuel')) {
                    $('#3').addClass('oldScore');
                    $('#3').children().last().attr('desValue', uniqueScore.unique[0][3]);
                }
            } else {
                $('#3').removeClass('oldScore');
            }
            if (arr[i][4] > 0) {
                if (!$('#4').hasClass('scoreActuel')) {
                    $('#4').addClass('oldScore');
                    $('#4').children().last().attr('desValue', uniqueScore.unique[0][4]);
                }
            } else {
                $('#4').removeClass('oldScore');
            }
            if (arr[i][5] > 0) {
                if (!$('#5').hasClass('scoreActuel')) {
                    $('#5').addClass('oldScore');
                    $('#5').children().last().attr('desValue', uniqueScore.unique[0][5]);
                }
            } else {
                $('#5').removeClass('oldScore');
            }
            if (arr[i][6] > 0) {
                if (!$('#6').hasClass('scoreActuel')) {
                    $('#6').addClass('oldScore');
                    $('#6').children().last().attr('desValue', uniqueScore.unique[0][6]);
                }
            } else {
                $('#6').removeClass('oldScore');
            }
        }
    }
});
