(function () {
  const bank = window.QUIZ_BANK || [];
  const $ = (id) => document.getElementById(id);

  const startEl = $('start');
  const quizEl = $('quiz');
  const resultEl = $('result');
  const btnStart = $('btnStart');
  const btnNext = $('btnNext');
  const btnRetry = $('btnRetry');
  const optionsEl = $('options');
  const feedbackEl = $('feedback');

  let deck = [];
  let idx = 0;
  let score = 0;
  let answered = false;
  let byCat = {};
  let player = '';

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function gradeLabel(pct) {
    if (pct >= 90) return 'Отлично — уверенный middle-уровень по базе';
    if (pct >= 75) return 'Хорошо — подтяни слабые категории и ещё один mock';
    if (pct >= 60) return 'Средне — повтори шпаргалку 01 и Q&A 03';
    return 'Слабо — сначала 01-cheat-sheet и story 04 вслух';
  }

  function show(el) {
    startEl.classList.add('hidden');
    quizEl.classList.add('hidden');
    resultEl.classList.add('hidden');
    el.classList.remove('hidden');
  }

  function renderQuestion() {
    answered = false;
    btnNext.disabled = true;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    const item = deck[idx];
    $('progress').textContent = `${idx + 1} / ${deck.length}`;
    $('scoreLive').textContent = `Баллы: ${score}`;
    $('cat').textContent = item.cat;
    $('question').textContent = item.q;
    optionsEl.innerHTML = '';
    item.options.forEach((text, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt';
      b.textContent = text;
      b.addEventListener('click', () => pick(i));
      optionsEl.appendChild(b);
    });
  }

  function pick(choice) {
    if (answered) return;
    answered = true;
    const item = deck[idx];
    const ok = choice === item.correct;
    if (!byCat[item.cat]) byCat[item.cat] = { ok: 0, total: 0 };
    byCat[item.cat].total += 1;
    if (ok) {
      score += 1;
      byCat[item.cat].ok += 1;
      feedbackEl.textContent = 'Верно';
      feedbackEl.className = 'feedback ok';
    } else {
      feedbackEl.textContent = `Неверно. Правильно: ${item.options[item.correct]}`;
      feedbackEl.className = 'feedback bad';
    }
    $('scoreLive').textContent = `Баллы: ${score}`;
    [...optionsEl.children].forEach((btn, i) => {
      btn.disabled = true;
      if (i === item.correct) btn.classList.add('correct');
      if (i === choice && !ok) btn.classList.add('wrong');
    });
    btnNext.disabled = false;
  }

  function finish() {
    const pct = Math.round((score / deck.length) * 100);
    const name = player || 'Кандидат';
    $('resultSummary').textContent = `${name}: ${score} из ${deck.length} (${pct}%)`;
    $('grade').textContent = gradeLabel(pct);
    const ul = $('byCat');
    ul.innerHTML = '';
    Object.keys(byCat)
      .sort()
      .forEach((cat) => {
        const row = byCat[cat];
        const li = document.createElement('li');
        li.textContent = `${cat}: ${row.ok}/${row.total}`;
        ul.appendChild(li);
      });
    try {
      const hist = JSON.parse(localStorage.getItem('hirePrepQuizHist') || '[]');
      hist.unshift({ at: new Date().toISOString(), score, total: deck.length, pct, player: name });
      localStorage.setItem('hirePrepQuizHist', JSON.stringify(hist.slice(0, 20)));
    } catch {
      /* ignore */
    }
    show(resultEl);
  }

  function start() {
    player = ($('player').value || '').trim();
    const n = Math.min(Number($('count').value) || 15, bank.length);
    deck = shuffle(bank).slice(0, n);
    idx = 0;
    score = 0;
    byCat = {};
    show(quizEl);
    renderQuestion();
  }

  btnStart.addEventListener('click', start);
  btnNext.addEventListener('click', () => {
    if (!answered) return;
    idx += 1;
    if (idx >= deck.length) finish();
    else renderQuestion();
  });
  btnRetry.addEventListener('click', () => {
    show(startEl);
  });
})();
