/**
 * 初期事例データ
 * 「事例収集フォーマット仕様・初期事例集.md」の全項目（出典・確認区分・公開ステータス含む）を完全網羅
 * 参考文献・出典および実践者案内のリンクを設定
 */

const INITIAL_TOILETS = [
  {
    id: "EX-001",
    title: "里山循環型ファームの手動攪拌トイレ",
    category: "手動攪拌式",
    categoryType: "farm",
    locationName: "神奈川県相模原市 藤野エリア",
    lat: 35.6158,
    lng: 139.1554,
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
    summary: "雨季における撹拌槽内の水分過多と臭気発生への対策",
    trouble: "梅雨時期に湿度が上がり、撹拌槽内の水分が過剰になって嫌気性発酵に傾き、アンモニア臭が発生した。",
    action: "水分調整材として乾燥もみ殻と燻炭を通常の1.5倍量投入し、通気パイプの開度を最大にして1日2回撹拌を実施。",
    result: "3日後には嫌気臭が収まり、発酵熱（45℃前後）が回復して好気発酵が再開した。",
    environment: "農園併設（温暖地）、梅雨期（6月〜7月）、1日平均3〜5回利用、基材：スギおがくず＋燻炭",
    source: "農園公式ブログの実践記録（2024年7月公開記事）",
    sourceUrl: "https://note.com/hashtag/%E3%82%B3%E3%83%B3%E3%83%9B%E3%82%9A%E3%82%B9%E3%83%88%E3%83%88%E3%82%A4%E3%83%AC",
    verificationStatus: "公開資料で確認済み",
    tags: ["水分過多", "アンモニア臭", "もみ殻", "燻炭", "通気改善", "農園"],
    unresolvedQuestion: "燻炭の投入比率が多すぎると微生物活性に影響があるかどうかの検証が必要",
    contributor: {
      name: "坂本（コミュニティ管理人）",
      contact: "Discord: @sakamoto / 管理チーム",
      note: "現地訪問時に管理者へヒアリング確認済み"
    },
    practitioner: {
      name: "里山アグリラボ（藤野）",
      role: "有機農家・パーマカルチャー実践者",
      bio: "地域の竹林整備で出た竹炭やもみ殻を活用した、完全自給型コンポストトイレを5年間運用中。",
      contactUrl: "https://note.com/hashtag/%E3%82%B3%E3%83%B3%E3%83%9B%E3%82%9A%E3%82%B9%E3%83%88%E3%83%88%E3%82%A4%E3%83%AC",
      contactLabel: "農園ブログ・見学案内を見る",
      communityNote: "見学希望の方は事前にDiscordまたは問い合わせフォームよりご連絡ください。"
    },
    updatedAt: "2026-10-29",
    status: "公開可能"
  },
  {
    id: "EX-002",
    title: "八ヶ岳山麓・山岳ビジターセンターのバイオトイレ",
    category: "電動バイオ式",
    categoryType: "mountain",
    locationName: "長野県茅野市（標高1,200m）",
    lat: 35.9981,
    lng: 138.2573,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    summary: "冬季寒冷地における発酵温度の低下と分解速度の遅延",
    trouble: "外気温が氷点下になる12月〜2月、槽内温度が低下しペーパーや排泄物の分解が大幅に遅れた。",
    action: "槽の外周に断熱ウレタンフォームを追加施工し、保温カバーを二重化。夜間のみ設定温度を微小引き上げた。",
    result: "槽内温度が常時25℃以上を維持できるようになり、冬期でも滞留することなく正常に分解が進んだ。",
    environment: "標高1,200m山岳施設、冬季（外気温-5℃〜3℃）、週末利用（1日15〜20回）",
    source: "環境省 山岳トイレ技術指針および山小屋導入報告書",
    sourceUrl: "https://www.env.go.jp/nature/np/san_toilet/",
    verificationStatus: "公開資料で確認済み",
    tags: ["寒冷地", "冬期保温", "ウレタン断熱", "分解遅延", "山岳トイレ"],
    unresolvedQuestion: "非通電環境（オフグリッド）の山小屋における冬期保温の現実的な代替策はあるか",
    contributor: {
      name: "山岳トイレ研究WG",
      contact: "Discord: #寒冷地対策スレッド",
      note: "自治体の導入報告書に基づきデータ登録"
    },
    practitioner: {
      name: "八ヶ岳山岳環境保全会",
      role: "山岳施設管理者・エコツーリズム推進員",
      bio: "山岳地域での環境負荷ゼロを目指し、水を使わないバイオトイレのデータ収集を10年以上継続。",
      contactUrl: "https://www.env.go.jp/nature/np/san_toilet/",
      contactLabel: "導入指針・計測データを見る",
      communityNote: "寒冷地での温度データログを共有可能です。Discordでお気軽にお声がけください。"
    },
    updatedAt: "2026-10-29",
    status: "公開可能"
  },
  {
    id: "EX-003",
    title: "アースフェスティバルの尿便分離モバイルトイレ",
    category: "セパレート型",
    categoryType: "event",
    locationName: "静岡県富士宮市 朝霧高原",
    lat: 35.4057,
    lng: 138.5833,
    imageUrl: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=900&q=80",
    summary: "イベント開催時の一時的な過負荷（利用急増）と水分滞留",
    trouble: "野外フェスで想定以上の利用者が集中し、便槽に尿が混入して水分過多になりかけた。",
    action: "利用案内ポップ（ピクトグラム入り多言語表記）を手元と壁面に増設し、投入用おがくずのスコップを1回2杯と明記。スタッフによる1時間ごとの目視点検を実施。",
    result: "尿の誤混入が激減し、急激な水分過多による詰まりや臭気の発生を未然に防止できた。",
    environment: "野外イベント会場、秋季（晴天）、1日約200回以上の連続利用",
    source: "野外イベント環境配慮ガイドライン・実施報告レポート",
    sourceUrl: "https://www.env.go.jp/policy/eco-event/",
    verificationStatus: "公開資料で確認済み",
    tags: ["尿便分離", "イベント・フェス", "案内サイン", "急激な過負荷", "ピクトグラム"],
    unresolvedQuestion: "子どもや初めての利用者が直感的に迷わないサインデザインの標準化",
    contributor: {
      name: "フェス環境運営ボランティア有志",
      contact: "Discord: @event-eco",
      note: "当日の運用担当者により記録"
    },
    practitioner: {
      name: "循環トイレキャラバン隊",
      role: "移動式オフグリッドトイレ設計ユニット",
      bio: "全国の野外音楽フェスや地域マルシェに、移動型コンポストトイレを出張設置・運営レクチャーしています。",
      contactUrl: "https://www.facebook.com/groups/3056220634712109/",
      contactLabel: "出張設置・レンタル相談を見る",
      communityNote: "イベント企画者やこれから手作りしたい方、お気軽にFacebookやDiscordでご相談ください。"
    },
    updatedAt: "2026-10-29",
    status: "公開可能"
  },
  {
    id: "EX-004",
    title: "森のクラフトキャンプ場の木造手動ハンドル式トイレ",
    category: "手動ハンドル式",
    categoryType: "camp",
    locationName: "群馬県みなかみ町 林間エリア",
    lat: 36.7645,
    lng: 138.9667,
    imageUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=900&q=80",
    summary: "チップ・おがくずの粒度違いによる撹拌負荷と分解スピードの差異",
    trouble: "仕入れ先変更により粗いウッドチップを使用したところ、ハンドルが極端に重くなり利用者が回せなくなった。",
    action: "微細なおがくずと粗いチップを6:4の比率でブレンドして投入し、回転トルクを軽減させた。",
    result: "撹拌が軽くなり、かつ粗いチップによる通気性（隙間）も確保され、良好な分解状態を維持できた。",
    environment: "林間キャンプ場、春季〜秋季、週末・連休に集中利用、基材：スギチップ＋微細おがくず",
    source: "キャンプ場運営者への直接ヒアリングメモ（2026年10月）",
    sourceUrl: "https://www.facebook.com/groups/3056220634712109/",
    verificationStatus: "情報提供者本人に確認済み",
    tags: ["基材選定", "おがくずブレンド", "ハンドル負荷", "通気性", "キャンプ場"],
    unresolvedQuestion: "針葉樹（スギ・ヒノキ）と広葉樹のチップで分解菌への影響にどの程度差があるか",
    contributor: {
      name: "坂本（コミュニティ管理人）",
      contact: "Discord: @sakamoto",
      note: "現地訪問時の直接インタビューより"
    },
    practitioner: {
      name: "みなかみエコフォレスト 管理人",
      role: "キャンプ場オーナー・木工家",
      bio: "敷地内の間伐材から自作したドラム型コンポストトイレ。子どもでも楽しく回せる工夫を重ねています。",
      contactUrl: "https://www.facebook.com/groups/3056220634712109/",
      contactLabel: "Facebookグループで事例を見る",
      communityNote: "キャンプ宿泊時に現物の構造を隅々まで見学・体験していただけます。"
    },
    updatedAt: "2026-10-29",
    status: "匿名化して公開可能"
  },
  {
    id: "EX-005",
    title: "淡路島・自然農コミュニティの屋外コンポストピット",
    category: "手動攪拌式",
    categoryType: "farm",
    locationName: "兵庫県淡路市",
    lat: 34.4842,
    lng: 134.9084,
    imageUrl: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=900&q=80",
    summary: "温暖多湿な海風地域での通気ドーム構造と腐葉土基材の活用",
    trouble: "夏場の高温多湿と強風で、通常の密閉型だと熱気がこもり小バエが発生しやすい課題があった。",
    action: "防虫ネットを二重にした立体ルーバー窓を自作し、下層に落ち葉腐葉土・上層に竹パウダーを敷く2層式を導入。",
    result: "ハエの侵入をゼロに抑え、海風を活かした自然通気ドラフトによって無臭化を達成。",
    environment: "瀬戸内気候、海沿い傾斜地、年間通して利用、基材：竹パウダー＋腐葉土",
    source: "淡路循環生活舎 活動会報誌（Vol.12）および現地聞き取り",
    sourceUrl: "https://www.facebook.com/groups/3056220634712109/",
    verificationStatus: "情報提供者本人に確認済み",
    tags: ["コバエ・防虫対策", "自然通気ルーバー", "竹パウダー", "腐葉土", "DIY"],
    unresolvedQuestion: "竹パウダーの乳酸菌発酵が排泄物分解菌に及ぼす相乗効果の定量的測定",
    contributor: {
      name: "淡路コミュニティ参加メンバー",
      contact: "Discord: @awaji-member",
      note: "ワークショップ参加時に現地ヒアリング"
    },
    practitioner: {
      name: "淡路アイランド循環生活舎",
      role: "移住コミュニティ・タイニーハウスビルダー",
      bio: "オフグリッドハウスと循環式トイレをセルフビルド。週末オープンデーを毎月開催。",
      contactUrl: "https://www.facebook.com/groups/3056220634712109/",
      contactLabel: "コミュニティページを見る",
      communityNote: "淡路島にお越しの際は気軽にお立ち寄りください。"
    },
    updatedAt: "2026-11-05",
    status: "公開可能"
  }
];
