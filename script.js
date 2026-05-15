(function () {
  const STORAGE_KEY = "meisi-collection-v1";
  const HINT_UNLOCK_KEY = "meisi-hint-unlock-v1";
  const HIDDEN_KEY = "meisi-hidden-cleared-v1";
  const HIDDEN_ANSWER = "パレット";
  const SHARE_HASHTAGS = "#アナビナゾコレ\n#AnotherVision\n#五月祭";
  // 引用ポスト用のツイートURL（空文字なら何も付かない）
  const QUOTE_TWEET_URL = "https://x.com/Another_Vision_/status/2055166285810462860?s=20";
  const cards = window.CARDS || [];

  function openShareTweet(headline) {
    const text = `${headline}\n\n${SHARE_HASHTAGS}`;
    const params = new URLSearchParams({ text });
    if (QUOTE_TWEET_URL) params.set("url", QUOTE_TWEET_URL);
    window.open(`https://twitter.com/intent/tweet?${params.toString()}`, "_blank", "noopener");
  }

  // ===== コレクション要素 =====
  const grid = document.getElementById("grid");
  const input = document.getElementById("answer-input");
  const submit = document.getElementById("answer-submit");
  const feedback = document.getElementById("feedback");

  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const modalOwnerInfo = document.getElementById("modal-owner-info");
  const modalClose = document.getElementById("modal-close");
  const ownerModal = document.getElementById("owner-modal");
  const ownerModalClose = document.getElementById("owner-modal-close");
  const ownerInfoText = document.getElementById("owner-info-text");
  const hiddenModal = document.getElementById("hidden-modal");
  const hiddenModalClose = document.getElementById("hidden-modal-close");
  const hiddenShare = document.getElementById("hidden-share");
  const OWNER_INFO_FALLBACK = "ここにテキストが入ります";
  const progressEl = document.getElementById("progress");
  const shareBtn = document.getElementById("share-x");

  // ===== タブ要素 =====
  const tabCollection = document.getElementById("tab-collection");
  const tabHint = document.getElementById("tab-hint");
  const panelCollection = document.getElementById("panel-collection");
  const panelHint = document.getElementById("panel-hint");

  // ===== ヒント要素 =====
  const stepList = document.getElementById("step-list");
  const hintNameInput = document.getElementById("hint-name-input");
  const hintNameSubmit = document.getElementById("hint-name-submit");
  const hintNameFeedback = document.getElementById("hint-name-feedback");

  // ============================================================
  // コレクション
  // ============================================================

  function loadCollected() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch (e) {
      return new Set();
    }
  }
  function saveCollected(set) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  }
  let collected = loadCollected();

  // 文字列正規化：全角→半角、ひら/カタ統一、空白/記号除去、小文字化
  function normalize(s) {
    if (!s) return "";
    let t = String(s).trim();
    t = t.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
    );
    t = t.replace(/[ァ-ヶ]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0x60)
    );
    t = t.replace(/[\s　・,.、。!！?？\-_/\\()（）「」『』]/g, "");
    return t.toLowerCase();
  }

  function updateProgress() {
    const count = collected.size;
    const total = cards.length;
    if (progressEl) {
      progressEl.textContent = `${count} / ${total}枚`;
    }
    if (shareBtn) {
      shareBtn.hidden = count === 0;
    }
  }

  function render() {
    grid.innerHTML = "";
    cards.forEach((c) => {
      const el = document.createElement("div");
      const got = collected.has(c.id);
      el.className = "card" + (got ? "" : " locked");
      el.dataset.id = c.id;

      const img = document.createElement("img");
      img.src = c.image;
      img.alt = "";
      el.appendChild(img);

      if (!got) {
        const lock = document.createElement("div");
        lock.className = "lock-mark";
        lock.textContent = "？";
        el.appendChild(lock);
        el.addEventListener("click", () => openOwnerModal(c));
      } else {
        el.addEventListener("click", () => openModal(c));
      }
      grid.appendChild(el);
    });
    updateProgress();
  }

  function openModal(c) {
    modalImg.src = c.image;
    modalImg.alt = "";
    const info = (c.ownerInfo && c.ownerInfo.trim()) || OWNER_INFO_FALLBACK;
    modalOwnerInfo.textContent = info;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }
  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  function openOwnerModal(c) {
    const info = (c.ownerInfo && c.ownerInfo.trim()) || OWNER_INFO_FALLBACK;
    ownerInfoText.textContent = info;
    ownerModal.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeOwnerModal() {
    ownerModal.hidden = true;
    document.body.style.overflow = "";
  }
  ownerModalClose.addEventListener("click", closeOwnerModal);
  ownerModal.addEventListener("click", (e) => {
    if (e.target === ownerModal) closeOwnerModal();
  });

  function openHiddenModal() {
    hiddenModal.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeHiddenModal() {
    hiddenModal.hidden = true;
    document.body.style.overflow = "";
  }
  hiddenModalClose.addEventListener("click", closeHiddenModal);
  hiddenModal.addEventListener("click", (e) => {
    if (e.target === hiddenModal) closeHiddenModal();
  });
  hiddenShare.addEventListener("click", () => {
    openShareTweet("隠された謎に正解した！");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!hiddenModal.hidden) closeHiddenModal();
      else if (!modal.hidden) closeModal();
      else if (!ownerModal.hidden) closeOwnerModal();
    }
  });

  // Xシェア
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      const count = collected.size;
      if (count === 0) return;
      openShareTweet(`名刺を${count}枚集めました！`);
    });
  }

  let feedbackTimer = null;
  function setFeedback(text, cls) {
    feedback.textContent = text;
    feedback.className = "feedback" + (cls ? " " + cls : "");
    if (feedbackTimer) clearTimeout(feedbackTimer);
    if (text) {
      feedbackTimer = setTimeout(() => {
        feedback.textContent = "";
        feedback.className = "feedback";
      }, 10000);
    }
  }

  function checkAnswer() {
    const val = normalize(input.value);
    if (!val) {
      setFeedback("答えを入力してください", "ng");
      return;
    }
    if (val === normalize("りせっとやりなおし")) {
      resetAll();
      setFeedback("コレクションとヒントをリセットしました", "ok");
      input.value = "";
      return;
    }
    if (val === normalize(HIDDEN_ANSWER)) {
      localStorage.setItem(HIDDEN_KEY, "1");
      openHiddenModal();
      setFeedback("隠された謎に正解！", "ok");
      input.value = "";
      return;
    }
    const match = cards.find((c) => {
      const answers = Array.isArray(c.answer) ? c.answer : [c.answer];
      return answers.some((a) => a && normalize(a) === val);
    });
    if (!match) {
      setFeedback("不正解…もう一度考えてみよう", "ng");
      return;
    }
    if (collected.has(match.id)) {
      setFeedback("回答済みです");
      input.value = "";
      return;
    }
    collected.add(match.id);
    saveCollected(collected);
    render();
    setFeedback("正解！おめでとう！", "ok");
    input.value = "";

    const el = grid.querySelector(`.card[data-id="${match.id}"]`);
    if (el) {
      el.classList.add("just-got");
      setTimeout(() => el.classList.remove("just-got"), 600);
    }
  }

  submit.addEventListener("click", checkAnswer);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkAnswer();
  });

  function resetAll() {
    // 開いているモーダルを閉じる
    if (!modal.hidden) closeModal();
    if (!ownerModal.hidden) closeOwnerModal();
    if (!hiddenModal.hidden) closeHiddenModal();
    // コレクション
    localStorage.removeItem(STORAGE_KEY);
    collected = new Set();
    render();
    // ヒント解錠
    localStorage.removeItem(HINT_UNLOCK_KEY);
    hintUnlocked.clear();
    stepList.innerHTML = "";
    if (hintNameInput) hintNameInput.value = "";
    if (hintNameFeedback) {
      hintNameFeedback.textContent = "";
      hintNameFeedback.className = "feedback";
    }
    // 隠し謎
    localStorage.removeItem(HIDDEN_KEY);
  }

  window.__resetCollection = function () {
    resetAll();
    setFeedback("コレクションとヒントをリセットしました", "ok");
  };

  // ============================================================
  // タブ切り替え
  // ============================================================

  function showTab(which) {
    const isCollection = which === "collection";
    tabCollection.setAttribute("aria-selected", isCollection ? "true" : "false");
    tabHint.setAttribute("aria-selected", isCollection ? "false" : "true");
    panelCollection.hidden = !isCollection;
    panelHint.hidden = isCollection;
    window.scrollTo({ top: 0 });
  }
  tabCollection.addEventListener("click", () => showTab("collection"));
  tabHint.addEventListener("click", () => showTab("hint"));

  // ============================================================
  // ヒント（アコーディオン + 段階開示）
  // ============================================================

  // ヒントの名前ロック
  function loadHintUnlocked() {
    try {
      const raw = localStorage.getItem(HINT_UNLOCK_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch (e) {
      return new Set();
    }
  }
  function saveHintUnlocked(set) {
    localStorage.setItem(HINT_UNLOCK_KEY, JSON.stringify([...set]));
  }
  const hintUnlocked = loadHintUnlocked();

  // 解除済みカードのみ初期描画
  cards.forEach((c) => {
    if (hintUnlocked.has(c.id)) {
      stepList.appendChild(buildHintAccordion(c));
    }
  });

  // 上の入力欄で名前を入れたらロック解除
  let hintFeedbackTimer = null;
  function setHintFeedback(text, cls) {
    hintNameFeedback.textContent = text;
    hintNameFeedback.className = "feedback" + (cls ? " " + cls : "");
    if (hintFeedbackTimer) clearTimeout(hintFeedbackTimer);
    if (text) {
      hintFeedbackTimer = setTimeout(() => {
        hintNameFeedback.textContent = "";
        hintNameFeedback.className = "feedback";
      }, 10000);
    }
  }

  function getCardNames(c) {
    if (!c.name) return [];
    return Array.isArray(c.name) ? c.name : [c.name];
  }

  function checkHintName() {
    const val = normalize(hintNameInput.value);
    if (!val) {
      setHintFeedback("名前を入力してください", "ng");
      return;
    }
    const match = cards.find((c) =>
      getCardNames(c).some((n) => normalize(n) === val)
    );
    if (!match) {
      setHintFeedback("該当する名刺がありません", "ng");
      return;
    }
    if (hintUnlocked.has(match.id)) {
      setHintFeedback("すでに解放済みです");
      hintNameInput.value = "";
      // 既存のアコーディオンを開く
      const existing = stepList.querySelector(`[data-card-id="${match.id}"]`);
      if (existing) {
        const btn = existing.querySelector(".btn-step");
        const content = existing.querySelector(".step-content");
        btn.setAttribute("aria-expanded", "true");
        content.classList.remove("hidden");
        existing.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
    hintUnlocked.add(match.id);
    saveHintUnlocked(hintUnlocked);
    setHintFeedback("ヒントを開放しました", "ok");
    hintNameInput.value = "";

    // 該当アコーディオンを追加して自動展開
    const item = buildHintAccordion(match);
    stepList.appendChild(item);
    const btn = item.querySelector(".btn-step");
    const content = item.querySelector(".step-content");
    btn.setAttribute("aria-expanded", "true");
    content.classList.remove("hidden");
    item.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  hintNameSubmit.addEventListener("click", checkHintName);
  hintNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkHintName();
  });

  function buildHintAccordion(c) {
    const item = document.createElement("section");
    item.className = "step-item";
    item.dataset.cardId = c.id;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-step";
    btn.setAttribute("aria-expanded", "false");

    if (c.image) {
      const img = document.createElement("img");
      img.src = c.image;
      img.alt = "";
      img.className = "step-thumb";
      btn.appendChild(img);
    }
    const spacer = document.createElement("span");
    spacer.className = "step-label";
    btn.appendChild(spacer);

    const chev = document.createElement("span");
    chev.className = "chevron";
    chev.textContent = "▼";
    btn.appendChild(chev);

    item.appendChild(btn);

    const content = document.createElement("div");
    content.className = "step-content hidden";
    item.appendChild(content);

    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      content.classList.toggle("hidden", expanded);
    });

    buildHintSteps(content, c);
    return item;
  }

  function buildHintSteps(container, c) {
    const steps = [];
    (c.hints || []).forEach((h, i) => {
      steps.push({ label: `ヒント${i + 1}`, body: h });
    });
    const primaryAnswer = Array.isArray(c.answer) ? c.answer[0] : c.answer;
    if (primaryAnswer) {
      steps.push({
        label: "答えを見る",
        body: c.explanation
          ? `答え：${primaryAnswer}\n\n${c.explanation}`
          : `答え：${primaryAnswer}`,
        isAnswer: true,
      });
    }

    if (steps.length === 0) {
      const empty = document.createElement("p");
      empty.className = "hint-empty";
      empty.textContent = "ヒントは準備中です";
      container.appendChild(empty);
      return;
    }

    const btnEls = [];

    steps.forEach((s, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "btn-hint" + (s.isAnswer ? " is-answer" : "") + (i === 0 ? "" : " hidden");
      btn.textContent = s.label;
      btn.dataset.shown = "false";
      btnEls.push(btn);

      const panel = document.createElement("div");
      panel.className = "panel-alpha hidden" + (s.isAnswer ? " is-answer" : "");
      panel.textContent = s.body;

      btn.addEventListener("click", () => {
        const nowHidden = panel.classList.toggle("hidden");
        if (!nowHidden && btn.dataset.shown === "false") {
          btn.dataset.shown = "true";
          const next = btnEls[i + 1];
          if (next) next.classList.remove("hidden");
        }
      });

      container.appendChild(btn);
      container.appendChild(panel);
    });
  }

  // ============================================================
  // 初期描画
  // ============================================================

  render();
})();
