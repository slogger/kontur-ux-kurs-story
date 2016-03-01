$(function() {
    var resize = [];
    $('#terminal').terminal(function(command, term) {
      function randomInteger(min, max) {
        var rand = min + Math.random() * (max - min)
        rand = Math.round(rand);
        return rand;
      }

      switch (command) {
        case 'help':
          term.echo(
              'Доступные команды:\n' +
              '  getbio          прочитать часть истории\n'+
              '  getcake         посмотреть на тортик\n' +
              '  test            пройти тестирование\n'
          );
          break;
        case 'getbio':
          var currentChapter = parseInt(localStorage.getItem('bio-chapter')) || 0;
          console.log(currentChapter);
          var chapters = [
            'Часть 1\nПривет, меня зовут Максим, я люблю лакричные конфеты, готовить напитки по новым рецептам каждую пятницу и снимать на пленку.\nпосмотреть на мои фотографии можно здесь: [[b;#0E1;#000]https://bit.ly/slggr-film]\n',
            'Часть 2\nИногда во мне просыпается "стартапер" и тогда я вместе с Сашей Плесовских делаю какой-нибудь проект\nПервые деньги в интернете получил монетизировав вирусного трафика, на фанатах теории большого взрыва, я тогда еще учился в школе\nПоследний более менее стоящий проект: igrofy, система мотивации сотрудников в call-центрах, выйграли местный конкурс, дошли до финала в телеком-идеи от МТС, прошли их акселератор, пары яблок не хватило что-бы выйграли поездку в Индию :3\nЧуть больше подробностей здесь https://medium.com/igrofy-news',
            'Часть 3\nНу а так, учусь на матмехе, пилю Контур-Фокус\nНа курс хочу что-бы прокачать скиллы, да завести больше знакомых в Контуре'
          ];
          if (currentChapter !== chapters.length) {
            term.echo(chapters[currentChapter]);
            localStorage.setItem('bio-chapter', currentChapter+1);
          } else {
            term.echo('Вы прочитали все истории');
            term.push(function(command, term) {
              if (command.toLowerCase() == 'да') {
                localStorage.removeItem('bio-chapter');
                term.pop();
              } else {
                term.pop();
              }
            }, {
                prompt: 'Хотите начать чтение сначала? [да\\нет]: ',
                name: 'chapter.reset'
            });
          }
          break;
        case 'getcake':
          if (localStorage.getItem('test-ok')) {
              cake = document.getElementById('cake');
              term.echo(cake.innerHTML);
          } else {
              term.echo('Вы не прошли тест!');
          }
          break;
        case 'unauth':
          localStorage.removeItem('test-ok');
          localStorage.removeItem('bio-chapter');
          break;
        case 'test':
          var attempts = 1;
          var answers = 0;
          term.echo(
              'Начало тестирования\n' +
              'Нажмите [[b;#0E1;#000]ctrl+D] для выхода из системы тестирования\n' +
              'Пожалуйста, ответьте на несколько простых вопросов.\n'
          );
          term.echo();
          var currentQuestion = 0;
          var questions = [
            ['Простой вопрос, какие мои любимые конфеты?', function(c) {return c.indexOf('лакр') > -1;}],
            ['Сколько пленочных фотографий у меня загреженно в альбом в вк?', function(c) {return c === '846';}],
            ['Сколько нужно было еще яблок что-бы попасть в Индию?', function(c) {return (c === '2' || c.indexOf('пар') > -1);}],
            ['Зачем я хочу на курс?', function(c) {return (c.indexOf('скил') > -1 || c.indexOf('знак') > -1);}]
          ];
          var congratulations = [
            'Отлично, правильный ответ!',
            'Отлично, вы ответили правильно!'
          ]
          term.echo(questions[currentQuestion][0]);
          term.push(function(command, term) {
              console.log(command.toLowerCase());
              if (questions[currentQuestion][1](command.toLowerCase())) {
                  term.echo(congratulations[randomInteger(0, congratulations.length)]);
                  currentQuestion++;
                  if (currentQuestion === questions.length) {
                      term.echo('\nВы успешно прошли тест!\n');
                      localStorage.setItem('test-ok', 'ok');
                  }
                  if (currentQuestion >= questions.length) { term.pop(); return; }
                  term.echo('\n' + questions[currentQuestion][0]);
              } else {
                  term.echo('Неправильно!');
                  if (++attempts > 3) {
                      term.echo('Превышено количество неправильных ответов. Попробуйте снова.\n');
                      term.pop();
                      return;
                  }
                  term.echo('\n' + questions[currentQuestion][0]);
              }
          }, {
              prompt: 'Ваш ответ: ',
              name: 'test'
          });
          break;
        default:
          term.echo(
              'Неизвестная команда\n' +
              'Для вызова справки наберите [[b;#0E1;#000]help]\n'
          );
      }
    }, {
        greetings: null,
        onInit: function(term) {
            term.echo('Добро пожаловать!\nНе забудьте получить свой торт\n\nДля вызова справки наберите [[b;#0E1;#000]help]');
        },
        onResize: function(term) {
            for (var i=resize.length;i--;) {
                resize[i](term);
            }
        },
        onBlur: function() {
            return false;
        },
        convertLinks: true
    });
});
