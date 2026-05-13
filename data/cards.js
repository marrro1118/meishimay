// 名刺データ。全16枚分の枠を用意。
//
// === フィールド ===
// 必須:
//   id        - 一意の番号（1〜16）
//   answer    - 正解の文字列（コレクションタブで入力する答え）
//   image     - 名刺表面の画像パス（cards/ フォルダ内）
//
// 任意（空でも動く）:
//   name        - ヒントタブで入力する解錠用の名前。
//                 複数表記を受け付けたいときは配列：name: ["たろう", "太郎"]
//                 文字列1つでも可：name: "たろう"
//   ownerInfo   - コレクション一覧の「？」タイルをタップしたときに表示される
//                 「謎の持ち主」についての情報文。空の場合はプレースホルダが出る。
//   backImage   - 拡大時の裏面画像。未指定なら共通の裏面デザイン。
//   hints       - 段階ヒントの配列。配列の順に開かれる（ヒントタブ）。
//   explanation - 「答えを見る」で答えと一緒に表示される解説文（ヒントタブ）。
//
// === 入力の揺れ ===
// answer と name は全角/半角・カタカナ/ひらがな・空白/記号 を同一視。
// 漢字も対応させたい場合は name に配列で両方書く。
window.CARDS = [
  // ----- サンプル（差し替え可） -----
  {
    id: 1,
    name: ["たろう", "太郎"],
    ownerInfo: "",
    answer: "さくらんぼ",
    image: "cards/さくらんぼ.webp",
    hints: [
      "ヒント①の文章をここに書きます。",
      "ヒント②の文章をここに書きます。",
    ],
    explanation: "解答の解説をここに書きます。",
  },
  {
    id: 2,
    name: ["はなこ", "花子"],
    ownerInfo: "",
    answer: "アップルパイ",
    image: "cards/アップルパイ.webp",
    hints: [
      "ヒント①の文章をここに書きます。",
      "ヒント②の文章をここに書きます。",
    ],
    explanation: "解答の解説をここに書きます。",
  },

  // ----- 本番データ流し込み用テンプレート（3〜16） -----
  {
    id: 3,
    name: ["", ""],
    ownerInfo: "",
    answer: "",
    image: "cards/03.webp",
    hints: ["", ""],
    explanation: "",
  },
  {
    id: 4,
    name: ["", ""],
    ownerInfo: "",
    answer: "",
    image: "cards/04.webp",
    hints: ["", ""],
    explanation: "",
  },
  {
    id: 5,
    name: ["", ""],
    ownerInfo: "",
    answer: "",
    image: "cards/05.webp",
    hints: ["", ""],
    explanation: "",
  },
  {
    id: 6,
    name: ["", ""],
    ownerInfo: "",
    answer: "",
    image: "cards/06.webp",
    hints: ["", ""],
    explanation: "",
  },
  {
    id: 7,
    name: ["", ""],
    ownerInfo: "",
    answer: "",
    image: "cards/07.webp",
    hints: ["", ""],
    explanation: "",
  },
  {
    id: 8,
    name: ["", ""],
    ownerInfo: "",
    answer: "",
    image: "cards/08.webp",
    hints: ["", ""],
    explanation: "",
  },
  {
    id: 9,
    name: ["", ""],
    ownerInfo: "",
    answer: "",
    image: "cards/09.webp",
    hints: ["", ""],
    explanation: "",
  },
  {
    id: 10,
    name: ["", ""],
    ownerInfo: "",
    answer: "",
    image: "cards/10.webp",
    hints: ["", ""],
    explanation: "",
  },
  {
    id: 11,
    name: ["", ""],
    ownerInfo: "",
    answer: "",
    image: "cards/11.webp",
    hints: ["", ""],
    explanation: "",
  },
  {
    id: 12,
    name: ["", ""],
    ownerInfo: "",
    answer: "",
    image: "cards/12.webp",
    hints: ["", ""],
    explanation: "",
  },
  {
    id: 13,
    name: ["", ""],
    ownerInfo: "",
    answer: "",
    image: "cards/13.webp",
    hints: ["", ""],
    explanation: "",
  },
  {
    id: 14,
    name: ["", ""],
    ownerInfo: "",
    answer: "",
    image: "cards/14.webp",
    hints: ["", ""],
    explanation: "",
  },
  {
    id: 15,
    name: ["", ""],
    ownerInfo: "",
    answer: "",
    image: "cards/15.webp",
    hints: ["", ""],
    explanation: "",
  },
  {
    id: 16,
    name: ["", ""],
    ownerInfo: "",
    answer: "",
    image: "cards/16.webp",
    hints: ["", ""],
    explanation: "",
  },
];
